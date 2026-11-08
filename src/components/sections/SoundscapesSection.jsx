import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookmarkPlus, Compass, Disc3 } from 'lucide-react';
import { SOUNDSCAPES } from '../../data/soundscapes';
import { useSoundscapePreviews } from '../../hooks/useSoundscapeCollection';
import { SoundscapeArtwork } from '../common/SoundscapeArtwork';
import { EditorialReveal } from '../common/EditorialReveal';
import { scrollToSection } from '../../utils/navigation';
import { SaveToCollectionModal } from '../collections/SaveToCollectionModal';

export function SoundscapesSection({
  activeMoodId = null,
  onAttuneSoundscape = null,
}) {
  const sectionRef = useRef(null);
  const [shouldLoadPreviews, setShouldLoadPreviews] = useState(false);
  const [savingSoundscape, setSavingSoundscape] = useState(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoadPreviews(true);
      return undefined;
    }

    const el = sectionRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadPreviews(true);
          observer.disconnect();
        }
      },
      { rootMargin: '450px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const previewMap = useSoundscapePreviews(shouldLoadPreviews);

  return (
    <section
      ref={sectionRef}
      id="soundscapes"
      aria-labelledby="soundscapes-heading"
      className="scroll-mt-20 border-b border-ink/15 py-20 sm:py-28 bg-cream-soft/60"
    >
      <div className="mx-auto max-w-editorial px-5 sm:px-8 lg:px-12">
        {/* Editorial Header */}
        <EditorialReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-ink/15 items-end">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wideLabel text-ink-muted">
              <Disc3 className="w-3.5 h-3.5 text-ink" aria-hidden="true" />
              <span>Curated Soundscapes &middot; Live Audius Collections</span>
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
              Each Soundscape gathers real music from Audius around a lived atmosphere and
              emotional pacing. Open any edition to explore its full curated track list.
            </p>
          </div>
        </EditorialReveal>

        {/* Asymmetric Editorial Exhibition Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-7">
          {SOUNDSCAPES.map((item) => {
            const isResonant = activeMoodId ? item.moodIds.includes(activeMoodId) : false;
            const preview = previewMap[item.id];
            const leadTracks = preview?.tracks?.slice(0, 2) || [];

            return (
              <article
                key={item.id}
                className={`${item.span} group flex flex-col justify-between border transition-colors duration-300 bg-cream ${
                  isResonant
                    ? 'border-ink ring-1 ring-ink'
                    : 'border-ink/15 hover:border-ink/50'
                }`}
              >
                <div>
                  {/* Bespoke geometric cover plate */}
                  <Link
                    to={`/soundscapes/${item.id}`}
                    aria-label={`Open ${item.title} Soundscape`}
                    className="block relative aspect-[16/9] w-full overflow-hidden border-b border-ink/15"
                  >
                    <SoundscapeArtwork
                      id={item.id}
                      className="transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                      <span className="bg-cream/95 border border-ink/20 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wideLabel text-ink">
                        Edition {item.index}
                      </span>
                      {isResonant && (
                        <span className="bg-ink text-cream px-2.5 py-1 text-[11px] font-medium tracking-wide">
                          Matches your mood
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Editorial copy + live returned track count & sample credits */}
                  <div className="p-6 sm:p-7 space-y-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="inline-flex items-center gap-2 font-medium text-ink-muted">
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 rounded-full border border-ink/25"
                          style={{ backgroundColor: item.palette.primary }}
                        />
                        <span>{item.moodLabel}</span>
                      </span>

                      <span className="uppercase tracking-wideLabel text-[11px] font-semibold text-ink">
                        {preview
                          ? preview.error
                            ? 'Audius collection'
                            : `${preview.count} ${
                                preview.count === 1 ? 'track' : 'tracks'
                              } loaded`
                          : item.soundFocus}
                      </span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-editorial text-ink leading-snug">
                      <Link
                        to={`/soundscapes/${item.id}`}
                        className="hover:underline"
                      >
                        {item.title}
                      </Link>
                    </h3>

                    <p className="text-sm sm:text-[15px] text-ink-muted leading-relaxed">
                      {item.description}
                    </p>

                    <p className="text-xs text-ink-subtle">
                      Sonic focus: <span className="text-ink-muted">{item.soundFocus}</span>
                    </p>

                    {leadTracks.length > 0 && (
                      <div className="pt-2 border-t border-ink/10 space-y-1 text-xs text-ink-muted">
                        <span className="block text-[11px] uppercase tracking-wideLabel text-ink-subtle">
                          Featuring on Audius
                        </span>
                        <p className="truncate text-ink">
                          {leadTracks
                            .map((t) => `${t.title} (${t.artistName})`)
                            .join(' · ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 mt-2">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/soundscapes/${item.id}`}
                      className="inline-flex min-h-[40px] items-center gap-2 bg-ink text-cream px-4 py-2.5 text-xs font-semibold uppercase tracking-wideLabel hover:bg-ink-soft transition-colors"
                    >
                      <span>Open Soundscape</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setSavingSoundscape(item)}
                      aria-label={`Save "${item.title}" to collection`}
                      className="inline-flex min-h-[40px] items-center gap-1.5 border border-ink/25 bg-cream px-3 py-2 text-xs font-semibold uppercase tracking-wideLabel text-ink hover:border-ink transition-colors"
                      title="Save to Collection"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5 text-ink-muted" aria-hidden="true" />
                      <span className="sr-only sm:not-sr-only">Save</span>
                    </button>
                  </div>

                  {onAttuneSoundscape && (
                    <button
                      type="button"
                      onClick={() => {
                        onAttuneSoundscape(item);
                        scrollToSection('mood-spectrum');
                      }}
                      className="inline-flex min-h-[40px] items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink underline py-1 transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Attune Spectrum</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <SaveToCollectionModal
        isOpen={Boolean(savingSoundscape)}
        onClose={() => setSavingSoundscape(null)}
        soundscape={savingSoundscape}
      />
    </section>
  );
}
