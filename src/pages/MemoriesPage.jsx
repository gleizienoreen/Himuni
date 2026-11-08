import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';
import { MOODS } from '../data/moods';
import { useMood } from '../hooks/useMood';
import { useMemories } from '../hooks/useMemories';
import { MainLayout } from '../layouts/MainLayout';
import { MemoryCard } from '../components/memories/MemoryCard';
import { MoodCalendar } from '../components/memories/MoodCalendar';
import { ListeningHistorySection } from '../components/memories/ListeningHistorySection';
import { PersonalInsightsSection } from '../components/memories/PersonalInsightsSection';
import { CreateMemoryModal } from '../components/memories/CreateMemoryModal';

export function MemoriesPage({
  extraSections = null,
  activeView = 'timeline', // 'timeline' | 'calendar' | 'history' | 'insights' | 'privacy'
  onViewChange = null,
}) {
  const { selectedMood, energy } = useMood();
  const location = useLocation();
  const { memories, createMemory, updateMemory, deleteMemory } = useMemories();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest'
  const [selectedDateFilter, setSelectedDateFilter] = useState(null);
  const [currentTab, setCurrentTab] = useState(activeView || 'timeline');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);

  // Pre-fill memory modal if track/soundscape passed via navigation state
  useEffect(() => {
    if (location.state?.track) {
      setEditingMemory({
        title: `${location.state.track.title} — Memory`,
        moodId: location.state.moodId || selectedMood?.id || 'dreamy',
        energy: typeof energy === 'number' ? energy : 50,
        references: {
          trackId: location.state.track.id,
          trackSnapshot: location.state.track,
        },
      });
      setModalOpen(true);
    } else if (location.state?.soundscape) {
      setEditingMemory({
        title: `${location.state.soundscape.title} — Memory`,
        moodId: location.state.soundscape.moodIds?.[0] || selectedMood?.id || 'dreamy',
        energy: typeof energy === 'number' ? energy : 50,
        references: {
          soundscapeId: location.state.soundscape.id,
          soundscapeSnapshot: location.state.soundscape,
        },
      });
      setModalOpen(true);
    }
  }, [location.state, selectedMood, energy]);

  // Filtered and sorted memories
  const filteredMemories = useMemo(() => {
    let result = [...memories];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          (m.title && m.title.toLowerCase().includes(q)) ||
          (m.note && m.note.toLowerCase().includes(q)) ||
          (m.references?.trackSnapshot?.title &&
            m.references.trackSnapshot.title.toLowerCase().includes(q)) ||
          (m.references?.trackSnapshot?.artistName &&
            m.references.trackSnapshot.artistName.toLowerCase().includes(q))
      );
    }

    if (selectedMoodFilter !== 'all') {
      result = result.filter((m) => m.moodId === selectedMoodFilter);
    }

    if (selectedDateFilter) {
      result = result.filter((m) => m.entryDate === selectedDateFilter);
    }

    result.sort((a, b) => {
      const dateA = a.entryDate || '';
      const dateB = b.entryDate || '';
      if (dateA !== dateB) {
        return sortBy === 'newest'
          ? dateB.localeCompare(dateA)
          : dateA.localeCompare(dateB);
      }
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [memories, searchQuery, selectedMoodFilter, selectedDateFilter, sortBy]);

  const handleOpenCreate = () => {
    setEditingMemory(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (mem) => {
    setEditingMemory(mem);
    setModalOpen(true);
  };

  const handleSaveMemory = (data) => {
    if (editingMemory) {
      updateMemory(editingMemory.id, data);
    } else {
      createMemory(data);
    }
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedMoodFilter !== 'all' ||
    Boolean(selectedDateFilter);

  return (
    <MainLayout activeMood={selectedMood}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24 font-sans text-ink">
        {/* Editorial Journal Header */}
        <header className="mb-10 sm:mb-12 border-b border-ink/20 pb-8 sm:pb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wideLabel text-ink-muted">
                <BookOpen className="w-4 h-4 text-violet-deep" aria-hidden="true" />
                <span>Personal Journal</span>
                <span className="text-ink/30">•</span>
                <span className="font-baybayin text-sm" aria-label="Himuni Baybayin">
                  ᜑᜒᜋᜓᜈᜒ
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink leading-[1.05]">
                Little moments, kept in sound.
              </h1>

              <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-serif italic max-w-xl">
                A personal collection of the moods, music, and moments you want to remember.
              </p>
            </div>

            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex min-h-[48px] items-center gap-2.5 bg-ink text-cream px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wideLabel hover:bg-violet-deep transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Record Memory</span>
              </button>
            </div>
          </div>

          {/* View switcher tabs: Timeline / Calendar */}
          <div className="mt-8 flex border-b border-ink/15 text-xs font-semibold uppercase tracking-wideLabel overflow-x-auto">
            <button
              type="button"
              onClick={() => setCurrentTab('timeline')}
              className={`py-3 px-5 border-b-2 transition-colors whitespace-nowrap ${
                currentTab === 'timeline'
                  ? 'border-ink text-ink font-bold bg-cream'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              Journal Timeline ({memories.length})
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('calendar')}
              className={`py-3 px-5 border-b-2 transition-colors whitespace-nowrap ${
                currentTab === 'calendar'
                  ? 'border-ink text-ink font-bold bg-cream'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              Mood Calendar
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('history')}
              className={`py-3 px-5 border-b-2 transition-colors whitespace-nowrap ${
                currentTab === 'history'
                  ? 'border-ink text-ink font-bold bg-cream'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              Listening History
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('insights')}
              className={`py-3 px-5 border-b-2 transition-colors whitespace-nowrap ${
                currentTab === 'insights'
                  ? 'border-ink text-ink font-bold bg-cream'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              Personal Insights
            </button>
          </div>

          {/* Section Sub-Navigation Tabs if provided */}
          {extraSections}

          {/* Filter, Search & Sort Controls Bar (Shown on Timeline tab) */}
          {currentTab === 'timeline' && (
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
                placeholder="Search reflections, titles, or tracks..."
                aria-label="Search memories"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-cream-soft border border-ink/20 focus:border-ink focus:outline-none transition-colors"
              />
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Mood Filter */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="memories-mood-filter"
                  className="text-xs uppercase tracking-wideLabel font-semibold text-ink-muted whitespace-nowrap"
                >
                  Mood:
                </label>
                <select
                  id="memories-mood-filter"
                  value={selectedMoodFilter}
                  onChange={(e) => setSelectedMoodFilter(e.target.value)}
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
                  htmlFor="memories-sort"
                  className="text-xs uppercase tracking-wideLabel font-semibold text-ink-muted whitespace-nowrap"
                >
                  Sort:
                </label>
                <select
                  id="memories-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-xs sm:text-sm bg-cream-soft border border-ink/20 focus:border-ink focus:outline-none transition-colors"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {/* Date Filter Badge if active */}
              {selectedDateFilter && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-ink text-cream text-xs">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{selectedDateFilter}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedDateFilter(null)}
                    className="ml-1 text-cream/70 hover:text-cream"
                    aria-label="Clear date filter"
                  >
                    ×
                  </button>
                </span>
              )}

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedMoodFilter('all');
                    setSelectedDateFilter(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs border border-ink/20 hover:border-ink text-ink-muted hover:text-ink transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
          )}
        </header>

        {/* Content based on Active Tab */}
        {currentTab === 'calendar' ? (
          <MoodCalendar
            memories={memories}
            selectedDate={selectedDateFilter}
            onSelectDate={setSelectedDateFilter}
            onEditMemory={handleOpenEdit}
            onDeleteMemory={deleteMemory}
            onCreateMemory={(date) => {
              setEditingMemory({ entryDate: date });
              setModalOpen(true);
            }}
          />
        ) : currentTab === 'history' ? (
          <ListeningHistorySection
            onCreateMemoryWithTrack={(track) => {
              setEditingMemory({
                title: `${track.title} — Memory`,
                moodId: selectedMood?.id || 'dreamy',
                energy: typeof energy === 'number' ? energy : 50,
                references: {
                  trackId: track.id,
                  trackSnapshot: track,
                },
              });
              setModalOpen(true);
            }}
          />
        ) : currentTab === 'insights' ? (
          <PersonalInsightsSection />
        ) : (
          /* Timeline Gallery or Empty State */
          memories.length === 0 ? (
          <div className="border border-dashed border-ink/30 p-12 sm:p-16 text-center max-w-2xl mx-auto my-12 bg-cream-soft/40">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-ink/20 bg-cream">
              <BookOpen className="w-8 h-8 text-violet-deep" aria-hidden="true" />
            </div>

            <div className="font-baybayin text-2xl text-ink-subtle mb-2">ᜑᜒᜋᜓᜈᜒ</div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-3">
              No mood memories recorded yet
            </h2>
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-serif italic mb-8 max-w-md mx-auto">
              Start your personal journal. Record the feelings, melodies, and quiet moments that
              matter to you—with or without an attached track.
            </p>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex min-h-[44px] items-center gap-2 bg-ink text-cream px-6 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wideLabel hover:bg-violet-deep transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Record your first memory</span>
            </button>
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="border border-dashed border-ink/25 p-12 text-center max-w-xl mx-auto my-12">
            <Sparkles className="w-8 h-8 text-ink-subtle mx-auto mb-4" aria-hidden="true" />
            <h3 className="font-display text-xl font-bold text-ink mb-2">
              No matching memories
            </h3>
            <p className="text-sm text-ink-muted mb-6">
              No memories match your active search or filter criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedMoodFilter('all');
                setSelectedDateFilter(null);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-ink text-xs font-semibold uppercase tracking-wide hover:bg-ink hover:text-cream transition-colors"
            >
              <span>Clear filters</span>
            </button>
          </div>
        ) : (
          /* Editorial Timeline */
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-ink-muted pb-2">
              <span className="uppercase tracking-wideLabel font-semibold">
                Chronological Entries ({filteredMemories.length})
              </span>
              <span>Local browser storage</span>
            </div>

            <div className="space-y-5">
              <AnimatePresence>
                {filteredMemories.map((mem) => (
                  <motion.div
                    key={mem.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                  >
                    <MemoryCard
                      memory={mem}
                      onEdit={handleOpenEdit}
                      onDelete={deleteMemory}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Create/Edit */}
      <CreateMemoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveMemory}
        initialData={editingMemory}
      />
    </MainLayout>
  );
}
