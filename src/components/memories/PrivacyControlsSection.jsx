import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  Database,
  Download,
  History,
  Lock,
  RefreshCw,
  Shield,
  Trash2,
} from 'lucide-react';
import { useMemories } from '../../hooks/useMemories';
import { useListeningHistory } from '../../hooks/useListeningHistory';
import {
  exportCompleteBackupAsJson,
  exportHistoryAsJson,
  exportMemoriesAsJson,
} from '../../services/privacy/dataExport';

export function PrivacyControlsSection() {
  const { memories, clearAll: clearAllMemories } = useMemories();
  const { history, isTrackingEnabled, setTracking, clearHistory } = useListeningHistory();

  const [confirmClearHistory, setConfirmClearHistory] = useState(false);
  const [confirmDeleteMemories, setConfirmDeleteMemories] = useState(false);
  const [notice, setNotice] = useState(null); // { message, type }

  const handleExportMemories = () => {
    const ok = exportMemoriesAsJson();
    if (ok) {
      setNotice({ message: 'Downloaded Mood Memories JSON backup.', type: 'success' });
      setTimeout(() => setNotice(null), 3500);
    }
  };

  const handleExportHistory = () => {
    const ok = exportHistoryAsJson();
    if (ok) {
      setNotice({ message: 'Downloaded Listening History JSON backup.', type: 'success' });
      setTimeout(() => setNotice(null), 3500);
    }
  };

  const handleExportBackup = () => {
    const ok = exportCompleteBackupAsJson();
    if (ok) {
      setNotice({ message: 'Downloaded complete HIMUNI JSON archive.', type: 'success' });
      setTimeout(() => setNotice(null), 3500);
    }
  };

  const handleConfirmClearHistory = () => {
    clearHistory();
    setConfirmClearHistory(false);
    setNotice({ message: 'Listening history cleared successfully.', type: 'info' });
    setTimeout(() => setNotice(null), 3500);
  };

  const handleConfirmDeleteMemories = () => {
    clearAllMemories();
    setConfirmDeleteMemories(false);
    setNotice({ message: 'All mood memories deleted successfully.', type: 'info' });
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <section aria-labelledby="privacy-heading" className="space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-ink/15 pb-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wideLabel font-semibold text-ink-muted">
          <Shield className="w-3.5 h-3.5 text-violet-deep" aria-hidden="true" />
          <span>Local Privacy Architecture</span>
          <span className="text-ink/30">•</span>
          <span className="font-baybayin text-sm">ᜑᜒᜋᜓᜈᜒ</span>
        </div>
        <h2
          id="privacy-heading"
          className="font-display text-2xl font-bold tracking-tight text-ink mt-1"
        >
          Privacy &amp; Personal Data Management
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted max-w-2xl mt-0.5">
          HIMUNI is built on a client-first privacy philosophy. Your feelings, reflection notes, and
          playback activity remain strictly on your own device in your browser's local storage.
        </p>
      </div>

      {/* Status Notice */}
      {notice && (
        <div
          role="status"
          className={`p-3.5 text-xs font-semibold uppercase tracking-wide flex items-center justify-between border ${
            notice.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-cream-soft text-ink border-ink/20'
          }`}
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>{notice.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-[11px] underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Privacy Architecture Principles Banner */}
      <div className="border border-ink/20 bg-cream p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wideLabel text-ink">
          <Lock className="w-4 h-4 text-violet-deep" aria-hidden="true" />
          <span>Our Privacy Principles</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-ink-muted pt-1">
          <div className="p-3 bg-cream-soft border border-ink/10 space-y-1">
            <strong className="block text-ink font-semibold">100% Local Storage</strong>
            <p>Your notes and memories never leave your browser. There is no remote account or database.</p>
          </div>
          <div className="p-3 bg-cream-soft border border-ink/10 space-y-1">
            <strong className="block text-ink font-semibold">No Psychological Profiling</strong>
            <p>Your mood selections are purely creative filters and journal bookmarks, never diagnostic data.</p>
          </div>
          <div className="p-3 bg-cream-soft border border-ink/10 space-y-1">
            <strong className="block text-ink font-semibold">Real Audio Sessions Only</strong>
            <p>We only log tracks that actually played through an official provider session—never browsing behavior.</p>
          </div>
        </div>
      </div>

      {/* Control 1: Listening History Tracking Preference */}
      <div className="border border-ink/20 bg-cream p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-bold text-ink">
              Playback Activity Recording
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
              Control whether HIMUNI saves your active listening sessions into your local history.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold font-mono text-ink">
              {isTrackingEnabled ? 'Enabled' : 'Paused'}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isTrackingEnabled}
              onClick={() => setTracking(!isTrackingEnabled)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full border border-ink transition-colors ${
                isTrackingEnabled ? 'bg-ink' : 'bg-cream-soft'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-cream transform transition-transform ${
                  isTrackingEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        <p className="text-[11px] text-ink-subtle italic border-t border-ink/10 pt-3">
          If disabled, no new listening events will be recorded. Your existing history remains intact
          unless explicitly cleared below.
        </p>
      </div>

      {/* Control 2: Data Export Backups */}
      <div className="border border-ink/20 bg-cream p-5 sm:p-6 space-y-4">
        <div className="border-b border-ink/15 pb-3">
          <h3 className="font-display text-lg font-bold text-ink flex items-center gap-2">
            <Download className="w-4 h-4 text-violet-deep" aria-hidden="true" />
            <span>Structured Data Export (JSON)</span>
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Download your personal data at any time in open, readable JSON format.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Export Memories */}
          <div className="border border-ink/15 bg-cream-soft p-4 flex flex-col justify-between gap-3">
            <div>
              <p className="font-display text-sm font-semibold text-ink">Mood Memories</p>
              <p className="text-[11px] text-ink-muted pt-1">
                {memories.length} entries with notes, dates, and mood territories.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportMemories}
              className="inline-flex min-h-[36px] items-center justify-center gap-1.5 px-3 py-1.5 border border-ink bg-cream hover:bg-ink hover:text-cream text-xs font-semibold uppercase tracking-wideLabel transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>

          {/* Export History */}
          <div className="border border-ink/15 bg-cream-soft p-4 flex flex-col justify-between gap-3">
            <div>
              <p className="font-display text-sm font-semibold text-ink">Listening History</p>
              <p className="text-[11px] text-ink-muted pt-1">
                {history.length} playback events with timestamps and track metadata.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportHistory}
              className="inline-flex min-h-[36px] items-center justify-center gap-1.5 px-3 py-1.5 border border-ink bg-cream hover:bg-ink hover:text-cream text-xs font-semibold uppercase tracking-wideLabel transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>

          {/* Complete Backup */}
          <div className="border border-ink bg-cream-soft p-4 flex flex-col justify-between gap-3">
            <div>
              <p className="font-display text-sm font-semibold text-ink">Complete Backup</p>
              <p className="text-[11px] text-ink-muted pt-1">
                Full archive: memories, postcards, collections, and preferences.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportBackup}
              className="inline-flex min-h-[36px] items-center justify-center gap-1.5 px-3 py-1.5 bg-ink text-cream hover:bg-violet-deep text-xs font-semibold uppercase tracking-wideLabel transition-colors"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Full Archive</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control 3: Danger Zone */}
      <div className="border border-red-300 bg-red-50/40 p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wideLabel font-semibold text-red-900 border-b border-red-200 pb-3">
          <AlertTriangle className="w-4 h-4 text-red-700" aria-hidden="true" />
          <span>Data Clearance &amp; Reset</span>
        </div>

        <div className="space-y-4">
          {/* Clear History */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-red-200">
            <div>
              <strong className="block text-xs font-semibold text-ink uppercase">
                Clear Listening History
              </strong>
              <p className="text-xs text-ink-muted mt-0.5">
                Permanently wipes all recorded playback events. Does not affect your saved tracks in collections, postcards, or memories.
              </p>
            </div>

            {confirmClearHistory ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleConfirmClearHistory}
                  className="bg-red-700 text-cream px-3 py-1.5 text-xs font-semibold uppercase hover:bg-red-800 transition-colors"
                >
                  Confirm Clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClearHistory(false)}
                  className="text-xs text-ink-muted hover:text-ink underline px-1"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClearHistory(true)}
                disabled={history.length === 0}
                className="inline-flex min-h-[36px] items-center gap-1.5 px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-100/60 text-xs font-semibold uppercase tracking-wideLabel disabled:opacity-40 transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {/* Delete All Memories */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <strong className="block text-xs font-semibold text-ink uppercase">
                Delete All Mood Memories
              </strong>
              <p className="text-xs text-ink-muted mt-0.5">
                Permanently removes all journal entries. Does not delete your saved postcards, collections, or original tracks.
              </p>
            </div>

            {confirmDeleteMemories ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleConfirmDeleteMemories}
                  className="bg-red-700 text-cream px-3 py-1.5 text-xs font-semibold uppercase hover:bg-red-800 transition-colors"
                >
                  Confirm Delete All
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDeleteMemories(false)}
                  className="text-xs text-ink-muted hover:text-ink underline px-1"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDeleteMemories(true)}
                disabled={memories.length === 0}
                className="inline-flex min-h-[36px] items-center gap-1.5 px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-100/60 text-xs font-semibold uppercase tracking-wideLabel disabled:opacity-40 transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete All Memories</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
