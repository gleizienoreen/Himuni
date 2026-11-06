import React from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Compass, Loader2 } from 'lucide-react';
import { getMoodById } from '../data/moods';
import { getSoundscapeById, SOUNDSCAPES } from '../data/soundscapes';
import { useMood } from '../hooks/useMood';
import { useSoundscapeCollection } from '../hooks/useSoundscapeCollection';
import { MainLayout } from '../layouts/MainLayout';
import { SoundscapeArtwork } from '../components/common/SoundscapeArtwork';
import { TrackRow } from '../components/discovery/TrackRow';
import {
  DiscoveryEmptyState,
  DiscoveryErrorState,
  TrackListSkeleton,
} from '../components/discovery/DiscoveryStateView';
import { AudiusAttributionNotice } from '../components/discovery/AudiusAttributionNotice';
import { scrollToSection } from '../utils/navigation';

export function SoundscapePage({
  renderTrackRowProps = null,
  headerAudioControl = null,
}) {
  const { soundscapeId } = useParams();
  const navigate = useNavigate();
  const { selectedMood, selectMood, attuneToSoundscape } = useMood();

  const soundscape = getSoundscapeById(soundscapeId);

  const {
    tracks,
    trackCount,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    retry,
  } = useSoundscapeCollection(soundscape);

  if (!soundscape) {
    return <Navigate to="/" replace />;
  }

  const associatedMoods = soundscape.moodIds.map((id) => getMoodById(id));

  return (
    <MainLayout
      activeMood={selectedMood}
      headerAudioControl={headerAudioControl}
    >
      <article className="py-12 sm:py-16 lg:py-20 bg-cream">
        <div className="mx-auto max-w-editorial px-5 sm:px-8 lg:px-12">
          {/* Functional Navigation Back to Discover */}
          <div className="pb-8 border-b border-ink/15 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 border border-ink/25 bg-cream-soft px-4 py-2 text-xs font-semibold uppercase tracking-wideLabel text-ink hover:border-ink transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Back to Discover</span>
            </Link>

            <span className="text-xs uppercase tracking-wideLabel text-ink-muted">
              Soundscape Edition {soundscape.index}
            </span>
          </div>

          {/* Editorial Soundscape Hero Header */}
          <header className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pb-12 border-b border-ink/15">
            <div className="lg:col-span-6 border border-ink/25 overflow-hidden aspect-[16/9]">
              <SoundscapeArtwork id={soundscape.id} />
            </div>

            <div className="lg:col-span-6 space-y-5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="bg-ink text-cream px-3 py-1 font-semibold uppercase tracking-wideLabel">
                  HIMUNI Soundscape
                </span>
                <span className="border border-ink/20 bg-cream-soft px-3 py-1 font-medium text-ink">
                  {loading
                    ? 'Loading Audius tracks...'
                    : `${trackCount} ${
                        trackCount === 1 ? 'track' : 'tracks'
                      } from Audius`}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-editorial leading-[1.05] text-ink">
                {soundscape.title}
              </h1>

              <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
                {soundscape.description}
              </p>

              <p className="text-xs sm:text-sm text-ink-muted">
                Curated sound direction:{' '}
                <strong className="font-medium text-ink">
                  {soundscape.soundFocus}
                </strong>
              </p>

              {/* Associated Moods & Spectrum Sync */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <span className="text-xs text-ink-muted">Associated moods:</span>
                {associatedMoods.map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => selectMood(mood.id)}
                    className="inline-flex items-center gap-1.5 border border-ink/25 bg-cream-soft px-3 py-1.5 text-xs font-medium text-ink hover:border-ink transition-colors"
                  >
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: mood.accent }}
                    />
                    <span>{mood.name}</span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    attuneToSoundscape(soundscape);
                    navigate('/');
                    setTimeout(() => scrollToSection('mood-spectrum'), 90);
                  }}
                  className="inline-flex items-center gap-1.5 border border-ink/25 bg-cream px-3 py-1.5 text-xs font-medium text-ink hover:border-ink transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>View on Spectrum</span>
                </button>
              </div>
            </div>
          </header>

          {/* Real Audius Track Results */}
          <section
            aria-labelledby="soundscape-tracks-heading"
            className="mt-12 space-y-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2
                id="soundscape-tracks-heading"
                className="font-display text-2xl sm:text-3xl font-semibold tracking-editorial text-ink"
              >
                Curated Track Selections
              </h2>
              {!loading && !error && (
                <span className="text-xs text-ink-muted">
                  {trackCount} {trackCount === 1 ? 'result' : 'results'} returned from Audius
                </span>
              )}
            </div>

            {loading ? (
              <TrackListSkeleton count={6} />
            ) : error && tracks.length === 0 ? (
              <DiscoveryErrorState
                error={error}
                onRetry={retry}
                title={`Could not load tracks for "${soundscape.title}"`}
              />
            ) : tracks.length === 0 ? (
              <DiscoveryEmptyState
                heading="This Soundscape has no available tracks right now"
                description="Audius returned no matching tracks for this collection at the moment. Try refreshing or return to Discover to explore other moods."
                actionLabel="Retry Soundscape"
                onAction={retry}
              />
            ) : (
              <>
                <div className="divide-y divide-ink/15 border-y border-ink/15">
                  {tracks.map((track, idx) => {
                    const extraProps = renderTrackRowProps
                      ? renderTrackRowProps(track)
                      : {};
                    return (
                      <TrackRow
                        key={track.id}
                        track={track}
                        index={idx}
                        accentColor={soundscape.palette.primary}
                        {...extraProps}
                      />
                    );
                  })}
                </div>

                {error && (
                  <DiscoveryErrorState
                    error={error}
                    onRetry={loadMore}
                    title="Could not load more Soundscape tracks"
                  />
                )}

                {hasMore && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="inline-flex items-center gap-2 border border-ink bg-cream px-6 py-3 text-xs uppercase tracking-wideLabel font-semibold text-ink hover:bg-ink hover:text-cream disabled:opacity-55 transition-colors"
                    >
                      {loadingMore && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                      )}
                      <span>
                        {loadingMore ? 'Loading more...' : 'Load more into Soundscape'}
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}

            <AudiusAttributionNotice className="mt-8" />
          </section>

          {/* Other HIMUNI Soundscapes Switcher */}
          <nav
            aria-label="Other HIMUNI Soundscapes"
            className="mt-16 pt-12 border-t border-ink/15 space-y-5"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wideLabel text-ink-muted">
              Explore Other Soundscapes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SOUNDSCAPES.filter((item) => item.id !== soundscape.id).map((other) => (
                <Link
                  key={other.id}
                  to={`/soundscapes/${other.id}`}
                  className="border border-ink/15 bg-cream-soft p-4 hover:border-ink transition-colors flex flex-col justify-between gap-2"
                >
                  <span className="text-[11px] uppercase tracking-wideLabel text-ink-subtle">
                    Edition {other.index} &middot; {other.moodLabel}
                  </span>
                  <span className="font-display text-base font-semibold text-ink">
                    {other.title}
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </article>
    </MainLayout>
  );
}
