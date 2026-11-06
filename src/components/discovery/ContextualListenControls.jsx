import React from 'react';
import {
  AlertCircle,
  ExternalLink,
  Loader2,
  Lock,
  Pause,
  Play,
  RotateCw,
  Square,
} from 'lucide-react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { formatTrackDuration } from '../../services/audius/audiusNormalizer';

export function TrackListenButton({ track }) {
  const { currentTrack, status, toggleTrack } = useAudioPlayer();

  if (!track) return null;

  // Respect unavailable and creator-gated content strictly
  if (!track.isAvailable || track.isStreamGated || !track.isStreamable) {
    return (
      <span
        role="status"
        className="inline-flex min-h-[40px] items-center gap-1.5 border border-ink/20 bg-cream-deep/65 px-3 py-2 text-xs font-medium text-ink-muted"
        title={
          track.availabilityNote ||
          'Direct streaming is restricted by creator settings on Audius'
        }
      >
        <Lock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{track.isStreamGated ? 'Gated' : 'Unavailable'}</span>
      </span>
    );
  }

  const isCurrent = currentTrack?.id === track.id;
  const isPlaying = isCurrent && status === 'playing';
  const isLoading = isCurrent && status === 'loading';
  const isError = isCurrent && status === 'error';

  return (
    <button
      type="button"
      onClick={() => toggleTrack(track)}
      aria-label={
        isPlaying
          ? `Pause "${track.title}" by ${track.artistName}`
          : isError
          ? `Retry streaming "${track.title}" by ${track.artistName}`
          : `Listen to "${track.title}" by ${track.artistName} via Audius`
      }
      className={`inline-flex min-h-[40px] items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wideLabel border transition-colors ${
        isPlaying
          ? 'bg-ink text-cream border-ink'
          : 'bg-cream-soft text-ink border-ink/35 hover:bg-ink hover:text-cream hover:border-ink'
      }`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
          <span>Connecting</span>
        </>
      ) : isPlaying ? (
        <>
          <Pause className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Pause</span>
        </>
      ) : isError ? (
        <>
          <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Retry</span>
        </>
      ) : (
        <>
          <Play className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Listen</span>
        </>
      )}
    </button>
  );
}

