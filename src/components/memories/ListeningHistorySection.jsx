import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ExternalLink,
  History,
  Music,
  Play,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { getMoodById, MOODS } from '../../data/moods';
import { useListeningHistory } from '../../hooks/useListeningHistory';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { TrackArtwork } from '../discovery/TrackArtwork';
import { formatTrackDuration } from '../../services/audius/audiusNormalizer';

export function ListeningHistorySection({
  onCreateMemoryWithTrack = null,
}) {
  const { history, isTrackingEnabled, clearHistory } = useListeningHistory();
  const { toggleTrack, currentTrack, status } = useAudioPlayer();

  const [searchQuery, setSearchQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState('all');
  const [confirmClear, setConfirmClear] = useState(false);

  // Filtered history list
  const filteredHistory = useMemo(() => {
    let result = [...history];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.trackTitle.toLowerCase().includes(q) ||
          item.artistName.toLowerCase().includes(q)
      );
    }

    if (moodFilter !== 'all') {
      result = result.filter((item) => item.moodId === moodFilter);
    }

    return result;
  }, [history, searchQuery, moodFilter]);

  const hasFilters = searchQuery.trim() !== '' || moodFilter !== 'all';

  return (
    <section aria-labelledby="history-heading" className="space-y-6 font-sans">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink/15 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wideLabel font-semibold text-ink-muted">
            <History className="w-3.5 h-3.5 text-violet-deep" aria-hidden="true" />
            <span>Actual Listening History</span>
            <span className="text-ink/30">•</span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase font-semibold ${
                isTrackingEnabled
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-50 text-amber-800 border border-amber-300'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isTrackingEnabled ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
              />
              <span>{isTrackingEnabled ? 'Tracking Enabled' : 'Tracking Paused'}</span>
            </span>
          </div>
          <h2
            id="history-heading"
            className="font-display text-2xl font-bold tracking-tight text-ink mt-1"
          >
            Recently Played Tracks ({history.length})
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Only tracks you actively played are recorded here. We never track browsing or unplayed recommendations.
          </p>
        </div>

        {/* Clear History Button */}
        {history.length > 0 && (
          <div className="flex-shrink-0">
            {confirmClear ? (
              <div className="flex items-center gap-2 border border-red-300 bg-cream-soft p-1">
                <span className="text-xs text-red-800 font-semibold px-2">Clear all history?</span>
                <button
                  type="button"
                  onClick={() => {
                    clearHistory();
                    setConfirmClear(false);
                  }}
                  className="bg-red-700 text-cream px-3 py-1 text-xs font-semibold uppercase hover:bg-red-800 transition-colors"
                >
                  Yes, Clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="text-xs text-ink-muted hover:text-ink underline px-1"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex min-h-[36px] items-center gap-1.5 px-3 py-1.5 border border-ink/20 hover:border-red-600 text-xs font-semibold uppercase tracking-wideLabel text-red-700 hover:bg-cream-soft transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear History</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      {history.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by track or artist..."
              aria-label="Filter listening history"
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-cream-soft border border-ink/20 focus:border-ink focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="history-mood-filter"
              className="text-xs uppercase tracking-wideLabel font-semibold text-ink-muted"
            >
              Mood:
            </label>
            <select
              id="history-mood-filter"
              value={moodFilter}
              onChange={(e) => setMoodFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-cream-soft border border-ink/20 focus:border-ink focus:outline-none"
            >
              <option value="all">All Moods</option>
              {MOODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setMoodFilter('all');
                }}
                className="p-1.5 border border-ink/20 text-ink-muted hover:text-ink hover:border-ink"
                title="Reset filters"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* History Items or Empty States */}
      {history.length === 0 ? (
        <div className="border border-dashed border-ink/30 p-12 text-center max-w-xl mx-auto my-8 bg-cream-soft/40 space-y-4">
          <div className="w-12 h-12 mx-auto flex items-center justify-center border border-ink/20 bg-cream">
            <History className="w-6 h-6 text-violet-deep" aria-hidden="true" />
          </div>
          <h3 className="font-display text-xl font-bold text-ink">
            No tracks played yet
          </h3>
          <p className="text-sm text-ink-muted font-serif italic max-w-md mx-auto leading-relaxed">
            Your listening history is built purely from real audio streams you start on HIMUNI.
            Explore music on Discover or open a Soundscape to begin.
          </p>
          <Link
            to="/"
            className="inline-flex min-h-[40px] items-center gap-2 bg-ink text-cream px-5 py-2 text-xs font-semibold uppercase tracking-wideLabel hover:bg-violet-deep transition-colors"
          >
            <span>Explore Discover</span>
          </Link>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="border border-dashed border-ink/20 p-8 text-center bg-cream-soft/30 space-y-2">
          <p className="text-sm text-ink-muted">No played tracks match your filter.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setMoodFilter('all');
            }}
            className="text-xs font-semibold uppercase tracking-wideLabel text-ink underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="divide-y divide-ink/15 border border-ink/20 bg-cream">
          {filteredHistory.map((event) => {
            const mood = event.moodId ? getMoodById(event.moodId) : null;
            const isPlayingThis = currentTrack?.id === event.trackId && status === 'playing';

            const playedDate = new Date(event.playedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });
            const playedTime = new Date(event.playedAt).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            });

            // Reconstruct track object for play action
            const trackObj = {
              id: event.trackId,
              title: event.trackTitle,
              artistName: event.artistName,
              artistUrl: event.artistUrl,
              artworkUrl: event.artworkUrl,
              trackUrl: event.trackUrl,
              duration: event.duration,
              genre: event.genre,
              isAvailable: true,
              isStreamable: true,
            };

            return (
              <div
                key={event.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-cream-soft/50 transition-colors"
              >
                {/* Left: Artwork + Track details */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="relative shrink-0">
                    <TrackArtwork
                      artworkUrl={event.artworkUrl}
                      title={event.trackTitle}
                      sizeClass="w-12 h-12 sm:w-14 sm:h-14"
                    />
                    <button
                      type="button"
                      onClick={() => toggleTrack(trackObj)}
                      aria-label={`Play "${event.trackTitle}"`}
                      className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                        isPlayingThis
                          ? 'bg-ink/70 opacity-100'
                          : 'bg-ink/50 opacity-0 hover:opacity-100'
                      }`}
                    >
                      <Play className="w-5 h-5 text-cream fill-cream" />
                    </button>
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-display text-base font-semibold text-ink truncate">
                        {event.trackTitle}
                      </h4>
                      {event.duration > 0 && (
                        <span className="text-xs text-ink-subtle font-mono tabular-nums shrink-0">
                          {formatTrackDuration(event.duration)}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-ink-muted truncate">
                      {event.artistName}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-ink-subtle">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        <span>
                          {playedDate} at {playedTime}
                        </span>
                      </span>

                      {mood && (
                        <span className="inline-flex items-center gap-1 text-ink-muted">
                          <span>&middot;</span>
                          <span
                            aria-hidden="true"
                            className="h-2 w-2 rounded-full border border-ink/20"
                            style={{ backgroundColor: mood.accent }}
                          />
                          <span>{mood.name}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center justify-end gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-ink/10">
                  {onCreateMemoryWithTrack && (
                    <button
                      type="button"
                      onClick={() => onCreateMemoryWithTrack(trackObj)}
                      className="inline-flex min-h-[34px] items-center gap-1 px-2.5 py-1.5 border border-ink/20 hover:border-ink bg-cream text-xs font-semibold uppercase tracking-wideLabel text-ink transition-colors"
                      title="Create a Memory with this track"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-violet-deep" aria-hidden="true" />
                      <span>Remember</span>
                    </button>
                  )}

                  {event.trackUrl && (
                    <a
                      href={event.trackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[34px] items-center gap-1 px-2.5 py-1.5 border border-ink/20 hover:border-ink bg-cream text-xs font-medium text-ink-muted hover:text-ink transition-colors"
                      title="Open on Audius"
                    >
                      <span className="text-[11px] uppercase tracking-wide">Audius</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
