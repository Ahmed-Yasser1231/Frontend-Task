import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Loading from './Loading';
import Modal from '../components/Modal';
import Table from '../components/Table/Table';
import TableActions from '../components/ActionButton/TableActions';
import confirmToast from '../utils/confirmToast';
import useLibraryData from '../hooks/useLibraryData';

const StoreInventory = () => {
  const { storeId } = useParams();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeTab, setActiveTab] = useState('books');
  const [showModal, setShowModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [bookPickerSearch, setBookPickerSearch] = useState('');
  const [editingInventoryId, setEditingInventoryId] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  const { books, authors, inventory, setInventory, storeBooks, currentStore, isLoading } = useLibraryData({
    storeId,
    searchTerm,
  });

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const handleOpenModal = () => {
    setSelectedBookId(String(books[0]?.id || ''));
    setPriceInput('');
    setBookPickerSearch('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBookId('');
    setPriceInput('');
    setBookPickerSearch('');
  };

  const handleSaveInventoryItem = () => {
    const parsedPrice = Number.parseFloat(priceInput);
    const bookId = Number.parseInt(selectedBookId, 10);

    if (!bookId || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error('Select a book and enter a price greater than 0');
      return;
    }

    const existingItem = inventory.find(
      (item) => item.store_id === Number.parseInt(storeId, 10) && item.book_id === bookId
    );

    if (existingItem) {
      setInventory((previous) =>
        previous.map((item) =>
          item.id === existingItem.id ? { ...item, price: parsedPrice } : item
        )
      );
      toast.success('Inventory price updated');
      handleCloseModal();
      return;
    }

    const newInventoryItem = {
      id: inventory.length > 0 ? Math.max(...inventory.map((item) => item.id)) + 1 : 1,
      book_id: bookId,
      store_id: Number.parseInt(storeId, 10),
      price: parsedPrice,
    };

    setInventory((previous) => [...previous, newInventoryItem]);
    toast.success('Book added to inventory');
    handleCloseModal();
  };

  const handleBookPickerSearch = (value) => {
    setBookPickerSearch(value);
    const normalized = value.trim().toLowerCase();
    const firstMatch = getAvailableBooks(normalized)[0];
    setSelectedBookId(firstMatch ? String(firstMatch.id) : '');
  };

  const handleEditPrice = (row) => {
    setEditingInventoryId(row.inventoryId);
    setEditPrice(String(row.price ?? ''));
  };

  const handleCancelEdit = () => {
    setEditingInventoryId(null);
    setEditPrice('');
  };

  const handleSavePrice = (inventoryId) => {
    const parsedPrice = Number.parseFloat(editPrice);

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    setInventory((previous) =>
      previous.map((item) =>
        item.id === inventoryId ? { ...item, price: parsedPrice } : item
      )
    );
    toast.success('Price updated');
    handleCancelEdit();
  };

  const handleDeleteInventoryItem = async (row) => {
    const confirmed = await confirmToast(`Remove ${row.name} from this store?`);
    if (!confirmed) {
      return;
    }

    setInventory((previous) => previous.filter((item) => item.id !== row.inventoryId));
    toast.success(`${row.name} removed from inventory`);
  };

  const inventoryColumns = useMemo(
    () => [
      { header: 'Book ID', accessorKey: 'id' },
      { header: 'Book', accessorKey: 'name' },
      { header: 'Pages', accessorKey: 'page_count' },
      { header: 'Author', accessorKey: 'author_name' },
      {
        header: 'Price',
        accessorKey: 'price',
        cell: ({ row }) =>
          editingInventoryId === row.original.inventoryId ? (
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={editPrice}
              onChange={(event) => setEditPrice(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSavePrice(row.original.inventoryId);
                }
                if (event.key === 'Escape') {
                  handleCancelEdit();
                }
              }}
              className="border border-gray-300 rounded p-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            `$${Number(row.original.price ?? 0).toFixed(2)}`
          ),
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <TableActions
            row={row}
            onEdit={
              editingInventoryId === row.original.inventoryId
                ? handleCancelEdit
                : () => handleEditPrice(row.original)
            }
            onDelete={() => handleDeleteInventoryItem(row.original)}
          />
        ),
      },
    ],
    [editingInventoryId, editPrice]
  );

  const authorsWithInventory = useMemo(() => {
    return Object.values(
      storeBooks.reduce((groups, book) => {
        const key = book.author_name || 'Unknown Author';
        if (!groups[key]) {
          groups[key] = { name: key, count: 0, total: 0 };
        }
        groups[key].count += 1;
        groups[key].total += Number(book.price || 0);
        return groups;
      }, {})
    ).map((group) => ({
      ...group,
      averagePrice: group.count ? group.total / group.count : 0,
    }));
  }, [storeBooks]);

  const availableBooks = useMemo(() => {
    const storeBookIds = new Set(
      inventory
        .filter((item) => item.store_id === Number.parseInt(storeId, 10))
        .map((item) => item.book_id)
    );

    return books
      .filter((book) => !storeBookIds.has(book.id) || storeBooks.some((storeBook) => storeBook.id === book.id))
      .slice(0, 7);
  }, [books, inventory, storeBooks, storeId]);

  const getAvailableBooks = (normalizedSearch = '') => {
    const storeBookIds = new Set(
      inventory
        .filter((item) => item.store_id === Number.parseInt(storeId, 10))
        .map((item) => item.book_id)
    );

    const scopedBooks = books.filter((book) => !storeBookIds.has(book.id) || storeBooks.some((storeBook) => storeBook.id === book.id));

    const filteredBooks = normalizedSearch
      ? scopedBooks.filter((book) => book.name.toLowerCase().includes(normalizedSearch))
      : scopedBooks;

    return filteredBooks.slice(0, normalizedSearch ? filteredBooks.length : 7);
  };

  const filteredAvailableBooks = useMemo(
    () => getAvailableBooks(bookPickerSearch.trim().toLowerCase()),
    [bookPickerSearch, books, inventory, storeBooks, storeId]
  );

  const authorLookup = useMemo(
    () => authors.reduce((map, author) => {
      map[author.id] = `${author.first_name} ${author.last_name}`;
      return map;
    }, {}),
    [authors]
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!currentStore) {
    return (
      <div className="py-6">
        <p className="text-gray-600">Store not found.</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex mb-4 w-full justify-center items-center">
        <button
          onClick={() => setActiveTab('books')}
          className={`px-4 border-b-2 py-2 ${activeTab === 'books' ? 'border-b-main' : 'border-b-transparent'}`}
        >
          Books
        </button>
        <button
          onClick={() => setActiveTab('authors')}
          className={`px-4 border-b-2 py-2 ${activeTab === 'authors' ? 'border-b-main' : 'border-b-transparent'}`}
        >
          Authors
        </button>
      </div>

      <Header addNew={handleOpenModal} title={`Store Inventory - ${currentStore.name}`} buttonTitle="Add to inventory" />

      {activeTab === 'books' ? (
        storeBooks.length > 0 ? (
          <Table data={storeBooks} columns={inventoryColumns} />
        ) : (
          <p className="text-gray-600">No books found in this store.</p>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {authorsWithInventory.map((author) => (
            <div key={author.name} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <p className="font-semibold text-gray-800">{author.name}</p>
              <p className="text-sm text-gray-600">Books in store: {author.count}</p>
              <p className="text-sm text-gray-600">Average price: ${author.averagePrice.toFixed(2)}</p>
            </div>
          ))}
          {authorsWithInventory.length === 0 ? <p className="text-gray-600">No authors with books in this store.</p> : null}
        </div>
      )}

      <Modal
        title="Add Book to Inventory"
        save={handleSaveInventoryItem}
        cancel={handleCloseModal}
        show={showModal}
        setShow={setShowModal}
      >
        <div className="flex flex-col gap-4 w-full">
          <div>
            <label htmlFor="book_search" className="block text-gray-700 font-medium mb-1">
              Search Book
            </label>
            <input
              id="book_search"
              type="text"
              value={bookPickerSearch}
              onChange={(event) => handleBookPickerSearch(event.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Search by title"
            />
          </div>

          <div>
            <label htmlFor="book_select" className="block text-gray-700 font-medium mb-1">
              Select Book
            </label>
            <select
              id="book_select"
              value={selectedBookId}
              onChange={(event) => setSelectedBookId(event.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            >
              <option value="" disabled>Select a book</option>
              {filteredAvailableBooks.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.name} - {authorLookup[book.author_id] || 'Unknown Author'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-gray-700 font-medium mb-1">
              Price
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0.01"
              value={priceInput}
              onChange={(event) => setPriceInput(event.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Enter Price (e.g., 29.99)"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StoreInventory;