import { MOODS } from '../data/moods.js';

export function clamp01(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0.5;
  return Math.min(1, Math.max(0, Number(value.toFixed(3))));
}

export function clampEnergy(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 50;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function findNearestMood(coordinates) {
  const x = clamp01(coordinates?.x);
  const y = clamp01(coordinates?.y);

  let closest = MOODS[0];
  let minDistance = Infinity;

  for (const mood of MOODS) {
    const dx = mood.coordinates.x - x;
    const dy = mood.coordinates.y - y;
    const dist = Math.hypot(dx, dy);
    if (dist < minDistance) {
      minDistance = dist;
      closest = mood;
    }
  }

  return { mood: closest, distance: minDistance };
}

export function getEnergyBand(energy) {
  const value = clampEnergy(energy);
  if (value <= 33) {
    return {
      key: 'low',
      label: 'Low energy',
      shortNote: 'Unhurried, spacious pacing',
    };
  }
  if (value <= 66) {
    return {
      key: 'balanced',
      label: 'Balanced',
      shortNote: 'Steady, natural cadence',
    };
  }
  return {
    key: 'high',
    label: 'High energy',
    shortNote: 'Kinetic, forward momentum',
  };
}

export function describeSpectrumPosition(coordinates) {
  const x = clamp01(coordinates?.x);
  const y = clamp01(coordinates?.y);

  const energyPhrase =
    x < 0.34 ? 'Calm stillness' : x < 0.67 ? 'Measured momentum' : 'Vivid kinetic drive';

  const tonePhrase =
    y < 0.35
      ? 'inward & introspective'
      : y < 0.68
      ? 'open & balanced'
      : 'bright & luminous';

  return `${energyPhrase}, ${tonePhrase}`;
}
