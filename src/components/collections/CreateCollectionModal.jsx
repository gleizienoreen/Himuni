import React, { useEffect, useState } from 'react';
import { Check, FolderPlus, Palette, X } from 'lucide-react';
import { MOODS } from '../../data/moods';
import { COLLECTION_THEMES } from '../../data/collectionThemes';

export function CreateCollectionModal({
  isOpen,
  onClose,
  onSave,
  initialCollection = null,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [moodId, setMoodId] = useState('calm');
  const [coverThemeId, setCoverThemeId] = useState('sky-blue');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialCollection) {
      setName(initialCollection.name || '');
      setDescription(initialCollection.description || '');
      setMoodId(initialCollection.moodId || 'calm');
      setCoverThemeId(initialCollection.coverThemeId || 'sky-blue');
    } else {
      setName('');
      setDescription('');
      setMoodId('calm');
      setCoverThemeId('sky-blue');
    }
    setError('');
  }, [initialCollection, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Collection name is required.');
      return;
    }

    const payload = {
      id: initialCollection?.id,
      name: name.trim(),
      description: description.trim(),
      moodId,
      coverThemeId,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-lg bg-cream border border-ink p-6 sm:p-7 space-y-5 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-ink/15 pb-3">
          <div className="space-y-0.5">
            <span className="text-[11px] uppercase tracking-wideLabel text-ink-muted">
              {initialCollection ? 'Edit Collection' : 'New Collection'}
            </span>
            <h3 id="collection-modal-title" className="font-display text-xl font-semibold text-ink">
              {initialCollection ? 'Update Collection Details' : 'Create Personal Collection'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex h-8 w-8 items-center justify-center border border-ink/20 hover:border-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Collection Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="collection-name"
            className="block text-xs font-semibold uppercase tracking-wideLabel text-ink"
          >
            Collection Name <span className="text-red-700">*</span>
          </label>
          <input
            id="collection-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. Soft Afternoons, Late Night Drift"
            className={`w-full border bg-cream-soft px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:outline-none ${
              error ? 'border-red-600 ring-1 ring-red-600' : 'border-ink/25'
            }`}
          />
          {error && (
            <p role="alert" className="text-xs text-red-700 font-medium">
              {error}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label
            htmlFor="collection-desc"
            className="block text-xs font-semibold uppercase tracking-wideLabel text-ink-muted"
          >
            Description <span className="text-ink-subtle">(Optional)</span>
          </label>
          <textarea
            id="collection-desc"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short note about the feeling, moments, or pacing of this collection..."
            className="w-full border border-ink/25 bg-cream-soft px-3.5 py-2 text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
          />
        </div>

        {/* Mood Association */}
        <div className="space-y-1.5">
          <label
            htmlFor="collection-mood"
            className="block text-xs font-semibold uppercase tracking-wideLabel text-ink-muted"
          >
            Mood Association
          </label>
          <select
            id="collection-mood"
            value={moodId}
            onChange={(e) => setMoodId(e.target.value)}
            className="w-full border border-ink/25 bg-cream-soft px-3 py-2 text-xs font-medium text-ink focus:outline-none"
          >
            {MOODS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} &middot; {m.description}
              </option>
            ))}
          </select>
        </div>

        {/* Cover Theme Palette */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wideLabel text-ink-muted flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Cover Color Theme</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {COLLECTION_THEMES.map((theme) => {
              const isSelected = coverThemeId === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setCoverThemeId(theme.id)}
                  style={{ backgroundColor: theme.color }}
                  className={`p-2 border text-left flex items-center justify-between text-xs transition-colors ${
                    isSelected ? 'border-ink ring-2 ring-ink font-semibold' : 'border-ink/20'
                  }`}
                >
                  <span className="truncate">{theme.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-3 border-t border-ink/15 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-ink-muted hover:text-ink underline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex min-h-[40px] items-center gap-2 bg-ink text-cream px-5 py-2 text-xs font-semibold uppercase tracking-wideLabel hover:bg-ink-soft transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            <span>{initialCollection ? 'Save Changes' : 'Create Collection'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
