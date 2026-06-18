import React, { useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import authorImg1 from '../assets/a1.png';
import authorImg2 from '../assets/a2.png';
import Loading from './Loading';
import useLibraryData from '../hooks/useLibraryData';

const AuthorProfile = () => {
  const { authorId } = useParams();
  const navigate = useNavigate();
  const { authors, books, isLoading } = useLibraryData();
  const topRef = React.useRef(null);

  useLayoutEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTop = 0;
      mainElement.scrollLeft = 0;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    topRef.current?.scrollIntoView({ block: 'start', inline: 'start' });
  }, [authorId]);

  const author = authors.find((item) => item.id === Number(authorId));

  const profileImage = Number(authorId) % 2 === 0 ? authorImg2 : authorImg1;
  const authorBooks = books.filter((book) => book.author_id === Number(authorId));

  if (isLoading) {
    return <Loading />;
  }

  if (!author) {
    return (
      <div className="py-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Author not found</h1>
          <p className="mt-2 text-sm text-gray-600">
            We could not find an author for this profile link.
          </p>
          <button
            type="button"
            onClick={() => navigate('/browseauthors')}
            className="mt-4 rounded-lg bg-main px-4 py-2 text-white"
          >
            Back to Authors
          </button>
        </div>
      </div>
    );
  }

  const fullName = `${author.first_name} ${author.last_name}`.trim();

  return (
    <motion.div
      ref={topRef}
      className="py-4 sm:py-6 px-0 sm:px-4 scroll-mt-0"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <motion.div
        className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Author Profile</h1>
          <p className="text-sm text-gray-500">Shop &gt; Authors &gt; {fullName}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700"
        >
          Go Back
        </button>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-[18rem_minmax(0,1fr)] gap-6">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <img
              src={profileImage}
              alt={fullName}
              className="h-28 w-28 rounded-2xl object-cover shadow-sm"
            />
            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-gray-800 break-words">{fullName}</h2>
              <p className="mt-1 text-sm text-gray-500">Author ID: {author.id}</p>
              <p className="mt-1 text-sm text-gray-500">Email: {author.email}</p>
              <p className="mt-1 text-sm text-gray-500">Nationality: {author.nationality}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-main/10 p-4">
              <p className="text-sm text-gray-600">Books written</p>
              <p className="mt-1 text-2xl font-bold text-main">{authorBooks.length}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-600">Profile status</p>
              <p className="mt-1 text-lg font-semibold text-gray-800">Active</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.14 }}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Books by {fullName}</h3>
              <p className="text-sm text-gray-500">{authorBooks.length} total books in the library</p>
            </div>
            <Link
              to="/browsebooks"
              className="rounded-lg bg-main px-4 py-2 text-sm text-white"
            >
              Browse Books
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            {authorBooks.length > 0 ? (
              authorBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col gap-2 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 break-words">{book.name}</p>
                    <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <span className="rounded-full bg-gray-100 px-3 py-1">{book.language}</span>
                    <span className="rounded-full bg-gray-100 px-3 py-1">{book.format}</span>
                    <span className="rounded-full bg-gray-100 px-3 py-1">{book.page_count} pages</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
                No books are linked to this author yet.
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default AuthorProfile;
