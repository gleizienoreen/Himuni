import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { HeroSection } from '../components/sections/HeroSection';
import { MoodSelectionSection } from '../components/sections/MoodSelectionSection';
import { SoundscapesSection } from '../components/sections/SoundscapesSection';
import { AboutSection } from '../components/sections/AboutSection';
import { useMood } from '../hooks/useMood';

export function DiscoverPage() {
  const { selectedMood, selectedMoodId, energy, attuneToSoundscape } = useMood();

  return (
    <MainLayout activeMood={selectedMood}>
      <HeroSection activeMood={selectedMood} energy={energy} />
      <MoodSelectionSection />

      <section
        id="mood-spectrum"
        aria-label="Mood Spectrum"
        className="scroll-mt-20 border-b border-ink/15 py-16 sm:py-20 bg-cream-soft/40"
      >
        <div className="mx-auto max-w-editorial px-5 sm:px-8 lg:px-12">
          <p className="text-xs font-semibold uppercase tracking-wideLabel text-ink-muted">
            Mood Spectrum
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-editorial text-ink">
            Currently attuned to {selectedMood.name}.
          </h2>
        </div>
      </section>

      <SoundscapesSection
        activeMoodId={selectedMoodId}
        onAttuneSoundscape={attuneToSoundscape}
      />
      <AboutSection activeMood={selectedMood} />
    </MainLayout>
  );
}
