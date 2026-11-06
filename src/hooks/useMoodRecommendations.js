import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  rankTracksByEnergyMetadata,
  resolveMoodDiscoveryPlan,
} from '../data/moodRecommendations';
import { isAbortError, searchTracks } from '../services/audius/audiusApi';

export function useMoodRecommendations(selectedMoodId, energy) {
  const [debouncedEnergy, setDebouncedEnergy] = useState(energy);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [additionalTracks, setAdditionalTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reset refresh cycle when user switches moods
  useEffect(() => {
    setRefreshIndex(0);
  }, [selectedMoodId]);

  // Debounce rapid slider / spectrum drag updates to avoid redundant requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedEnergy(energy);
    }, 260);
    return () => clearTimeout(timer);
  }, [energy]);

  const plan = useMemo(
    () => resolveMoodDiscoveryPlan(selectedMoodId, debouncedEnergy, refreshIndex),
    [selectedMoodId, debouncedEnergy, refreshIndex]
  );

  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const bypassCache = reloadNonce > 0;

    async function loadRecommendations() {
      setLoading(true);
      setError(null);

      try {
        const [primaryResult, additionalResult] = await Promise.all([
          searchTracks({
            query: plan.primaryQuery,
            limit: 10,
            offset: plan.offset,
            signal: controller.signal,
            bypassCache,
          }),
          searchTracks({
            query: plan.additionalQuery,
            limit: 8,
            offset: plan.offset,
            signal: controller.signal,
            bypassCache,
          }),
        ]);

        let primaryPool = primaryResult.tracks;

        // Broaden search deterministically if specific offset/phrase returned sparse results
        if (primaryPool.length < 3) {
          const broadFallback = await searchTracks({
            query: plan.directions[0],
            limit: 10,
            offset: 0,
            signal: controller.signal,
          });
          const seenIds = new Set(primaryPool.map((t) => t.id));
          for (const item of broadFallback.tracks) {
            if (!seenIds.has(item.id)) {
              seenIds.add(item.id);
              primaryPool.push(item);
            }
          }
        }

        const rankedPrimary = rankTracksByEnergyMetadata(primaryPool, {
          preferredMinBpm: plan.preferredMinBpm,
          preferredMaxBpm: plan.preferredMaxBpm,
        });

        const topRecommended = rankedPrimary.slice(0, 6);
        const recommendedIds = new Set(topRecommended.map((t) => t.id));

        const overflowPrimary = rankedPrimary.slice(6);
        const deduplicatedAdditional = [];

        for (const candidate of [...additionalResult.tracks, ...overflowPrimary]) {
          if (!recommendedIds.has(candidate.id)) {
            recommendedIds.add(candidate.id);
            deduplicatedAdditional.push(candidate);
          }
          if (deduplicatedAdditional.length >= 4) break;
        }

        const rankedAdditional = rankTracksByEnergyMetadata(deduplicatedAdditional, {
          preferredMinBpm: plan.preferredMinBpm,
          preferredMaxBpm: plan.preferredMaxBpm,
        });

        if (!controller.signal.aborted) {
          setRecommendedTracks(topRecommended);
          setAdditionalTracks(rankedAdditional);
          setLoading(false);
        }
      } catch (err) {
        if (isAbortError(err) || controller.signal.aborted) return;
        setError(err);
        setLoading(false);
      }
    }

    loadRecommendations();
    return () => controller.abort();
  }, [plan, reloadNonce]);

  const refreshRecommendations = useCallback(() => {
    setRefreshIndex((prev) => prev + 1);
  }, []);

  const retryRecommendations = useCallback(() => {
    setReloadNonce((prev) => prev + 1);
  }, []);

  return {
    plan,
    recommendedTracks,
    additionalTracks,
    loading,
    error,
    refreshRecommendations,
    retryRecommendations,
  };
}
