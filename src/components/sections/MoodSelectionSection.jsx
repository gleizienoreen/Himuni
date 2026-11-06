import React from 'react';
import { useMood } from '../../hooks/useMood';
import { MoodTile } from '../mood/MoodTile';
import { MoodSummary } from '../mood/MoodSummary';

export function MoodSelectionSection() {
  const {
    moods,
    selectedMood,
    selectedMoodId,
    energy,
    coordinates,
    isCustomCoordinates,
    selectMood,
    resetToMoodBaseline,
  } = useMood();

  return (
    <section
      id="mood-explorer"
      aria-labelledby="mood-explorer-heading"
      className="scroll-mt-20 border-b border-ink/15 py-20 sm:py-28 bg-cream"
    >
      <div className="mx-auto max-w-editorial px-5 sm:px-8 lg:px-12">
        {/* Editorial Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12 border-b border-ink/15 items-end">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wideLabel text-ink-muted">
              Interactive Mood Exploration
            </p>
            <h2
              id="mood-explorer-heading"
              className="font-display text-3xl sm:text-5xl font-semibold tracking-editorial leading-[1.06] text-ink"
            >
              Start with how the moment{' '}
              <span className="font-sans italic font-normal">feels</span>.
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pl-6">
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
              Choose an emotional territory below. Each mood shifts HIMUNI&rsquo;s
              visual atmosphere and aligns your position on the Mood Spectrum.
            </p>
          </div>
        </div>

        {/* Asymmetric 12-column Mood Mosaic */}
        <div
          role="group"
          aria-label="Selectable mood experiences"
          className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5"
        >
          {moods.map((mood) => (
            <MoodTile
              key={mood.id}
              mood={mood}
              isSelected={mood.id === selectedMoodId}
              onSelect={selectMood}
            />
          ))}
        </div>

        {/* Live Selected Mood Reflection Summary */}
        <MoodSummary
          mood={selectedMood}
          energy={energy}
          coordinates={coordinates}
          isCustomCoordinates={isCustomCoordinates}
          onResetBaseline={resetToMoodBaseline}
        />
      </div>
    </section>
  );
}
