// src/pages/Browse.jsx
import React from 'react';
import Loading from '../pages/Loading';
import BookCard from '../components/Cards/BookCard';
import useLibraryData from '../hooks/useLibraryData';

const BrowseBooks = () => {
  // Use the custom hook
  const { booksWithStores, isLoading } = useLibraryData();

  if (isLoading) {
    return <Loading />;
  }

return (
    <div className="py-4 sm:py-6 px-0 sm:px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse All Books</h2>
        <div className="grid grid-cols-1 gap-4 ">
            {booksWithStores.map((book) => (
                <BookCard
                    key={book.title}
                    title={book.title}
                    author={book.author}
                    stores={book.stores}
                />
            ))}
        </div>
    </div>
);
};

export default BrowseBooks;