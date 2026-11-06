import React from 'react';
import { ExternalLink, Lock } from 'lucide-react';
import { formatTrackDuration } from '../../services/audius/audiusNormalizer';
import { TrackArtwork } from './TrackArtwork';

/**
 * Editorial track-list item presenting real Audius metadata, creator attribution,
 * external links to artist and track pages, and availability notices.
 */
export function TrackRow({
  track,
  index = 0,
  accentColor = '#8067E8',
  variant = 'default',
  listenAction = null,
  inlinePlayerPanel = null,
  isActiveTrack = false,
}) {
  if (!track) return null;

  const formattedDuration = formatTrackDuration(track.duration);
  const isCompact = variant === 'compact';

  const metadataPills = [];
  if (track.genre) metadataPills.push(track.genre);
  if (track.mood && track.mood.toLowerCase() !== track.genre?.toLowerCase()) {
    metadataPills.push(track.mood);
  }
  if (!isCompact && typeof track.bpm === 'number' && track.bpm > 0) {
    metadataPills.push(`${track.bpm} BPM`);
  }
  if (!isCompact && metadataPills.length < 3 && Array.isArray(track.tags)) {
    for (const tag of track.tags) {
      if (
        metadataPills.length < 3 &&
        !metadataPills.some((m) => m.toLowerCase() === tag.toLowerCase())
      ) {
        metadataPills.push(`#${tag}`);
      }
    }
  }

  return (
    <article
      className={`group transition-colors duration-200 ${
        isActiveTrack
          ? 'bg-cream-soft border-l-2 border-l-ink pl-3 sm:pl-4 pr-2'
          : 'hover:bg-cream-soft/65'
      } ${isCompact ? 'py-4' : 'py-4 sm:py-5'}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Editorial Index + Artwork + Track & Artist Details */}
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
          <span
            aria-hidden="true"
            className="w-6 pt-1 sm:pt-0 text-xs font-display font-medium text-ink-subtle shrink-0"
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          <TrackArtwork
            artworkUrl={track.artworkUrl}
            artworkFallbacks={track.artworkFallbacks}
            title={track.title}
            accentColor={accentColor}
            sizeClass={isCompact ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-14 h-14 sm:w-16 sm:h-16'}
          />

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              {track.trackUrl ? (
                <a
                  href={track.trackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-base sm:text-lg font-semibold tracking-editorial text-ink hover:underline truncate max-w-full"
                  title={`${track.title} on Audius`}
                >
                  {track.title}
                </a>
              ) : (
                <h4 className="font-display text-base sm:text-lg font-semibold tracking-editorial text-ink truncate">
                  {track.title}
                </h4>
              )}

              {formattedDuration && (
                <span className="text-xs font-sans tabular-nums text-ink-subtle shrink-0">
                  {formattedDuration}
                </span>
              )}
            </div>

            {/* Artist Attribution + Audius Source */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-ink-muted">
              <span>by</span>
              {track.artistUrl ? (
                <a
                  href={track.artistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-ink hover:underline truncate max-w-[16rem]"
                >
                  {track.artistName}
                </a>
              ) : (
                <span className="font-medium text-ink truncate max-w-[16rem]">
                  {track.artistName}
                </span>
              )}
              <span aria-hidden="true" className="text-ink-subtle">
                &middot;
              </span>
              <span className="text-xs text-ink-subtle">via Audius</span>
            </div>

            {/* Genre / Mood / Tags / License / Availability Metadata */}
            <div className="pt-1 flex flex-wrap items-center gap-1.5">
              {metadataPills.map((pill) => (
                <span
                  key={pill}
                  className="border border-ink/15 bg-cream px-2 py-0.5 text-[11px] text-ink-muted"
                >
                  {pill}
                </span>
              ))}

              {!isCompact && track.license && (
                <span
                  className="border border-ink/15 bg-cream px-2 py-0.5 text-[11px] text-ink-subtle truncate max-w-[12rem]"
                  title={`License: ${track.license}`}
                >
                  {track.license}
                </span>
              )}

              {track.availabilityNote && (
                <span className="inline-flex items-center gap-1 border border-ink/25 bg-cream-deep/70 px-2 py-0.5 text-[11px] font-medium text-ink">
                  <Lock className="w-3 h-3" aria-hidden="true" />
                  <span>{track.availabilityNote}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Contextual Listen Control + External Audius Track Link */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 pl-9 sm:pl-0 shrink-0">
          {listenAction}

          {track.trackUrl && (
            <a
              href={track.trackUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open "${track.title}" by ${track.artistName} on Audius`}
              className="inline-flex items-center gap-1.5 border border-ink/20 bg-cream px-3 py-2 text-xs font-medium text-ink hover:border-ink transition-colors"
            >
              <span>Audius</span>
              <ExternalLink className="w-3.5 h-3.5 text-ink-muted" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {inlinePlayerPanel}
    </article>
  );
}
