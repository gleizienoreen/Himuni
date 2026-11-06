import React from 'react';
import { MotionConfig } from 'framer-motion';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';
import { HeaderStreamPill } from '../components/discovery/ContextualListenControls';

export function MainLayout({
  children,
  activeMood = null,
  headerAudioControl = null,
}) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-cream text-ink">
        <Navbar
          activeMood={activeMood}
          headerAudioControl={
            headerAudioControl ?? <HeaderStreamPill accentColor={activeMood?.accent} />
          }
        />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer activeMood={activeMood} />
      </div>
    </MotionConfig>
  );
}
