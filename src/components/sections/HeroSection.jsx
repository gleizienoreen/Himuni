import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, Compass } from 'lucide-react';
import { BaybayinMark } from '../branding/BaybayinMark';
import { scrollToSection } from '../../utils/navigation';

export function HeroSection({ activeMood = null, energy = null }) {
  const shouldReduceMotion = useReducedMotion();

  const accentColor = activeMood?.accent || '#8067E8';
  const surfaceTint = activeMood?.surface || '#EAE5FB';
  const secondaryTone = activeMood?.secondary || '#E8D98E';

  return (
    <section
      id="discover"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-ink/15 pt-10 pb-16 sm:pt-14 sm:pb-24 lg:pt-20 lg:pb-28"
    >
      <div className="mx-auto max-w-editorial px-5 sm:px-8 lg:px-12">
        {/* Top editorial index strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 sm:pb-12 border-b border-ink/10">
          <div className="inline-flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full transition-colors duration-300"
              style={{ backgroundColor: accentColor }}
            />
            <p className="text-xs font-semibold uppercase tracking-wideLabel text-ink">
              A SPACE FOR EVERY FEELING
            </p>
          </div>

          <p className="text-xs text-ink-muted">
            <span className="italic">Himig</span> (melody) &middot;{' '}
            <span className="italic">Muni-muni</span> (reflection)
          </p>
        </div>

        {/* Asymmetric 12-column editorial composition */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
          {/* Left Typographic Composition */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col justify-between"
          >
            <h1
              id="hero-heading"
              className="font-display text-[2.6rem] sm:text-6xl lg:text-[4.35rem] xl:text-[4.85rem] font-semibold tracking-editorial leading-[1.01] text-ink max-w-[14ch]"
            >
              What does your world{' '}
              <span className="font-sans italic font-normal">sound like</span>{' '}
              today?
            </h1>

            <div className="mt-8 sm:mt-12 lg:pl-12 xl:pl-20 max-w-xl space-y-8">
              <p className="text-lg sm:text-xl text-ink-soft leading-relaxed">
                Explore the sounds that match your moment.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => scrollToSection('mood-explorer')}
                  className="group inline-flex items-center gap-3 bg-ink text-cream px-6 py-4 text-sm sm:text-base font-medium tracking-wide hover:bg-ink-soft transition-colors"
                >
                  <span>Explore your mood</span>
                  <ArrowDownRight
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('mood-spectrum')}
                  className="inline-flex items-center gap-2.5 border border-ink/25 bg-cream-soft px-5 py-4 text-sm sm:text-base font-medium text-ink hover:border-ink transition-colors"
                >
                  <Compass className="w-4 h-4 text-ink-muted" aria-hidden="true" />
                  <span>Open Mood Spectrum</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed border-l-2 border-ink/20 pl-4">
                Not every feeling needs words. Sometimes, it just needs a sound.
              </p>
            </div>
          </motion.div>

          {/* Right Asymmetric Sculptural Resonance Composition */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
            className="lg:col-span-5 lg:mt-2"
          >
            <div className="relative border border-ink/20 bg-cream-soft p-5 sm:p-7">
              {/* Top caption inside art plate */}
              <div className="flex items-center justify-between text-xs text-ink-muted pb-4 border-b border-ink/10">
                <span className="uppercase tracking-wideLabel font-medium text-ink">
                  Resonance Study I
                </span>
                <BaybayinMark className="text-sm text-ink-muted" />
              </div>

              {/* Abstract geometric collage reactive to selected mood */}
              <div
                className="relative mt-5 aspect-[4/3] sm:aspect-[5/4] w-full overflow-hidden border border-ink/15 transition-colors duration-500"
                style={{ backgroundColor: surfaceTint }}
              >
                <svg
                  viewBox="0 0 420 336"
                  fill="none"
                  aria-hidden="true"
                  className="w-full h-full"
                >
                  {/* Warm cream architectural cutout arch */}
                  <path
                    d="M36 336V154C36 86.6213 90.6213 32 158 32C225.379 32 280 86.6213 280 154V336H36Z"
                    fill="#F5F1EA"
                    stroke="#24232B"
                    strokeWidth="1.5"
                  />

                  {/* Offset chromatic mood circle */}
                  <circle
                    cx="256"
                    cy="142"
                    r="86"
                    fill={accentColor}
                    opacity="0.88"
                    style={{ transition: 'fill 420ms ease' }}
                  />

                  {/* Secondary warm harmonic crescent */}
                  <path
                    d="M256 56C303.496 56 342 94.5035 342 142H170C170 94.5035 208.504 56 256 56Z"
                    fill={secondaryTone}
                    opacity="0.9"
                    style={{ transition: 'fill 420ms ease' }}
                  />

                  {/* Sky blue reflection slice */}
                  <path
                    d="M92 214H236C236 253.765 203.765 286 164 286C124.235 286 92 253.765 92 214Z"
                    fill="#BBD5DF"
                    stroke="#24232B"
                    strokeWidth="1.5"
                  />

                  {/* Editorial horizon & resonance arcs */}
                  <line
                    x1="20"
                    y1="214"
                    x2="400"
                    y2="214"
                    stroke="#24232B"
                    strokeWidth="1.75"
                  />
                  <path
                    d="M114 214C114 186.386 136.386 164 164 164C191.614 164 214 186.386 214 214"
                    stroke="#24232B"
                    strokeWidth="1.6"
                  />
                  <circle cx="164" cy="214" r="7" fill="#24232B" />
                  <circle cx="348" cy="268" r="18" fill="#F18B63" />
                </svg>
              </div>

              {/* Bottom live mood status caption */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-ink/10 text-xs">
                {activeMood ? (
                  <>
                    <div className="flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className="h-2.5 w-2.5 rounded-full border border-ink/30"
                        style={{ backgroundColor: activeMood.accent }}
                      />
                      <span className="text-ink-muted">Attuned to</span>
                      <span className="font-display font-semibold text-sm text-ink">
                        {activeMood.name}
                      </span>
                    </div>
                    <span className="text-ink-muted italic">
                      {energy !== null ? `${energy}% personal energy` : activeMood.description}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-display font-medium text-ink">
                      Every feeling has a sound.
                    </span>
                    <span className="text-ink-muted">Eight emotional territories</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
