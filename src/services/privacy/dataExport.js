/**
 * HIMUNI Privacy & Data Export Service
 * Produces structured JSON backups with human-readable filenames.
 * Downloads run 100% locally in the browser with zero cloud dependencies.
 */

import { loadMemories } from '../memories/memoryStorage';
import { isHistoryTrackingEnabled, loadListeningHistory } from '../history/listeningHistoryStorage';
import { loadPostcards } from '../postcards/postcardStorage';
import { loadCollections } from '../collections/collectionStorage';
import { loadPreferences } from '../../utils/storage';
import { getLocalTodayDateString } from '../memories/memoryStorage';

function downloadJsonFile(filename, dataObj) {
  if (typeof document === 'undefined') return false;

  try {
    const jsonStr = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Failed to export JSON file:', err);
    return false;
  }
}

export function exportMemoriesAsJson() {
  const dateStr = getLocalTodayDateString();
  const memories = loadMemories();
  const payload = {
    brand: 'HIMUNI',
    version: '1.0',
    type: 'mood-memories',
    exportedAt: new Date().toISOString(),
    recordCount: memories.length,
    memories,
  };
  return downloadJsonFile(`himuni-mood-memories-${dateStr}.json`, payload);
}

export function exportListeningHistoryAsJson() {
  const dateStr = getLocalTodayDateString();
  const history = loadListeningHistory();
  const payload = {
    brand: 'HIMUNI',
    version: '1.0',
    type: 'listening-history',
    exportedAt: new Date().toISOString(),
    recordCount: history.length,
    history,
  };
  return downloadJsonFile(`himuni-listening-history-${dateStr}.json`, payload);
}

export const exportHistoryAsJson = exportListeningHistoryAsJson;

export function exportCompleteBackupAsJson() {
  const dateStr = getLocalTodayDateString();
  const memories = loadMemories();
  const history = loadListeningHistory();
  const postcards = loadPostcards();
  const collections = loadCollections();
  const preferences = loadPreferences();
  const trackingEnabled = isHistoryTrackingEnabled();

  const backup = {
    brand: 'HIMUNI',
    tagline: 'Every feeling has a sound.',
    version: '1.0',
    type: 'complete-backup',
    exportedAt: new Date().toISOString(),
    data: {
      preferences,
      memories,
      postcards,
      collections,
      listeningHistory: history,
      settings: {
        historyTrackingEnabled: trackingEnabled,
      },
    },
    counts: {
      memories: memories.length,
      postcards: postcards.length,
      collections: collections.length,
      listeningEvents: history.length,
    },
  };

  return downloadJsonFile(`himuni-complete-backup-${dateStr}.json`, backup);
}
