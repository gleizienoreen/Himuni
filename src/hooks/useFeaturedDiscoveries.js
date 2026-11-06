import { useCallback, useEffect, useState } from 'react';
import { getMoodById } from '../data/moods';
import {
  MOOD_RECOMMENDATIONS,
  resolveMoodDiscoveryPlan,
} from '../data/moodRecommendations';
import {
  getTrendingTracks,
  isAbortError,
  searchTracks,
} from '../services/audius/audiusApi';

export function useFeaturedDiscoveries(selectedMoodId) {
  const [spotlightTrack, setSpotlightTrack] = useState(null);
  const [networkPicks, setNetworkPicks] = useState([]);
  const [contrastingTracks, setContrastingTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryNonce, setRetryNonce] = useState(0);

  const moodConfig =
    MOOD_RECOMMENDATIONS[selectedMoodId] || MOOD_RECOMMENDATIONS.dreamy;
  const contrastingMood = getMoodById(moodConfig.contrastingMoodId);

  useEffect(() => {
    const controller = new AbortController();
    const contrastingPlan = resolveMoodDiscoveryPlan(contrastingMood.id, 55, 0);

    async function loadFeatured() {
      setLoading(true);
      setError(null);

      try {
        const [trendingRes, contrastRes] = await Promise.all([
          getTrendingTracks({
            time: 'week',
            limit: 6,
            offset: 0,
            signal: controller.signal,
            bypassCache: retryNonce > 0,
          }),
          searchTracks({
            query: contrastingPlan.primaryQuery,
            limit: 5,
            offset: 0,
            signal: controller.signal,
            bypassCache: retryNonce > 0,
          }),
        ]);

        if (!controller.signal.aborted) {
          const trendingList = trendingRes.tracks;
          const spotlight = trendingList[0] || null;
          const picks = trendingList.slice(1, 4);

          const usedIds = new Set(trendingList.slice(0, 4).map((t) => t.id));
          const contrastFiltered = contrastRes.tracks
            .filter((t) => !usedIds.has(t.id))
            .slice(0, 3);

          setSpotlightTrack(spotlight);
          setNetworkPicks(picks);
          setContrastingTracks(contrastFiltered);
          setLoading(false);
        }
      } catch (err) {
        if (isAbortError(err) || controller.signal.aborted) return;
        setError(err);
        setLoading(false);
      }
    }

    loadFeatured();
    return () => controller.abort();
  }, [contrastingMood.id, retryNonce]);

  const retry = useCallback(() => {
    setRetryNonce((prev) => prev + 1);
  }, []);

  return {
    contrastingMood,
    spotlightTrack,
    networkPicks,
    contrastingTracks,
    loading,
    error,
    retry,
  };
}
