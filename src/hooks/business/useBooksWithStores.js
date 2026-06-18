import { useMemo } from 'react';

const useBooksWithStores = ({ books, inventory, authorMap, storeMap }) => {
  const booksWithStores = useMemo(() => {
    return books.map((book) => {
      const bookInventory = inventory.filter(
        (item) => item.book_id === book.id
      );
      const bookStores = bookInventory.map((item) => ({
        name: storeMap[item.store_id]?.name || 'Unknown Store',
        price: item.price,
      }));

      return {
        title: book.name,
        author: authorMap[book.author_id]?.name || 'Unknown Author',
        stores: bookStores,
      };
    });
  }, [books, inventory, authorMap, storeMap]);

  return booksWithStores;
};

export default useBooksWithStores;
