/**
 * HIMUNI Personal Insights Calculator
 * Pure calculation functions derived strictly from real saved data.
 * Adheres strictly to neutral descriptive language.
 * No psychological inference, profiling, or medical terminology.
 */

import { getMoodById, MOODS } from '../../data/moods';

export function calculateMoodInsights(memories = []) {
  const total = memories.length;
  if (total === 0) {
    return {
      total: 0,
      distribution: [],
      topMood: null,
      averageEnergy: null,
      thisMonthCount: 0,
    };
  }

  // Count by mood
  const counts = {};
  MOODS.forEach((m) => {
    counts[m.id] = 0;
  });

  let energySum = 0;
  let energyCount = 0;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  let thisMonthCount = 0;

  memories.forEach((mem) => {
    if (mem.moodId && counts[mem.moodId] !== undefined) {
      counts[mem.moodId] += 1;
    }
    if (typeof mem.energy === 'number') {
      energySum += mem.energy;
      energyCount += 1;
    }
    if (mem.entryDate) {
      const d = new Date(`${mem.entryDate}T00:00:00`);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        thisMonthCount += 1;
      }
    }
  });

  const distribution = MOODS.map((m) => {
    const count = counts[m.id] || 0;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      moodId: m.id,
      name: m.name,
      baybayin: m.baybayin,
      accent: m.accent,
      count,
      percentage,
    };
  }).filter((d) => d.count > 0).sort((a, b) => b.count - a.count);

  const topMood = distribution.length > 0 ? distribution[0] : null;
  const averageEnergy = energyCount > 0 ? Math.round(energySum / energyCount) : null;

  return {
    total,
    distribution,
    topMood,
    averageEnergy,
    thisMonthCount,
  };
}

export function calculateListeningInsights(history = []) {
  const total = history.length;
  if (total === 0) {
    return {
      total: 0,
      topTracks: [],
      topArtists: [],
      topListeningMood: null,
    };
  }

  // Count tracks
  const trackMap = new Map();
  const artistMap = new Map();
  const moodMap = new Map();

  history.forEach((event) => {
    // Track count
    if (event.trackId) {
      const current = trackMap.get(event.trackId) || {
        trackId: event.trackId,
        title: event.trackTitle,
        artistName: event.artistName,
        count: 0,
      };
      current.count += 1;
      trackMap.set(event.trackId, current);
    }

    // Artist count
    if (event.artistName) {
      const count = artistMap.get(event.artistName) || 0;
      artistMap.set(event.artistName, count + 1);
    }

    // Mood count
    if (event.moodId) {
      const count = moodMap.get(event.moodId) || 0;
      moodMap.set(event.moodId, count + 1);
    }
  });

  const topTracks = Array.from(trackMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topArtists = Array.from(artistMap.entries())
    .map(([artistName, count]) => ({ artistName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  let topListeningMood = null;
  if (moodMap.size > 0) {
    const sortedMoods = Array.from(moodMap.entries()).sort((a, b) => b[1] - a[1]);
    const topMoodObj = getMoodById(sortedMoods[0][0]);
    if (topMoodObj) {
      topListeningMood = {
        moodId: topMoodObj.id,
        name: topMoodObj.name,
        accent: topMoodObj.accent,
        count: sortedMoods[0][1],
      };
    }
  }

  return {
    total,
    topTracks,
    topArtists,
    topListeningMood,
  };
}

export function calculateArchiveInsights(memories = [], postcards = [], collections = []) {
  const memoriesWithTracks = memories.filter(
    (m) => m.references?.trackId || m.references?.trackSnapshot
  ).length;

  let totalItemsInCollections = 0;
  collections.forEach((c) => {
    if (Array.isArray(c.items)) {
      totalItemsInCollections += c.items.length;
    }
  });

  return {
    memoriesCount: memories.length,
    memoriesWithTracks,
    postcardsCount: postcards.length,
    collectionsCount: collections.length,
    totalItemsInCollections,
  };
}
