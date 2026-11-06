import React from 'react';
import { ArrowRight, ExternalLink, Lock } from 'lucide-react';
import { useMood } from '../../hooks/useMood';
import { useFeaturedDiscoveries } from '../../hooks/useFeaturedDiscoveries';
import { formatTrackDuration } from '../../services/audius/audiusNormalizer';
import { EditorialReveal } from '../common/EditorialReveal';
import { TrackArtwork } from '../discovery/TrackArtwork';
import { TrackRow } from '../discovery/TrackRow';
import {
  DiscoveryErrorState,
  TrackListSkeleton,
} from '../discovery/DiscoveryStateView';
import { AudiusAttributionNotice } from '../discovery/AudiusAttributionNotice';
import { scrollToSection } from '../../utils/navigation';

export function FeaturedDiscoveriesSection({ renderTrackRowProps = null }) {
  const { selectedMood, selectedMoodId, selectMood } = useMood();
  const {
    contrastingMood,
    spotlightTrack,
    networkPicks,
    contrastingTracks,
    loading,
    error,
    retry,
  } = useFeaturedDiscoveries(selectedMoodId);

  const spotlightExtra =
    spotlightTrack && renderTrackRowProps
      ? renderTrackRowProps(spotlightTrack)
      : {};

  return (
    <section
      id="featured-discoveries"
      aria-labelledby="featured-discoveries-heading"
      className="scroll-mt-20 border-b border-ink/15 py-20 sm:py-28 bg-cream"
    >
      <div className="mx-auto max-w-editorial px-5 sm:px-8 lg:px-12">
        <EditorialReveal className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12 border-b border-ink/15 items-end">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wideLabel text-ink-muted">
              Featured Discoveries &middot; Audius Network
            </p>
            <h2
              id="featured-discoveries-heading"
              className="font-display text-3xl sm:text-5xl font-semibold tracking-editorial leading-[1.06] text-ink"
            >
              A wider horizon of{' '}
              <span className="font-sans italic font-normal">independent</span> sound.
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pl-6">
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
              Selected highlights from Audius&rsquo;s weekly trending feed paired with sounds
              outside your current {selectedMood.name.toLowerCase()} mood.
            </p>
          </div>
        </EditorialReveal>

        <div className="mt-12">
          {error ? (
            <DiscoveryErrorState
              error={error}
              onRetry={retry}
              title="Unable to load featured discoveries"
            />
          ) : loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-6">
                <TrackListSkeleton count={4} />
              </div>
              <div className="lg:col-span-6">
                <TrackListSkeleton count={4} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left Column: Spotlight Feature + Audius Weekly Trending Finds */}
              <div className="lg:col-span-6 space-y-8">
                {spotlightTrack && (
                  <article className="border border-ink bg-cream-soft p-6 sm:p-7 space-y-5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="bg-ink text-cream px-2.5 py-1 font-semibold uppercase tracking-wideLabel">
                        A discovery worth hearing
                      </span>
                      <span className="text-ink-muted">
                        Trending this week on Audius
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                      <TrackArtwork
                        artworkUrl={spotlightTrack.artworkUrl}
                        artworkFallbacks={spotlightTrack.artworkFallbacks}
                        title={spotlightTrack.title}
                        accentColor={selectedMood.accent}
                        sizeClass="w-28 h-28 sm:w-32 sm:h-32"
                      />

                      <div className="min-w-0 flex-1 space-y-2">
                        {spotlightTrack.trackUrl ? (
                          <a
                            href={spotlightTrack.trackUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-display text-2xl font-semibold tracking-editorial text-ink hover:underline block leading-snug"
                          >
                            {spotlightTrack.title}
                          </a>
                        ) : (
                          <h3 className="font-display text-2xl font-semibold tracking-editorial text-ink leading-snug">
                            {spotlightTrack.title}
                          </h3>
                        )}

                        <p className="text-sm text-ink-muted">
                          by{' '}
                          {spotlightTrack.artistUrl ? (
                            <a
                              href={spotlightTrack.artistUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-ink hover:underline"
                            >
                              {spotlightTrack.artistName}
                            </a>
                          ) : (
                            <span className="font-medium text-ink">
                              {spotlightTrack.artistName}
                            </span>
                          )}{' '}
                          &middot; via Audius
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {spotlightTrack.genre && (
                            <span className="border border-ink/15 bg-cream px-2.5 py-0.5 text-xs text-ink-muted">
                              {spotlightTrack.genre}
                            </span>
                          )}
                          {spotlightTrack.mood && (
                            <span className="border border-ink/15 bg-cream px-2.5 py-0.5 text-xs text-ink-muted">
                              {spotlightTrack.mood}
                            </span>
                          )}
                          {spotlightTrack.duration > 0 && (
                            <span className="border border-ink/15 bg-cream px-2.5 py-0.5 text-xs tabular-nums text-ink-subtle">
                              {formatTrackDuration(spotlightTrack.duration)}
                            </span>
                          )}
                          {spotlightTrack.availabilityNote && (
                            <span className="inline-flex items-center gap-1 border border-ink/25 bg-cream-deep px-2 py-0.5 text-xs font-medium text-ink">
                              <Lock className="w-3 h-3" aria-hidden="true" />
                              <span>{spotlightTrack.availabilityNote}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-ink/15 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        {spotlightExtra.listenAction}
                      </div>

                      {spotlightTrack.trackUrl && (
                        <a
                          href={spotlightTrack.trackUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wideLabel text-ink hover:underline"
                        >
                          <span>View track on Audius</span>
                          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>

                    {spotlightExtra.inlinePlayerPanel}
                  </article>
                )}

                {networkPicks.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-display text-xl font-semibold tracking-editorial text-ink">
                        New sounds to explore
                      </h3>
                      <span className="text-xs text-ink-muted">
                        Audius trending selections
                      </span>
                    </div>
                    <div className="divide-y divide-ink/15 border-y border-ink/15">
                      {networkPicks.map((track, idx) => {
                        const extraProps = renderTrackRowProps
                          ? renderTrackRowProps(track)
                          : {};
                        return (
                          <TrackRow
                            key={track.id}
                            track={track}
                            index={idx}
                            accentColor={selectedMood.accent}
                            variant="compact"
                            {...extraProps}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Sounds Outside Your Usual Mood */}
              <div
                style={{ backgroundColor: `${contrastingMood.surface}80` }}
                className="lg:col-span-6 border border-ink/20 p-6 sm:p-8 space-y-6"
              >
                <div className="space-y-2 pb-5 border-b border-ink/15">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="uppercase tracking-wideLabel font-semibold text-ink-muted">
                      An unexpected find
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                      <span
                        aria-hidden="true"
                        className="h-2.5 w-2.5 rounded-full border border-ink/25"
                        style={{ backgroundColor: contrastingMood.accent }}
                      />
                      <span>{contrastingMood.name} territory</span>
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-editorial text-ink">
                    Sounds outside your usual mood.
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    You&rsquo;re currently attuned to{' '}
                    <strong className="font-medium text-ink">{selectedMood.name}</strong>.
                    Step across the spectrum into{' '}
                    <strong className="font-medium text-ink">
                      {contrastingMood.name.toLowerCase()}
                    </strong>{' '}
                    textures—{contrastingMood.description.toLowerCase()}
                  </p>
                </div>

                {contrastingTracks.length > 0 ? (
                  <div className="divide-y divide-ink/15 border-b border-ink/15">
                    {contrastingTracks.map((track, idx) => {
                      const extraProps = renderTrackRowProps
                        ? renderTrackRowProps(track)
                        : {};
                      return (
                        <TrackRow
                          key={track.id}
                          track={track}
                          index={idx}
                          accentColor={contrastingMood.accent}
                          variant="compact"
                          {...extraProps}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-ink-muted py-4">
                    Explore {contrastingMood.name} directly to uncover contrasting tracks.
                  </p>
                )}

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      selectMood(contrastingMood.id);
                      scrollToSection('mood-recommendations');
                    }}
                    className="inline-flex items-center gap-2 border border-ink bg-cream px-5 py-3 text-xs uppercase tracking-wideLabel font-semibold text-ink hover:bg-ink hover:text-cream transition-colors"
                  >
                    <span>Switch mood to {contrastingMood.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <AudiusAttributionNotice className="mt-10" />
        </div>
      </div>
    </section>
  );
}
