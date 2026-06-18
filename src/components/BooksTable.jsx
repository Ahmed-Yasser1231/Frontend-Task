// src/components/BooksTable.jsx
import React, { useMemo } from 'react';
import toast from 'react-hot-toast';
import Table from './Table/Table';
import TableActions from './ActionButton/TableActions';

const BooksTable = ({
  books,
  authors,
  editingRowId,
  setEditingRowId,
  editName,
  setEditName,
  setBooks,
  deleteBook,
  columnsConfig = ['id', 'name', 'pages', 'author', 'actions'], // Default columns
}) => {
  const [editError, setEditError] = React.useState('');

  // Create a lookup map for authors
  const authorMap = useMemo(() => {
    return authors.reduce((map, author) => {
      map[author.id] = `${author.first_name} ${author.last_name}`;
      return map;
    }, {});
  }, [authors]);

  // Enrich books with author names
  const enrichedBooks = useMemo(() => {
    return books.map((book) => ({
      ...book,
      author_name: authorMap[book.author_id] || 'Unknown Author',
    }));
  }, [books, authorMap]);

  // Define all possible columns
  const allColumns = useMemo(
    () => ({
      id: { header: 'Book Id', accessorKey: 'id' },
      name: {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) =>
          editingRowId === row.original.id ? (
            <div className="w-full">
              <input
                type="text"
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value);
                  if (editError) {
                    setEditError('');
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave(row.original.id);
                  if (e.key === 'Escape') handleCancel();
                }}
                className={`w-full rounded p-1 outline-none focus:ring-2 ${editError ? 'border border-red-400 bg-red-50 focus:ring-red-300' : 'border border-gray-300 focus:ring-blue-500'}`}
                autoFocus
                aria-invalid={Boolean(editError)}
              />
              {editError ? <p className="mt-1 text-xs text-red-600">{editError}</p> : null}
            </div>
          ) : (
            row.original.name
          ),
      },
      pages: { header: 'Pages', accessorKey: 'page_count' },
      author: { header: 'Author', accessorKey: 'author_name' },
      price: { header: 'Price', accessorKey: 'price' },
      actions: {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <TableActions
            row={row}
            onEdit={
              editingRowId === row.original.id
                ? handleCancel
                : () => handleEdit(row.original)
            }
            onDelete={() => deleteBook(row.original.id, row.original.name)}
          />
        ),
      },
    }),
    [editingRowId, editName, editError]
  );

  // Select columns based on columnsConfig
  const columns = useMemo(() => {
    return columnsConfig.map((colKey) => allColumns[colKey]).filter(Boolean);
  }, [columnsConfig, allColumns]);

  // Handle editing
  const handleEdit = (book) => {
    setEditingRowId(book.id);
    setEditName(book.name);
  };

  // Save edited name
  const handleSave = (id) => {
    if (!editName.trim()) {
      setEditError('Book name is required');
      toast.error('Book name is required');
      return;
    }

    setBooks(
      books.map((book) =>
        book.id === id ? { ...book, name: editName.trim() } : book
      )
    );
    toast.success(`Book updated to "${editName.trim()}"`);
    setEditingRowId(null);
    setEditName('');
    setEditError('');
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingRowId(null);
    setEditName('');
    setEditError('');
  };

  return <Table data={enrichedBooks} columns={columns} />;
};

export default BooksTable;