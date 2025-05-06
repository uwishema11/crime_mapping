import { useEffect, useState } from 'react';
import { Trash2, PenLine } from 'lucide-react';
import { FadeLoader } from 'react-spinners';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import UserForm from './userForm';
import useUserStore from '@/store/user';
import TableComponent from '../Table';
import { toast } from 'sonner';

const UsersTable = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const {
    users,
    search,
    setSearch,
    filter,
    setFilter,
    editingUser,
    page,
    setPage,
    limit,
    setLimit,
    isFilterOpen,
    isUserFormOpen,
    openUserForm,
    fetchUsers,
    pagination,
    loadingFetch,
    error,
    deleteUser,
    toggleFilterDropdown,
  } = useUserStore();

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchUsers({ limit, page, search, filter });
      if (!result.success) {
        toast.error(result.message);
      }
      setIsInitialLoad(false);
    };
    fetchData();
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    const result = await deleteUser(id);
    if (result.success === true) {
      toast.success(result.message || 'User deleted successfully');
      fetchUsers({ limit, page, search, filter });
    } else {
      toast.error(result.message || 'Failed to delete user');
    }
  };

  if (isInitialLoad && loadingFetch)
    return (
      <div className="flex items-center justify-center mt-10">
        <FadeLoader color="#3B82F6" />
      </div>
    );

  const userColumns = [
    { header: 'ID', accessorKey: 'id' },
    {
      header: 'PICTURE',
      accessorKey: 'image_url',
      cell: ({ getValue }) => {
        const imgUrl = getValue();
        const fallbackImg = '/default.jpg';
        const isValidImg = imgUrl && imgUrl.trim() !== '';

        return (
          <img
            src={isValidImg ? imgUrl : fallbackImg}
            alt="user profile"
            className="w-13 h-13 p-2 object-cover rounded-full"
            onError={(e) => {
              e.target.src = fallbackImg;
            }}
          />
        );
      },
    },
    { header: 'Role', accessorKey: 'role' },
    { header: 'First Name', accessorKey: 'firstName' },
    { header: 'Last Name', accessorKey: 'lastName' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Status', accessorKey: 'status' },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="p-2 text-blue-600 hover:bg-gray-100 rounded-full"
            onClick={() => openUserForm('edit', row.original)}
            aria-label="Edit"
          >
            <PenLine className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-red-600 hover:bg-gray-100 rounded-full"
            onClick={() =>
              row.original.id !== undefined && handleDelete(row.original.id)
            }
            aria-label="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
    fetchUsers({ filter, page: newPage, limit, search });
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
    fetchUsers({ filter, page: 1, limit: newLimit, search });
  };

  const handleSearch = (text) => {
    setSearch(text);
    const timeoutId = setTimeout(() => {
      fetchUsers({ filter, page, limit, search: text });
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleFilter = (fil) => {
    setFilter(fil);
    fetchUsers({ filter: fil, page, limit, search });
    toggleFilterDropdown();
  };

  return (
    <div className="rounded-lg p-4 bg-white">
      <h1 className="text-gray-700 font-bold text-3xl mb-6">All Users</h1>

      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search user..."
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <button
              className="w-full sm:w-auto px-4 py-2 bg-[#0A66C2] text-white rounded hover:bg-blue-700"
              onClick={toggleFilterDropdown}
            >
              Filter: {filter}
            </button>
            {isFilterOpen && (
              <div className="absolute z-10 right-0 mt-2 w-40 bg-white text-black border border-gray-300 rounded shadow-lg">
                <ul>
                  <li
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                      filter === 'ACTIVE' ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => handleFilter('ACTIVE')}
                  >
                    Active
                  </li>
                  <li
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                      filter === 'BLOCKED' ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => handleFilter('BLOCKED')}
                  >
                    Blocked
                  </li>
                </ul>
              </div>
            )}
          </div>
          <button
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={() => openUserForm('add')}
          >
            Add user
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <TableComponent columns={userColumns} data={users} />

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page:
            </label>
            <select
              id="rows-per-page"
              value={limit}
              onChange={(e) => {
                handleLimitChange(Number(e.target.value));
              }}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {[3, 10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-4 py-2 rounded ${
                page === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Previous
            </button>
            <span className="text-sm font-medium">
              {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages}
              className={`px-4 py-2 rounded ${
                page === pagination.totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Sheet open={isUserFormOpen} onOpenChange={() => !isUserFormOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editingUser ? 'Edit User' : 'Add New User'}
            </SheetTitle>
          </SheetHeader>
          {isUserFormOpen && (
            <UserForm initialValues={editingUser || undefined} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default UsersTable;
