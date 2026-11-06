import { AUDIUS_CONFIG } from './audiusConfig.js';

/**
 * Constructs the official documented Audius v1 track stream endpoint URL.
 */
export function buildOfficialStreamUrl(trackId, baseUrl = AUDIUS_CONFIG.apiBaseUrl) {
  if (!trackId) return '';
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const params = new URLSearchParams({ app_name: AUDIUS_CONFIG.appName });
  if (AUDIUS_CONFIG.apiKey) {
    params.set('api_key', AUDIUS_CONFIG.apiKey);
  }
  return `${cleanBase}/tracks/${encodeURIComponent(String(trackId))}/stream?${params.toString()}`;
}

function resolveAudiusTrackUrl(permalink) {
  if (!permalink || typeof permalink !== 'string') return '';
  const trimmed = permalink.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${AUDIUS_CONFIG.webOrigin}${path}`;
}

function resolveAudiusArtistUrl(user) {
  const handle = typeof user?.handle === 'string' ? user.handle.trim() : '';
  if (!handle) return '';
  return `${AUDIUS_CONFIG.webOrigin}/${encodeURIComponent(handle)}`;
}

function buildArtworkUrls(artwork) {
  if (!artwork || typeof artwork !== 'object') {
    return { primary: '', fallbacks: [] };
  }

  const candidates = [artwork['480x480'], artwork['150x150'], artwork['1000x1000']].filter(
    (u) => typeof u === 'string' && /^https?:\/\//i.test(u)
  );

  if (candidates.length === 0) {
    return { primary: '', fallbacks: [] };
  }

  const primary = candidates[0];
  const fallbacks = candidates.slice(1);

  if (Array.isArray(artwork.mirrors) && artwork.mirrors.length > 0) {
    try {
      const parsed = new URL(primary);
      for (const mirror of artwork.mirrors) {
        if (typeof mirror === 'string' && /^https?:\/\//i.test(mirror)) {
          const mirrorOrigin = mirror.replace(/\/+$/, '');
          const mirroredUrl = `${mirrorOrigin}${parsed.pathname}${parsed.search}`;
          if (mirroredUrl !== primary && !fallbacks.includes(mirroredUrl)) {
            fallbacks.push(mirroredUrl);
          }
        }
      }
    } catch {
      // Ignore invalid URL parsing
    }
  }

  return { primary, fallbacks };
}

function parseTags(rawTags) {
  if (!rawTags) return [];
  if (Array.isArray(rawTags)) {
    return rawTags
      .map((t) => (typeof t === 'string' ? t.trim() : ''))
      .filter(Boolean)
      .slice(0, 6);
  }
  if (typeof rawTags === 'string') {
    return rawTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 6);
  }
  return [];
}

function describeStreamGate(isStreamGated, streamConditions) {
  if (!isStreamGated) return '';
  if (streamConditions && typeof streamConditions === 'object') {
    if (streamConditions.usdc_purchase) return 'Artist purchase-gated on Audius';
    if (streamConditions.tip_user_id) return 'Supporter-gated on Audius';
    if (streamConditions.follow_user_id) return 'Follower-gated on Audius';
    if (streamConditions.nft_collection) return 'Collectible-gated on Audius';
  }
  return 'Creator-gated on Audius';
}

/**
 * Normalizes a raw Audius API track record into HIMUNI's consistent internal track shape.
 * Never fabricates missing metadata.
 */
export function normalizeAudiusTrack(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const id = raw.id ? String(raw.id).trim() : '';
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  if (!id || !title) return null;

  // Respect unlisted and deleted creator records
  if (raw.is_delete === true || raw.is_unlisted === true) {
    return null;
  }

  const user = raw.user && typeof raw.user === 'object' ? raw.user : {};
  const artistName =
    (typeof user.name === 'string' && user.name.trim()) ||
    (typeof user.handle === 'string' && user.handle.trim()) ||
    'Unknown Artist';

  const artistHandle = typeof user.handle === 'string' ? user.handle.trim() : '';
  const artistUrl = resolveAudiusArtistUrl(user);
  const trackUrl = resolveAudiusTrackUrl(raw.permalink);

  const { primary: artworkUrl, fallbacks: artworkFallbacks } = buildArtworkUrls(raw.artwork);

  const duration =
    typeof raw.duration === 'number' && Number.isFinite(raw.duration) && raw.duration > 0
      ? Math.round(raw.duration)
      : 0;

  const bpm =
    typeof raw.bpm === 'number' && Number.isFinite(raw.bpm) && raw.bpm > 0
      ? Math.round(raw.bpm)
      : null;

  const genre =
    raw.field_visibility?.genre === false
      ? ''
      : typeof raw.genre === 'string'
      ? raw.genre.trim()
      : '';

  const mood =
    raw.field_visibility?.mood === false
      ? ''
      : typeof raw.mood === 'string'
      ? raw.mood.trim()
      : '';

  const tags = raw.field_visibility?.tags === false ? [] : parseTags(raw.tags);

  const license =
    (typeof raw.license === 'string' && raw.license.trim()) ||
    (typeof raw.copyright_line === 'string' && raw.copyright_line.trim()) ||
    (typeof raw.rights_controller === 'string' && raw.rights_controller.trim()) ||
    '';

  const isUserActive = user.is_deactivated !== true && user.is_available !== false;
  const isAvailable = raw.is_available !== false && isUserActive;
  const isStreamGated = Boolean(raw.is_stream_gated || raw.access?.stream === false);
  const isStreamable = Boolean(isAvailable && !isStreamGated && raw.is_streamable !== false);

  return {
    id,
    title,
    artistName,
    artistHandle,
    artistUrl,
    artworkUrl,
    artworkFallbacks,
    duration,
    bpm,
    musicalKey: typeof raw.musical_key === 'string' ? raw.musical_key.trim() : '',
    genre,
    tags,
    mood,
    license,
    releaseDate: typeof raw.release_date === 'string' ? raw.release_date : '',
    trackUrl,
    isAvailable,
    isStreamGated,
    isStreamable,
    availabilityNote: !isAvailable
      ? 'Unavailable on Audius'
      : isStreamGated
      ? describeStreamGate(true, raw.stream_conditions)
      : !isStreamable
      ? 'Streaming restricted by creator'
      : '',
    streamUrl: isStreamable ? buildOfficialStreamUrl(id) : '',
    provider: 'Audius',
  };
}

export function normalizeAudiusTrackList(rawList) {
  if (!Array.isArray(rawList)) return [];
  const seen = new Set();
  const normalized = [];

  for (const item of rawList) {
    const track = normalizeAudiusTrack(item);
    if (track && !seen.has(track.id)) {
      seen.add(track.id);
      normalized.push(track);
    }
  }

  return normalized;
}

export function formatTrackDuration(seconds) {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds <= 0) {
    return '';
  }
  const total = Math.round(seconds);
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${mins}:${String(secs).padStart(2, '0')}`;
}
