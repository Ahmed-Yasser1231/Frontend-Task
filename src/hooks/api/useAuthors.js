import useFetchJson from './useFetchJson';

const useAuthors = () => {
  const { data: authors, isLoading, error } = useFetchJson('/data/authors.json');
  return { authors, isLoading, error };
};

export default useAuthors;
