import React from 'react';
import { MotionConfig } from 'framer-motion';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';

export function MainLayout({ children, activeMood = null }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-cream text-ink">
        <Navbar activeMood={activeMood} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer activeMood={activeMood} />
      </div>
    </MotionConfig>
  );
}
