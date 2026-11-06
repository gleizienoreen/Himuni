import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { MoodArtwork } from './MoodArtwork';

/**
 * Asymmetric editorial mood tile with layout variations ('split', 'stacked', 'tall', 'banner')
 * so each mood maintains its own distinctive visual composition.
 */
export function MoodTile({ mood, isSelected, onSelect }) {
  const shouldReduceMotion = useReducedMotion();

  const isSplit = mood.layoutVariant === 'split';
  const isBanner = mood.layoutVariant === 'banner';
  const isTall = mood.layoutVariant === 'tall';

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(mood.id)}
      aria-pressed={isSelected}
      aria-label={`${mood.name} — ${mood.description}`}
      whileHover={shouldReduceMotion ? undefined : { y: -3 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        backgroundColor: isSelected ? mood.surface : undefined,
      }}
      className={`${mood.gridSpan} group relative text-left w-full border transition-colors duration-300 p-5 sm:p-6 flex flex-col justify-between overflow-hidden ${
        isSelected
          ? 'border-ink ring-1 ring-ink shadow-sm'
          : 'bg-cream-soft/80 border-ink/15 hover:border-ink/60 hover:bg-cream-soft'
      }`}
    >
      {/* Subtle top chromatic bar */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-1.5 transition-opacity duration-300"
        style={{
          backgroundColor: mood.accent,
          opacity: isSelected ? 1 : 0.35,
        }}
      />

      {/* Top metadata row */}
      <div className="flex items-center justify-between gap-3 w-full pb-3">
        <span className="inline-flex items-center gap-2 text-xs font-medium tracking-wideLabel uppercase text-ink-muted">
          <span>{mood.index}</span>
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full border border-ink/25"
            style={{ backgroundColor: mood.accent }}
          />
        </span>

        {isSelected ? (
          <span className="inline-flex items-center gap-1.5 bg-ink text-cream px-2.5 py-0.5 text-[11px] font-medium tracking-wide">
            <Check className="w-3 h-3" aria-hidden="true" />
            <span>Selected</span>
          </span>
        ) : (
          <span className="text-[11px] text-ink-subtle opacity-0 group-hover:opacity-100 transition-opacity">
            Explore
          </span>
        )}
      </div>

      {/* Layout-specific middle/bottom composition */}
      {isSplit || isBanner ? (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className={isBanner ? 'sm:col-span-7 space-y-2' : 'sm:col-span-7 space-y-2'}>
            <h3 className="font-display text-2xl sm:text-[1.7rem] font-semibold tracking-editorial text-ink leading-tight">
              {mood.name}
            </h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              {mood.description}
            </p>
            <p className="pt-1 text-[11px] uppercase tracking-wideLabel text-ink-subtle">
              {mood.spectrumRegion}
            </p>
          </div>

          <div className="sm:col-span-5 flex justify-end">
            <MoodArtwork
              moodId={mood.id}
              isSelected={isSelected}
              className="w-32 sm:w-36 h-24 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div
            className={`my-1 flex items-center ${
              isTall ? 'justify-start py-2' : 'justify-center py-1'
            }`}
          >
            <MoodArtwork
              moodId={mood.id}
              isSelected={isSelected}
              className="w-32 h-22 transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-display text-2xl font-semibold tracking-editorial text-ink leading-tight">
              {mood.name}
            </h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              {mood.description}
            </p>
            <p className="pt-1 text-[11px] uppercase tracking-wideLabel text-ink-subtle">
              {mood.spectrumRegion}
            </p>
          </div>
        </div>
      )}
    </motion.button>
  );
}
