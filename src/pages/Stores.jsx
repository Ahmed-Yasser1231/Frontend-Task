import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Loading from './Loading';
import Table from '../components/Table/Table';
import { useSearchParams } from 'react-router-dom';
import Modal from '../components/Modal';
import TableActions from '../components/ActionButton/TableActions';
import { useNavigate } from 'react-router-dom';
import confirmToast from '../utils/confirmToast';
import useLibraryData from '../hooks/useLibraryData';

const Stores = () => {
  const navigate = useNavigate();
  const { stores, setStores, isLoading } = useLibraryData();
  

  const handleViewStoreInventory = (storeId) => {
    navigate(`/store/${storeId}`);
  };  

  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [editingRowId, setEditingRowId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editError, setEditError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    address: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Sync search term with URL query parameters
  useEffect(() => {
    const search = searchParams.get('search') || '';
    setSearchTerm(search);
  }, [searchParams]);

  // Enrich stores with computed address and filter based on search term
  const filteredStores = useMemo(() => {
    const enrichedStores = stores.map((store) => ({
      ...store,
      full_address: `${store.address_1}${store.address_2 ? `, ${store.address_2}` : ''}, ${store.city}, ${store.state} ${store.zip}`,
    }));

    if (!searchTerm.trim()) return enrichedStores;

    const lowerSearch = searchTerm.toLowerCase();
    return enrichedStores.filter((store) =>
      Object.values(store).some((value) =>
        String(value).toLowerCase().includes(lowerSearch)
      )
    );
  }, [stores, searchTerm]);

  // Define table columns
  const columns = useMemo(
    () => [
      { header: 'Store Id', accessorKey: 'id' },
      {
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
                className={`rounded p-1 w-full outline-none focus:ring-2 ${editError ? 'border border-red-400 bg-red-50 focus:ring-red-300' : 'border border-gray-300 focus:ring-blue-500'}`}
                autoFocus
                aria-invalid={Boolean(editError)}
              />
              {editError ? <p className="mt-1 text-xs text-red-600">{editError}</p> : null}
            </div>
          ) : (
            row.original.name
          ),
      },
      { header: 'Address', accessorKey: 'full_address' },
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
            onDelete={() => deleteStore(row.original.id, row.original.name)}
          />
        ),
      },
    ],
    [editingRowId, editName, editError]
  );

  // Handle store deletion
  const deleteStore = async (id, name) => {
    const confirmed = await confirmToast(`Are you sure you want to delete "${name}"?`);
    if (confirmed) {
      setStores((prevStores) => prevStores.filter((store) => store.id !== id));
      setEditingRowId(null);
      setEditName('');
      toast.success(`"${name}" has been deleted`);
    }
  };

  // Initiate editing
  const handleEdit = (store) => {
    setEditingRowId(store.id);
    setEditName(store.name);
  };

  // Save edited name
  const handleSave = (id) => {
    if (!editName.trim()) {
      setEditError('Store name is required');
      toast.error('Store name is required');
      return;
    }

    setStores(
      stores.map((store) =>
        store.id === id ? { ...store, name: editName.trim() } : store
      )
    );
    toast.success(`Store updated to "${editName.trim()}"`);
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

  // Modal controls
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setFormErrors({});
    setNewStore({
      name: '',
      address: '',
    });
  };

  // Parse address to extract address_1, address_2, city, state, and zip
  const parseAddress = (address) => {
    if (!address || address.trim() === '') {
      return { address_1: '', address_2: '', city: '', state: '', zip: '' };
    }

    // Split the address by commas
    const parts = address.split(',').map((part) => part.trim());


    if (parts.length < 3) {
      return { address_1: address, address_2: '', city: '', state: '', zip: '' };
    }

    // Last part should be "state zip"
    const lastPart = parts[parts.length - 1].trim();
    const stateZipMatch = lastPart.match(/(\w+)\s+(\d{5})/);
    let state = '';
    let zip = '';
    if (stateZipMatch) {
      state = stateZipMatch[1];
      zip = stateZipMatch[2];
    } else {
      state = lastPart;
      zip = '';
    }

    const city = parts[parts.length - 2];

    const address_1 = parts[0];
    const address_2 = parts.length > 3 ? parts[1] : '';

    return { address_1, address_2, city, state, zip };
  };

  // Add new store
  const handleAddNew = () => {
    const nextErrors = {};

    if (newStore.name.trim() === '') {
      nextErrors.name = 'Store name is required';
    }

    if (newStore.address.trim() === '') {
      nextErrors.address = 'Store address is required';
    }

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      toast.error('Please fix the highlighted fields');
      return;
    }

    // Parse the address to extract fields
    const { address_1, address_2, city, state, zip } = parseAddress(newStore.address);

    if (!city || !state || !zip) {
      toast.error('Address must include city, state, and zip (e.g., "123 Main St, Athens, GA 30605")');
      return;
    }

    const newId = stores.length > 0 ? Math.max(...stores.map((s) => s.id)) + 1 : 1;
    const newStoreObject = {
      id: newId,
      name: newStore.name,
      address_1,
      address_2,
      city,
      state,
      zip,
    };

    setStores((prevStores) => [...prevStores, newStoreObject]);
    toast.success(`"${newStoreObject.name}" has been added`);
    setNewStore({
      name: '',
      address: '',
    });
    setFormErrors({});
    closeModal();
  };
  const onRowClick = (e, rw) => {
    handleViewStoreInventory(rw.id);
}
  return (
    <div className="py-6">
      <Header addNew={openModal} title="Stores List" />
      {isLoading ? (
        <Loading />
      ) : (
        <Table data={filteredStores} columns={columns} onRowClick={onRowClick} />
      )}
      <Modal
        title="New Store"
        save={handleAddNew}
        cancel={closeModal}
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
              Store Name
            </label>
            <input
              id="name"
              type="text"
              value={newStore.name}
              onChange={(e) => {
                setNewStore({ ...newStore, name: e.target.value });
                if (formErrors.name) {
                  setFormErrors((previous) => ({ ...previous, name: undefined }));
                }
              }}
              className={`rounded p-2 w-full outline-none transition shadow-sm focus:ring-2 ${formErrors.name ? 'border border-red-400 bg-red-50 focus:ring-red-300' : 'border border-gray-300 focus:ring-main'}`}
              placeholder="Enter Store Name"
              required
              aria-invalid={Boolean(formErrors.name)}
            />
            {formErrors.name ? <p className="mt-1 text-sm text-red-600">{formErrors.name}</p> : null}
          </div>
          <div>
            <label htmlFor="address" className="block text-gray-700 font-medium mb-1">
              Address
            </label>
            <input
              id="address"
              type="text"
              value={newStore.address}
              onChange={(e) => {
                setNewStore({ ...newStore, address: e.target.value });
                if (formErrors.address) {
                  setFormErrors((previous) => ({ ...previous, address: undefined }));
                }
              }}
              className={`rounded p-2 w-full outline-none transition shadow-sm focus:ring-2 ${formErrors.address ? 'border border-red-400 bg-red-50 focus:ring-red-300' : 'border border-gray-300 focus:ring-main'}`}
              placeholder="e.g., 123 Main St, 2nd Floor, Athens, GA 30605"
              required
              aria-invalid={Boolean(formErrors.address)}
            />
            {formErrors.address ? <p className="mt-1 text-sm text-red-600">{formErrors.address}</p> : null}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Stores;