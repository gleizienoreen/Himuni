import { useCallback, useEffect, useState } from 'react';
import {
  addItemToCollection,
  deleteCollection,
  duplicateCollection,
  getCollectionById,
  loadCollections,
  removeItemFromCollection,
  reorderCollectionItems,
  saveCollection,
} from '../services/collections/collectionStorage';

export function useCollections() {
  const [collections, setCollections] = useState(() => loadCollections());

  const refresh = useCallback(() => {
    setCollections(loadCollections());
  }, []);

  useEffect(() => {
    const handleUpdate = () => refresh();
    window.addEventListener('himuni:collections-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('himuni:collections-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refresh]);

  const save = useCallback(
    (data) => {
      const res = saveCollection(data);
      if (res) refresh();
      return res;
    },
    [refresh]
  );

  const getCollection = useCallback(
    (id) => {
      if (!id) return null;
      return collections.find((c) => c.id === id) || getCollectionById(id);
    },
    [collections]
  );

  const createCollection = useCallback(
    (data) => {
      return save(data);
    },
    [save]
  );

  const updateCollection = useCallback(
    (id, updates) => {
      const existing = getCollectionById(id);
      if (!existing) return null;
      return save({
        ...existing,
        ...updates,
      });
    },
    [save]
  );

  const duplicate = useCallback(
    (id) => {
      const res = duplicateCollection(id);
      if (res) refresh();
      return res;
    },
    [refresh]
  );

  const remove = useCallback(
    (id) => {
      const ok = deleteCollection(id);
      if (ok) refresh();
      return ok;
    },
    [refresh]
  );

  const addItem = useCallback(
    (collectionId, item) => {
      const res = addItemToCollection(collectionId, item);
      if (res.success) refresh();
      return res;
    },
    [refresh]
  );

  const removeItem = useCallback(
    (collectionId, itemId) => {
      const ok = removeItemFromCollection(collectionId, itemId);
      if (ok) refresh();
      return ok;
    },
    [refresh]
  );

  const reorder = useCallback(
    (collectionId, newOrder) => {
      const ok = reorderCollectionItems(collectionId, newOrder);
      if (ok) refresh();
      return ok;
    },
    [refresh]
  );

  return {
    collections,
    refresh,
    getCollection,
    save,
    createCollection,
    updateCollection,
    duplicate,
    duplicateCollection: duplicate,
    remove,
    deleteCollection: remove,
    addItem,
    removeItem,
    reorder,
    reorderItems: reorder,
  };
}
