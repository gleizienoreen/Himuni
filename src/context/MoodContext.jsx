import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_MOOD_ID, getMoodById, MOODS } from '../data/moods';
import { clamp01, clampEnergy, findNearestMood } from '../utils/spectrum';
import { clearPreferences, loadPreferences, savePreferences } from '../utils/storage';

export const MoodContext = createContext(null);

function getInitialMoodState() {
  const stored = loadPreferences();
  if (stored) {
    return stored;
  }

  const fallbackMood = getMoodById(DEFAULT_MOOD_ID);
  return {
    selectedMoodId: fallbackMood.id,
    coordinates: { ...fallbackMood.coordinates },
    energy: clampEnergy(fallbackMood.coordinates.x * 100),
  };
}

export function MoodProvider({ children }) {
  const [initialState] = useState(getInitialMoodState);

  const [selectedMoodId, setSelectedMoodId] = useState(initialState.selectedMoodId);
  const [coordinates, setCoordinates] = useState(initialState.coordinates);
  const [energy, setEnergy] = useState(initialState.energy);

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

  // Persist selected mood, energy preference, and spectrum coordinates locally
  useEffect(() => {
    savePreferences({
      selectedMoodId,
      energy,
      coordinates,
    });
  }, [selectedMoodId, energy, coordinates]);

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

  const resetPreferences = useCallback(() => {
    clearPreferences();
    const fallbackMood = getMoodById(DEFAULT_MOOD_ID);
    setSelectedMoodId(fallbackMood.id);
    setCoordinates({ ...fallbackMood.coordinates });
    setEnergy(clampEnergy(fallbackMood.coordinates.x * 100));
  }, []);

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
      resetPreferences,
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
      resetPreferences,
      attuneToSoundscape,
    ]
  );

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
}
