import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Check,
  Disc3,
  Folder,
  Music,
  Plus,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { MOODS } from '../../data/moods';
import { SOUNDSCAPES } from '../../data/soundscapes';
import { getLocalTodayDateString } from '../../services/memories/memoryStorage';
import { usePostcards } from '../../hooks/usePostcards';
import { useCollections } from '../../hooks/useCollections';
import { PostcardTrackPickerModal } from '../postcards/PostcardTrackPickerModal';

export function CreateMemoryModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}) {
  const { postcards } = usePostcards();
  const { collections } = useCollections();

  // Curate saved tracks from collections for instant attachment
  const collectionTracks = React.useMemo(() => {
    const list = [];
    const seen = new Set();
    collections.forEach((c) => {
      (c.items || []).forEach((it) => {
        if (it.type === 'track' && it.snapshot && !seen.has(it.providerId)) {
          seen.add(it.providerId);
          list.push({ ...it.snapshot, collectionName: c.name });
        }
      });
    });
    return list;
  }, [collections]);

  const [title, setTitle] = useState('');
  const [moodId, setMoodId] = useState('dreamy');
  const [energy, setEnergy] = useState(50);
  const [entryDate, setEntryDate] = useState(getLocalTodayDateString());
  const [note, setNote] = useState('');

  // Attached references
  const [attachedTrack, setAttachedTrack] = useState(null);
  const [attachedSoundscapeId, setAttachedSoundscapeId] = useState('');
  const [attachedPostcardId, setAttachedPostcardId] = useState('');
  const [attachedCollectionId, setAttachedCollectionId] = useState('');

  const [trackPickerOpen, setTrackPickerOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '');
        setMoodId(initialData.moodId || 'dreamy');
        setEnergy(typeof initialData.energy === 'number' ? initialData.energy : 50);
        setEntryDate(initialData.entryDate || getLocalTodayDateString());
        setNote(initialData.note || '');

        const refs = initialData.references || {};
        setAttachedTrack(refs.trackSnapshot || (refs.trackId ? { id: refs.trackId } : null));
        setAttachedSoundscapeId(refs.soundscapeId || '');
        setAttachedPostcardId(refs.postcardId || '');
        setAttachedCollectionId(refs.collectionId || '');
      } else {
        setTitle('');
        setMoodId('dreamy');
        setEnergy(50);
        setEntryDate(getLocalTodayDateString());
        setNote('');
        setAttachedTrack(null);
        setAttachedSoundscapeId('');
        setAttachedPostcardId('');
        setAttachedCollectionId('');
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!moodId) errs.moodId = 'Mood selection is required.';
    if (!entryDate) errs.entryDate = 'Date is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Build snapshot metadata for attached soundscape / postcard / collection
    let soundscapeSnapshot = null;
    if (attachedSoundscapeId) {
      const s = SOUNDSCAPES.find((item) => item.id === attachedSoundscapeId);
      if (s) {
        soundscapeSnapshot = {
          id: s.id,
          title: s.title,
          moodLabel: s.moodLabel,
          soundFocus: s.soundFocus,
        };
      }
    }

    let postcardSnapshot = null;
    if (attachedPostcardId) {
      const p = postcards.find((item) => item.id === attachedPostcardId);
      if (p) {
        postcardSnapshot = {
          id: p.id,
          title: p.title,
          themeId: p.themeId,
        };
      }
    }

    let collectionSnapshot = null;
    if (attachedCollectionId) {
      const c = collections.find((item) => item.id === attachedCollectionId);
      if (c) {
        collectionSnapshot = {
          id: c.id,
          name: c.name,
          moodId: c.moodId,
        };
      }
    }

    onSave({
      title,
      moodId,
      energy,
      entryDate,
      note,
      references: {
        trackId: attachedTrack?.id || null,
        trackSnapshot: attachedTrack || null,
        soundscapeId: attachedSoundscapeId || null,
        soundscapeSnapshot,
        postcardId: attachedPostcardId || null,
        postcardSnapshot,
        collectionId: attachedCollectionId || null,
        collectionSnapshot,
      },
    });

    onClose();
  };

  const handleTrackSelect = (track) => {
    setAttachedTrack({
      id: track.id,
      title: track.title,
      artistName: track.artistName,
      artistUrl: track.artistUrl || null,
      artworkUrl: track.artworkUrl || null,
      duration: track.duration || 0,
      trackUrl: track.trackUrl || null,
      genre: track.genre || '',
    });
    setTrackPickerOpen(false);
  };

  const isEditing = Boolean(initialData);

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-memory-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-xs overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="w-full max-w-2xl border border-ink bg-cream p-6 sm:p-8 shadow-2xl my-8 space-y-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-ink/15 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wideLabel text-ink-muted">
                <span>Personal Journal</span>
                <span className="text-ink/30">•</span>
                <span className="font-baybayin text-sm">ᜑᜒᜋᜓᜈᜒ</span>
              </div>
              <h2
                id="create-memory-modal-title"
                className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink mt-1"
              >
                {isEditing ? 'Edit Mood Memory' : 'Record Mood Memory'}
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted font-serif italic mt-0.5">
                Keep a personal record of how you felt, and optionally link the sounds around you.
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Mood Selection (Required) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wideLabel text-ink">
                Mood Territory <span className="text-red-700">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MOODS.map((m) => {
                  const isSelected = moodId === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setMoodId(m.id);
                        if (errors.moodId) setErrors((prev) => ({ ...prev, moodId: null }));
                      }}
                      className={`p-2.5 border text-left flex items-center justify-between gap-1.5 transition-colors ${
                        isSelected
                          ? 'border-ink bg-cream-soft ring-1 ring-ink font-semibold'
                          : 'border-ink/20 bg-cream hover:border-ink'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 rounded-full border border-ink/20 shrink-0"
                          style={{ backgroundColor: m.accent }}
                        />
                        <span className="text-xs truncate">{m.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
              {errors.moodId && (
                <p className="text-xs text-red-700 font-medium">{errors.moodId}</p>
              )}
            </div>

            {/* 2. Date (Required) & Energy Slider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="memory-date"
                  className="block text-xs font-semibold uppercase tracking-wideLabel text-ink"
                >
                  Entry Date <span className="text-red-700">*</span>
                </label>
                <input
                  id="memory-date"
                  type="date"
                  value={entryDate}
                  onChange={(e) => {
                    setEntryDate(e.target.value);
                    if (errors.entryDate) setErrors((prev) => ({ ...prev, entryDate: null }));
                  }}
                  className="w-full px-3 py-2 text-sm bg-cream-soft border border-ink/25 focus:border-ink focus:outline-none"
                />
                {errors.entryDate && (
                  <p className="text-xs text-red-700 font-medium">{errors.entryDate}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="memory-energy"
                    className="block text-xs font-semibold uppercase tracking-wideLabel text-ink-muted"
                  >
                    Energy Level <span className="text-ink-subtle">(Optional)</span>
                  </label>
                  <span className="text-xs font-mono font-semibold">{energy}%</span>
                </div>
                <input
                  id="memory-energy"
                  type="range"
                  min={0}
                  max={100}
                  value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  className="himuni-range w-full"
                />
              </div>
            </div>

            {/* 3. Title (Optional) */}
            <div className="space-y-1.5">
              <label
                htmlFor="memory-title"
                className="block text-xs font-semibold uppercase tracking-wideLabel text-ink-muted"
              >
                Memory Title <span className="text-ink-subtle">(Optional)</span>
              </label>
              <input
                id="memory-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Somewhere Between Midnight and Morning"
                className="w-full px-3 py-2 text-sm bg-cream-soft border border-ink/25 focus:border-ink focus:outline-none placeholder:text-ink-subtle"
              />
            </div>

            {/* 4. Reflection Note (Optional) */}
            <div className="space-y-1.5">
              <label
                htmlFor="memory-note"
                className="block text-xs font-semibold uppercase tracking-wideLabel text-ink-muted"
              >
                Personal Reflection <span className="text-ink-subtle">(Optional)</span>
              </label>
              <textarea
                id="memory-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What did this moment feel like? Not every feeling needs words, but you can keep them here."
                className="w-full px-3 py-2 text-sm bg-cream-soft border border-ink/25 focus:border-ink focus:outline-none placeholder:text-ink-subtle font-serif italic"
              />
            </div>

            {/* 5. Optional Reference Attachments (Track, Soundscape, Postcard, Collection) */}
            <div className="pt-2 border-t border-ink/15 space-y-3">
              <span className="block text-xs font-semibold uppercase tracking-wideLabel text-ink">
                Attached Content <span className="text-ink-subtle">(Optional)</span>
              </span>

              {/* Attach Track */}
              <div className="flex items-center justify-between gap-3 p-3 border border-ink/15 bg-cream-soft">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Music className="w-4 h-4 text-violet-deep shrink-0" aria-hidden="true" />
                  <div className="min-w-0 text-xs">
                    {attachedTrack ? (
                      <div>
                        <p className="font-semibold text-ink truncate">{attachedTrack.title}</p>
                        <p className="text-ink-muted truncate">by {attachedTrack.artistName}</p>
                      </div>
                    ) : (
                      <span className="text-ink-muted italic">No track attached</span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {attachedTrack ? (
                    <button
                      type="button"
                      onClick={() => setAttachedTrack(null)}
                      className="text-xs text-red-700 underline font-medium"
                    >
                      Remove
                    </button>
                  ) : (
                    <>
                      {collectionTracks.length > 0 && (
                        <select
                          onChange={(e) => {
                            const found = collectionTracks.find((t) => String(t.id) === e.target.value);
                            if (found) handleTrackSelect(found);
                          }}
                          defaultValue=""
                          aria-label="Select track from your collections"
                          className="px-2 py-1 text-xs bg-cream border border-ink/20 focus:border-ink focus:outline-none max-w-[140px] truncate"
                        >
                          <option value="" disabled>From Collection...</option>
                          {collectionTracks.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.title}
                            </option>
                          ))}
                        </select>
                      )}

                      <button
                        type="button"
                        onClick={() => setTrackPickerOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream border border-ink/20 hover:border-ink text-xs font-semibold uppercase tracking-wideLabel text-ink transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Search Audius</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Attach Soundscape */}
              <div className="flex items-center justify-between gap-3 p-3 border border-ink/15 bg-cream-soft">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Disc3 className="w-4 h-4 text-tangerine shrink-0" aria-hidden="true" />
                  <div className="min-w-0 text-xs">
                    <label htmlFor="memory-attach-soundscape" className="text-ink font-semibold">
                      Soundscape:
                    </label>
                  </div>
                </div>

                <select
                  id="memory-attach-soundscape"
                  value={attachedSoundscapeId}
                  onChange={(e) => setAttachedSoundscapeId(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-cream border border-ink/25 focus:border-ink focus:outline-none max-w-xs truncate"
                >
                  <option value="">None</option>
                  {SOUNDSCAPES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.moodLabel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Attach Postcard or Collection (if user has any saved) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Postcard selection */}
                <div className="flex items-center justify-between gap-2 p-2.5 border border-ink/15 bg-cream-soft text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-ink">
                    <Sparkles className="w-3.5 h-3.5 text-butter-yellow" aria-hidden="true" />
                    <span>Postcard:</span>
                  </span>
                  <select
                    value={attachedPostcardId}
                    onChange={(e) => setAttachedPostcardId(e.target.value)}
                    className="px-2 py-1 text-xs bg-cream border border-ink/25 focus:border-ink focus:outline-none max-w-[150px] truncate"
                  >
                    <option value="">None</option>
                    {postcards.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Collection selection */}
                <div className="flex items-center justify-between gap-2 p-2.5 border border-ink/15 bg-cream-soft text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-ink">
                    <Folder className="w-3.5 h-3.5 text-sky-blue" aria-hidden="true" />
                    <span>Collection:</span>
                  </span>
                  <select
                    value={attachedCollectionId}
                    onChange={(e) => setAttachedCollectionId(e.target.value)}
                    className="px-2 py-1 text-xs bg-cream border border-ink/25 focus:border-ink focus:outline-none max-w-[150px] truncate"
                  >
                    <option value="">None</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-ink/15 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-ink/20 hover:border-ink text-xs font-semibold uppercase tracking-wideLabel text-ink hover:bg-cream-soft transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex min-h-[42px] items-center gap-2 bg-ink text-cream px-6 py-2.5 text-xs font-semibold uppercase tracking-wideLabel hover:bg-violet-deep transition-colors shadow-sm"
              >
                <span>{isEditing ? 'Save Changes' : 'Record Memory'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Audius Track Picker Modal */}
      {trackPickerOpen && (
        <PostcardTrackPickerModal
          isOpen={trackPickerOpen}
          onClose={() => setTrackPickerOpen(false)}
          onSelectTrack={handleTrackSelect}
        />
      )}
    </>
  );
}
