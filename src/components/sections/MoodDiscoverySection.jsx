import React from 'react';
import { RefreshCw, SlidersHorizontal } from 'lucide-react';
import { useMood } from '../../hooks/useMood';
import { useMoodRecommendations } from '../../hooks/useMoodRecommendations';
import { EditorialReveal } from '../common/EditorialReveal';
import { TrackRow } from '../discovery/TrackRow';
import {
  DiscoveryEmptyState,
  DiscoveryErrorState,
  TrackListSkeleton,
} from '../discovery/DiscoveryStateView';
import { AudiusAttributionNotice } from '../discovery/AudiusAttributionNotice';
import { scrollToSection } from '../../utils/navigation';

export function MoodDiscoverySection({ renderTrackRowProps = null }) {
  const { selectedMood, selectedMoodId, energy } = useMood();
  const {
    plan,
    recommendedTracks,
    additionalTracks,
    loading,
    error,
    refreshRecommendations,
    retryRecommendations,
  } = useMoodRecommendations(selectedMoodId, energy);

  return (
    <section
      id="mood-recommendations"
      aria-labelledby="mood-recommendations-heading"
      className="scroll-mt-20 border-b border-ink/15 py-20 sm:py-28 bg-cream"
    >
      <div className="mx-auto max-w-editorial px-5 sm:px-8 lg:px-12">
        {/* Editorial Header tied visually to Selected Mood & Energy */}
        <EditorialReveal className="border-b border-ink/15 pb-10">
          <div
            aria-hidden="true"
            className="h-1.5 w-24 mb-6 transition-colors duration-300"
            style={{ backgroundColor: selectedMood.accent }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex flex-wrap items-center gap-2.5 text-xs uppercase tracking-wideLabel text-ink-muted">
                <span className="font-semibold text-ink">Curated Mood Discovery</span>
                <span aria-hidden="true">&middot;</span>
                <span>
                  {energy}% ({plan.energyBand.label})
                </span>
              </div>

              <h2
                id="mood-recommendations-heading"
                className="font-display text-3xl sm:text-5xl font-semibold tracking-editorial leading-[1.06] text-ink"
              >
                Sounds for{' '}
                {/^[aeiou]/i.test(selectedMood.name) ? 'an' : 'a'}{' '}
                <span
                  className="font-sans italic font-normal underline decoration-2 underline-offset-4"
                  style={{ textDecorationColor: selectedMood.accent }}
                >
                  {selectedMood.name.toLowerCase()}
                </span>{' '}
                moment.
              </h2>

              <p className="text-base sm:text-lg text-ink-soft leading-relaxed max-w-2xl pt-1">
                {selectedMood.description} {plan.refinementSummary}
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={refreshRecommendations}
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-ink text-cream px-5 py-3 text-xs uppercase tracking-wideLabel font-semibold hover:bg-ink-soft disabled:opacity-55 transition-colors"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
                    aria-hidden="true"
                  />
                  <span>Refresh recommendations</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('energy-personalization')}
                  className="inline-flex items-center gap-2 border border-ink/25 bg-cream-soft px-4 py-3 text-xs uppercase tracking-wideLabel font-semibold text-ink hover:border-ink transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Tune energy ({energy}%)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Curated Musical Directions Strip */}
          <div className="mt-7 flex flex-wrap items-center gap-2">
            <span className="text-xs text-ink-muted mr-1">Curated directions:</span>
            {plan.directions.map((dir) => (
              <span
                key={dir}
                style={{ backgroundColor: selectedMood.surface }}
                className="border border-ink/20 px-3 py-1 text-xs font-medium text-ink transition-colors duration-300"
              >
                {dir}
              </span>
            ))}
          </div>
        </EditorialReveal>

        {/* Asymmetric 12-column Discovery Layout */}
        <div className="mt-12">
          {error ? (
            <DiscoveryErrorState
              error={error}
              onRetry={retryRecommendations}
              title={`Unable to load ${selectedMood.name} discoveries`}
            />
          ) : loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7">
                <TrackListSkeleton count={6} />
              </div>
              <div className="lg:col-span-5">
                <TrackListSkeleton count={4} />
              </div>
            </div>
          ) : recommendedTracks.length === 0 ? (
            <DiscoveryEmptyState
              heading={`No ${selectedMood.name.toLowerCase()} tracks returned right now`}
              description="Try refreshing recommendations or adjusting your personal energy level to explore nearby sounds."
              actionLabel="Refresh recommendations"
              onAction={refreshRecommendations}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Primary Recommended Tracks Column */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-baseline justify-between gap-2 pb-2">
                  <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-editorial text-ink">
                    Recommended Tracks
                  </h3>
                  <span className="text-xs text-ink-muted">
                    {recommendedTracks.length} selections &middot; {selectedMood.name}
                  </span>
                </div>

                <div className="divide-y divide-ink/15 border-y border-ink/15">
                  {recommendedTracks.map((track, idx) => {
                    const extraProps = renderTrackRowProps
                      ? renderTrackRowProps(track)
                      : {};
                    return (
                      <TrackRow
                        key={track.id}
                        track={track}
                        index={idx}
                        accentColor={selectedMood.accent}
                        {...extraProps}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Secondary Asymmetric Column: Additional Discoveries */}
              <aside
                aria-label="Additional discoveries"
                className="lg:col-span-5 border border-ink/20 p-6 sm:p-7 transition-colors duration-500"
                style={{ backgroundColor: `${selectedMood.surface}75` }}
              >
                <div className="pb-4 border-b border-ink/15 space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wideLabel text-ink-muted">
                    Adjacent Textures
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-editorial text-ink">
                    Additional Discoveries
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                    Companion selections exploring neighboring expressions within{' '}
                    {selectedMood.name.toLowerCase()} at {energy}% energy.
                  </p>
                </div>

                {additionalTracks.length > 0 ? (
                  <div className="mt-2 divide-y divide-ink/15">
                    {additionalTracks.map((track, idx) => {
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
                ) : (
                  <p className="py-6 text-sm text-ink-muted">
                    Refresh recommendations to surface additional companion selections.
                  </p>
                )}
              </aside>
            </div>
          )}

          <AudiusAttributionNotice className="mt-10" />
        </div>
      </div>
    </section>
  );
}
