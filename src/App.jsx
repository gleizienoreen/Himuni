import React from 'react';
import { BRAND } from './data/brand';
import { HimuniLogo } from './components/branding/HimuniLogo';

export default function App() {
  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col justify-between p-8 sm:p-14">
      <header className="flex items-center justify-between border-b border-ink/15 pb-6">
        <HimuniLogo theme="light" size="md" layout="inline" />
        <p className="text-xs uppercase tracking-wideLabel text-ink-muted">
          {BRAND.category}
        </p>
      </header>

      <main className="my-auto py-16 max-w-2xl">
        <p className="text-xs uppercase tracking-wideLabel text-ink-muted mb-4">
          {BRAND.tagline}
        </p>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-editorial leading-[1.04]">
          {BRAND.statement}
        </h1>
      </main>

      <footer className="bg-ink text-cream p-6 sm:p-8 flex items-center justify-between">
        <HimuniLogo theme="dark" size="sm" layout="inline" />
        <span className="text-xs text-cream/70">{BRAND.tagline}</span>
      </footer>
    </div>
  );
}