export function InlineContextualPlayer({ track, accentColor = '#8067E8' }) {
  const {
    currentTrack,
    status,
    currentTime,
    duration,
    playbackError,
    toggleTrack,
    stopPlayback,
    seekTo,
  } = useAudioPlayer();

  if (!track || currentTrack?.id !== track.id || status === 'idle') {
    return null;
  }

  const effectiveDuration = duration > 0 ? duration : track.duration || 0;
  const progressPercent =
    effectiveDuration > 0
      ? Math.min(100, Math.max(0, (currentTime / effectiveDuration) * 100))
      : 0;

  if (status === 'error') {
    return (
      <div
        role="alert"
        className="mt-4 border border-ink/30 bg-cream p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs"
      >
        <div className="flex items-start gap-2.5 text-ink">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            {playbackError ||
              'Unable to stream this track right now. Rights or node availability may have changed.'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleTrack(track)}
            className="inline-flex items-center gap-1.5 bg-ink text-cream px-3 py-1.5 font-semibold uppercase tracking-wideLabel hover:bg-ink-soft transition-colors"
          >
            <RotateCw className="w-3 h-3" aria-hidden="true" />
            <span>Retry</span>
          </button>

          {track.trackUrl && (
            <a
              href={track.trackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 border border-ink/25 bg-cream-soft px-3 py-1.5 font-medium text-ink hover:border-ink transition-colors"
            >
              <span>Open on Audius</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          )}

          <button
            type="button"
            onClick={stopPlayback}
            className="px-2 py-1.5 text-ink-muted hover:text-ink underline"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label={`Contextual Audius stream for ${track.title} by ${track.artistName}`}
      className="mt-4 border border-ink/25 bg-cream p-3.5 sm:p-4 space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span
            aria-hidden="true"
            className={`h-2 w-2 rounded-full shrink-0 ${
              status === 'playing' ? 'animate-pulse' : ''
            }`}
            style={{ backgroundColor: accentColor }}
          />
          <span className="font-semibold uppercase tracking-wideLabel text-ink">
            {status === 'loading'
              ? 'Connecting to Audius'
              : status === 'paused'
              ? 'Stream Paused'
              : 'Streaming from Audius'}
          </span>
          <span aria-hidden="true" className="text-ink-subtle">
            &middot;
          </span>
          <span className="text-ink-muted truncate">
            {track.artistName}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="tabular-nums text-ink-muted">
            {formatTrackDuration(Math.max(0, Math.floor(currentTime))) || '0:00'}
            {effectiveDuration > 0
              ? ` / ${formatTrackDuration(effectiveDuration)}`
              : ''}
          </span>

          <button
            type="button"
            onClick={stopPlayback}
            aria-label={`Stop streaming "${track.title}"`}
            className="inline-flex items-center gap-1 border border-ink/25 bg-cream-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wideLabel text-ink hover:border-ink transition-colors"
          >
            <Square className="w-2.5 h-2.5 fill-current" aria-hidden="true" />
            <span>Stop</span>
          </button>
        </div>
      </div>

      {/* Scrubbable progress track */}
      <div className="relative flex items-center">
        <label htmlFor={`seek-${track.id}`} className="sr-only">
          Seek playback position for {track.title}
        </label>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 h-1.5 bg-cream-deep border border-ink/15 overflow-hidden"
        >
          <div
            className="h-full transition-all duration-150"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: accentColor,
            }}
          />
        </div>
        <input
          id={`seek-${track.id}`}
          type="range"
          min={0}
          max={effectiveDuration > 0 ? Math.round(effectiveDuration) : 100}
          step={1}
          value={Math.min(
            effectiveDuration > 0 ? Math.round(effectiveDuration) : 100,
            Math.round(currentTime)
          )}
          disabled={effectiveDuration <= 0}
          onChange={(e) => seekTo(Number(e.target.value))}
          className="himuni-range relative z-10 w-full"
        />
      </div>

      {track.trackUrl && (
        <div className="flex items-center justify-between text-[11px] text-ink-muted">
          <span>Official Audius stream &middot; Creator-hosted audio</span>
          <a
            href={track.trackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-ink underline hover:text-violet-deep"
          >
            <span>Original track on Audius</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </div>
      )}
    </div>
  );
}

/**
 * Contextual masthead stream strip rendered ONLY while a track is active,
 * avoiding any permanent bottom music player bar while preserving attribution
 * and stop/pause controls across discovery sections.
 */
export function HeaderStreamPill({ accentColor = '#8067E8' }) {
  const { currentTrack, status, toggleTrack, stopPlayback } = useAudioPlayer();

  if (
    !currentTrack ||
    (status !== 'playing' && status !== 'paused' && status !== 'loading')
  ) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Active Audius stream"
      className="border-t border-ink/15 bg-cream-soft/95"
    >
      <div className="mx-auto max-w-editorial px-5 sm:px-8 lg:px-12 py-2 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => toggleTrack(currentTrack)}
            aria-label={
              status === 'playing'
                ? `Pause ${currentTrack.title}`
                : `Resume ${currentTrack.title}`
            }
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center border border-ink/25 bg-cream text-ink hover:bg-ink hover:text-cream transition-colors"
          >
            {status === 'loading' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            ) : status === 'playing' ? (
              <Pause className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </button>

          <div className="min-w-0 flex-1 truncate">
            <span
              aria-hidden="true"
              className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 align-middle ${
                status === 'playing' ? 'animate-pulse' : ''
              }`}
              style={{ backgroundColor: accentColor }}
            />
            <span className="font-display font-semibold text-ink">
              {currentTrack.title}
            </span>
            <span className="text-ink-muted">
              {' '}
              &middot; {currentTrack.artistName} &middot; via Audius
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentTrack.trackUrl && (
            <a
              href={currentTrack.trackUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open "${currentTrack.title}" on Audius`}
              className="hidden sm:inline-flex items-center gap-1 border border-ink/20 bg-cream px-2.5 py-1.5 text-[11px] font-medium text-ink hover:border-ink transition-colors"
            >
              <span>Audius</span>
              <ExternalLink className="w-3 h-3 text-ink-muted" aria-hidden="true" />
            </a>
          )}

          <button
            type="button"
            onClick={stopPlayback}
            aria-label="Stop active stream"
            className="inline-flex h-8 items-center gap-1 border border-ink/25 bg-cream px-2.5 text-[11px] font-semibold uppercase tracking-wideLabel text-ink hover:border-ink transition-colors"
          >
            <Square className="w-2.5 h-2.5 fill-current" aria-hidden="true" />
            <span>Stop</span>
          </button>
        </div>
      </div>
    </div>
  );
}
