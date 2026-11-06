import { useCallback, useEffect, useRef, useState } from 'react';
import { isAbortError, searchTracks } from '../services/audius/audiusApi';

const SEARCH_DEBOUNCE_MS = 380;
const PAGE_SIZE = 10;

export function useTrackSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery.trim());

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState(0);
  const [retryNonce, setRetryNonce] = useState(0);

  const loadMoreControllerRef = useRef(null);

  // Debounce user input so we never send requests on every keystroke
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setDebouncedQuery('');
      setResults([]);
      setLoading(false);
      setError(null);
      setHasMore(false);
      setNextOffset(0);
      return undefined;
    }

    const timer = setTimeout(() => {
      setDebouncedQuery(trimmed);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  // Execute search with AbortController cancellation for outdated requests
  useEffect(() => {
    if (loadMoreControllerRef.current) {
      loadMoreControllerRef.current.abort();
      loadMoreControllerRef.current = null;
    }

    if (!debouncedQuery) {
      return undefined;
    }

    const controller = new AbortController();

    async function runSearch() {
      setLoading(true);
      setError(null);

      try {
        const res = await searchTracks({
          query: debouncedQuery,
          limit: PAGE_SIZE,
          offset: 0,
          signal: controller.signal,
          bypassCache: retryNonce > 0,
        });

        if (!controller.signal.aborted) {
          setResults(res.tracks);
          setHasMore(res.hasMore && res.tracks.length > 0);
          setNextOffset(res.nextOffset);
          setLoading(false);
        }
      } catch (err) {
        if (isAbortError(err) || controller.signal.aborted) return;
        setError(err);
        setLoading(false);
      }
    }

    runSearch();
    return () => controller.abort();
  }, [debouncedQuery, retryNonce]);

  const loadMore = useCallback(async () => {
    if (!debouncedQuery || loading || loadingMore || !hasMore) return;

    if (loadMoreControllerRef.current) {
      loadMoreControllerRef.current.abort();
    }
    const controller = new AbortController();
    loadMoreControllerRef.current = controller;

    setLoadingMore(true);
    setError(null);

    try {
      const res = await searchTracks({
        query: debouncedQuery,
        limit: PAGE_SIZE,
        offset: nextOffset,
        signal: controller.signal,
      });

      if (!controller.signal.aborted) {
        setResults((prev) => {
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
      }
    } catch (err) {
      if (isAbortError(err) || controller.signal.aborted) return;
      setError(err);
      setLoadingMore(false);
    }
  }, [debouncedQuery, loading, loadingMore, hasMore, nextOffset]);

  const clearSearch = useCallback(() => {
    if (loadMoreControllerRef.current) {
      loadMoreControllerRef.current.abort();
      loadMoreControllerRef.current = null;
    }
    setQuery('');
    setDebouncedQuery('');
    setResults([]);
    setError(null);
    setHasMore(false);
    setNextOffset(0);
    setLoading(false);
    setLoadingMore(false);
  }, []);

  const retrySearch = useCallback(() => {
    setRetryNonce((prev) => prev + 1);
  }, []);

  const applySuggestedTerm = useCallback((term) => {
    setQuery(term);
    setDebouncedQuery(term.trim());
  }, []);

  const isTyping = query.trim() !== debouncedQuery && query.trim().length > 0;

  return {
    query,
    setQuery,
    debouncedQuery,
    isTyping,
    results,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    clearSearch,
    retrySearch,
    applySuggestedTerm,
  };
}
