import React from 'react';
import { BRAND } from '../../data/brand';
import { HimuniLogo } from '../branding/HimuniLogo';
import { BaybayinMark } from '../branding/BaybayinMark';

export function AboutSection({ activeMood = null }) {
  const accentColor = activeMood?.accent || '#8067E8';

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-20 py-20 sm:py-28 bg-cream"
    >
      <div className="mx-auto max-w-editorial px-5 sm:px-8 lg:px-12">
        {/* Top editorial eyebrow */}
        <div className="pb-10 border-b border-ink/15 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-wideLabel text-ink-muted">
            About HIMUNI
          </p>
          <p className="text-xs text-ink-muted">
            Origin &amp; Identity
          </p>
        </div>

        {/* Main editorial essay + etymology columns */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          <div className="lg:col-span-7 space-y-6">
            <h2
              id="about-heading"
              className="font-display text-3xl sm:text-5xl font-semibold tracking-editorial leading-[1.07] text-ink"
            >
              Where <span className="font-sans italic font-normal">melody</span> meets
              quiet reflection.
            </h2>

            <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
              Most music spaces begin with a search bar, a genre label, or a crowded wall
              of albums. HIMUNI begins earlier than that—with the quiet pause where you
              notice how a moment actually feels.
            </p>

            <p className="text-base text-ink-muted leading-relaxed">
              Coined from two Filipino expressions—<em className="italic text-ink">Himig</em>,
              the gentle contour of a melody, and <em className="italic text-ink">Muni-muni</em>,
              the unhurried act of sitting with your thoughts—HIMUNI is an expressive space
              for exploring sound through emotion, energy, and personal atmosphere.
            </p>

            <blockquote className="my-8 border-l-2 border-ink pl-5 py-1">
              <p className="font-display text-xl sm:text-2xl font-medium tracking-editorial text-ink leading-snug">
                &ldquo;{BRAND.statement}&rdquo;
              </p>
            </blockquote>
          </div>

          {/* Right Column: Etymology Cards & Baybayin Script Study */}
          <div className="lg:col-span-5 space-y-6">
            {/* Two Filipino root words */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {BRAND.roots.map((root, idx) => (
                <div
                  key={root.word}
                  className="border border-ink/15 bg-cream-soft p-6 space-y-2"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-2xl font-semibold text-ink">
                      {root.word}
                    </h3>
                    <span className="text-xs text-ink-subtle uppercase tracking-wideLabel">
                      0{idx + 1} &middot; {root.origin}
                    </span>
                  </div>
                  <p className="text-xs italic text-ink-muted">/{root.pronunciation}/</p>
                  <p className="text-sm text-ink-soft leading-relaxed pt-1">
                    {root.meaning}
                  </p>
                </div>
              ))}
            </div>

            {/* Baybayin Companion Inscription Study */}
            <div className="border border-ink/20 bg-cream-deep/45 p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wideLabel text-ink">
                  Baybayin Companion Mark
                </span>
                <BaybayinMark className="text-xl text-ink" />
              </div>

              <p className="text-sm text-ink-muted leading-relaxed">
                Alongside the primary Latin wordmark, HIMUNI carries its inscription in
                Baybayin—honoring the pre-colonial Filipino syllabic script as an enduring
                part of the brand&rsquo;s cultural voice.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {BRAND.syllables.map((item) => (
                  <div
                    key={item.syllable}
                    className="border border-ink/15 bg-cream p-3 text-center"
                  >
                    <div
                      lang="tl-Tglg"
                      aria-label={`Baybayin syllable ${item.syllable}`}
                      className="font-baybayin text-2xl text-ink"
                    >
                      {item.script}
                    </div>
                    <div className="mt-1 font-display text-xs font-semibold uppercase tracking-wideLabel text-ink">
                      {item.syllable}
                    </div>
                    <div className="text-[11px] text-ink-muted">{item.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Light & Dark Brand Mark Specimen */}
        <div className="mt-16 pt-12 border-t border-ink/15">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wideLabel text-ink-muted">
              Visual Identity &middot; Light &amp; Dark Treatments
            </h3>
            <p className="text-xs text-ink-muted">
              Abstract resonance mark with Latin &amp; Baybayin lockup
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border border-ink/20">
            <div className="bg-cream p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b md:border-b-0 md:border-r border-ink/20">
              <HimuniLogo
                theme="light"
                size="lg"
                layout="stacked-wordmark"
                accentColor={accentColor}
              />
              <span className="text-xs uppercase tracking-wideLabel text-ink-muted">
                Warm Cream Ground
              </span>
            </div>

            <div className="bg-ink p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <HimuniLogo
                theme="dark"
                size="lg"
                layout="stacked-wordmark"
                accentColor={accentColor}
              />
              <span className="text-xs uppercase tracking-wideLabel text-cream/60">
                Deep Ink Ground
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
