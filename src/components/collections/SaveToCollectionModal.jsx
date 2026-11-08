import React, { useEffect, useState } from 'react';
import {
  Check,
  Folder,
  FolderPlus,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';
import { useCollections } from '../../hooks/useCollections';
import { MOODS } from '../../data/moods';
import { COLLECTION_THEMES } from '../../data/collectionThemes';

/**
 * Modal dialog that allows saving a Track or Soundscape to one or more
 * personal collections, with duplicate prevention and quick inline collection creation.
 */
export function SaveToCollectionModal({
  isOpen,
  onClose,
  track = null,
  soundscape = null,
}) {
  const { collections, addItem, createCollection } = useCollections();

  const [feedback, setFeedback] = useState(null); // { message, type: 'success' | 'warn' }
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColMood, setNewColMood] = useState('calm');
  const [nameError, setNameError] = useState('');

  // Determine item representation
  const itemType = track ? 'track' : soundscape ? 'soundscape' : null;
  const itemId = track ? track.id : soundscape ? soundscape.id : null;
  const itemTitle = track ? track.title : soundscape ? soundscape.title : '';
  const itemSubtitle = track
    ? track.artistName
    : soundscape
    ? soundscape.soundFocus
    : '';

  useEffect(() => {
    if (isOpen) {
      setFeedback(null);
      setShowCreateForm(collections.length === 0);
      setNewColName('');
      setNameError('');
    }
  }, [isOpen, collections.length]);

  if (!isOpen || !itemType) return null;

  // Build normalized item payload for collectionStorage
  const buildItemPayload = () => {
    if (track) {
      return {
        type: 'track',
        provider: 'audius',
        providerId: String(track.id),
        snapshot: {
          id: track.id,
          title: track.title,
          artistName: track.artistName,
          artistUrl: track.artistUrl || null,
          artworkUrl: track.artworkUrl || null,
          duration: track.duration || 0,
          genre: track.genre || '',
          mood: track.mood || '',
          trackUrl: track.trackUrl || null,
          streamUrl: track.streamUrl || null,
          isStreamGated: !!track.isStreamGated,
        },
      };
    }
    if (soundscape) {
      return {
        type: 'soundscape',
        provider: 'himuni',
        providerId: String(soundscape.id),
        snapshot: {
          id: soundscape.id,
          title: soundscape.title,
          description: soundscape.description,
          moodIds: soundscape.moodIds || [],
          moodLabel: soundscape.moodLabel || '',
          soundFocus: soundscape.soundFocus || '',
          palette: soundscape.palette || {},
        },
      };
    }
    return null;
  };

  const handleAddToCollection = (col) => {
    const payload = buildItemPayload();
    if (!payload) return;

    const res = addItem(col.id, payload);
    if (res.success) {
      setFeedback({
        message: `Added to "${col.name}"`,
        type: 'success',
      });
      setTimeout(() => setFeedback(null), 3000);
    } else if (res.isDuplicate) {
      setFeedback({
        message: `Already in "${col.name}"`,
        type: 'warn',
      });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleCreateAndAdd = (e) => {
    e.preventDefault();
    if (!newColName.trim()) {
      setNameError('Collection name is required.');
      return;
    }

    const payload = buildItemPayload();
    const newCol = createCollection({
      name: newColName.trim(),
      description: '',
      moodId: newColMood,
      coverThemeId: 'warm-cream',
    });

    if (newCol && payload) {
      addItem(newCol.id, payload);
      setFeedback({
        message: `Created "${newCol.name}" and added item!`,
        type: 'success',
      });
      setShowCreateForm(false);
      setNewColName('');
      setNameError('');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-collection-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg border border-ink bg-cream p-6 sm:p-7 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-ink/15 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wideLabel text-ink-muted">
              <Folder className="w-3.5 h-3.5 text-violet-deep" aria-hidden="true" />
              <span>Personal Collections</span>
            </div>
            <h2
              id="save-collection-title"
              className="font-display text-2xl font-bold tracking-tight text-ink mt-1"
            >
              Save to Collection
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted truncate max-w-sm mt-0.5">
              <span className="font-semibold text-ink">{itemTitle}</span>
              {itemSubtitle && <span> &middot; {itemSubtitle}</span>}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-ink-muted hover:text-ink hover:bg-cream-soft transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            role="status"
            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide flex items-center gap-2 border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-amber-50 text-amber-900 border-amber-300'
            }`}
          >
            <Check className="w-4 h-4" aria-hidden="true" />
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Existing Collections List */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {collections.length === 0 && !showCreateForm ? (
            <div className="text-center py-6 text-sm text-ink-muted">
              <p>You don't have any collections yet.</p>
            </div>
          ) : (
            collections.map((col) => {
              const count = Array.isArray(col.items) ? col.items.length : 0;
              const isAlreadyPresent = (col.items || []).some(
                (it) => it.type === itemType && String(it.providerId) === String(itemId)
              );

              return (
                <div
                  key={col.id}
                  className="flex items-center justify-between gap-3 p-3 border border-ink/15 bg-cream-soft hover:border-ink transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-semibold text-ink truncate">
                      {col.name}
                    </p>
                    <p className="text-[11px] text-ink-subtle">
                      {count} {count === 1 ? 'item' : 'items'} &middot; Mood: {col.moodId}
                    </p>
                  </div>

                  <div>
                    {isAlreadyPresent ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-muted bg-cream border border-ink/20">
                        <Check className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                        <span>Saved</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddToCollection(col)}
                        className="inline-flex min-h-[34px] items-center gap-1.5 px-3 py-1 bg-ink text-cream hover:bg-violet-deep text-xs font-semibold uppercase tracking-wideLabel transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Inline Creation Form or Toggle */}
        <div className="pt-2 border-t border-ink/15">
          {!showCreateForm ? (
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="inline-flex min-h-[38px] items-center gap-2 text-xs font-semibold uppercase tracking-wideLabel text-ink hover:text-violet-deep transition-colors"
            >
              <FolderPlus className="w-4 h-4" aria-hidden="true" />
              <span>+ Create New Collection</span>
            </button>
          ) : (
            <form onSubmit={handleCreateAndAdd} className="space-y-3 bg-cream-soft p-3.5 border border-ink/20">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wideLabel text-ink">
                <span>New Collection</span>
                {collections.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="text-ink-muted hover:text-ink text-[11px] underline"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div>
                <input
                  type="text"
                  value={newColName}
                  onChange={(e) => {
                    setNewColName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  placeholder="Collection name (e.g. Midnight Reflections)"
                  autoFocus
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-cream border border-ink/25 focus:border-ink focus:outline-none"
                />
                {nameError && (
                  <p className="text-[11px] text-red-600 pt-1 font-medium">{nameError}</p>
                )}
              </div>

              <div className="flex items-center justify-between gap-2">
                <select
                  value={newColMood}
                  onChange={(e) => setNewColMood(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-cream border border-ink/25 focus:border-ink focus:outline-none"
                >
                  {MOODS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.baybayin})
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="inline-flex min-h-[34px] items-center gap-1.5 px-4 py-1.5 bg-ink text-cream hover:bg-violet-deep text-xs font-semibold uppercase tracking-wideLabel transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Create & Add</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Done */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-ink/20 hover:border-ink text-xs font-semibold uppercase tracking-wideLabel text-ink hover:bg-cream-soft transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
