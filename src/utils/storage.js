import { DEFAULT_MOOD_ID, MOODS } from '../data/moods';
import { clamp01, clampEnergy } from './spectrum';

export const STORAGE_KEY = 'himuni.preferences.v1';

const VALID_MOOD_IDS = new Set(MOODS.map((mood) => mood.id));

export function loadPreferences() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    const moodId =
      typeof parsed.selectedMoodId === 'string' &&
      VALID_MOOD_IDS.has(parsed.selectedMoodId)
        ? parsed.selectedMoodId
        : DEFAULT_MOOD_ID;

    const fallbackMood = MOODS.find((m) => m.id === moodId) || MOODS[0];

    const hasValidCoords =
      parsed.coordinates &&
      typeof parsed.coordinates === 'object' &&
      typeof parsed.coordinates.x === 'number' &&
      !Number.isNaN(parsed.coordinates.x) &&
      typeof parsed.coordinates.y === 'number' &&
      !Number.isNaN(parsed.coordinates.y);

    const coordinates = hasValidCoords
      ? {
          x: clamp01(parsed.coordinates.x),
          y: clamp01(parsed.coordinates.y),
        }
      : {
          x: fallbackMood.coordinates.x,
          y: fallbackMood.coordinates.y,
        };

    const energy =
      typeof parsed.energy === 'number' && !Number.isNaN(parsed.energy)
        ? clampEnergy(parsed.energy)
        : clampEnergy(coordinates.x * 100);

    const alignedX =
      Math.abs(coordinates.x * 100 - energy) <= 1
        ? coordinates.x
        : clamp01(energy / 100);

    // Keep horizontal spectrum coordinate aligned with stored energy preference
    return {
      selectedMoodId: moodId,
      energy,
      coordinates: {
        x: alignedX,
        y: coordinates.y,
      },
    };
  } catch {
    return null;
  }
}

export function savePreferences({ selectedMoodId, energy, coordinates }) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    const payload = {
      selectedMoodId: VALID_MOOD_IDS.has(selectedMoodId)
        ? selectedMoodId
        : DEFAULT_MOOD_ID,
      energy: clampEnergy(energy),
      coordinates: {
        x: clamp01(coordinates?.x),
        y: clamp01(coordinates?.y),
      },
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Gracefully ignore quota or restricted storage errors
  }
}

export function clearPreferences() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage removal errors
  }
}
