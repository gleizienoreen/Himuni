import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { TrackSearchSection } from '../components/sections/TrackSearchSection';
import { useMood } from '../hooks/useMood';

export function SearchPage({ renderTrackRowProps = null }) {
  const { selectedMood } = useMood();

  return (
    <MainLayout activeMood={selectedMood}>
      <TrackSearchSection
        standalonePage
        renderTrackRowProps={renderTrackRowProps}
      />
    </MainLayout>
  );
}
