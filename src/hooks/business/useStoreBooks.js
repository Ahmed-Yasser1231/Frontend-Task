import { useMemo } from 'react';

const useStoreBooks = ({ storeId, books, inventory, authorMap, searchTerm }) => {
  const storeBooks = useMemo(() => {
    if (!storeId) {
      return books.map((book) => ({
        ...book,
        author_name: authorMap[book.author_id]?.name || 'Unknown Author',
        price: null,
        inventoryId: null,
      }));
    }

    const numericStoreId = parseInt(storeId, 10);
    const storeInventory = inventory.filter(
      (item) => item.store_id === numericStoreId
    );

    let filteredBooks = books
      .filter((book) =>
        storeInventory.some((item) => item.book_id === book.id)
      )
      .map((book) => {
        const inventoryItem = storeInventory.find(
          (item) => item.book_id === book.id
        );
        return {
          ...book,
          author_name: authorMap[book.author_id]?.name || 'Unknown Author',
          price: inventoryItem ? inventoryItem.price : null,
          inventoryId: inventoryItem ? inventoryItem.id : null,
        };
      });

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filteredBooks = filteredBooks.filter((book) =>
        Object.values({
          ...book,
          author_name: authorMap[book.author_id]?.name || 'Unknown Author',
        }).some((value) => String(value).toLowerCase().includes(lowerSearch))
      );
    }

    return filteredBooks;
  }, [storeId, books, inventory, authorMap, searchTerm]);

  return storeBooks;
};

export default useStoreBooks;
