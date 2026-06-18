import useFetchJson from './useFetchJson';

const useInventory = () => {
  const { data: inventory, setData: setInventory, isLoading, error } = useFetchJson('/data/inventory.json');
  return { inventory, setInventory, isLoading, error };
};

export default useInventory;
