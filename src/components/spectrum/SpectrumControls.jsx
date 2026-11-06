import React from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  RotateCcw,
} from 'lucide-react';
import { clamp01, describeSpectrumPosition } from '../../utils/spectrum';

export function SpectrumControls({
  moods,
  selectedMood,
  coordinates,
  isCustomCoordinates,
  onSelectMood,
  onChangeCoordinates,
  onResetBaseline,
}) {
  const positionDescription = describeSpectrumPosition(coordinates);
  const brightnessPercent = Math.round(coordinates.y * 100);
  const energyPercent = Math.round(coordinates.x * 100);

  const nudge = (dx, dy) => {
    onChangeCoordinates({
      x: clamp01(coordinates.x + dx),
      y: clamp01(coordinates.y + dy),
    });
  };

  return (
    <div className="border border-ink/20 bg-cream p-6 sm:p-7 flex flex-col justify-between gap-7">
      {/* Live Spectrum Emotional Readout */}
      <div aria-live="polite" className="space-y-4">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="uppercase tracking-wideLabel font-semibold text-ink-muted">
            Current Territory
          </span>
          {isCustomCoordinates ? (
            <span className="bg-ink text-cream px-2.5 py-0.5 text-[11px] font-medium">
              Custom Point
            </span>
          ) : (
            <span className="border border-ink/20 px-2.5 py-0.5 text-[11px] text-ink-muted">
              Mood Anchor
            </span>
          )}
        </div>

        <div
          style={{ backgroundColor: selectedMood.surface }}
          className="border border-ink/20 p-4 sm:p-5 transition-colors duration-300 space-y-2"
        >
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full border border-ink/30"
              style={{ backgroundColor: selectedMood.accent }}
            />
            <h3 className="font-display text-2xl font-semibold tracking-editorial text-ink">
              {selectedMood.name}
            </h3>
          </div>
          <p className="text-sm text-ink-soft leading-relaxed">
            {positionDescription}. {selectedMood.description}
          </p>
        </div>

        {/* Qualitative Coordinate Balance */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="border border-ink/15 bg-cream-soft p-3">
            <span className="block text-[11px] uppercase tracking-wideLabel text-ink-muted">
              Calm &harr; Energetic
            </span>
            <span className="mt-1 block font-display text-lg font-semibold text-ink">
              {energyPercent}%
            </span>
          </div>
          <div className="border border-ink/15 bg-cream-soft p-3">
            <span className="block text-[11px] uppercase tracking-wideLabel text-ink-muted">
              Introspective &harr; Bright
            </span>
            <span className="mt-1 block font-display text-lg font-semibold text-ink">
              {brightnessPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Labeled Accessible Directional Controls */}
      <div className="space-y-3 pt-4 border-t border-ink/15">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wideLabel text-ink">
            Step Across the Map
          </span>
          {isCustomCoordinates && (
            <button
              type="button"
              onClick={onResetBaseline}
              className="inline-flex items-center gap-1 text-xs font-medium underline text-ink hover:text-violet-deep"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              <span>Snap to {selectedMood.name}</span>
            </button>
          )}
        </div>

        <div
          role="group"
          aria-label="Step selection across the Mood Spectrum"
          className="grid grid-cols-2 gap-2 text-xs font-medium"
        >
          <button
            type="button"
            onClick={() => nudge(-0.08, 0)}
            className="inline-flex items-center justify-center gap-1.5 border border-ink/20 bg-cream-soft px-3 py-2.5 text-ink hover:border-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>More Calm</span>
          </button>

          <button
            type="button"
            onClick={() => nudge(0.08, 0)}
            className="inline-flex items-center justify-center gap-1.5 border border-ink/20 bg-cream-soft px-3 py-2.5 text-ink hover:border-ink transition-colors"
          >
            <span>More Energetic</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => nudge(0, 0.08)}
            className="inline-flex items-center justify-center gap-1.5 border border-ink/20 bg-cream-soft px-3 py-2.5 text-ink hover:border-ink transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
            <span>More Bright</span>
          </button>

          <button
            type="button"
            onClick={() => nudge(0, -0.08)}
            className="inline-flex items-center justify-center gap-1.5 border border-ink/20 bg-cream-soft px-3 py-2.5 text-ink hover:border-ink transition-colors"
          >
            <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
            <span>More Introspective</span>
          </button>
        </div>
      </div>

      {/* Accessible Predefined Mood Landmark Selector */}
      <div className="space-y-2.5 pt-4 border-t border-ink/15">
        <span className="block text-xs font-semibold uppercase tracking-wideLabel text-ink-muted">
          Jump to Mood Landmark
        </span>
        <div className="flex flex-wrap gap-1.5">
          {moods.map((mood) => {
            const active = mood.id === selectedMood.id && !isCustomCoordinates;
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => onSelectMood(mood.id)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs border transition-colors ${
                  active
                    ? 'bg-ink text-cream border-ink font-semibold'
                    : 'bg-cream-soft text-ink border-ink/20 hover:border-ink'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: mood.accent }}
                />
                <span>{mood.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
