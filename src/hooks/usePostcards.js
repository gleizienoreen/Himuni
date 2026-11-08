import { useCallback, useEffect, useState } from 'react';
import {
  deletePostcard,
  duplicatePostcard,
  loadPostcards,
  savePostcard,
} from '../services/postcards/postcardStorage';

export function usePostcards() {
  const [postcards, setPostcards] = useState(() => loadPostcards());

  const refresh = useCallback(() => {
    setPostcards(loadPostcards());
  }, []);

  useEffect(() => {
    const handleUpdate = () => refresh();
    window.addEventListener('himuni:postcards-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('himuni:postcards-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refresh]);

  const remove = useCallback(
    (id) => {
      const ok = deletePostcard(id);
      if (ok) refresh();
      return ok;
    },
    [refresh]
  );

  const duplicate = useCallback(
    (id) => {
      const dup = duplicatePostcard(id);
      if (dup) refresh();
      return dup;
    },
    [refresh]
  );

  const save = useCallback(
    (data) => {
      const res = savePostcard(data);
      if (res) refresh();
      return res;
    },
    [refresh]
  );

  return {
    postcards,
    refresh,
    save,
    duplicate,
    remove,
  };
}
