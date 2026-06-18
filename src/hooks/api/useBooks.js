// src/hooks/api/useBooks.js
//
// Single-responsibility hook: fetches the books resource.
// Delegates to useFetchJson so fetch logic is not duplicated.

import useFetchJson from './useFetchJson';

const useBooks = () => {
  const { data: books, setData: setBooks, isLoading, error } = useFetchJson('/data/books.json');
  return { books, setBooks, isLoading, error };
};

export default useBooks;
