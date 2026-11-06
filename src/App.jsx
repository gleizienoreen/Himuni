import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DiscoverPage } from './pages/DiscoverPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DiscoverPage />} />
      <Route path="/mood-spectrum" element={<DiscoverPage />} />
      <Route path="/about" element={<DiscoverPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
