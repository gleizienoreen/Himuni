import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MoodProvider } from './context/MoodContext';
import { DiscoverPage } from './pages/DiscoverPage';
import { SearchPage } from './pages/SearchPage';

export default function App() {
  return (
    <MoodProvider>
      <Routes>
        <Route path="/" element={<DiscoverPage />} />
        <Route path="/mood-spectrum" element={<DiscoverPage />} />
        <Route path="/soundscapes" element={<DiscoverPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/about" element={<DiscoverPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MoodProvider>
  );
}
