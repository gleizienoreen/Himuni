import { AUDIUS_CONFIG } from './audiusConfig.js';
import {
  buildOfficialStreamUrl,
  normalizeAudiusTrack,
  normalizeAudiusTrackList,
} from './audiusNormalizer.js';

export class AudiusApiError extends Error {
  constructor(message, { code = 'UNAVAILABLE', status = 0, retryAfterSeconds = null } = {}) {
    super(message);
    this.name = 'AudiusApiError';
    this.code = code;
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export function isAbortError(error) {
  return Boolean(
    error &&
      (error.name === 'AbortError' ||
        error.code === 'ABORTED' ||
        error.message === 'Request aborted')
  );
}

// Short-lived in-memory response cache (not a permanent catalog)
const responseCache = new Map();
let cachedFallbackBaseUrl = null;

function getCachedValue(cacheKey) {
  const entry = responseCache.get(cacheKey);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    responseCache.delete(cacheKey);
    return null;
  }
  return entry.data;
}

function setCachedValue(cacheKey, data) {
  if (responseCache.size >= AUDIUS_CONFIG.maxCacheEntries) {
    const oldestKey = responseCache.keys().next().value;
    if (oldestKey) responseCache.delete(oldestKey);
  }
  responseCache.set(cacheKey, {
    data,
    expiresAt: Date.now() + AUDIUS_CONFIG.cacheTtlMs,
  });
}

export function clearAudiusCache() {
  responseCache.clear();
}

// Lightweight concurrency limiter
let activeRequests = 0;
const waitQueue = [];

function acquireSlot(signal) {
  if (signal?.aborted) {
    return Promise.reject(new AudiusApiError('Request aborted', { code: 'ABORTED' }));
  }

  if (activeRequests < AUDIUS_CONFIG.maxConcurrentRequests) {
    activeRequests += 1;
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const entry = {
      resolve: () => {
        if (signal) signal.removeEventListener('abort', onAbort);
        activeRequests += 1;
        resolve();
      },
      reject,
    };

    function onAbort() {
      const idx = waitQueue.indexOf(entry);
      if (idx !== -1) waitQueue.splice(idx, 1);
      reject(new AudiusApiError('Request aborted', { code: 'ABORTED' }));
    }

    if (signal) {
      signal.addEventListener('abort', onAbort, { once: true });
    }
    waitQueue.push(entry);
  });
}

function releaseSlot() {
  activeRequests = Math.max(0, activeRequests - 1);
  if (waitQueue.length > 0 && activeRequests < AUDIUS_CONFIG.maxConcurrentRequests) {
    const next = waitQueue.shift();
    next.resolve();
  }
}

async function resolveFallbackBaseUrl(signal) {
  if (cachedFallbackBaseUrl) return cachedFallbackBaseUrl;

  try {
    const res = await fetch(AUDIUS_CONFIG.discoveryHostListUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    });
    if (!res.ok) return null;
    const payload = await res.json();
    const hosts = Array.isArray(payload?.data) ? payload.data : [];
    const validHost = hosts.find(
      (h) => typeof h === 'string' && /^https:\/\//i.test(h)
    );
    if (validHost) {
      cachedFallbackBaseUrl = `${validHost.replace(/\/+$/, '')}/v1`;
      return cachedFallbackBaseUrl;
    }
  } catch {
    // Fallback discovery host lookup failed; caller will surface original error
  }
  return null;
}

async function executeAudiusGet(path, params = {}, { signal, bypassCache = false } = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  searchParams.set('app_name', AUDIUS_CONFIG.appName);

  const queryString = searchParams.toString();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const cacheKey = `${normalizedPath}?${queryString}`;

  if (!bypassCache) {
    const hit = getCachedValue(cacheKey);
    if (hit) return hit;
  }

  await acquireSlot(signal);

  const timeoutController = new AbortController();
  let timedOut = false;
  const timeoutId = setTimeout(() => {
    timedOut = true;
    timeoutController.abort();
  }, AUDIUS_CONFIG.requestTimeoutMs);

  const onCallerAbort = () => timeoutController.abort();
  if (signal) {
    if (signal.aborted) {
      clearTimeout(timeoutId);
      releaseSlot();
      throw new AudiusApiError('Request aborted', { code: 'ABORTED' });
    }
    signal.addEventListener('abort', onCallerAbort, { once: true });
  }

  const headers = { Accept: 'application/json' };
  if (AUDIUS_CONFIG.apiKey) {
    headers['x-api-key'] = AUDIUS_CONFIG.apiKey;
  }

  const fetchFromBase = async (baseUrl) => {
    const url = `${baseUrl}${normalizedPath}?${queryString}`;
    return fetch(url, {
      method: 'GET',
      headers,
      signal: timeoutController.signal,
    });
  };

  try {
    let response;
    try {
      response = await fetchFromBase(AUDIUS_CONFIG.apiBaseUrl);
      if ([502, 503, 504].includes(response.status)) {
        const altBase = await resolveFallbackBaseUrl(timeoutController.signal);
        if (altBase && altBase !== AUDIUS_CONFIG.apiBaseUrl) {
          response = await fetchFromBase(altBase);
        }
      }
    } catch (networkErr) {
      if (signal?.aborted) {
        throw new AudiusApiError('Request aborted', { code: 'ABORTED' });
      }
      if (timedOut) {
        throw new AudiusApiError(
          'Audius took too long to respond. Please try again in a moment.',
          { code: 'TIMEOUT' }
        );
      }
      const altBase = await resolveFallbackBaseUrl(timeoutController.signal);
      if (altBase && altBase !== AUDIUS_CONFIG.apiBaseUrl) {
        response = await fetchFromBase(altBase);
      } else {
        throw new AudiusApiError(
          'Unable to reach the Audius music network right now. Check your connection or try again.',
          { code: 'UNAVAILABLE' }
        );
      }
    }

    if (response.status === 429) {
      const retryHeader = response.headers.get('Retry-After');
      const retryAfterSeconds = retryHeader ? Number.parseInt(retryHeader, 10) || 15 : 15;
      throw new AudiusApiError(
        'Audius rate limit reached. Please pause briefly before making more requests.',
        {
          code: 'RATE_LIMITED',
          status: 429,
          retryAfterSeconds,
        }
      );
    }

    if (response.status === 404) {
      throw new AudiusApiError('The requested track could not be found on Audius.', {
        code: 'NOT_FOUND',
        status: 404,
      });
    }

    if (!response.ok) {
      throw new AudiusApiError(
        `Audius discovery service is temporarily unavailable (HTTP ${response.status}).`,
        {
          code: 'UNAVAILABLE',
          status: response.status,
        }
      );
    }

    const json = await response.json();
    setCachedValue(cacheKey, json);
    return json;
  } catch (err) {
    if (err instanceof AudiusApiError) {
      throw err;
    }
    if (signal?.aborted) {
      throw new AudiusApiError('Request aborted', { code: 'ABORTED' });
    }
    if (timedOut || err?.name === 'AbortError') {
      throw new AudiusApiError(
        'Audius took too long to respond. Please try again in a moment.',
        { code: 'TIMEOUT' }
      );
    }
    throw new AudiusApiError(
      'Unable to load music from Audius right now. Please try again.',
      { code: 'UNAVAILABLE' }
    );
  } finally {
    clearTimeout(timeoutId);
    if (signal) {
      signal.removeEventListener('abort', onCallerAbort);
    }
    releaseSlot();
  }
}

