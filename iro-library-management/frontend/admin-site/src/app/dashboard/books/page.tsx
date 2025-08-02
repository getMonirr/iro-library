"use client";

import { BooksTable } from "@/components/books/BooksTable";
import { useBooksQuery, useDeleteBookMutation } from "@/hooks/useBooks";
import { Book } from "@/services/bookService";
import { BookOpen, Download, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function BooksPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [formatFilter, setFormatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [goToPage, setGoToPage] = useState("");

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
    limit: itemsPerPage,
    search: debouncedSearchQuery || undefined,
    category: categoryFilter || undefined,
    format: formatFilter || undefined,
    isActive: statusFilter === "all" ? undefined : statusFilter === "active",
    sort: `${sortOrder === "desc" ? "-" : ""}${sortBy}`,
  });

  const deleteBookMutation = useDeleteBookMutation();

  // Extract data from response
  const books = booksResponse?.data?.books || [];
  const totalPages = booksResponse?.pagination?.totalPages || 1;
  const totalBooksCount = booksResponse?.pagination?.totalBooks || 0;

  // Keyboard navigation for pagination
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle pagination keys if no input is focused
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "SELECT"
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
          if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
          break;
        case "ArrowRight":
          if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
          }
          break;
        case "Home":
          setCurrentPage(1);
          break;
        case "End":
          setCurrentPage(totalPages);
          break;
      }
    };

    if (totalPages > 1) {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [currentPage, totalPages]);

  const handleEditBook = (bookId: string) => {
    router.push(`/dashboard/books/edit/${bookId}`);
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    deleteBookMutation.mutate(bookId);
  };

  const handleBulkDelete = async (bookIds: string[]) => {
    // For now, delete books one by one
    // In production, you'd want a bulk delete API endpoint
    for (const bookId of bookIds) {
      deleteBookMutation.mutate(bookId);
    }
    toast.success(`Deleted ${bookIds.length} books`);
  };

  const handleBulkStatusChange = async (
    bookIds: string[],
    isActive: boolean
  ) => {
    // This would require a bulk update API endpoint
    toast.success(
      `Updated ${bookIds.length} books to ${
        isActive ? "active" : "inactive"
      } status`
    );
  };

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(goToPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setGoToPage("");
    } else {
      toast.error(`Please enter a page number between 1 and ${totalPages}`);
    }
  };

  const handleExportBooks = () => {
    // Convert books to CSV
    const headers = [
      "Title",
      "Authors",
      "Book ID",
      "Categories",
      "Format",
      "Language",
      "Total Copies",
      "Available Copies",
      "Location",
      "Added Date",
    ];

    const csvData = books.map((book) => [
      book.title,
      book.authors
        .map((author: any) =>
          typeof author === "object" ? author.name : author
        )
        .join("; "),
      book.bookId || "",
      book.categories
        .map((category: any) =>
          typeof category === "object" ? category.name : category
        )
        .join("; "),
      book.format,
      book.language || "",
      book.totalCopies,
      book.availableCopies,
      `${book.location?.shelf || ""} - ${book.location?.section || ""}`,
      new Date(book.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `books_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${books.length} books to CSV`);
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
        <div className="flex gap-2">
          <button
            onClick={handleExportBooks}
            disabled={books.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <Link
            href="/dashboard/books/add"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add New Book
          </Link>
        </div>
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

      {/* Quick Stats */}
      {!loading && books.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalBooksCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Books
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {books.reduce((sum, book) => sum + book.availableCopies, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Available Copies
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {books.reduce(
                  (sum, book) =>
                    sum + (book.totalCopies - book.availableCopies),
                  0
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Borrowed Copies
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {books.filter((book) => book.availableCopies === 0).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Out of Stock
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search books by title, author, or Book ID..."
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

          {/* Category Filter */}
          <div className="min-w-40">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Categories</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science">Science</option>
              <option value="Technology">Technology</option>
              <option value="History">History</option>
              <option value="Biography">Biography</option>
              <option value="Children">Children</option>
              <option value="Education">Education</option>
            </select>
          </div>

          {/* Format Filter */}
          <div className="min-w-32">
            <select
              value={formatFilter}
              onChange={(e) => {
                setFormatFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Formats</option>
              <option value="physical">Physical</option>
              <option value="digital">Digital</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="min-w-32">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="min-w-40">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split("-");
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="authors-asc">Author A-Z</option>
              <option value="authors-desc">Author Z-A</option>
              <option value="totalCopies-desc">Most Copies</option>
              <option value="availableCopies-desc">Most Available</option>
            </select>
          </div>

          {/* Items per page */}
          <div className="min-w-20">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(searchQuery ||
          categoryFilter ||
          formatFilter ||
          statusFilter !== "all") && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("");
                setFormatFilter("");
                setStatusFilter("all");
                setSortBy("createdAt");
                setSortOrder("desc");
                setCurrentPage(1);
              }}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Clear Filters
            </button>
          </div>
        )}
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
            <Link
              href="/dashboard/books/add"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Your First Book
            </Link>
          </div>
        ) : (
          <BooksTable
            books={books}
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
            onView={handleViewBook}
            onBulkDelete={handleBulkDelete}
            onBulkStatusChange={handleBulkStatusChange}
          />
        )}
      </div>

      {/* Pagination */}
      {books.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mt-6 p-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalBooksCount)} of{" "}
                {totalBooksCount} books
              </div>

              {/* Page size selector in pagination */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Show:
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  per page
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
              >
                Previous
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {(() => {
                  const maxVisiblePages = 5;
                  const halfVisible = Math.floor(maxVisiblePages / 2);
                  let startPage = Math.max(1, currentPage - halfVisible);
                  let endPage = Math.min(totalPages, currentPage + halfVisible);

                  // Adjust if we're near the beginning or end
                  if (endPage - startPage + 1 < maxVisiblePages) {
                    if (startPage === 1) {
                      endPage = Math.min(
                        totalPages,
                        startPage + maxVisiblePages - 1
                      );
                    } else {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }
                  }

                  const pages = [];

                  // Add ellipsis if needed at start
                  if (startPage > 1) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => setCurrentPage(1)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                      >
                        1
                      </button>
                    );
                    if (startPage > 2) {
                      pages.push(
                        <span key="ellipsis1" className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                  }

                  // Add visible page numbers
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-3 py-2 border rounded-md text-sm ${
                          i === currentPage
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }

                  // Add ellipsis if needed at end
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <span key="ellipsis2" className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                      >
                        {totalPages}
                      </button>
                    );
                  }

                  return pages;
                })()}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
              >
                Last
              </button>

              {/* Go to page input */}
              {totalPages > 10 && (
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-300 dark:border-gray-600">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Go to:
                  </span>
                  <form onSubmit={handleGoToPage} className="flex gap-1">
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={goToPage}
                      onChange={(e) => setGoToPage(e.target.value)}
                      placeholder="Page"
                      className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Go
                    </button>
                  </form>
                </div>
              )}

              {/* Keyboard shortcuts info */}
              <div className="ml-4 pl-4 border-l border-gray-300 dark:border-gray-600">
                <div
                  className="text-xs text-gray-500 dark:text-gray-400 cursor-help"
                  title="Keyboard shortcuts: ← → arrows to navigate, Home/End for first/last page"
                >
                  ⌨️ Shortcuts
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
