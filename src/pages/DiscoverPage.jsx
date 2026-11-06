import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { HeroSection } from '../components/sections/HeroSection';
import { MoodSelectionSection } from '../components/sections/MoodSelectionSection';
import { MoodDiscoverySection } from '../components/sections/MoodDiscoverySection';
import { MoodSpectrumSection } from '../components/sections/MoodSpectrumSection';
import { EnergyPersonalization } from '../components/spectrum/EnergyPersonalization';
import { FeaturedDiscoveriesSection } from '../components/sections/FeaturedDiscoveriesSection';
import { SoundscapesSection } from '../components/sections/SoundscapesSection';
import { TrackSearchSection } from '../components/sections/TrackSearchSection';
import { AboutSection } from '../components/sections/AboutSection';
import { useMood } from '../hooks/useMood';

export function DiscoverPage() {
  const {
    selectedMood,
    selectedMoodId,
    energy,
    updateEnergy,
    resetPreferences,
    attuneToSoundscape,
  } = useMood();

  return (
    <MainLayout activeMood={selectedMood}>
      <HeroSection activeMood={selectedMood} energy={energy} />
      <MoodSelectionSection />
      <MoodDiscoverySection />

      <MoodSpectrumSection>
        <EnergyPersonalization
          mood={selectedMood}
          energy={energy}
          onChangeEnergy={updateEnergy}
          onResetPreferences={resetPreferences}
        />
      </MoodSpectrumSection>

      <FeaturedDiscoveriesSection />

      <SoundscapesSection
        activeMoodId={selectedMoodId}
        onAttuneSoundscape={attuneToSoundscape}
      />

      <TrackSearchSection />
      <AboutSection activeMood={selectedMood} />
    </MainLayout>
  );
}
