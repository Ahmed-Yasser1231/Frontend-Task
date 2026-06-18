import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Loading from './Loading';
import BooksTable from '../components/BooksTable';
import { useSearchParams } from 'react-router-dom';
import Modal from '../components/Modal';
import confirmToast from '../utils/confirmToast';
import useLibraryData from '../hooks/useLibraryData';

const Books = () => {
  const { books, setBooks, authors, isLoading } = useLibraryData();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [editingRowId, setEditingRowId] = useState(null);
  const [editName, setEditName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [newBook, setNewBook] = useState({
    author_id: '',
    name: '',
    page_count: '',
  });

  // Sync search term with URL params
  useEffect(() => {
    const search = searchParams.get('search') || '';
    setSearchTerm(search);
  }, [searchParams]);

  // Filter books based on search
  const filteredBooks = books.filter((book) => {
    if (!searchTerm.trim()) return true;
    return Object.values(book).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Delete book handler
  const deleteBook = async (id, name) => {
    const confirmed = await confirmToast(`Are you sure you want to delete "${name}"?`);
    if (confirmed) {
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
      setEditingRowId(null);
      setEditName('');
      toast.success(`"${name}" has been deleted`);
    }
  };

  const validateNewBook = () => {
    const nextErrors = {};

    if (!newBook.name.trim()) {
      nextErrors.name = 'Book name is required';
    }

    if (!newBook.page_count.toString().trim()) {
      nextErrors.page_count = 'Page count is required';
    } else if (Number(newBook.page_count) <= 0) {
      nextErrors.page_count = 'Page count must be greater than 0';
    }

    if (!newBook.author_id) {
      nextErrors.author_id = 'Please select an author';
    }

    return nextErrors;
  };

  // Add new book handler
  const handleAddNew = () => {
    const nextErrors = validateNewBook();

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      toast.error('Please fix the highlighted fields');
      return;
    }

    const newId = books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;
    const newBookObject = {
      id: newId,
      author_id: parseInt(newBook.author_id),
      name: newBook.name,
      page_count: parseInt(newBook.page_count),
    };

    setBooks((prevBooks) => [...prevBooks, newBookObject]);
    setNewBook({ author_id: '', name: '', page_count: '' });
    setFormErrors({});
    setShowModal(false);
    toast.success(`"${newBookObject.name}" has been added`);
  };

  const handleFieldChange = (field, value) => {
    if (field === 'page_count') {
      if (value === '') {
        setNewBook((previous) => ({ ...previous, page_count: '' }));
        setFormErrors((previous) => ({ ...previous, page_count: undefined }));
        return;
      }

      if (Number(value) <= 0) {
        setFormErrors((previous) => ({
          ...previous,
          page_count: 'Page count must be greater than 0',
        }));
        return;
      }
    }

    setNewBook((previous) => ({ ...previous, [field]: value }));
    setFormErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormErrors({});
    setNewBook({ author_id: '', name: '', page_count: '' });
  };

  return (
    <div className="py-6">
      <Header addNew={() => setShowModal(true)} title="Books List" />
      {isLoading ? (
        <Loading />
      ) : (
        <BooksTable
          books={filteredBooks}
          authors={authors}
          editingRowId={editingRowId}
          setEditingRowId={setEditingRowId}
          editName={editName}
          setEditName={setEditName}
          setBooks={setBooks}
          deleteBook={deleteBook}
        />
      )}
      <Modal
        title="New Book"
        save={handleAddNew}
        cancel={handleCloseModal}
        show={showModal}
        setShow={setShowModal}
      >
        <div className="flex flex-col gap-4 w-full">
          {Object.values(formErrors).some(Boolean) ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
              Please correct the highlighted fields before saving.
            </div>
          ) : null}
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
              Book Name
            </label>
            <input
              id="name"
              type="text"
              value={newBook.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className={`rounded p-2 w-full outline-none transition shadow-sm focus:ring-2 ${formErrors.name ? 'border border-red-400 bg-red-50 focus:ring-red-300' : 'border border-gray-300 focus:ring-main'}`}
              placeholder="Enter Book Name"
              required
              aria-invalid={Boolean(formErrors.name)}
            />
            {formErrors.name ? <p className="mt-1 text-sm text-red-600">{formErrors.name}</p> : null}
          </div>
          <div>
            <label htmlFor="page_count" className="block text-gray-700 font-medium mb-1">
              Number of Pages
            </label>
            <input
              id="page_count"
              type="number"
              min="1"
              step="1"
              value={newBook.page_count}
              onChange={(e) => handleFieldChange('page_count', e.target.value)}
              className={`rounded p-2 w-full outline-none transition shadow-sm focus:ring-2 ${formErrors.page_count ? 'border border-red-400 bg-red-50 focus:ring-red-300' : 'border border-gray-300 focus:ring-main'}`}
              placeholder="Enter Page Count"
              required
              aria-invalid={Boolean(formErrors.page_count)}
            />
            {formErrors.page_count ? <p className="mt-1 text-sm text-red-600">{formErrors.page_count}</p> : null}
          </div>
          <div>
            <label htmlFor="author_id" className="block text-gray-700 font-medium mb-1">
              Author
            </label>
            <select
              id="author_id"
              value={newBook.author_id}
              onChange={(e) => handleFieldChange('author_id', e.target.value)}
              className={`rounded p-2 w-full outline-none transition shadow-sm focus:ring-2 ${formErrors.author_id ? 'border border-red-400 bg-red-50 focus:ring-red-300' : 'border border-gray-300 focus:ring-main'}`}
              required
              aria-invalid={Boolean(formErrors.author_id)}
            >
              <option value="" disabled>Select an Author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.first_name} {author.last_name}
                </option>
              ))}
            </select>
            {formErrors.author_id ? <p className="mt-1 text-sm text-red-600">{formErrors.author_id}</p> : null}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Books;