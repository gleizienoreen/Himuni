import React, { useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';
import { getMoodById } from '../../data/moods';
import { getLocalTodayDateString } from '../../services/memories/memoryStorage';
import { MemoryCard } from './MemoryCard';

export function MoodCalendar({
  memories = [],
  selectedDate = null,
  onSelectDate = null,
  onEditMemory = null,
  onDeleteMemory = null,
  onCreateMemory = null,
}) {
  const todayStr = useMemo(() => getLocalTodayDateString(), []);

  // Current viewed month (year & month in local time)
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-11

  // Map memories by entryDate: { "YYYY-MM-DD": [mem1, mem2] }
  const memoriesByDate = useMemo(() => {
    const map = new Map();
    memories.forEach((m) => {
      if (!m.entryDate) return;
      if (!map.has(m.entryDate)) {
        map.set(m.entryDate, []);
      }
      map.get(m.entryDate).push(m);
    });
    return map;
  }, [memories]);

  // Calendar calculations
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // handles leap years automatically

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    if (onSelectDate) onSelectDate(todayStr);
  };

  // Build grid days
  const calendarCells = useMemo(() => {
    const cells = [];

    // Leading empty cells
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push({ type: 'empty', key: `empty-${i}` });
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateStr = `${year}-${monthStr}-${dayStr}`;
      const dayMemories = memoriesByDate.get(dateStr) || [];

      cells.push({
        type: 'day',
        key: dateStr,
        dayNumber: day,
        dateStr,
        memories: dayMemories,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedDate,
      });
    }

    return cells;
  }, [year, month, daysInMonth, firstDayOfWeek, memoriesByDate, todayStr, selectedDate]);

  const selectedDateMemories = selectedDate ? memoriesByDate.get(selectedDate) || [] : [];
  const selectedDateFormatted = selectedDate
    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const weekDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-8 font-sans">
      {/* Calendar Card Container */}
      <div className="border border-ink/20 bg-cream p-5 sm:p-7 space-y-6">
        {/* Month Header and Navigation Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/15 pb-4">
          <div className="flex items-center gap-2.5">
            <CalendarIcon className="w-4 h-4 text-violet-deep" aria-hidden="true" />
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              {monthName}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={goToToday}
              className="inline-flex min-h-[36px] items-center px-3 py-1.5 border border-ink/20 hover:border-ink uppercase tracking-wideLabel font-semibold text-ink bg-cream-soft transition-colors"
            >
              Today
            </button>

            <div className="inline-flex border border-ink/20 bg-cream">
              <button
                type="button"
                onClick={prevMonth}
                aria-label="Previous month"
                className="p-2 text-ink hover:bg-cream-soft transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                aria-label="Next month"
                className="p-2 text-ink hover:bg-cream-soft border-l border-ink/20 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Day of week labels */}
          {weekDayLabels.map((w) => (
            <div
              key={w}
              className="py-1 text-center text-[11px] font-semibold uppercase tracking-wideLabel text-ink-muted"
            >
              {w}
            </div>
          ))}

          {/* Date cells */}
          {calendarCells.map((cell) => {
            if (cell.type === 'empty') {
              return <div key={cell.key} className="min-h-[56px] sm:min-h-[72px]" />;
            }

            const hasMemories = cell.memories.length > 0;

            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => {
                  if (onSelectDate) {
                    onSelectDate(cell.isSelected ? null : cell.dateStr);
                  }
                }}
                aria-label={`${cell.dateStr}: ${cell.memories.length} memories`}
                className={`min-h-[56px] sm:min-h-[72px] p-1.5 sm:p-2 border flex flex-col justify-between text-left transition-colors relative ${
                  cell.isSelected
                    ? 'border-ink bg-ink text-cream ring-2 ring-ink ring-offset-1 ring-offset-cream'
                    : cell.isToday
                    ? 'border-violet-deep bg-cream-soft/80 text-ink'
                    : hasMemories
                    ? 'border-ink/20 bg-cream hover:border-ink text-ink'
                    : 'border-ink/10 bg-cream-soft/30 hover:border-ink/30 text-ink-muted'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-mono font-medium ${
                      cell.isSelected ? 'text-cream font-bold' : cell.isToday ? 'font-bold text-violet-deep' : ''
                    }`}
                  >
                    {cell.dayNumber}
                  </span>
                  {cell.isToday && !cell.isSelected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-deep" aria-hidden="true" />
                  )}
                </div>

                {/* Mood dots for recorded memories on this date */}
                {hasMemories && (
                  <div className="flex items-center gap-1 flex-wrap mt-1">
                    {cell.memories.slice(0, 4).map((m, idx) => {
                      const mood = getMoodById(m.moodId);
                      return (
                        <span
                          key={m.id || idx}
                          title={`${mood?.name || 'Mood'}`}
                          className="h-2 w-2 rounded-full border border-ink/20 shrink-0"
                          style={{ backgroundColor: mood?.accent || '#8067E8' }}
                        />
                      );
                    })}
                    {cell.memories.length > 4 && (
                      <span className="text-[9px] font-mono text-ink-subtle">
                        +{cell.memories.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="pt-3 border-t border-ink/10 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full border border-violet-deep bg-violet-deep" />
              <span>Today</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full border border-ink/25 bg-amber-400" />
              <span>Recorded mood</span>
            </span>
          </div>

          <span className="text-[11px] text-ink-subtle italic">
            Click any date to view or record memories for that day.
          </span>
        </div>
      </div>

      {/* Selected Date Agenda / Detail Drawer */}
      {selectedDate && (
        <section
          aria-labelledby="selected-date-heading"
          className="border border-ink/25 bg-cream p-5 sm:p-7 space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/15 pb-4">
            <div>
              <div className="text-xs uppercase tracking-wideLabel font-semibold text-ink-muted">
                Daily Agenda &middot; {selectedDateMemories.length}{' '}
                {selectedDateMemories.length === 1 ? 'memory' : 'memories'}
              </div>
              <h3
                id="selected-date-heading"
                className="font-display text-2xl font-bold tracking-tight text-ink mt-0.5"
              >
                {selectedDateFormatted}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onCreateMemory && onCreateMemory(selectedDate)}
                className="inline-flex min-h-[38px] items-center gap-1.5 bg-ink text-cream px-4 py-1.5 text-xs font-semibold uppercase tracking-wideLabel hover:bg-violet-deep transition-colors"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add for this date</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectDate && onSelectDate(null)}
                aria-label="Close date view"
                className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center border border-ink/20 hover:border-ink text-ink-muted hover:text-ink transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {selectedDateMemories.length === 0 ? (
            <div className="border border-dashed border-ink/20 p-8 text-center bg-cream-soft/40 space-y-3">
              <Sparkles className="w-7 h-7 text-ink-subtle mx-auto" aria-hidden="true" />
              <p className="text-sm text-ink-muted font-serif italic">
                No memories recorded on this date yet.
              </p>
              <button
                type="button"
                onClick={() => onCreateMemory && onCreateMemory(selectedDate)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wideLabel text-ink underline hover:text-violet-deep"
              >
                <span>Record how you felt on this day</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateMemories.map((mem) => (
                <MemoryCard
                  key={mem.id}
                  memory={mem}
                  onEdit={onEditMemory}
                  onDelete={onDeleteMemory}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
