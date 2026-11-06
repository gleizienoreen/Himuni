import React from 'react';
import { useMood } from '../../hooks/useMood';
import { MoodSpectrumCanvas } from '../spectrum/MoodSpectrumCanvas';
import { SpectrumControls } from '../spectrum/SpectrumControls';
import { EditorialReveal } from '../common/EditorialReveal';

export function MoodSpectrumSection({ children }) {
  const {
    moods,
    selectedMood,
    coordinates,
    isCustomCoordinates,
    selectMood,
    updateCoordinates,
    resetToMoodBaseline,
  } = useMood();

  return (
    <section
      id="mood-spectrum"
      aria-labelledby="mood-spectrum-heading"
      className="scroll-mt-20 border-b border-ink/15 py-20 sm:py-28 bg-cream-deep/35"
    >
      <div className="mx-auto max-w-editorial px-5 sm:px-8 lg:px-12">
        {/* Editorial Header */}
        <EditorialReveal className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12 border-b border-ink/15 items-end">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wideLabel text-ink-muted">
              Mood Spectrum
            </p>
            <h2
              id="mood-spectrum-heading"
              className="font-display text-3xl sm:text-5xl font-semibold tracking-editorial leading-[1.06] text-ink"
            >
              An emotional map for{' '}
              <span className="font-sans italic font-normal">in-between</span> feelings.
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pl-6">
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
              Select a mood landmark or tap and drag anywhere across the field to explore
              how stillness, momentum, introspection, and brightness meet.
            </p>
          </div>
        </EditorialReveal>

        {/* 2D Spectrum Field + Accessible Companion Panel */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <MoodSpectrumCanvas
              moods={moods}
              selectedMood={selectedMood}
              coordinates={coordinates}
              isCustomCoordinates={isCustomCoordinates}
              onSelectMood={selectMood}
              onChangeCoordinates={updateCoordinates}
            />
          </div>

          <div className="lg:col-span-4">
            <SpectrumControls
              moods={moods}
              selectedMood={selectedMood}
              coordinates={coordinates}
              isCustomCoordinates={isCustomCoordinates}
              onSelectMood={selectMood}
              onChangeCoordinates={updateCoordinates}
              onResetBaseline={resetToMoodBaseline}
            />
          </div>
        </div>

        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
