import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { getEnergyBand } from '../../utils/spectrum';

const ENERGY_PRESETS = [
  { key: 'low', label: 'Low energy', value: 20 },
  { key: 'balanced', label: 'Balanced', value: 50 },
  { key: 'high', label: 'High energy', value: 82 },
];

const BAR_FACTORS = [0.38, 0.58, 0.44, 0.76, 0.62, 0.92, 0.7, 0.85, 0.52, 0.96, 0.66, 0.48];

export function EnergyPersonalization({
  mood,
  energy,
  onChangeEnergy,
  onResetPreferences,
}) {
  const band = getEnergyBand(energy);
  const contextualDescription = mood.energyProfiles[band.key];

  return (
    <div
      id="energy-personalization"
      aria-labelledby="energy-personalization-heading"
      className="border border-ink bg-cream p-6 sm:p-8 lg:p-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left: Personal Preference Slider & Labels */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wideLabel text-ink-muted">
              <SlidersHorizontal className="w-3.5 h-3.5 text-ink" aria-hidden="true" />
              <span>Personal Energy Preference</span>
            </div>

            <button
              type="button"
              onClick={onResetPreferences}
              className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink underline transition-colors"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              <span>Reset saved preferences</span>
            </button>
          </div>

          <div className="space-y-2">
            <h3
              id="energy-personalization-heading"
              className="font-display text-2xl sm:text-3xl font-semibold tracking-editorial text-ink"
            >
              Shape the pacing of{' '}
              <span className="underline decoration-2" style={{ textDecorationColor: mood.accent }}>
                {mood.name}
              </span>
              .
            </h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Set how gently or vividly you want your atmosphere to move right now. Your
              personal preference stays synchronized with the Mood Spectrum above.
            </p>
          </div>

          {/* 0 to 100 Range Control */}
          <div className="pt-2 space-y-3">
            <div className="flex items-baseline justify-between gap-4">
              <label
                htmlFor="himuni-energy-slider"
                className="text-xs font-semibold uppercase tracking-wideLabel text-ink"
              >
                Preferred intensity
              </label>
              <output
                htmlFor="himuni-energy-slider"
                className="font-display text-2xl sm:text-3xl font-semibold text-ink"
              >
                {energy}%{' '}
                <span className="text-xs sm:text-sm font-sans font-medium text-ink-muted">
                  &middot; {band.label}
                </span>
              </output>
            </div>

            <div className="relative py-2">
              {/* Custom background progress track */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 bg-cream-deep border border-ink/20 overflow-hidden"
              >
                <div
                  className="h-full transition-all duration-150"
                  style={{
                    width: `${energy}%`,
                    backgroundColor: mood.accent,
                  }}
                />
              </div>

              <input
                id="himuni-energy-slider"
                type="range"
                min={0}
                max={100}
                step={1}
                value={energy}
                onChange={(e) => onChangeEnergy(Number(e.target.value))}
                aria-valuetext={`${energy}% (${band.label}) for ${mood.name}`}
                className="himuni-range relative z-10 w-full"
              />
            </div>

            {/* Required Low energy / Balanced / High energy Labels */}
            <div
              role="group"
              aria-label="Energy preference presets"
              className="grid grid-cols-3 gap-2 pt-1"
            >
              {ENERGY_PRESETS.map((preset) => {
                const isActiveBand = band.key === preset.key;
                return (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => onChangeEnergy(preset.value)}
                    aria-pressed={isActiveBand}
                    className={`px-3 py-2 text-xs border text-center transition-colors ${
                      isActiveBand
                        ? 'bg-ink text-cream border-ink font-semibold'
                        : 'bg-cream-soft text-ink-muted border-ink/15 hover:border-ink hover:text-ink font-medium'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Personalized Mood Profile & Associated Visual Treatment */}
        <div className="lg:col-span-5">
          <div
            style={{ backgroundColor: mood.surface }}
            className="border border-ink/25 p-6 transition-colors duration-300 space-y-5"
          >
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-ink/15">
              <div>
                <span className="block text-[11px] uppercase tracking-wideLabel text-ink-muted">
                  Personalized Profile
                </span>
                <span className="font-display text-xl font-semibold text-ink">
                  {mood.name} &middot; {energy}%
                </span>
              </div>
              <span className="border border-ink/25 bg-cream/90 px-2.5 py-1 text-xs font-medium text-ink">
                {band.label}
              </span>
            </div>

            {/* Expressive sculptural cadence bars reactive to mood & energy */}
            <div
              aria-hidden="true"
              className="h-24 bg-cream/85 border border-ink/15 px-4 py-3 flex items-end justify-between gap-1.5"
            >
              {BAR_FACTORS.map((factor, idx) => {
                const normalizedEnergy = Math.max(0.16, energy / 100);
                const barHeightPercent = Math.round(
                  Math.min(100, Math.max(16, (0.22 + factor * normalizedEnergy * 0.85) * 100))
                );
                const isHighlight = idx % 3 === 1;
                return (
                  <span
                    key={idx}
                    className="flex-1 border border-ink/25 transition-all duration-200"
                    style={{
                      height: `${barHeightPercent}%`,
                      backgroundColor: isHighlight ? mood.secondary : mood.accent,
                    }}
                  />
                );
              })}
            </div>

            <p aria-live="polite" className="text-sm text-ink-soft leading-relaxed">
              {contextualDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
