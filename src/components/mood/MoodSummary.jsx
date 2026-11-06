import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Compass, Disc3, RotateCcw } from 'lucide-react';
import { describeSpectrumPosition, getEnergyBand } from '../../utils/spectrum';
import { scrollToSection } from '../../utils/navigation';
import { MoodArtwork } from './MoodArtwork';

export function MoodSummary({
  mood,
  energy,
  coordinates,
  isCustomCoordinates,
  onResetBaseline,
}) {
  const shouldReduceMotion = useReducedMotion();
  const energyBand = getEnergyBand(energy);
  const positionSummary = describeSpectrumPosition(coordinates);
  const energyReflection = mood.energyProfiles[energyBand.key];

  return (
    <div
      aria-live="polite"
      style={{ backgroundColor: mood.surface }}
      className="mt-10 border border-ink bg-cream-soft transition-colors duration-500 p-6 sm:p-8 lg:p-10"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={mood.id}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          {/* Left: Selected Mood Identity & Editorial Reflection */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-2 bg-ink text-cream px-3 py-1 font-medium uppercase tracking-wideLabel">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: mood.accent }}
                />
                <span>Selected Mood</span>
              </span>
              <span className="text-ink-muted font-medium">
                {isCustomCoordinates
                  ? `Custom region near ${mood.name} · ${positionSummary}`
                  : mood.spectrumRegion}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-3xl sm:text-4xl font-semibold tracking-editorial text-ink">
                {mood.name}{' '}
                <span className="font-sans italic font-normal text-xl sm:text-2xl text-ink-soft">
                  — {mood.description}
                </span>
              </h3>
              <p className="text-sm sm:text-base text-ink-soft leading-relaxed max-w-2xl">
                {mood.atmosphere}
              </p>
              <p className="text-sm text-ink-muted italic">
                At {energy}% ({energyBand.label.toLowerCase()}): {energyReflection}
              </p>
            </div>

            {/* Sonic texture descriptors */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              {mood.textures.map((texture) => (
                <span
                  key={texture}
                  className="border border-ink/25 bg-cream/85 px-3 py-1 text-xs font-medium text-ink"
                >
                  {texture}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Visual Signature + Spectrum Action */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-l border-ink/20 pt-6 lg:pt-0 lg:pl-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wideLabel text-ink-muted">
                  Personal Energy
                </p>
                <p className="mt-1 font-display text-2xl font-semibold text-ink">
                  {energy}%{' '}
                  <span className="text-sm font-sans font-normal text-ink-muted">
                    ({energyBand.label})
                  </span>
                </p>
              </div>
              <MoodArtwork moodId={mood.id} isSelected className="w-28 h-20 shrink-0" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToSection('mood-recommendations')}
                className="inline-flex items-center gap-2 bg-ink text-cream px-5 py-3 text-xs sm:text-sm font-medium tracking-wide hover:bg-ink-soft transition-colors"
              >
                <Disc3 className="w-4 h-4" aria-hidden="true" />
                <span>Explore {mood.name.toLowerCase()} tracks</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('mood-spectrum')}
                className="inline-flex items-center gap-2 border border-ink/30 bg-cream px-4 py-3 text-xs sm:text-sm font-medium text-ink hover:border-ink transition-colors"
              >
                <Compass className="w-4 h-4" aria-hidden="true" />
                <span>Mood Spectrum</span>
              </button>

              {isCustomCoordinates && (
                <button
                  type="button"
                  onClick={onResetBaseline}
                  className="inline-flex items-center gap-1.5 border border-ink/30 bg-cream px-3.5 py-3 text-xs font-medium text-ink hover:border-ink transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reset baseline</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
