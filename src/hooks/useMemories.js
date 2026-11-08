import { useCallback, useEffect, useState } from 'react';
import {
  clearAllMemories,
  deleteMemory,
  getMemoryById,
  loadMemories,
  saveMemory,
} from '../services/memories/memoryStorage';

export function useMemories() {
  const [memories, setMemories] = useState(() => loadMemories());

  const refresh = useCallback(() => {
    setMemories(loadMemories());
  }, []);

  useEffect(() => {
    const handleUpdate = () => refresh();
    window.addEventListener('himuni:memories-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('himuni:memories-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refresh]);

  const save = useCallback(
    (data) => {
      const res = saveMemory(data);
      if (res) refresh();
      return res;
    },
    [refresh]
  );

  const getMemory = useCallback(
    (id) => {
      if (!id) return null;
      return memories.find((m) => m.id === id) || getMemoryById(id);
    },
    [memories]
  );

  const createMemory = useCallback(
    (data) => {
      return save(data);
    },
    [save]
  );

  const updateMemory = useCallback(
    (id, updates) => {
      const existing = getMemoryById(id);
      if (!existing) return null;
      return save({
        ...existing,
        ...updates,
      });
    },
    [save]
  );

  const remove = useCallback(
    (id) => {
      const ok = deleteMemory(id);
      if (ok) refresh();
      return ok;
    },
    [refresh]
  );

  const clearAll = useCallback(() => {
    const ok = clearAllMemories();
    if (ok) refresh();
    return ok;
  }, [refresh]);

  return {
    memories,
    refresh,
    getMemory,
    save,
    createMemory,
    updateMemory,
    deleteMemory: remove,
    clearAll,
  };
}
