import React from 'react';
import { ArrowLeft, Loader2, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMood } from '../../hooks/useMood';
import { MOOD_RECOMMENDATIONS } from '../../data/moodRecommendations';
import { useTrackSearch } from '../../hooks/useTrackSearch';
import { EditorialReveal } from '../common/EditorialReveal';
import { TrackRow } from '../discovery/TrackRow';
import {
  DiscoveryEmptyState,
  DiscoveryErrorState,
  TrackListSkeleton,
} from '../discovery/DiscoveryStateView';
import { AudiusAttributionNotice } from '../discovery/AudiusAttributionNotice';

export function TrackSearchSection({
  standalonePage = false,
  renderTrackRowProps = null,
}) {
  const { selectedMood, selectedMoodId } = useMood();
  const {
    query,
    setQuery,
    debouncedQuery,
    isTyping,
    results,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    clearSearch,
    retrySearch,
    applySuggestedTerm,
  } = useTrackSearch('');

  const moodConfig =
    MOOD_RECOMMENDATIONS[selectedMoodId] || MOOD_RECOMMENDATIONS.dreamy;
  const suggestedPrompts = moodConfig.directions;

  return (
    <section
      id="search"
      aria-labelledby="track-search-heading"
      className={`scroll-mt-20 border-b border-ink/15 py-20 sm:py-28 ${
        standalonePage ? 'bg-cream min-h-[72vh]' : 'bg-cream-deep/25'
      }`}
    >
      <div className="mx-auto max-w-editorial px-5 sm:px-8 lg:px-12">
        {standalonePage && (
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wideLabel text-ink-muted hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Back to Discover</span>
            </Link>
          </div>
        )}

        <EditorialReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-ink/15 items-end">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wideLabel text-ink-muted">
              Open Search &middot; Audius Catalog
            </p>
            <h2
              id="track-search-heading"
              className="font-display text-3xl sm:text-5xl font-semibold tracking-editorial leading-[1.06] text-ink"
            >
              Follow a title, an artist, or a{' '}
              <span className="font-sans italic font-normal">passing thought</span>.
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pl-6">
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
              Search directly across independent artists and sounds on Audius, or tap one of
              your {selectedMood.name.toLowerCase()} textures below to begin.
            </p>
          </div>
        </EditorialReveal>

        {/* Architectural Search Input Bar */}
        <div className="mt-10 max-w-3xl space-y-4">
          <form
            role="search"
            aria-label="Search tracks and artists on Audius"
            onSubmit={(e) => e.preventDefault()}
            className="relative flex items-center border-2 border-ink bg-cream-soft focus-within:bg-cream transition-colors"
          >
            <label htmlFor="himuni-track-search-input" className="sr-only">
              Search by track title, artist name, or keyword
            </label>
            <span className="pl-4 sm:pl-5 text-ink-muted shrink-0" aria-hidden="true">
              {loading || isTyping ? (
                <Loader2 className="w-5 h-5 animate-spin text-ink" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </span>

            <input
              id="himuni-track-search-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search track title, artist name, or texture (e.g. ambient piano, synthwave)..."
              autoComplete="off"
              className="w-full bg-transparent px-3.5 sm:px-4 py-4 sm:py-5 text-base sm:text-lg text-ink placeholder:text-ink-subtle focus:outline-none"
            />

            {query.length > 0 && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search query"
                className="mr-3 inline-flex min-h-[40px] items-center gap-1.5 border border-ink/25 bg-cream px-3 py-1.5 text-xs font-semibold uppercase tracking-wideLabel text-ink hover:border-ink transition-colors"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear</span>
              </button>
            )}
          </form>

          {/* Suggested Prompts linked to current mood */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-ink-muted mr-1">
              Inspired by {selectedMood.name}:
            </span>
            {suggestedPrompts.map((term) => {
              const isActiveTerm =
                query.trim().toLowerCase() === term.toLowerCase();
              return (
                <button
                  key={term}
                  type="button"
                  onClick={() => applySuggestedTerm(term)}
                  className={`inline-flex min-h-[38px] items-center px-3.5 py-2 border transition-colors ${
                    isActiveTerm
                      ? 'bg-ink text-cream border-ink font-semibold'
                      : 'bg-cream text-ink border-ink/20 hover:border-ink'
                  }`}
                >
                  {term}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Results Region */}
        <div className="mt-10" aria-live="polite">
          {!debouncedQuery && !isTyping ? (
            <div className="border border-ink/15 bg-cream-soft/75 p-6 sm:p-8 max-w-3xl">
              <p className="text-sm text-ink-muted leading-relaxed">
                Enter a track title, artist name, or musical mood above to explore live
                results from Audius. Requests are automatically debounced while you type.
              </p>
            </div>
          ) : loading ? (
            <TrackListSkeleton count={5} />
          ) : error && results.length === 0 ? (
            <DiscoveryErrorState
              error={error}
              onRetry={retrySearch}
              title={`Search could not complete for "${debouncedQuery}"`}
            />
          ) : results.length === 0 && !isTyping ? (
            <DiscoveryEmptyState
              heading={`No results found for "${debouncedQuery}"`}
              description="Check the spelling or try a broader artist name, instrument, or mood keyword."
              actionLabel="Clear search"
              onAction={clearSearch}
            />
          ) : results.length > 0 ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink/15 pb-3">
                <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-editorial text-ink">
                  Results for &ldquo;{debouncedQuery}&rdquo;
                </h3>
                <span className="text-xs text-ink-muted">
                  Showing {results.length} {results.length === 1 ? 'track' : 'tracks'}
                </span>
              </div>

              <div className="divide-y divide-ink/15 border-b border-ink/15">
                {results.map((track, idx) => {
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

              {error && (
                <DiscoveryErrorState
                  error={error}
                  onRetry={loadMore}
                  title="Could not load additional search results"
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
                    <span>{loadingMore ? 'Loading more...' : 'Load more results'}</span>
                  </button>
                </div>
              )}

              <AudiusAttributionNotice className="mt-6" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
