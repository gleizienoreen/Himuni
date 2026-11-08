/**
 * LocalStorage persistence service for HIMUNI Personal Collections.
 * Manages user-curated archives of discovered tracks and Soundscapes.
 */

export const COLLECTIONS_STORAGE_KEY = 'himuni.collections.v1';

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `col_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function loadCollections() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(COLLECTIONS_STORAGE_KEY);
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

export function getCollectionById(id) {
  if (!id) return null;
  const list = loadCollections();
  return list.find((c) => c.id === id) || null;
}

export function saveCollection(collectionData) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const list = loadCollections();
    const now = new Date().toISOString();

    const existingIndex = list.findIndex((c) => c.id === collectionData.id);

    let savedItem;
    if (existingIndex >= 0) {
      const existing = list[existingIndex];
      savedItem = {
        ...existing,
        ...collectionData,
        id: existing.id,
        items: Array.isArray(collectionData.items) ? collectionData.items : existing.items || [],
        createdAt: existing.createdAt || now,
        updatedAt: now,
      };
      list[existingIndex] = savedItem;
    } else {
      savedItem = {
        id: collectionData.id || generateId(),
        name: collectionData.name?.trim() || 'Untitled Collection',
        description: collectionData.description?.trim() || '',
        moodId: collectionData.moodId || 'calm',
        coverThemeId: collectionData.coverThemeId || 'sky-blue',
        coverColor: collectionData.coverColor || '#E4EFF3',
        items: Array.isArray(collectionData.items) ? collectionData.items : [],
        createdAt: collectionData.createdAt || now,
        updatedAt: now,
      };
      list.unshift(savedItem);
    }

    window.localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('himuni:collections-updated', { detail: list }));
    return savedItem;
  } catch {
    return null;
  }
}

export function duplicateCollection(id) {
  const target = getCollectionById(id);
  if (!target) return null;

  const now = new Date().toISOString();
  const duplicate = {
    ...target,
    id: generateId(),
    name: `${target.name} (Copy)`,
    items: target.items.map((item) => ({
      ...item,
      id: generateId(),
    })),
    createdAt: now,
    updatedAt: now,
  };

  return saveCollection(duplicate);
}

export function deleteCollection(id) {
  if (typeof window === 'undefined' || !window.localStorage || !id) {
    return false;
  }

  try {
    const list = loadCollections();
    const filtered = list.filter((c) => c.id !== id);
    window.localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('himuni:collections-updated', { detail: filtered }));
    return true;
  } catch {
    return false;
  }
}

/**
 * Adds a track or soundscape reference to a collection.
 * Prevents duplicate items within the same collection.
 */
export function addItemToCollection(collectionId, item) {
  const collection = getCollectionById(collectionId);
  if (!collection) {
    return { success: false, reason: 'Collection not found' };
  }

  const items = Array.isArray(collection.items) ? [...collection.items] : [];

  // Check for duplicate reference
  const isDuplicate = items.some(
    (existing) =>
      existing.type === item.type &&
      String(existing.providerId) === String(item.providerId)
  );

  if (isDuplicate) {
    return {
      success: false,
      isDuplicate: true,
      reason: `Already in "${collection.name}"`,
    };
  }

  const newItem = {
    id: generateId(),
    type: item.type, // 'track' | 'soundscape'
    provider: item.provider || 'audius',
    providerId: String(item.providerId),
    snapshot: item.snapshot || {},
    order: items.length,
    addedAt: new Date().toISOString(),
  };

  items.push(newItem);

  saveCollection({
    ...collection,
    items,
  });

  return { success: true, item: newItem };
}

export function removeItemFromCollection(collectionId, referenceId) {
  const collection = getCollectionById(collectionId);
  if (!collection) return false;

  const items = (collection.items || [])
    .filter((it) => it.id !== referenceId)
    .map((it, idx) => ({ ...it, order: idx }));

  saveCollection({
    ...collection,
    items,
  });

  return true;
}

export function reorderCollectionItems(collectionId, newOrderedItems) {
  const collection = getCollectionById(collectionId);
  if (!collection || !Array.isArray(newOrderedItems)) return false;

  const updatedItems = newOrderedItems.map((it, idx) => ({
    ...it,
    order: idx,
  }));

  saveCollection({
    ...collection,
    items: updatedItems,
  });

  return true;
}
