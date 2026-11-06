import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { SOUNDSCAPES } from '../../data/soundscapes';
import { SoundscapeArtwork } from '../common/SoundscapeArtwork';
import { EditorialReveal } from '../common/EditorialReveal';
import { scrollToSection } from '../../utils/navigation';

export function SoundscapesSection({ activeMoodId = null, onAttuneSoundscape = null }) {
  return (
    <section
      id="soundscapes"
      aria-labelledby="soundscapes-heading"
      className="border-b border-ink/15 py-20 sm:py-28 bg-cream-soft/60"
    >
      <div className="mx-auto max-w-editorial px-5 sm:px-8 lg:px-12">
        {/* Editorial Header */}
        <EditorialReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-ink/15 items-end">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wideLabel text-ink-muted">
              <Sparkles className="w-3.5 h-3.5 text-ink" aria-hidden="true" />
              <span>Future Concept Preview</span>
            </div>
            <h2
              id="soundscapes-heading"
              className="font-display text-3xl sm:text-5xl font-semibold tracking-editorial leading-[1.06] text-ink"
            >
              Soundscapes for unwritten moments.
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pl-6">
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
              In upcoming phases of HIMUNI, Soundscapes will gather textures, pacing, and
              tonal moods around lived moments rather than rigid genres. Explore the initial
              conceptual editions below.
            </p>
          </div>
        </EditorialReveal>

        {/* Asymmetric Editorial Exhibition Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-7">
          {SOUNDSCAPES.map((item) => {
            const isResonant = activeMoodId ? item.moodIds.includes(activeMoodId) : false;

            return (
              <article
                key={item.id}
                className={`${item.span} group flex flex-col justify-between border transition-colors duration-300 bg-cream ${
                  isResonant ? 'border-ink ring-1 ring-ink' : 'border-ink/15 hover:border-ink/45'
                }`}
              >
                <div>
                  {/* Bespoke geometric cover plate */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-ink/15">
                    <SoundscapeArtwork
                      id={item.id}
                      className="transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="bg-cream/95 border border-ink/20 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wideLabel text-ink">
                        Edition {item.index}
                      </span>
                      {isResonant && (
                        <span className="bg-ink text-cream px-2.5 py-1 text-[11px] font-medium tracking-wide">
                          Matches your mood
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Editorial copy */}
                  <div className="p-6 sm:p-7 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="inline-flex items-center gap-2 font-medium text-ink-muted">
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 rounded-full border border-ink/25"
                          style={{ backgroundColor: item.palette.primary }}
                        />
                        <span>{item.moodLabel}</span>
                      </span>
                      <span className="uppercase tracking-wideLabel text-[11px] text-ink-subtle">
                        Concept Preview
                      </span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-editorial text-ink leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-sm sm:text-[15px] text-ink-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {onAttuneSoundscape && (
                  <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-2 flex items-center justify-between border-t border-ink/10 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onAttuneSoundscape(item);
                        scrollToSection('mood-spectrum');
                      }}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wideLabel text-ink hover:text-violet-deep transition-colors py-1"
                    >
                      <span>Explore this feeling on Spectrum</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
