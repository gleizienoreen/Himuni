import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FolderPlus,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';
import { useMood } from '../hooks/useMood';
import { useCollections } from '../hooks/useCollections';
import { MOODS } from '../data/moods';
import { MainLayout } from '../layouts/MainLayout';
import { CollectionCard } from '../components/collections/CollectionCard';
import { CreateCollectionModal } from '../components/collections/CreateCollectionModal';

export function CollectionsPage() {
  const { selectedMood } = useMood();
  const {
    collections,
    createCollection,
    updateCollection,
    duplicateCollection,
    deleteCollection,
  } = useCollections();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodId, setSelectedMoodId] = useState('all');
  const [sortOption, setSortOption] = useState('newest'); // newest | oldest | items | alphabetical

  const [modalOpen, setModalOpen] = useState(false);
  const [collectionToEdit, setCollectionToEdit] = useState(null);

  // Filtered & sorted collections
  const filteredCollections = useMemo(() => {
    let result = [...collections];

    // Search query: match title or description
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }

    // Mood filter
    if (selectedMoodId !== 'all') {
      result = result.filter((c) => c.moodId === selectedMoodId);
    }

    // Sort
    result.sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      }
      if (sortOption === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortOption === 'items') {
        const countA = Array.isArray(a.items) ? a.items.length : 0;
        const countB = Array.isArray(b.items) ? b.items.length : 0;
        return countB - countA;
      }
      if (sortOption === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [collections, searchQuery, selectedMoodId, sortOption]);

  const handleOpenCreateModal = () => {
    setCollectionToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (col) => {
    setCollectionToEdit(col);
    setModalOpen(true);
  };

  const handleSaveCollection = (data) => {
    if (collectionToEdit) {
      updateCollection(collectionToEdit.id, data);
    } else {
      createCollection(data);
    }
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedMoodId !== 'all';

  return (
    <MainLayout activeMood={selectedMood}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24">
        {/* Editorial Header */}
        <header className="mb-10 sm:mb-14 border-b border-ink/20 pb-8 sm:pb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wideLabel text-ink-muted">
                <Layers className="w-4 h-4 text-violet-deep" aria-hidden="true" />
                <span>Personal Archives</span>
                <span className="text-ink/30">•</span>
                <span className="font-baybayin text-sm" aria-label="Himuni Baybayin">
                  ᜑᜒᜋᜓᜈᜒ
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink leading-[1.05]">
                My Collections
              </h1>

              <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-serif italic max-w-xl">
                Every feeling has a sound. Curate your emotional soundscapes, Audius discoveries,
                and sonic archives into thoughtful personal collections.
              </p>
            </div>

            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="inline-flex min-h-[48px] items-center gap-2.5 bg-ink text-cream px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wideLabel hover:bg-violet-deep transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Create Collection</span>
              </button>
            </div>
          </div>

          {/* Filter, Search & Sort Bar */}
          <div className="mt-8 pt-6 border-t border-ink/10 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collections by title or note..."
                aria-label="Search collections"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-cream-soft border border-ink/20 focus:border-ink focus:outline-none transition-colors"
              />
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Mood Filter */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="collections-mood-filter"
                  className="text-xs uppercase tracking-wideLabel font-semibold text-ink-muted whitespace-nowrap"
                >
                  Mood:
                </label>
                <select
                  id="collections-mood-filter"
                  value={selectedMoodId}
                  onChange={(e) => setSelectedMoodId(e.target.value)}
                  className="px-3 py-2 text-xs sm:text-sm bg-cream-soft border border-ink/20 focus:border-ink focus:outline-none transition-colors"
                >
                  <option value="all">All Moods</option>
                  {MOODS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.baybayin})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="collections-sort"
                  className="text-xs uppercase tracking-wideLabel font-semibold text-ink-muted whitespace-nowrap"
                >
                  Sort:
                </label>
                <select
                  id="collections-sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-3 py-2 text-xs sm:text-sm bg-cream-soft border border-ink/20 focus:border-ink focus:outline-none transition-colors"
                >
                  <option value="newest">Recently Updated</option>
                  <option value="oldest">Oldest First</option>
                  <option value="items">Most Items</option>
                  <option value="alphabetical">Alphabetical (A–Z)</option>
                </select>
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedMoodId('all');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs border border-ink/20 hover:border-ink text-ink-muted hover:text-ink transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Collections Gallery or Empty State */}
        {collections.length === 0 ? (
          /* Empty Initial State */
          <div className="border border-dashed border-ink/30 p-12 sm:p-16 text-center max-w-2xl mx-auto my-12 bg-cream-soft/50">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-ink/20 bg-cream">
              <FolderPlus className="w-8 h-8 text-violet-deep" aria-hidden="true" />
            </div>

            <div className="font-baybayin text-2xl text-ink-subtle mb-2">ᜑᜒᜋᜓᜈᜒ</div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-3">
              Your sound archive is waiting
            </h2>
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-serif italic mb-8 max-w-md mx-auto">
              Start building your personal library. Organize Audius tracks and HIMUNI soundscapes
              by emotion, atmosphere, and meaningful moments.
            </p>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex min-h-[44px] items-center gap-2 bg-ink text-cream px-6 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wideLabel hover:bg-violet-deep transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Create your first collection</span>
            </button>
          </div>
        ) : filteredCollections.length === 0 ? (
          /* Filtered No Matches */
          <div className="border border-dashed border-ink/25 p-12 text-center max-w-xl mx-auto my-12">
            <Sparkles className="w-8 h-8 text-ink-subtle mx-auto mb-4" aria-hidden="true" />
            <h3 className="font-display text-xl font-bold text-ink mb-2">
              No matching collections
            </h3>
            <p className="text-sm text-ink-muted mb-6">
              No collections found matching "{searchQuery}" in the selected mood filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedMoodId('all');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-ink text-xs font-semibold uppercase tracking-wide hover:bg-ink hover:text-cream transition-colors"
            >
              <span>Clear filters</span>
            </button>
          </div>
        ) : (
          /* Responsive Collections Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence>
              {filteredCollections.map((col) => (
                <motion.div
                  key={col.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <CollectionCard
                    collection={col}
                    onEdit={handleOpenEditModal}
                    onDuplicate={duplicateCollection}
                    onDelete={deleteCollection}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      <CreateCollectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCollection}
        initialData={collectionToEdit}
      />
    </MainLayout>
  );
}
