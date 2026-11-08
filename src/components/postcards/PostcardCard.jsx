import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Copy,
  Download,
  Edit3,
  Eye,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { getMoodById } from '../../data/moods';
import { PostcardCanvas } from './PostcardCanvas';

export function PostcardCard({
  postcard,
  onPreview = null,
  onDuplicate = null,
  onDelete = null,
  onExport = null,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const mood = getMoodById(postcard?.moodId || 'dreamy');
  const track = postcard?.featuredTrack;

  const dateFormatted = postcard?.createdAt
    ? new Date(postcard.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <article className="group flex flex-col justify-between border border-ink/20 bg-cream transition-colors duration-200 hover:border-ink">
      {/* Top canvas preview tile */}
      <div
        onClick={() => onPreview && onPreview(postcard)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPreview && onPreview(postcard);
          }
        }}
        aria-label={`Preview postcard: "${postcard.title}"`}
        className="cursor-pointer block relative aspect-[4/5] w-full overflow-hidden border-b border-ink/15 bg-cream-soft transition-transform duration-300"
      >
        <div className="w-full h-full pointer-events-none">
          <PostcardCanvas postcard={postcard} />
        </div>

        {/* Hover preview overlay pill */}
        <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 bg-ink text-cream px-3 py-1.5 text-xs font-semibold uppercase tracking-wideLabel shadow">
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Open Preview</span>
          </span>
        </div>
      </div>

      {/* Card Info Details */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 font-medium text-ink-muted">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full border border-ink/25"
              style={{ backgroundColor: mood?.accent || '#8067E8' }}
            />
            <span>{mood?.name || 'Dreamy'}</span>
          </span>

          <span className="text-[11px] text-ink-subtle tabular-nums font-mono">
            {dateFormatted}
          </span>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink line-clamp-1">
            {postcard.title}
          </h3>

          {track ? (
            <p className="text-xs text-ink-muted line-clamp-1 pt-0.5">
              <span className="font-medium text-ink">
                {track.titleSnapshot || track.title}
              </span>
              <span> &middot; {track.artistSnapshot || track.artistName}</span>
            </p>
          ) : (
            <p className="text-xs text-ink-subtle italic pt-0.5">No track attached</p>
          )}
        </div>

        {postcard.note && (
          <p className="text-xs text-ink-muted italic line-clamp-2 pt-1 border-t border-ink/10">
            &ldquo;{postcard.note}&rdquo;
          </p>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="px-5 pb-5 pt-1 border-t border-ink/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link
            to={`/postcards/edit/${postcard.id}`}
            aria-label={`Edit "${postcard.title}"`}
            className="inline-flex min-h-[38px] items-center gap-1.5 border border-ink/20 bg-cream-soft px-3 py-1.5 text-xs font-semibold uppercase tracking-wideLabel text-ink hover:bg-ink hover:text-cream hover:border-ink transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Edit</span>
          </Link>

          <button
            type="button"
            onClick={() => onExport && onExport(postcard)}
            aria-label={`Export "${postcard.title}" as PNG`}
            className="inline-flex min-h-[38px] items-center gap-1.5 border border-ink/20 bg-cream px-2.5 py-1.5 text-xs font-medium text-ink hover:border-ink transition-colors"
            title="Export as PNG"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only text-[11px] uppercase tracking-wideLabel">
              PNG
            </span>
          </button>
        </div>

        {/* Overflow Actions Dropdown / Delete Confirmation */}
        <div className="relative">
          {confirmDelete ? (
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  onDelete && onDelete(postcard.id);
                  setConfirmDelete(false);
                }}
                className="bg-ink text-cream px-2.5 py-1.5 font-semibold text-[11px] uppercase tracking-wide hover:bg-red-800 transition-colors"
              >
                Delete?
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-ink-muted hover:text-ink text-[11px] underline px-1"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label={`More actions for "${postcard.title}"`}
                aria-expanded={menuOpen}
                className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center border border-ink/15 text-ink-muted hover:text-ink hover:border-ink transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 bottom-full mb-1 z-20 w-36 border border-ink bg-cream p-1 shadow-md space-y-0.5 text-xs"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onDuplicate && onDuplicate(postcard.id);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-ink hover:bg-cream-soft transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Duplicate</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      setConfirmDelete(true);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-red-700 hover:bg-cream-soft transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}
