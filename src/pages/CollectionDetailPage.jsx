import React, { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookmarkX,
  Compass,
  Copy,
  Disc3,
  Edit3,
  Folder,
  Music,
  Plus,
  Trash2,
} from 'lucide-react';
import { getMoodById } from '../data/moods';
import { useMood } from '../hooks/useMood';
import { useCollections } from '../hooks/useCollections';
import { MainLayout } from '../layouts/MainLayout';
import { CollectionCover } from '../components/collections/CollectionCover';
import { CreateCollectionModal } from '../components/collections/CreateCollectionModal';
import { TrackRow } from '../components/discovery/TrackRow';

export function CollectionDetailPage() {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const { selectedMood } = useMood();
  const {
    getCollection,
    updateCollection,
    duplicateCollection,
    deleteCollection,
    removeItem,
    reorderItems,
  } = useCollections();

  const collection = getCollection(collectionId);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'tracks' | 'soundscapes'

  if (!collection) {
    return <Navigate to="/collections" replace />;
  }

  const mood = getMoodById(collection.moodId || 'calm');
  const items = Array.isArray(collection.items) ? collection.items : [];

  const trackItems = items.filter((it) => it.type === 'track');
  const soundscapeItems = items.filter((it) => it.type === 'soundscape');

  const filteredItems = useMemo(() => {
    if (filterType === 'tracks') return items.filter((it) => it.type === 'track');
    if (filterType === 'soundscapes') return items.filter((it) => it.type === 'soundscape');
    return items;
  }, [items, filterType]);

  const handleUpdate = (data) => {
    updateCollection(collection.id, data);
  };

  const handleDuplicate = () => {
    const dup = duplicateCollection(collection.id);
    if (dup) {
      navigate(`/collections/${dup.id}`);
    }
  };

  const handleDelete = () => {
    deleteCollection(collection.id);
    navigate('/collections');
  };

  const handleMoveUp = (index) => {
    if (index <= 0) return;
    const newItems = [...items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    reorderItems(collection.id, newItems);
  };

  const handleMoveDown = (index) => {
    if (index >= items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    reorderItems(collection.id, newItems);
  };

  const handleRemove = (referenceId) => {
    removeItem(collection.id, referenceId);
  };

  const createdFormatted = collection.createdAt
    ? new Date(collection.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const updatedFormatted = collection.updatedAt
    ? new Date(collection.updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <MainLayout activeMood={selectedMood}>
      <article className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24 font-sans text-ink">
        {/* Navigation Bar */}
        <div className="pb-6 border-b border-ink/15 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/collections"
            className="inline-flex min-h-[40px] items-center gap-2 border border-ink/20 bg-cream-soft px-4 py-2 text-xs font-semibold uppercase tracking-wideLabel text-ink hover:border-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Collections</span>
          </Link>

          <span className="text-xs uppercase tracking-wideLabel text-ink-muted">
            Personal Archive &middot; {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Editorial Collection Hero Header */}
        <header className="mt-8 pb-10 border-b border-ink/20 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Cover Art */}
          <div className="md:col-span-4 lg:col-span-3 border border-ink/20 shadow-sm max-w-xs sm:max-w-none">
            <CollectionCover
              themeId={collection.coverThemeId}
              name={collection.name}
              itemCount={items.length}
            />
          </div>

          {/* Details & Action Controls */}
          <div className="md:col-span-8 lg:col-span-9 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 border border-ink/20 bg-cream px-2.5 py-1 font-medium text-ink">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: mood?.accent || '#8067E8' }}
                />
                <span>Mood: {mood?.name || 'Calm'}</span>
                <span className="font-baybayin text-[11px] text-ink-subtle">
                  ({mood?.baybayin})
                </span>
              </span>

              <span className="border border-ink/20 bg-cream-soft px-2.5 py-1 text-ink-muted">
                {trackItems.length} {trackItems.length === 1 ? 'track' : 'tracks'}
                {' &middot; '}
                {soundscapeItems.length}{' '}
                {soundscapeItems.length === 1 ? 'soundscape' : 'soundscapes'}
              </span>

              {updatedFormatted && (
                <span className="text-ink-subtle text-[11px] font-mono">
                  Updated {updatedFormatted}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-ink leading-[1.08]">
              {collection.name}
            </h1>

            {collection.description ? (
              <p className="text-base sm:text-lg text-ink-muted font-serif italic max-w-2xl leading-relaxed">
                "{collection.description}"
              </p>
            ) : (
              <p className="text-sm text-ink-subtle italic">
                A personalized HIMUNI sound collection.
              </p>
            )}

            {/* Collection Actions */}
            <div className="pt-3 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setEditModalOpen(true)}
                className="inline-flex min-h-[38px] items-center gap-1.5 border border-ink bg-ink text-cream px-4 py-2 text-xs font-semibold uppercase tracking-wideLabel hover:bg-violet-deep transition-colors shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Edit Collection</span>
              </button>

              <button
                type="button"
                onClick={handleDuplicate}
                className="inline-flex min-h-[38px] items-center gap-1.5 border border-ink/20 bg-cream px-3.5 py-2 text-xs font-semibold uppercase tracking-wideLabel text-ink hover:border-ink transition-colors"
                title="Duplicate this collection"
              >
                <Copy className="w-3.5 h-3.5 text-ink-muted" aria-hidden="true" />
                <span>Duplicate</span>
              </button>

              {confirmDelete ? (
                <div className="inline-flex items-center gap-2 bg-cream-soft border border-red-300 p-1">
                  <span className="text-xs text-red-800 font-semibold px-2">Delete collection?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-700 text-cream px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:bg-red-800 transition-colors"
                  >
                    Confirm Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="text-xs text-ink-muted hover:text-ink underline px-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex min-h-[38px] items-center gap-1.5 border border-ink/20 bg-cream px-3.5 py-2 text-xs font-semibold uppercase tracking-wideLabel text-red-700 hover:border-red-600 transition-colors"
                  title="Delete collection"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Collection Content Listing */}
        <section aria-labelledby="collection-items-heading" className="mt-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/15 pb-4">
            <h2
              id="collection-items-heading"
              className="font-display text-2xl font-bold tracking-tight text-ink"
            >
              Collection Content
            </h2>

            {/* Filter Toggle */}
            {items.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-ink-muted uppercase tracking-wideLabel font-semibold">
                  View:
                </span>
                <div className="inline-flex border border-ink/20 bg-cream p-0.5">
                  <button
                    type="button"
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1 text-xs font-medium uppercase tracking-wide transition-colors ${
                      filterType === 'all'
                        ? 'bg-ink text-cream'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    All ({items.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType('tracks')}
                    className={`px-3 py-1 text-xs font-medium uppercase tracking-wide transition-colors ${
                      filterType === 'tracks'
                        ? 'bg-ink text-cream'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Tracks ({trackItems.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType('soundscapes')}
                    className={`px-3 py-1 text-xs font-medium uppercase tracking-wide transition-colors ${
                      filterType === 'soundscapes'
                        ? 'bg-ink text-cream'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Soundscapes ({soundscapeItems.length})
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Empty Collection State */}
          {items.length === 0 ? (
            <div className="border border-dashed border-ink/30 p-12 sm:p-16 text-center max-w-xl mx-auto my-12 bg-cream-soft/40">
              <Folder className="w-12 h-12 text-ink-subtle mx-auto mb-4" aria-hidden="true" />
              <h3 className="font-display text-2xl font-bold text-ink mb-2">
                This collection is empty
              </h3>
              <p className="text-sm text-ink-muted font-serif italic mb-8 max-w-md mx-auto leading-relaxed">
                Add Audius tracks from the Discover feed or save HIMUNI Soundscapes to assemble
                your personal listening moments.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/"
                  className="inline-flex min-h-[42px] items-center gap-2 bg-ink text-cream px-5 py-2.5 text-xs font-semibold uppercase tracking-wideLabel hover:bg-violet-deep transition-colors"
                >
                  <Compass className="w-4 h-4" aria-hidden="true" />
                  <span>Discover Music</span>
                </Link>

                <Link
                  to="/soundscapes"
                  className="inline-flex min-h-[42px] items-center gap-2 border border-ink bg-cream px-5 py-2.5 text-xs font-semibold uppercase tracking-wideLabel text-ink hover:bg-cream-soft transition-colors"
                >
                  <Disc3 className="w-4 h-4" aria-hidden="true" />
                  <span>Explore Soundscapes</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Items List with Reordering & Removal Controls */
            <div className="space-y-4">
              {filteredItems.map((item, index) => {
                const originalIndex = items.findIndex((it) => it.id === item.id);
                const isFirst = originalIndex === 0;
                const isLast = originalIndex === items.length - 1;

                if (item.type === 'soundscape') {
                  const s = item.snapshot || {};
                  return (
                    <article
                      key={item.id}
                      className="border border-ink/20 bg-cream p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-ink transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                        <span
                          aria-hidden="true"
                          className="w-6 text-xs font-display font-medium text-ink-subtle shrink-0"
                        >
                          {String(originalIndex + 1).padStart(2, '0')}
                        </span>

                        <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 border border-ink/20 flex items-center justify-center bg-violet-deep text-cream">
                          <Disc3 className="w-6 h-6" aria-hidden="true" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-ink text-cream px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wideLabel">
                              Soundscape
                            </span>
                            {s.moodLabel && (
                              <span className="text-xs text-ink-muted">
                                Mood: {s.moodLabel}
                              </span>
                            )}
                          </div>

                          <h4 className="font-display text-lg font-semibold text-ink truncate">
                            <Link
                              to={`/soundscapes/${s.id}`}
                              className="hover:underline"
                            >
                              {s.title || 'Untitled Soundscape'}
                            </Link>
                          </h4>

                          {s.description && (
                            <p className="text-xs text-ink-muted line-clamp-1">
                              {s.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between md:justify-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-ink/10">
                        <Link
                          to={`/soundscapes/${s.id}`}
                          className="inline-flex min-h-[38px] items-center gap-1.5 border border-ink bg-ink text-cream px-3 py-1.5 text-xs font-semibold uppercase tracking-wideLabel hover:bg-violet-deep transition-colors"
                        >
                          <span>Open</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>

                        {/* Reorder Buttons */}
                        <div className="inline-flex border border-ink/20 bg-cream">
                          <button
                            type="button"
                            onClick={() => handleMoveUp(originalIndex)}
                            disabled={isFirst}
                            aria-label={`Move "${s.title}" up`}
                            className="p-2 text-ink hover:bg-cream-soft disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDown(originalIndex)}
                            disabled={isLast}
                            aria-label={`Move "${s.title}" down`}
                            className="p-2 text-ink hover:bg-cream-soft border-l border-ink/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          aria-label={`Remove "${s.title}" from collection`}
                          className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center border border-ink/20 text-ink-muted hover:text-red-700 hover:border-red-600 transition-colors"
                          title="Remove from collection"
                        >
                          <BookmarkX className="w-4 h-4" />
                        </button>
                      </div>
                    </article>
                  );
                }

                // Track Item
                const t = item.snapshot || {};
                return (
                  <div
                    key={item.id}
                    className="border border-ink/20 bg-cream hover:border-ink transition-colors"
                  >
                    <div className="flex items-center justify-between px-4 pt-3 pb-1 border-b border-ink/10 text-xs">
                      <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-wideLabel text-ink-muted text-[11px]">
                        <Music className="w-3 h-3 text-violet-deep" aria-hidden="true" />
                        <span>Audius Track #{originalIndex + 1}</span>
                      </span>

                      {/* Reorder & Remove Controls for Track */}
                      <div className="flex items-center gap-1.5">
                        <div className="inline-flex border border-ink/20 bg-cream">
                          <button
                            type="button"
                            onClick={() => handleMoveUp(originalIndex)}
                            disabled={isFirst}
                            aria-label={`Move "${t.title}" up`}
                            className="p-1.5 text-ink hover:bg-cream-soft disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDown(originalIndex)}
                            disabled={isLast}
                            aria-label={`Move "${t.title}" down`}
                            className="p-1.5 text-ink hover:bg-cream-soft border-l border-ink/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          aria-label={`Remove "${t.title}" from collection`}
                          className="inline-flex min-h-[32px] min-w-[32px] items-center justify-center border border-ink/20 text-ink-muted hover:text-red-700 hover:border-red-600 transition-colors"
                          title="Remove from collection"
                        >
                          <BookmarkX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <TrackRow
                      track={t}
                      index={originalIndex}
                      accentColor={mood?.accent || '#8067E8'}
                      variant="compact"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Edit Modal */}
        <CreateCollectionModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleUpdate}
          initialData={collection}
        />
      </article>
    </MainLayout>
  );
}
