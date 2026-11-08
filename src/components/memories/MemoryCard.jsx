import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Compass,
  Disc3,
  Edit3,
  ExternalLink,
  Folder,
  Music,
  Sparkles,
  Trash2,
  Zap,
} from 'lucide-react';
import { getMoodById } from '../../data/moods';

export function MemoryCard({
  memory,
  onEdit = null,
  onDelete = null,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const mood = getMoodById(memory.moodId || 'dreamy');
  const accent = mood?.accent || '#8067E8';

  // Format date cleanly in local format
  const dateFormatted = memory.entryDate
    ? new Date(`${memory.entryDate}T00:00:00`).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const title = memory.title?.trim() || `Reflections in ${mood?.name || 'Sound'}`;
  const note = memory.note?.trim() || '';
  const isLongNote = note.length > 220;
  const displayedNote = isExpanded || !isLongNote ? note : `${note.slice(0, 220)}...`;

  const refs = memory.references || {};
  const hasTrack = Boolean(refs.trackSnapshot || refs.trackId);
  const hasSoundscape = Boolean(refs.soundscapeSnapshot || refs.soundscapeId);
  const hasPostcard = Boolean(refs.postcardSnapshot || refs.postcardId);
  const hasCollection = Boolean(refs.collectionSnapshot || refs.collectionId);

  return (
    <article
      className="group relative border border-ink/20 bg-cream p-5 sm:p-7 transition-colors hover:border-ink space-y-4"
      style={{ borderLeftColor: accent, borderLeftWidth: '4px' }}
    >
      {/* Top row: Date, Mood & Energy */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-ink/10 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-ink-muted" aria-hidden="true" />
          <time dateTime={memory.entryDate} className="font-mono text-ink-muted text-xs">
            {dateFormatted}
          </time>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Mood badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cream-soft border border-ink/20 font-medium text-ink">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full border border-ink/20"
              style={{ backgroundColor: accent }}
            />
            <span>{mood?.name || 'Dreamy'}</span>
            <span className="font-baybayin text-[11px] text-ink-subtle">
              ({mood?.baybayin})
            </span>
          </span>

          {/* Energy level */}
          {typeof memory.energy === 'number' && (
            <span className="inline-flex items-center gap-1 text-[11px] text-ink-muted">
              <Zap className="w-3 h-3 text-ink-subtle" aria-hidden="true" />
              <span>{memory.energy}% energy</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Journal Title & Reflection */}
      <div className="space-y-2">
        <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink">
          {title}
        </h3>

        {note ? (
          <div className="text-sm sm:text-base text-ink-muted font-serif italic leading-relaxed space-y-1">
            <p className="whitespace-pre-line">{displayedNote}</p>
            {isLongNote && (
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="text-xs font-sans not-italic text-ink underline font-medium hover:text-violet-deep pt-1"
              >
                {isExpanded ? 'Show less' : 'Read full reflection'}
              </button>
            )}
          </div>
        ) : (
          <p className="text-xs text-ink-subtle italic">
            A quiet feeling captured without words.
          </p>
        )}
      </div>

      {/* Referenced Elements (Tracks, Soundscapes, Postcards, Collections) */}
      {(hasTrack || hasSoundscape || hasPostcard || hasCollection) && (
        <div className="pt-2 border-t border-ink/10 flex flex-wrap items-center gap-2 text-xs">
          {/* Track Reference */}
          {hasTrack && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-cream-soft border border-ink/20 max-w-xs truncate">
              <Music className="w-3.5 h-3.5 text-violet-deep shrink-0" aria-hidden="true" />
              <span className="truncate text-ink font-medium">
                {refs.trackSnapshot?.title || 'Featured Track'}
              </span>
              {refs.trackSnapshot?.artistName && (
                <span className="text-ink-subtle truncate">
                  by {refs.trackSnapshot.artistName}
                </span>
              )}
              {refs.trackSnapshot?.trackUrl && (
                <a
                  href={refs.trackSnapshot.trackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink text-ink-subtle shrink-0 ml-1"
                  title="Open on Audius"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* Soundscape Reference */}
          {hasSoundscape && (
            <Link
              to={`/soundscapes/${refs.soundscapeId}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-cream-soft border border-ink/20 hover:border-ink text-ink transition-colors"
            >
              <Disc3 className="w-3.5 h-3.5 text-tangerine shrink-0" aria-hidden="true" />
              <span className="font-medium truncate">
                {refs.soundscapeSnapshot?.title || 'HIMUNI Soundscape'}
              </span>
            </Link>
          )}

          {/* Postcard Reference */}
          {hasPostcard && (
            <Link
              to="/postcards"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-cream-soft border border-ink/20 hover:border-ink text-ink transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-butter-yellow shrink-0" aria-hidden="true" />
              <span className="font-medium truncate">
                {refs.postcardSnapshot?.title || 'Sound Postcard'}
              </span>
            </Link>
          )}

          {/* Collection Reference */}
          {hasCollection && (
            <Link
              to={`/collections/${refs.collectionId}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-cream-soft border border-ink/20 hover:border-ink text-ink transition-colors"
            >
              <Folder className="w-3.5 h-3.5 text-sky-blue shrink-0" aria-hidden="true" />
              <span className="font-medium truncate">
                {refs.collectionSnapshot?.name || 'Personal Collection'}
              </span>
            </Link>
          )}
        </div>
      )}

      {/* Footer Management Actions */}
      <div className="pt-2 border-t border-ink/10 flex items-center justify-between gap-2">
        <span className="text-[11px] text-ink-subtle font-mono">
          {memory.createdAt
            ? `Recorded ${new Date(memory.createdAt).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}`
            : ''}
        </span>

        <div className="flex items-center gap-2">
          {confirmDelete ? (
            <div className="flex items-center gap-1.5 text-xs bg-cream-soft border border-red-300 p-1">
              <span className="text-[11px] text-red-800 font-semibold px-1">Delete memory?</span>
              <button
                type="button"
                onClick={() => {
                  onDelete && onDelete(memory.id);
                  setConfirmDelete(false);
                }}
                className="bg-red-700 text-cream px-2.5 py-1 text-[11px] font-semibold uppercase hover:bg-red-800 transition-colors"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-[11px] text-ink-muted hover:text-ink underline px-1"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onEdit && onEdit(memory)}
                className="inline-flex min-h-[34px] items-center gap-1.5 px-3 py-1 border border-ink/20 hover:border-ink text-xs font-semibold uppercase tracking-wideLabel text-ink hover:bg-cream-soft transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                aria-label={`Delete memory "${title}"`}
                className="inline-flex min-h-[34px] min-w-[34px] items-center justify-center border border-ink/20 hover:border-red-600 text-ink-muted hover:text-red-700 hover:bg-cream-soft transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
