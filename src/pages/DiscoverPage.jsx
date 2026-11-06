import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { HeroSection } from '../components/sections/HeroSection';
import { MoodSelectionSection } from '../components/sections/MoodSelectionSection';
import { MoodSpectrumSection } from '../components/sections/MoodSpectrumSection';
import { SoundscapesSection } from '../components/sections/SoundscapesSection';
import { AboutSection } from '../components/sections/AboutSection';
import { useMood } from '../hooks/useMood';

export function DiscoverPage() {
  const { selectedMood, selectedMoodId, energy, attuneToSoundscape } = useMood();

  return (
    <MainLayout activeMood={selectedMood}>
      <HeroSection activeMood={selectedMood} energy={energy} />
      <MoodSelectionSection />
      <MoodSpectrumSection />
      <SoundscapesSection
        activeMoodId={selectedMoodId}
        onAttuneSoundscape={attuneToSoundscape}
      />
      <AboutSection activeMood={selectedMood} />
    </MainLayout>
  );
}
