import React, { useMemo } from 'react';
import {
  BarChart3,
  BookOpen,
  Folder,
  Headphones,
  Heart,
  Music,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useMemories } from '../../hooks/useMemories';
import { useListeningHistory } from '../../hooks/useListeningHistory';
import { usePostcards } from '../../hooks/usePostcards';
import { useCollections } from '../../hooks/useCollections';
import {
  calculateArchiveInsights,
  calculateListeningInsights,
  calculateMoodInsights,
} from '../../services/insights/insightsCalculator';

export function PersonalInsightsSection() {
  const { memories } = useMemories();
  const { history } = useListeningHistory();
  const { postcards } = usePostcards();
  const { collections } = useCollections();

  const moodInsights = useMemo(() => calculateMoodInsights(memories), [memories]);
  const listeningInsights = useMemo(() => calculateListeningInsights(history), [history]);
  const archiveInsights = useMemo(
    () => calculateArchiveInsights(memories, postcards, collections),
    [memories, postcards, collections]
  );

  const hasAnyData =
    memories.length > 0 || history.length > 0 || postcards.length > 0 || collections.length > 0;

  return (
    <section aria-labelledby="insights-heading" className="space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-ink/15 pb-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wideLabel font-semibold text-ink-muted">
          <BarChart3 className="w-3.5 h-3.5 text-violet-deep" aria-hidden="true" />
          <span>Local Personal Insights</span>
          <span className="text-ink/30">•</span>
          <span className="font-baybayin text-sm">ᜑᜒᜋᜓᜈᜒ</span>
        </div>
        <h2
          id="insights-heading"
          className="font-display text-2xl font-bold tracking-tight text-ink mt-1"
        >
          Your Emotional &amp; Sonic Patterns
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted max-w-2xl mt-0.5">
          These patterns are calculated purely from your local journal entries and active listening sessions.
          HIMUNI presents these as descriptive reflections of your time here, without personality profiling.
        </p>
      </div>

      {!hasAnyData ? (
        <div className="border border-dashed border-ink/30 p-12 text-center max-w-xl mx-auto my-8 bg-cream-soft/40 space-y-3">
          <Sparkles className="w-8 h-8 text-ink-subtle mx-auto" aria-hidden="true" />
          <h3 className="font-display text-xl font-bold text-ink">
            No personal activity to reflect yet
          </h3>
          <p className="text-sm text-ink-muted font-serif italic max-w-md mx-auto leading-relaxed">
            Record a mood memory, craft a Sound Postcard, or play a track to start seeing your
            personal patterns unfold here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Overview Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-ink/20 bg-cream p-4 sm:p-5 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wideLabel text-ink-muted flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-violet-deep" />
                <span>Memories</span>
              </span>
              <p className="font-display text-3xl sm:text-4xl font-bold text-ink">
                {archiveInsights.memoriesCount}
              </p>
              <p className="text-[11px] text-ink-subtle">
                {moodInsights.thisMonthCount} recorded this month
              </p>
            </div>

            <div className="border border-ink/20 bg-cream p-4 sm:p-5 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wideLabel text-ink-muted flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5 text-tangerine" />
                <span>Playback Starts</span>
              </span>
              <p className="font-display text-3xl sm:text-4xl font-bold text-ink">
                {listeningInsights.total}
              </p>
              <p className="text-[11px] text-ink-subtle">
                Legitimate provider streams
              </p>
            </div>

            <div className="border border-ink/20 bg-cream p-4 sm:p-5 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wideLabel text-ink-muted flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-butter-yellow" />
                <span>Postcards</span>
              </span>
              <p className="font-display text-3xl sm:text-4xl font-bold text-ink">
                {archiveInsights.postcardsCount}
              </p>
              <p className="text-[11px] text-ink-subtle">
                Designed sound keepsakes
              </p>
            </div>

            <div className="border border-ink/20 bg-cream p-4 sm:p-5 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wideLabel text-ink-muted flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-sky-blue" />
                <span>Collections</span>
              </span>
              <p className="font-display text-3xl sm:text-4xl font-bold text-ink">
                {archiveInsights.collectionsCount}
              </p>
              <p className="text-[11px] text-ink-subtle">
                {archiveInsights.totalItemsInCollections} total curated items
              </p>
            </div>
          </div>

          {/* Section 1: Mood Distribution */}
          <div className="border border-ink/20 bg-cream p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-ink/15 pb-3">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">
                  Mood Resonance
                </h3>
                {moodInsights.topMood ? (
                  <p className="text-xs sm:text-sm text-ink-muted font-serif italic mt-0.5">
                    You recorded <strong>{moodInsights.topMood.name}</strong> most frequently in your memories.
                  </p>
                ) : (
                  <p className="text-xs text-ink-muted italic">
                    Record memories across different days to see your emotional territories.
                  </p>
                )}
              </div>

              {typeof moodInsights.averageEnergy === 'number' && (
                <div className="inline-flex items-center gap-1.5 text-xs text-ink-muted font-mono">
                  <Zap className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                  <span>Average Energy: <strong>{moodInsights.averageEnergy}%</strong></span>
                </div>
              )}
            </div>

            {moodInsights.distribution.length === 0 ? (
              <p className="text-xs text-ink-subtle italic py-4">
                No mood distribution available yet. Create your first memory to begin.
              </p>
            ) : (
              <div className="space-y-3">
                {moodInsights.distribution.map((item) => (
                  <div key={item.moodId} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-ink">
                      <span className="inline-flex items-center gap-2 font-medium">
                        <span
                          className="h-2.5 w-2.5 rounded-full border border-ink/20 shrink-0"
                          style={{ backgroundColor: item.accent }}
                        />
                        <span>{item.name}</span>
                        <span className="font-baybayin text-[11px] text-ink-subtle">
                          ({item.baybayin})
                        </span>
                      </span>
                      <span className="font-mono text-ink-muted">
                        {item.count} {item.count === 1 ? 'entry' : 'entries'} ({item.percentage}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-cream-soft border border-ink/15 overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.accent,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Listening Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Played Tracks */}
            <div className="border border-ink/20 bg-cream p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-ink/15 pb-3">
                <h3 className="font-display text-lg font-bold text-ink flex items-center gap-2">
                  <Music className="w-4 h-4 text-violet-deep" aria-hidden="true" />
                  <span>Most Played Tracks</span>
                </h3>
                <span className="text-xs text-ink-subtle font-mono">
                  {listeningInsights.topTracks.length} tracks
                </span>
              </div>

              {listeningInsights.topTracks.length === 0 ? (
                <p className="text-xs text-ink-subtle italic py-4">
                  No playback history recorded yet. Listen to tracks to populate this list.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {listeningInsights.topTracks.map((t, idx) => (
                    <div
                      key={t.trackId}
                      className="flex items-center justify-between gap-3 text-xs p-2 bg-cream-soft border border-ink/10"
                    >
                      <div className="min-w-0 flex items-center gap-2.5">
                        <span className="font-mono text-[11px] text-ink-subtle w-4">
                          0{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-ink truncate">{t.title}</p>
                          <p className="text-ink-muted text-[11px] truncate">{t.artistName}</p>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-ink-muted shrink-0 font-medium">
                        {t.count} {t.count === 1 ? 'play' : 'plays'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Frequently Played Artists */}
            <div className="border border-ink/20 bg-cream p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-ink/15 pb-3">
                <h3 className="font-display text-lg font-bold text-ink flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-tangerine" aria-hidden="true" />
                  <span>Frequently Played Artists</span>
                </h3>
                <span className="text-xs text-ink-subtle font-mono">
                  {listeningInsights.topArtists.length} artists
                </span>
              </div>

              {listeningInsights.topArtists.length === 0 ? (
                <p className="text-xs text-ink-subtle italic py-4">
                  No artist statistics yet. Play sounds to surface your top artists.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {listeningInsights.topArtists.map((a, idx) => (
                    <div
                      key={a.artistName}
                      className="flex items-center justify-between gap-3 text-xs p-2 bg-cream-soft border border-ink/10"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-mono text-[11px] text-ink-subtle w-4">
                          0{idx + 1}
                        </span>
                        <span className="font-semibold text-ink truncate">{a.artistName}</span>
                      </div>
                      <span className="font-mono text-[11px] text-ink-muted shrink-0 font-medium">
                        {a.count} {a.count === 1 ? 'play' : 'plays'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
