import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Loading from './Loading';
import Table from '../components/Table/Table';
import { useSearchParams } from 'react-router-dom';

import Modal from '../components/Modal';
import TableActions from '../components/ActionButton/TableActions';
import confirmToast from '../utils/confirmToast';
import useLibraryData from '../hooks/useLibraryData';

const Authors = () => {
  const { authors, setAuthors, isLoading } = useLibraryData();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [editingRowId, setEditingRowId] = useState(null);
  const [editName, setEditName] = useState('');
  const [newName, setNewName] = useState('');
  const [editError, setEditError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  // Sync searchTerm with query params
  useEffect(() => {
    const search = searchParams.get('search') || '';
    setSearchTerm(search);
  }, [searchParams]);

  // filter based on search
  const filteredAuthors = useMemo(() => {
    if (!searchTerm.trim()) return authors;
    const lowerSearch = searchTerm.toLowerCase();
    return authors.filter((author) =>
      Object.values(author).some((value) =>
        String(value).toLowerCase().includes(lowerSearch)
      )
    );
  }, [authors, searchTerm]);

  const columns = useMemo(
    () => [
      { header: 'ID', accessorKey: 'id' },
      {
        header: 'Name',
        accessorFn: (row) => `${row.first_name} ${row.last_name}`,
        id: 'name',
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
                  if (e.key === 'Enter') {
                    handleSave(row.original.id);
                  } else if (e.key === 'Escape') {
                    handleCancel();
                  }
                }}
                className={`rounded p-1 w-full outline-none focus:ring-2 ${editError ? 'border border-red-400 bg-red-50 focus:ring-red-300' : 'border border-gray-300 focus:ring-blue-500'}`}
                autoFocus
                aria-invalid={Boolean(editError)}
              />
              {editError ? <p className="mt-1 text-xs text-red-600">{editError}</p> : null}
            </div>
          ) : (
            `${row.original.first_name} ${row.original.last_name}`
          ),
      },
      {
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
            onDelete={() => deleteAuthor(row.original.id, row.original.first_name, row.original.last_name)}
          />
        ),
      },
    ],
    [editingRowId, editName, editError]
  );

  const deleteAuthor = async (id, first_name, last_name) => {
    const confirmed = await confirmToast(
      `Are you sure you want to delete ${first_name} ${last_name}?`
    );
    if (confirmed) {
      setAuthors((prevAuthors) => prevAuthors.filter((author) => author.id !== id));
      setEditingRowId(null);
      setEditName('');
      setNewName('');
      toast.success(`${first_name} ${last_name} has been deleted`);
    }
  };

  const handleEdit = (author) => {
    setEditingRowId(author.id);
    setEditName(`${author.first_name} ${author.last_name}`);
  };

  const handleSave = (id) => {
    if (!editName.trim()) {
      setEditError('Author name is required');
      toast.error('Author name is required');
      return;
    }

    const [first_name, ...last_name_parts] = editName.trim().split(' ');
    const last_name = last_name_parts.join(' ');

    setAuthors(
      authors.map((author) =>
        author.id === id
          ? { ...author, first_name, last_name: last_name || author.last_name }
          : author
      )
    );

    toast.success(`Author updated to "${editName.trim()}"`);
    setEditingRowId(null);
    setEditName('');
    setEditError('');
  };

  const handleCancel = () => {
    setEditingRowId(null);
    setEditName('');
    setEditError('');
  };

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setFormErrors({});
    setNewName('');
  };
  const handleAddNew = () => {
    if (newName.trim() === '') {
      setFormErrors({ name: 'Author name is required' });
      toast.error('Author name is required');
      return;
    }
    const [first_name, ...last_name_parts] = newName.trim().split(' ');
    const last_name = last_name_parts.join(' ');

    const newAuthor = {
      id: authors.length + 1,
      first_name,
      last_name: last_name || '',
    };

    setAuthors((prevAuthors) => [...prevAuthors, newAuthor]);
    toast.success(`${first_name} ${last_name || ''} has been added`.trim());

    setNewName('');
    setFormErrors({});
    closeModal();
  };

  return (
    <div className='py-6'>
      <Header addNew={openModal} title="Authors List" />
      {isLoading ? (
        <Loading />
      ) : (
        <Table
          data={filteredAuthors}
          columns={columns}
        />
      )}
      <Modal
        title={' New Author'}
        save={handleAddNew}
        cancel={closeModal}
        show={showModal}
        setShow={setShowModal}
      >
        <div className="flex flex-col gap-2 w-full">
          {formErrors.name ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
              {formErrors.name}
            </div>
          ) : null}
          <span>Author Name</span>
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              if (formErrors.name) {
                setFormErrors({});
              }
            }}
            className={`rounded p-1 ps-3 w-full outline-none focus:ring-2 ${formErrors.name ? 'border border-red-400 bg-red-50 focus:ring-red-300' : 'border border-gray-300 focus:ring-blue-500'}`}
            aria-invalid={Boolean(formErrors.name)}
          />
          {formErrors.name ? <p className="text-sm text-red-600">{formErrors.name}</p> : null}
        </div>
      </Modal>
    </div>
  );
};

export default Authors;