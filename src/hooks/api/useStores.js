import useFetchJson from './useFetchJson';

const useStores = () => {
  const { data: stores, setData: setStores, isLoading, error } = useFetchJson('/data/stores.json');
  return { stores, setStores, isLoading, error };
};

export default useStores;
