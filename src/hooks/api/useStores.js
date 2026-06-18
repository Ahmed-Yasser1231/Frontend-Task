import useFetchJson from './useFetchJson';

const useStores = () => {
  const { data: stores, isLoading, error } = useFetchJson('/data/stores.json');
  return { stores, isLoading, error };
};

export default useStores;
