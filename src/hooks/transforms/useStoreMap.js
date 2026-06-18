import { useMemo } from 'react';

const useStoreMap = (stores) => {
  const storeMap = useMemo(() => {
    return stores.reduce((map, store) => {
      map[store.id] = store;
      return map;
    }, {});
  }, [stores]);

  return storeMap;
};

export default useStoreMap;