/**
 * Searches tracks on Audius using the documented GET /v1/tracks/search endpoint.
 */
export async function searchTracks({
  query,
  limit = AUDIUS_CONFIG.defaultLimit,
  offset = 0,
  signal,
  bypassCache = false,
} = {}) {
  const cleanQuery = typeof query === 'string' ? query.trim() : '';
  if (!cleanQuery) {
    return { tracks: [], hasMore: false, nextOffset: 0 };
  }

  const safeLimit = Math.min(50, Math.max(1, Math.round(limit)));
  const safeOffset = Math.max(0, Math.round(offset));

  const payload = await executeAudiusGet(
    '/tracks/search',
    {
      query: cleanQuery,
      limit: safeLimit,
      offset: safeOffset,
    },
    { signal, bypassCache }
  );

  const rawItems = Array.isArray(payload?.data) ? payload.data : [];
  const tracks = normalizeAudiusTrackList(rawItems);

  return {
    tracks,
    rawCount: rawItems.length,
    hasMore: rawItems.length >= safeLimit,
    nextOffset: safeOffset + safeLimit,
  };
}

/**
 * Retrieves metadata for a single track via GET /v1/tracks/{track_id}.
 */
export async function getTrackById(trackId, { signal, bypassCache = false } = {}) {
  const cleanId = trackId ? String(trackId).trim() : '';
  if (!cleanId) {
    throw new AudiusApiError('Track ID is required.', { code: 'NOT_FOUND', status: 404 });
  }

  const payload = await executeAudiusGet(
    `/tracks/${encodeURIComponent(cleanId)}`,
    {},
    { signal, bypassCache }
  );

  const track = normalizeAudiusTrack(payload?.data);
  if (!track) {
    throw new AudiusApiError('This track is currently unavailable on Audius.', {
      code: 'NOT_FOUND',
      status: 404,
    });
  }
  return track;
}

/**
 * Retrieves trending discovery tracks via GET /v1/tracks/trending.
 */
export async function getTrendingTracks({
  genre = '',
  time = 'week',
  limit = AUDIUS_CONFIG.defaultLimit,
  offset = 0,
  signal,
  bypassCache = false,
} = {}) {
  const safeLimit = Math.min(50, Math.max(1, Math.round(limit)));
  const safeOffset = Math.max(0, Math.round(offset));

  const payload = await executeAudiusGet(
    '/tracks/trending',
    {
      genre: typeof genre === 'string' ? genre.trim() : '',
      time,
      limit: safeLimit,
      offset: safeOffset,
    },
    { signal, bypassCache }
  );

  const rawItems = Array.isArray(payload?.data) ? payload.data : [];
  const tracks = normalizeAudiusTrackList(rawItems);

  return {
    tracks,
    rawCount: rawItems.length,
    hasMore: rawItems.length >= safeLimit,
    nextOffset: safeOffset + safeLimit,
  };
}

/**
 * Returns the official Audius v1 streaming endpoint URL for a publicly streamable track.
 */
export function getTrackStreamUrl(trackOrId) {
  if (!trackOrId) return '';
  if (typeof trackOrId === 'string') {
    return buildOfficialStreamUrl(trackOrId, cachedFallbackBaseUrl || AUDIUS_CONFIG.apiBaseUrl);
  }
  if (!trackOrId.isStreamable || !trackOrId.id) {
    return '';
  }
  return buildOfficialStreamUrl(trackOrId.id, cachedFallbackBaseUrl || AUDIUS_CONFIG.apiBaseUrl);
}
