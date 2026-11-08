import React, { useEffect, useState } from 'react';
import { ExternalLink, Loader2, Music, Search, X } from 'lucide-react';
import { searchTracks, getTrendingTracks } from '../../services/audius/audiusApi';
import { TrackArtwork } from '../discovery/TrackArtwork';
import { formatTrackDuration } from '../../services/audius/audiusNormalizer';

export function PostcardTrackPickerModal({
  isOpen,
  onClose,
  onSelectTrack,
  currentMoodId = 'dreamy',
}) {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load initial suggestions based on trending / current mood
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    async function loadInitial() {
      setLoading(true);
      setError(null);
      try {
        const res = await searchTracks({ query: currentMoodId || 'ambient', limit: 8 });
        if (!cancelled) {
          setTracks(res.tracks || []);
        }
      } catch {
        try {
          const trending = await getTrendingTracks({ limit: 8 });
          if (!cancelled) setTracks(trending.tracks || []);
        } catch (err) {
          if (!cancelled) setError(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadInitial();
    return () => {
      cancelled = true;
    };
  }, [isOpen, currentMoodId]);

  // Handle debounced search
  useEffect(() => {
    if (!isOpen || !query.trim()) return;
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await searchTracks({
          query: query.trim(),
          limit: 12,
          signal: controller.signal,
        });
        setTracks(res.tracks || []);
      } catch (err) {
        if (err?.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="track-picker-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-cream border border-ink p-6 sm:p-7 space-y-5 shadow-2xl max-h-[88vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-ink/15 pb-3 shrink-0">
          <div className="space-y-0.5">
            <span className="text-[11px] uppercase tracking-wideLabel text-ink-muted">
              Select Featured Sound
            </span>
            <h3 id="track-picker-title" className="font-display text-xl font-semibold text-ink">
              Choose an Audius Track
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close track picker"
            className="inline-flex h-8 w-8 items-center justify-center border border-ink/20 hover:border-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search input */}
        <div className="relative shrink-0">
          <label htmlFor="postcard-track-search" className="sr-only">
            Search tracks or artists
          </label>
          <div className="flex items-center border border-ink/30 bg-cream-soft px-3 py-2.5">
            <Search className="w-4 h-4 text-ink-muted mr-2.5 shrink-0" aria-hidden="true" />
            <input
              id="postcard-track-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by track title, artist name, or genre..."
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
            />
            {loading && <Loader2 className="w-4 h-4 animate-spin text-ink ml-2" />}
          </div>
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto divide-y divide-ink/10 border-y border-ink/10 pr-1">
          {error ? (
            <p className="py-8 text-center text-xs text-red-700">
              Unable to load tracks from Audius. Please try another search.
            </p>
          ) : tracks.length === 0 && !loading ? (
            <p className="py-8 text-center text-xs text-ink-muted">
              No tracks found matching &ldquo;{query}&rdquo;.
            </p>
          ) : (
            tracks.map((t) => (
              <div
                key={t.id}
                className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-cream-soft/80 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <TrackArtwork
                    artworkUrl={t.artworkUrl}
                    artworkFallbacks={t.artworkFallbacks}
                    title={t.title}
                    sizeClass="w-12 h-12"
                  />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="font-display font-semibold text-sm text-ink truncate">
                      {t.title}
                    </p>
                    <p className="text-xs text-ink-muted truncate">
                      {t.artistName} &middot;{' '}
                      {formatTrackDuration(t.duration) || 'via Audius'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {t.trackUrl && (
                    <a
                      href={t.trackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View track on Audius"
                      className="p-1.5 text-ink-subtle hover:text-ink transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onSelectTrack(t);
                      onClose();
                    }}
                    className="inline-flex min-h-[36px] items-center gap-1 bg-ink text-cream px-3 py-1.5 text-xs font-semibold uppercase tracking-wideLabel hover:bg-ink-soft transition-colors"
                  >
                    <span>Attach</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between pt-2 text-[11px] text-ink-muted shrink-0">
          <span>Tracks sourced directly via Audius REST API</span>
          <button
            type="button"
            onClick={onClose}
            className="underline font-medium hover:text-ink"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
