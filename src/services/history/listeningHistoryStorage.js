/**
 * HIMUNI Listening History Service
 * Tracks actual successful provider playback sessions under key "himuni.history.v1"
 * Respects user privacy preference under key "himuni.history.enabled.v1"
 */

export const HISTORY_STORAGE_KEY = 'himuni.history.v1';
export const HISTORY_ENABLED_KEY = 'himuni.history.enabled.v1';

export function generateHistoryId() {
  return `hist-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

export function isHistoryTrackingEnabled() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return true;
  }
  try {
    const raw = window.localStorage.getItem(HISTORY_ENABLED_KEY);
    if (raw === null) return true; // Default to true
    return JSON.parse(raw) === true;
  } catch {
    return true;
  }
}

export function setHistoryTrackingEnabled(enabled) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.setItem(HISTORY_ENABLED_KEY, JSON.stringify(Boolean(enabled)));
    window.dispatchEvent(
      new CustomEvent('himuni:history-pref-updated', { detail: Boolean(enabled) })
    );
    return true;
  } catch {
    return false;
  }
}

export function loadListeningHistory() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));
  } catch (err) {
    console.error('Failed to load listening history from localStorage:', err);
    return [];
  }
}

let lastRecordedTrackId = null;
let lastRecordedTime = 0;

/**
 * Records a legitimate audio playback session.
 * Prevents accidental duplicate events from re-renders or rapid consecutive clicks.
 */
export function recordPlaybackEvent(track, moodContext = null) {
  if (!track || !track.id) return null;
  if (!isHistoryTrackingEnabled()) return null;

  const now = Date.now();
  // Prevent duplicate event for the exact same track within 4 seconds
  if (lastRecordedTrackId === track.id && now - lastRecordedTime < 4000) {
    return null;
  }

  lastRecordedTrackId = track.id;
  lastRecordedTime = now;

  try {
    const history = loadListeningHistory();

    const moodId =
      moodContext?.selectedMoodId ||
      moodContext?.selectedMood?.id ||
      moodContext?.id ||
      null;

    const energy =
      typeof moodContext?.energy === 'number'
        ? moodContext.energy
        : null;

    const event = {
      id: generateHistoryId(),
      provider: 'audius',
      trackId: String(track.id),
      trackTitle: track.title || 'Untitled Track',
      artistName: track.artistName || 'Unknown Artist',
      artistUrl: track.artistUrl || null,
      artworkUrl: track.artworkUrl || null,
      trackUrl: track.trackUrl || null,
      duration: track.duration || 0,
      genre: track.genre || '',
      playedAt: new Date().toISOString(),
      moodId,
      energy,
      playbackStatus: 'started',
      durationPlayedSeconds: null,
      source: 'player',
    };

    // Keep the most recent 500 events
    history.unshift(event);
    const trimmed = history.slice(0, 500);

    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
    window.dispatchEvent(
      new CustomEvent('himuni:history-updated', { detail: trimmed })
    );

    return event;
  } catch (err) {
    console.error('Failed to record playback event:', err);
    return null;
  }
}

export function clearListeningHistory() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('himuni:history-updated', { detail: [] }));
    return true;
  } catch (err) {
    console.error('Failed to clear listening history:', err);
    return false;
  }
}
