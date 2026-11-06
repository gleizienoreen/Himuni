import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MoodProvider } from './context/MoodContext';
import { DiscoverPage } from './pages/DiscoverPage';

export default function App() {
  return (
    <MoodProvider>
      <Routes>
        <Route path="/" element={<DiscoverPage />} />
        <Route path="/mood-spectrum" element={<DiscoverPage />} />
        <Route path="/about" element={<DiscoverPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MoodProvider>
  );
}
