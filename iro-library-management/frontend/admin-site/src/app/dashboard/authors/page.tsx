"use client";

import {
  useAuthorsQuery,
  useCreateAuthorMutation,
  useDeleteAuthorMutation,
  useUpdateAuthorMutation,
} from "@/hooks/useAuthors";
import {
  Author,
  CreateAuthorData,
  UpdateAuthorData,
} from "@/services/authorService";
import {
  Edit,
  Globe,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AuthorForm } from "../../../components/authors/AuthorForm";

export default function AuthorsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  // Debounce search to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: authorsData,
    isLoading,
    error,
  } = useAuthorsQuery({ page, search: debouncedSearch, limit: 10 });
  const authors = authorsData?.data?.authors || [];
  const pagination = authorsData?.data?.pagination;

  const createAuthorMutation = useCreateAuthorMutation({
    onSuccess: () => {
      setIsFormOpen(false);
    },
  });

  const updateAuthorMutation = useUpdateAuthorMutation({
    onSuccess: () => {
      setIsFormOpen(false);
      setEditingAuthor(null);
    },
  });

  const deleteAuthorMutation = useDeleteAuthorMutation();

  const handleCreate = (data: CreateAuthorData | UpdateAuthorData) => {
    createAuthorMutation.mutate(data as CreateAuthorData);
  };

  const handleUpdate = (data: CreateAuthorData | UpdateAuthorData) => {
    if (editingAuthor) {
      updateAuthorMutation.mutate({
        id: editingAuthor._id,
        data: data as UpdateAuthorData,
      });
    }
  };

  const handleDelete = (author: Author) => {
    if (window.confirm(`Are you sure you want to delete "${author.name}"?`)) {
      deleteAuthorMutation.mutate(author._id);
    }
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAuthor(null);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Loading authors...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
            Error
          </h3>
          <p className="text-red-600 dark:text-red-300">
            {error.message || "Failed to load authors"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Authors
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage book authors and their information
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Author
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <Users className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Authors
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pagination?.totalAuthors || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search authors by name, biography, or specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Authors Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {authors.map((author) => (
                <tr
                  key={author._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {author.photo ? (
                        <img
                          src={author.photo}
                          alt={author.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <UserCheck className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {author.name}
                        </div>
                        {author.slug && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            /{author.slug}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {author.genres?.slice(0, 2).join(", ") || "Not specified"}
                    </div>
                    {author.nationality && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {author.nationality}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {author.website && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <Globe className="h-3 w-3" />
                          Website
                        </div>
                      )}
                      {author.socialMedia?.twitter && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <span>@</span>
                          Social Media
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        author.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {author.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(author)}
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(author)}
                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(pagination.currentPage - 1) * 10 + 1} to{" "}
            {Math.min(pagination.currentPage * 10, pagination.totalAuthors)} of{" "}
            {pagination.totalAuthors} authors
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.totalPages}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Author Form Modal */}
      <AuthorForm
        author={editingAuthor}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingAuthor ? handleUpdate : handleCreate}
        loading={
          createAuthorMutation.isPending || updateAuthorMutation.isPending
        }
      />
    </div>
  );
}
