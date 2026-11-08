import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Copy,
  Edit3,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { getMoodById } from '../../data/moods';
import { CollectionCover } from './CollectionCover';

export function CollectionCard({
  collection,
  onEdit = null,
  onDuplicate = null,
  onDelete = null,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const mood = getMoodById(collection.moodId || 'calm');
  const count = Array.isArray(collection.items) ? collection.items.length : 0;

  const dateFormatted = collection.updatedAt
    ? new Date(collection.updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <article className="group flex flex-col justify-between border border-ink/20 bg-cream transition-colors duration-200 hover:border-ink">
      {/* Visual Cover Header */}
      <Link
        to={`/collections/${collection.id}`}
        aria-label={`Open collection: "${collection.name}"`}
        className="block"
      >
        <CollectionCover
          themeId={collection.coverThemeId}
          name={collection.name}
          itemCount={count}
        />
      </Link>

      {/* Details */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 font-medium text-ink-muted">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full border border-ink/25"
              style={{ backgroundColor: mood?.accent || '#8067E8' }}
            />
            <span>{mood?.name || 'Calm'}</span>
          </span>

          <span className="text-[11px] text-ink-subtle tabular-nums font-mono">
            Updated {dateFormatted}
          </span>
        </div>

        <div>
          <h3 className="font-display text-xl font-semibold tracking-tight text-ink line-clamp-1">
            <Link to={`/collections/${collection.id}`} className="hover:underline">
              {collection.name}
            </Link>
          </h3>

          {collection.description ? (
            <p className="text-xs sm:text-sm text-ink-muted line-clamp-2 pt-1 leading-relaxed">
              {collection.description}
            </p>
          ) : (
            <p className="text-xs text-ink-subtle italic pt-1">
              Curated sound archive.
            </p>
          )}
        </div>
      </div>

      {/* Actions Footer */}
      <div className="px-5 pb-5 pt-1 border-t border-ink/10 flex items-center justify-between gap-2">
        <Link
          to={`/collections/${collection.id}`}
          className="inline-flex min-h-[38px] items-center gap-1.5 text-xs font-semibold uppercase tracking-wideLabel text-ink hover:text-violet-deep transition-colors"
        >
          <span>Open Collection</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>

        {/* Action Menu */}
        <div className="relative">
          {confirmDelete ? (
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  onDelete && onDelete(collection.id);
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
                aria-label={`Actions for "${collection.name}"`}
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
                      onEdit && onEdit(collection);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-ink hover:bg-cream-soft transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onDuplicate && onDuplicate(collection.id);
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
