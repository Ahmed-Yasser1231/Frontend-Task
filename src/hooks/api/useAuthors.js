import useFetchJson from './useFetchJson';

const useAuthors = () => {
  const { data: authors, setData: setAuthors, isLoading, error } = useFetchJson('/data/authors.json');
  return { authors, setAuthors, isLoading, error };
};

export default useAuthors;
