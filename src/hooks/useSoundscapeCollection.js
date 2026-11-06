import { useCallback, useEffect, useState } from 'react';
import { SOUNDSCAPES } from '../data/soundscapes';
import { isAbortError, searchTracks } from '../services/audius/audiusApi';

const PAGE_LIMIT = 8;

/**
 * Fetches real Audius tracks for a dedicated HIMUNI Soundscape discovery view.
 */
export function useSoundscapeCollection(soundscape) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState(0);
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    if (!soundscape) {
      setTracks([]);
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    const bypassCache = retryNonce > 0;

    async function loadSoundscape() {
      setLoading(true);
      setError(null);

      try {
        const primaryQuery = soundscape.queries[0];
        const secondaryQuery = soundscape.queries[1] || soundscape.soundFocus;

        const [primaryRes, secondaryRes] = await Promise.all([
          searchTracks({
            query: primaryQuery,
            limit: PAGE_LIMIT,
            offset: 0,
            signal: controller.signal,
            bypassCache,
          }),
          searchTracks({
            query: secondaryQuery,
            limit: 6,
            offset: 0,
            signal: controller.signal,
            bypassCache,
          }),
        ]);

        const seen = new Set();
        const combined = [];
        for (const item of [...primaryRes.tracks, ...secondaryRes.tracks]) {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            combined.push(item);
          }
        }

        if (!controller.signal.aborted) {
          setTracks(combined);
          setHasMore(primaryRes.hasMore);
          setNextOffset(primaryRes.nextOffset);
          setLoading(false);
        }
      } catch (err) {
        if (isAbortError(err) || controller.signal.aborted) return;
        setError(err);
        setLoading(false);
      }
    }

    loadSoundscape();
    return () => controller.abort();
  }, [soundscape, retryNonce]);

  const loadMore = useCallback(async () => {
    if (!soundscape || loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    setError(null);

    try {
      const res = await searchTracks({
        query: soundscape.queries[0],
        limit: PAGE_LIMIT,
        offset: nextOffset,
      });

      setTracks((prev) => {
        const seen = new Set(prev.map((t) => t.id));
        const merged = [...prev];
        for (const item of res.tracks) {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            merged.push(item);
          }
        }
        return merged;
      });
      setHasMore(res.hasMore && res.tracks.length > 0);
      setNextOffset(res.nextOffset);
      setLoadingMore(false);
    } catch (err) {
      if (isAbortError(err)) return;
      setError(err);
      setLoadingMore(false);
    }
  }, [soundscape, loading, loadingMore, hasMore, nextOffset]);

  const retry = useCallback(() => {
    setRetryNonce((prev) => prev + 1);
  }, []);

  return {
    tracks,
    trackCount: tracks.length,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    retry,
  };
}

/**
 * Lazily retrieves initial Audius results for Soundscape cards on Discover
 * so each card displays real returned track counts and preview artists.
 */
export function useSoundscapePreviews(enabled = true) {
  const [previewMap, setPreviewMap] = useState({});

  useEffect(() => {
    if (!enabled) return undefined;
    const controller = new AbortController();

    async function fetchAllPreviews() {
      await Promise.allSettled(
        SOUNDSCAPES.map(async (sc) => {
          try {
            const res = await searchTracks({
              query: sc.queries[0],
              limit: PAGE_LIMIT,
              offset: 0,
              signal: controller.signal,
            });
            if (!controller.signal.aborted) {
              setPreviewMap((prev) => ({
                ...prev,
                [sc.id]: {
                  tracks: res.tracks,
                  count: res.tracks.length,
                  error: false,
                },
              }));
            }
          } catch (err) {
            if (isAbortError(err) || controller.signal.aborted) return;
            setPreviewMap((prev) => ({
              ...prev,
              [sc.id]: {
                tracks: [],
                count: 0,
                error: true,
              },
            }));
          }
        })
      );
    }

    fetchAllPreviews();
    return () => controller.abort();
  }, [enabled]);

  return previewMap;
}
