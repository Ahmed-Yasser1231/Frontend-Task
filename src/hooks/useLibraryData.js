// src/hooks/useLibraryData.js
//
// Lightweight composition hook that orchestrates the smaller,
// single-responsibility hooks.  Contains ZERO business logic itself —
// it simply wires data-fetching → transforms → business hooks and
// exposes the same public API as the original monolithic hook so that
// consumer components require no changes.

import useBooks from './api/useBooks';
import useAuthors from './api/useAuthors';
import useStores from './api/useStores';
import useInventory from './api/useInventory';
import useAuthorMap from './transforms/useAuthorMap';
import useStoreMap from './transforms/useStoreMap';
import useStoreBooks from './business/useStoreBooks';
import useBooksWithStores from './business/useBooksWithStores';

const useLibraryData = ({ storeId = null, searchTerm = '' } = {}) => {
  // ── Data fetching ──────────────────────────────────────────────
  const { books, setBooks, isLoading: booksLoading, error: booksError } = useBooks();
  const { authors, isLoading: authorsLoading, error: authorsError } = useAuthors();
  const { stores, isLoading: storesLoading, error: storesError } = useStores();
  const { inventory, setInventory, isLoading: inventoryLoading, error: inventoryError } = useInventory();

  // ── Transforms ─────────────────────────────────────────────────
  const authorMap = useAuthorMap(authors);
  const storeMap = useStoreMap(stores);

  // ── Business logic ─────────────────────────────────────────────
  const storeBooks = useStoreBooks({ storeId, books, inventory, authorMap, searchTerm });
  const booksWithStores = useBooksWithStores({ books, inventory, authorMap, storeMap });

  // ── Aggregated state ───────────────────────────────────────────
  const isLoading = booksLoading || authorsLoading || storesLoading || inventoryLoading;
  const error = booksError || authorsError || storesError || inventoryError;

  return {
    books,
    setBooks,
    authors,
    stores,
    inventory,
    setInventory,
    authorMap,
    storeMap,
    storeBooks,
    booksWithStores,
    isLoading,
    error,
    currentStore: stores.find((store) => store.id === parseInt(storeId, 10)),
  };
};

export default useLibraryData;