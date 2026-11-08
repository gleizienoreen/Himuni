import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { MOODS } from '../data/moods';
import { usePostcards } from '../hooks/usePostcards';
import { useMood } from '../hooks/useMood';
import { MainLayout } from '../layouts/MainLayout';
import { EditorialReveal } from '../components/common/EditorialReveal';
import { PostcardCard } from '../components/postcards/PostcardCard';
import { PostcardPreviewModal } from '../components/postcards/PostcardPreviewModal';
import { exportPostcardAsPng } from '../services/postcards/postcardExport';

export function PostcardsPage() {
  const { selectedMood } = useMood();
  const { postcards, remove, duplicate } = usePostcards();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest'

  const [previewingPostcard, setPreviewingPostcard] = useState(null);
  const [exportNotice, setExportNotice] = useState(null); // { message, type }

  const handleExport = async (postcard) => {
    setExportNotice({ message: `Exporting "${postcard.title}"...`, type: 'info' });
    try {
      const res = await exportPostcardAsPng(postcard);
      if (res.success) {
        setExportNotice({ message: `Exported "${postcard.title}" to ${res.filename}`, type: 'success' });
        setTimeout(() => setExportNotice(null), 4000);
      } else {
        setExportNotice({ message: res.error || 'Export could not complete', type: 'error' });
      }
    } catch (err) {
      setExportNotice({ message: err?.message || 'Export error occurred', type: 'error' });
    }
  };

  const filteredPostcards = useMemo(() => {
    let list = [...postcards];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const titleMatch = p.title?.toLowerCase().includes(q);
        const noteMatch = p.note?.toLowerCase().includes(q);
        const trackTitleMatch = p.featuredTrack?.titleSnapshot?.toLowerCase().includes(q);
        const artistMatch = p.featuredTrack?.artistSnapshot?.toLowerCase().includes(q);
        return titleMatch || noteMatch || trackTitleMatch || artistMatch;
      });
    }

    if (selectedMoodFilter !== 'all') {
      list = list.filter((p) => p.moodId === selectedMoodFilter);
    }

    list.sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return list;
  }, [postcards, searchQuery, selectedMoodFilter, sortBy]);

  return (
    <MainLayout activeMood={selectedMood}>
      <section className="py-12 sm:py-16 lg:py-20 bg-cream">
        <div className="mx-auto max-w-editorial px-5 sm:px-8 lg:px-12">
          {/* Header Block */}
          <EditorialReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-ink/15 items-end">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wideLabel text-ink-muted">
                <Sparkles className="w-3.5 h-3.5 text-ink" aria-hidden="true" />
                <span>Sound Postcards &middot; Tangible Memories</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-editorial leading-[1.06] text-ink">
                Little keepsakes of sound and thought.
              </h1>
              <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-2xl">
                Pair a discovered melody with personal words, expressive geometry, and
                color. Sound Postcards let you frame how a moment felt and export it to keep.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Link
                to="/postcards/new"
                className="inline-flex min-h-[44px] items-center gap-2 bg-ink text-cream px-6 py-3 text-xs uppercase tracking-wideLabel font-semibold hover:bg-ink-soft transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Create Postcard</span>
              </Link>
            </div>
          </EditorialReveal>

          {/* Feedback banner */}
          {exportNotice && (
            <div
              role="status"
              className={`mt-6 p-4 border text-xs flex items-center justify-between gap-3 ${
                exportNotice.type === 'error'
                  ? 'bg-red-50 border-red-300 text-red-900'
                  : exportNotice.type === 'success'
                  ? 'bg-green-50 border-green-300 text-green-900'
                  : 'bg-cream-soft border-ink/20 text-ink'
              }`}
            >
              <span>{exportNotice.message}</span>
              <button
                type="button"
                onClick={() => setExportNotice(null)}
                className="underline uppercase font-semibold text-[11px]"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Controls Bar: Search, Mood Filter, Sort */}
          <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-ink/15">
            <div className="flex flex-1 items-center gap-3 max-w-md border border-ink/25 bg-cream-soft px-3 py-2">
              <Search className="w-4 h-4 text-ink-muted shrink-0" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search postcards by title, track, or note..."
                aria-label="Search postcards"
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Mood Filter */}
              <div className="flex items-center gap-2">
                <span className="text-ink-muted">Mood:</span>
                <select
                  value={selectedMoodFilter}
                  onChange={(e) => setSelectedMoodFilter(e.target.value)}
                  aria-label="Filter postcards by mood"
                  className="bg-cream-soft border border-ink/25 px-2.5 py-1.5 text-xs text-ink font-medium focus:outline-none"
                >
                  <option value="all">All Moods ({postcards.length})</option>
                  {MOODS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-2">
                <span className="text-ink-muted">Order:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort postcards"
                  className="bg-cream-soft border border-ink/25 px-2.5 py-1.5 text-xs text-ink font-medium focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Postcards Gallery or Empty State */}
          <div className="mt-10">
            {postcards.length === 0 ? (
              <div className="border border-ink/20 bg-cream-soft/60 p-10 sm:p-14 text-center max-w-2xl mx-auto space-y-5">
                <div className="w-12 h-12 mx-auto rounded-full bg-cream-deep flex items-center justify-center text-ink">
                  <Sparkles className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-semibold text-ink">
                    Your Postcard Gallery is Empty
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed max-w-md mx-auto">
                    Create your first Sound Postcard by pairing an Audius track with your own
                    words, mood colors, and editorial layouts.
                  </p>
                </div>
                <Link
                  to="/postcards/new"
                  className="inline-flex min-h-[44px] items-center gap-2 bg-ink text-cream px-6 py-3 text-xs font-semibold uppercase tracking-wideLabel hover:bg-ink-soft transition-colors"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Create Your First Postcard</span>
                </Link>
              </div>
            ) : filteredPostcards.length === 0 ? (
              <div className="border border-ink/15 bg-cream-soft p-8 text-center max-w-md mx-auto space-y-3">
                <p className="text-sm text-ink-muted">
                  No postcards match your search or filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedMoodFilter('all');
                  }}
                  className="text-xs uppercase tracking-wideLabel font-semibold text-ink underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {filteredPostcards.map((card) => (
                  <PostcardCard
                    key={card.id}
                    postcard={card}
                    onPreview={(p) => setPreviewingPostcard(p)}
                    onDuplicate={(id) => duplicate(id)}
                    onDelete={(id) => remove(id)}
                    onExport={(p) => handleExport(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Preview Modal */}
      {previewingPostcard && (
        <PostcardPreviewModal
          postcard={previewingPostcard}
          onClose={() => setPreviewingPostcard(null)}
          onExport={(p) => handleExport(p)}
        />
      )}
    </MainLayout>
  );
}
