import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { HeroSection } from '../components/sections/HeroSection';
import { SoundscapesSection } from '../components/sections/SoundscapesSection';
import { AboutSection } from '../components/sections/AboutSection';

export function DiscoverPage() {
  return (
    <MainLayout>
      <HeroSection />

      <section
        id="mood-explorer"
        aria-label="Mood exploration"
        className="scroll-mt-20 border-b border-ink/15 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-editorial px-5 sm:px-8 lg:px-12">
          <p className="text-xs font-semibold uppercase tracking-wideLabel text-ink-muted">
            Mood Discovery
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-editorial text-ink">
            Eight moods to shape your atmosphere.
          </h2>
        </div>
      </section>

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
            Navigate between calm stillness and bright momentum.
          </h2>
        </div>
      </section>

      <SoundscapesSection />
      <AboutSection />
    </MainLayout>
  );
}
