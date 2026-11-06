import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MoodProvider } from './context/MoodContext';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import { DiscoverPage } from './pages/DiscoverPage';
import { SearchPage } from './pages/SearchPage';
import { SoundscapePage } from './pages/SoundscapePage';

export default function App() {
  return (
    <MoodProvider>
      <AudioPlayerProvider>
        <Routes>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/mood-spectrum" element={<DiscoverPage />} />
          <Route path="/soundscapes" element={<DiscoverPage />} />
          <Route path="/soundscapes/:soundscapeId" element={<SoundscapePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<DiscoverPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AudioPlayerProvider>
    </MoodProvider>
  );
}
