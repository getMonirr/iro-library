"use client";

import { BookForm } from "@/components/books/BookForm";
import { BooksTable } from "@/components/books/BooksTable";
import {
  useBooksQuery,
  useCreateBookMutation,
  useDeleteBookMutation,
  useUpdateBookMutation,
} from "@/hooks/useBooks";
import { Book, CreateBookData, UpdateBookData } from "@/services/bookService";
import { BookOpen, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function BooksPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // React Query hooks
  const {
    data: booksResponse,
    isLoading: loading,
    error,
    refetch: fetchBooks,
  } = useBooksQuery({
    page: currentPage,
    limit: 20, // Increased from 10 to 20 to show more books per page
    search: debouncedSearchQuery || undefined,
  });

  const createBookMutation = useCreateBookMutation({
    onSuccess: () => {
      setShowAddModal(false);
    },
  });

  const updateBookMutation = useUpdateBookMutation({
    onSuccess: () => {
      setShowEditModal(false);
      setSelectedBook(null);
    },
  });

  const deleteBookMutation = useDeleteBookMutation();

  // Extract data from response
  const books = booksResponse?.data?.books || [];
  const totalPages = booksResponse?.data?.pagination?.totalPages || 1;
  const totalBooksCount = booksResponse?.data?.pagination?.totalBooks || 0;

  const handleCreateBook = async (
    bookData: CreateBookData | UpdateBookData
  ) => {
    createBookMutation.mutate(bookData as CreateBookData);
  };

  const handleUpdateBook = async (
    bookData: CreateBookData | UpdateBookData
  ) => {
    if (!selectedBook) return;
    updateBookMutation.mutate({
      id: selectedBook._id,
      data: bookData as UpdateBookData,
    });
  };

  const handleEditBook = (bookId: string) => {
    const book = books.find((b) => b._id === bookId);
    if (book) {
      setSelectedBook(book);
      setShowEditModal(true);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    deleteBookMutation.mutate(bookId);
  };

  const handleViewBook = (bookId: string) => {
    // For now, just show an alert. You can implement a detailed view later
    toast("Book details view coming soon!", { icon: "ℹ️" });
  };

  // Calculate statistics from current page
  const totalBooks = books.reduce(
    (sum: number, book: Book) => sum + book.totalCopies,
    0
  );
  const availableBooks = books.reduce(
    (sum: number, book: Book) => sum + book.availableCopies,
    0
  );

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
            Error Loading Books
          </h3>
          <p className="text-red-600 dark:text-red-300">
            {error.message || "Failed to load books"}
          </p>
          <button
            onClick={() => fetchBooks()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center gap-3 mb-4 lg:mb-0">
          <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Books Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your library collection
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Book
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Books
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totalBooksCount}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Copies
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totalBooks}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <BookOpen className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Available Copies
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {availableBooks}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {searchQuery !== debouncedSearchQuery && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Loading books...
            </p>
          </div>
        ) : books.length === 0 ? (
          <div className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No books found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery
                ? "No books match your search criteria."
                : "Get started by adding your first book."}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Your First Book
            </button>
          </div>
        ) : (
          <BooksTable
            books={books}
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
            onView={handleViewBook}
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {books.length} of {totalBooksCount} books
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Last
            </button>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      <BookForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateBook}
        loading={createBookMutation.isPending}
      />

      {/* Edit Book Modal */}
      <BookForm
        book={selectedBook || undefined}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBook(null);
        }}
        onSubmit={handleUpdateBook}
        loading={updateBookMutation.isPending}
      />
    </div>
  );
}
