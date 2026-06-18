// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Loading from '../pages/Loading';
import StoreCard from '../components/Cards/StoreCard';
import BookCard from '../components/Cards/BookCard';
import AuthorCard from '../components/Cards/AuthorCard';
import useLibraryData from '../hooks/useLibraryData';

const Home = () => {
  const {
    stores,
    booksWithStores,
    authors,
    books,
    inventory,
    isLoading,
  } = useLibraryData();

  const storesWithMetrics = React.useMemo(() => {
    return stores.slice(0, 5).map((store) => { 
      const storeInventory = inventory.filter(
        (item) => item.store_id === store.id
      );
      const noOfBooks = storeInventory.length;
      const totalPrice = storeInventory.reduce((sum, item) => sum + item.price, 0);
      const averagePrice = noOfBooks > 0 ? totalPrice / noOfBooks : 0;

      return {
        id: store.id,
        name: store.name,
        noOfBooks,
        averagePrice,
      };
    });
  }, [stores, inventory]);

  const limitedBooksWithStores = booksWithStores.slice(0, 5);

  const authorsWithBookCount = React.useMemo(() => {
    return authors.slice(0, 5).map((author) => { 
      const noOfBooks = books.filter((book) => book.author_id === author.id).length;
      return {
        id: author.id,
        name: `${author.first_name} ${author.last_name}`,
        noOfBooks,
      };
    });
  }, [authors, books]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="py-4 sm:py-6 px-0 sm:px-4">
      {/* Stores Section */}
      <section className="mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Stores</h2>
          <Link 
            to="/browsestores" 
            className="bg-main text-white px-4 py-2 rounded-md hover:bg-main/90 transition-colors w-full sm:w-auto text-center"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {storesWithMetrics.map((store, index) => (
            <div key={store.id ?? index}>
              <StoreCard
                name={store.name}
                noOfBooks={store.noOfBooks}
                averagePrice={store.averagePrice}
                id={store.id}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Books Section */}
      <section className="mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Books</h2>
          <Link 
            to="/browsebooks" 
            className="bg-main text-white px-4 py-2 rounded-md hover:bg-main/90 transition-colors w-full sm:w-auto text-center"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {limitedBooksWithStores.map((book, index) => (
            <div key={book.title ?? index}>
              <BookCard
                title={book.title}
                author={book.author}
                stores={book.stores}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Authors Section */}
      <section className="mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Authors</h2>
          <Link 
            to="/browseauthors" 
            className="bg-main text-white px-4 py-2 rounded-md hover:bg-main/90 transition-colors w-full sm:w-auto text-center"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {authorsWithBookCount.map((author) => (
            <div key={author.id}>
              <AuthorCard
                id={author.id}
                name={author.name}
                noOfBooks={author.noOfBooks}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;