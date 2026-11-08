import { useCallback, useEffect, useState } from 'react';
import {
  clearListeningHistory,
  isHistoryTrackingEnabled,
  loadListeningHistory,
  setHistoryTrackingEnabled,
} from '../services/history/listeningHistoryStorage';

export function useListeningHistory() {
  const [history, setHistory] = useState(() => loadListeningHistory());
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(() => isHistoryTrackingEnabled());

  const refresh = useCallback(() => {
    setHistory(loadListeningHistory());
    setIsTrackingEnabled(isHistoryTrackingEnabled());
  }, []);

  useEffect(() => {
    const onHistoryUpdated = () => setHistory(loadListeningHistory());
    const onPrefUpdated = () => setIsTrackingEnabled(isHistoryTrackingEnabled());

    window.addEventListener('himuni:history-updated', onHistoryUpdated);
    window.addEventListener('himuni:history-pref-updated', onPrefUpdated);
    window.addEventListener('storage', onHistoryUpdated);

    return () => {
      window.removeEventListener('himuni:history-updated', onHistoryUpdated);
      window.removeEventListener('himuni:history-pref-updated', onPrefUpdated);
      window.removeEventListener('storage', onHistoryUpdated);
    };
  }, []);

  const clear = useCallback(() => {
    const ok = clearListeningHistory();
    if (ok) refresh();
    return ok;
  }, [refresh]);

  const setTracking = useCallback((enabled) => {
    const ok = setHistoryTrackingEnabled(enabled);
    if (ok) setIsTrackingEnabled(enabled);
    return ok;
  }, []);

  return {
    history,
    isTrackingEnabled,
    setTracking,
    clearHistory: clear,
    refresh,
  };
}
