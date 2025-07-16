"use client";

import { BooksTable } from "@/components/books/BooksTable";
import {
  Book,
  deleteBook,
  getBookCategories,
  getBooks,
} from "@/services/bookService";
import { BookOpen, Download, Filter, Plus, Search, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch books and categories
  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, [currentPage, searchQuery]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getBooks({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
      });

      if (response.success) {
        setBooks(response.data.books);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch books");
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getBookCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      const response = await deleteBook(bookId);
      if (response.success) {
        toast.success("Book deleted successfully");
        fetchBooks(); // Refresh the list
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete book");
    }
  };

  const handleEditBook = (bookId: string) => {
    // TODO: Implement edit functionality
    console.log("Edit book:", bookId);
    toast("Edit functionality coming soon");
  };

  const handleViewBook = (bookId: string) => {
    // TODO: Implement view functionality
    console.log("View book:", bookId);
    toast("View functionality coming soon");
  };

  const handleAddBookSuccess = () => {
    setShowAddModal(false);
    fetchBooks(); // Refresh the list
    toast.success("Book added successfully");
  };

  // Calculate stats from current books
  const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
  const availableBooks = books.reduce(
    (sum, book) => sum + book.availableCopies,
    0
  );
  const borrowedBooks = totalBooks - availableBooks;

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.authors.some((author) =>
        author.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      (book.isbn && book.isbn.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Books Management
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Manage your library's book collection
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </button>
          <button className="btn-outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          <button className="btn-outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Books
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totalBooks}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Available
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {availableBooks}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Borrowed
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {borrowedBooks}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Categories
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {categories.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search books by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500">
              Filters will be implemented here
            </div>
          </div>
        )}
      </div>

      {/* Books Table */}
      <div className="card">
        <BooksTable
          books={filteredBooks}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
          onView={handleViewBook}
        />
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Add New Book</h2>
            <p className="text-gray-600 mb-4">
              Add book modal will be implemented here
            </p>
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
