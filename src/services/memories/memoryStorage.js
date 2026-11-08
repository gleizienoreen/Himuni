/**
 * HIMUNI Mood Memories Storage Service
 * LocalStorage persistence layer under key "himuni.memories.v1"
 */

export const MEMORIES_STORAGE_KEY = 'himuni.memories.v1';

export function generateMemoryId() {
  return `mem-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Returns today's local date as YYYY-MM-DD string without UTC shifting.
 */
export function getLocalTodayDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadMemories() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(MEMORIES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Sort by entryDate descending, then createdAt descending
    return parsed.sort((a, b) => {
      const dateA = a.entryDate || '';
      const dateB = b.entryDate || '';
      if (dateA !== dateB) return dateB.localeCompare(dateA);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  } catch (err) {
    console.error('Failed to load memories from localStorage:', err);
    return [];
  }
}

export function getMemoryById(id) {
  if (!id) return null;
  const list = loadMemories();
  return list.find((m) => m.id === id) || null;
}

export function saveMemory(memoryData) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const list = loadMemories();
    const now = new Date().toISOString();

    const existingIndex = list.findIndex((m) => m.id === memoryData.id);

    let savedItem;
    if (existingIndex >= 0) {
      const existing = list[existingIndex];
      savedItem = {
        ...existing,
        title: memoryData.title !== undefined ? memoryData.title.trim() : existing.title,
        moodId: memoryData.moodId || existing.moodId || 'dreamy',
        energy: typeof memoryData.energy === 'number' ? memoryData.energy : existing.energy,
        entryDate: memoryData.entryDate || existing.entryDate || getLocalTodayDateString(),
        note: memoryData.note !== undefined ? memoryData.note.trim() : existing.note,
        references: {
          trackId: memoryData.references?.trackId ?? existing.references?.trackId ?? null,
          trackSnapshot: memoryData.references?.trackSnapshot ?? existing.references?.trackSnapshot ?? null,
          soundscapeId: memoryData.references?.soundscapeId ?? existing.references?.soundscapeId ?? null,
          soundscapeSnapshot: memoryData.references?.soundscapeSnapshot ?? existing.references?.soundscapeSnapshot ?? null,
          postcardId: memoryData.references?.postcardId ?? existing.references?.postcardId ?? null,
          postcardSnapshot: memoryData.references?.postcardSnapshot ?? existing.references?.postcardSnapshot ?? null,
          collectionId: memoryData.references?.collectionId ?? existing.references?.collectionId ?? null,
          collectionSnapshot: memoryData.references?.collectionSnapshot ?? existing.references?.collectionSnapshot ?? null,
        },
        updatedAt: now,
      };
      list[existingIndex] = savedItem;
    } else {
      savedItem = {
        id: memoryData.id || generateMemoryId(),
        title: memoryData.title ? memoryData.title.trim() : '',
        moodId: memoryData.moodId || 'dreamy',
        energy: typeof memoryData.energy === 'number' ? memoryData.energy : 50,
        entryDate: memoryData.entryDate || getLocalTodayDateString(),
        note: memoryData.note ? memoryData.note.trim() : '',
        references: {
          trackId: memoryData.references?.trackId || null,
          trackSnapshot: memoryData.references?.trackSnapshot || null,
          soundscapeId: memoryData.references?.soundscapeId || null,
          soundscapeSnapshot: memoryData.references?.soundscapeSnapshot || null,
          postcardId: memoryData.references?.postcardId || null,
          postcardSnapshot: memoryData.references?.postcardSnapshot || null,
          collectionId: memoryData.references?.collectionId || null,
          collectionSnapshot: memoryData.references?.collectionSnapshot || null,
        },
        createdAt: memoryData.createdAt || now,
        updatedAt: now,
      };
      list.unshift(savedItem);
    }

    window.localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('himuni:memories-updated', { detail: list }));
    return savedItem;
  } catch (err) {
    console.error('Failed to save memory to localStorage:', err);
    return null;
  }
}

export function deleteMemory(id) {
  if (typeof window === 'undefined' || !window.localStorage || !id) {
    return false;
  }

  try {
    const list = loadMemories();
    const filtered = list.filter((m) => m.id !== id);
    window.localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('himuni:memories-updated', { detail: filtered }));
    return true;
  } catch (err) {
    console.error('Failed to delete memory from localStorage:', err);
    return false;
  }
}

export function clearAllMemories() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    window.localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('himuni:memories-updated', { detail: [] }));
    return true;
  } catch (err) {
    console.error('Failed to clear memories:', err);
    return false;
  }
}
