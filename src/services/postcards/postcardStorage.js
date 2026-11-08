/**
 * LocalStorage persistence service for HIMUNI Sound Postcards.
 * Preserves user-created postcards locally without duplicating audio or provider catalog data.
 */

export const POSTCARDS_STORAGE_KEY = 'himuni.postcards.v1';

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `card_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function loadPostcards() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(POSTCARDS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) => item && typeof item === 'object' && typeof item.id === 'string'
    );
  } catch {
    return [];
  }
}

export function getPostcardById(id) {
  if (!id) return null;
  const list = loadPostcards();
  return list.find((card) => card.id === id) || null;
}

export function savePostcard(postcardData) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const list = loadPostcards();
    const now = new Date().toISOString();

    const existingIndex = list.findIndex((c) => c.id === postcardData.id);

    let savedItem;
    if (existingIndex >= 0) {
      const existing = list[existingIndex];
      savedItem = {
        ...existing,
        ...postcardData,
        id: existing.id,
        createdAt: existing.createdAt || now,
        updatedAt: now,
      };
      list[existingIndex] = savedItem;
    } else {
      savedItem = {
        id: postcardData.id || generateId(),
        title: postcardData.title?.trim() || 'Untitled Postcard',
        subtitle: postcardData.subtitle?.trim() || '',
        note: postcardData.note?.trim() || '',
        moodId: postcardData.moodId || 'dreamy',
        energy: typeof postcardData.energy === 'number' ? postcardData.energy : 50,
        featuredTrack: postcardData.featuredTrack || null,
        themeId: postcardData.themeId || 'lavender-dream',
        layoutId: postcardData.layoutId || 'editorial',
        typography: {
          alignment: postcardData.typography?.alignment || 'left',
          style: postcardData.typography?.style || 'editorial',
        },
        createdAt: postcardData.createdAt || now,
        updatedAt: now,
      };
      list.unshift(savedItem);
    }

    window.localStorage.setItem(POSTCARDS_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('himuni:postcards-updated', { detail: list }));
    return savedItem;
  } catch {
    return null;
  }
}

export function duplicatePostcard(id) {
  const target = getPostcardById(id);
  if (!target) return null;

  const now = new Date().toISOString();
  const duplicate = {
    ...target,
    id: generateId(),
    title: `${target.title} (Copy)`,
    createdAt: now,
    updatedAt: now,
  };

  return savePostcard(duplicate);
}

export function deletePostcard(id) {
  if (typeof window === 'undefined' || !window.localStorage || !id) {
    return false;
  }

  try {
    const list = loadPostcards();
    const filtered = list.filter((c) => c.id !== id);
    window.localStorage.setItem(POSTCARDS_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('himuni:postcards-updated', { detail: filtered }));
    return true;
  } catch {
    return false;
  }
}
