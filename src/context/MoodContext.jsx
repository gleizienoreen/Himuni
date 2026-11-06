import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_MOOD_ID, getMoodById, MOODS } from '../data/moods';
import { clamp01, clampEnergy, findNearestMood } from '../utils/spectrum';

export const MoodContext = createContext(null);

export function MoodProvider({ children }) {
  const initialMood = getMoodById(DEFAULT_MOOD_ID);

  const [selectedMoodId, setSelectedMoodId] = useState(initialMood.id);
  const [coordinates, setCoordinates] = useState(initialMood.coordinates);
  const [energy, setEnergy] = useState(Math.round(initialMood.coordinates.x * 100));

  const selectedMood = useMemo(
    () => getMoodById(selectedMoodId),
    [selectedMoodId]
  );

  // Sync CSS custom properties for ambient visual treatments
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.style.setProperty('--mood-accent', selectedMood.accent);
    document.documentElement.style.setProperty('--mood-surface', selectedMood.surface);
  }, [selectedMood]);

  const selectMood = useCallback((moodId) => {
    const mood = getMoodById(moodId);
    setSelectedMoodId(mood.id);
    setCoordinates({ x: mood.coordinates.x, y: mood.coordinates.y });
    setEnergy(clampEnergy(mood.coordinates.x * 100));
  }, []);

  const updateCoordinates = useCallback((nextCoords) => {
    const x = clamp01(nextCoords?.x);
    const y = clamp01(nextCoords?.y);
    const { mood } = findNearestMood({ x, y });

    setCoordinates({ x, y });
    setEnergy(clampEnergy(x * 100));
    setSelectedMoodId(mood.id);
  }, []);

  const updateEnergy = useCallback((nextEnergy) => {
    const safeEnergy = clampEnergy(nextEnergy);
    const nextX = clamp01(safeEnergy / 100);

    setEnergy(safeEnergy);
    setCoordinates((prev) => ({
      x: nextX,
      y: clamp01(prev.y),
    }));
  }, []);

  const resetToMoodBaseline = useCallback(() => {
    const mood = getMoodById(selectedMoodId);
    setCoordinates({ x: mood.coordinates.x, y: mood.coordinates.y });
    setEnergy(clampEnergy(mood.coordinates.x * 100));
  }, [selectedMoodId]);

  const attuneToSoundscape = useCallback((soundscape) => {
    if (!soundscape) return;
    const primaryMoodId = soundscape.moodIds?.[0] || DEFAULT_MOOD_ID;
    const mood = getMoodById(primaryMoodId);
    const x = clamp01(soundscape.coordinates?.x ?? mood.coordinates.x);
    const y = clamp01(soundscape.coordinates?.y ?? mood.coordinates.y);

    setSelectedMoodId(mood.id);
    setCoordinates({ x, y });
    setEnergy(clampEnergy(x * 100));
  }, []);

  const isCustomCoordinates = useMemo(() => {
    const dx = Math.abs(coordinates.x - selectedMood.coordinates.x);
    const dy = Math.abs(coordinates.y - selectedMood.coordinates.y);
    return dx > 0.015 || dy > 0.015;
  }, [coordinates, selectedMood]);

  const value = useMemo(
    () => ({
      moods: MOODS,
      selectedMoodId,
      selectedMood,
      coordinates,
      energy,
      isCustomCoordinates,
      selectMood,
      updateCoordinates,
      updateEnergy,
      resetToMoodBaseline,
      attuneToSoundscape,
    }),
    [
      selectedMoodId,
      selectedMood,
      coordinates,
      energy,
      isCustomCoordinates,
      selectMood,
      updateCoordinates,
      updateEnergy,
      resetToMoodBaseline,
      attuneToSoundscape,
    ]
  );

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
}
