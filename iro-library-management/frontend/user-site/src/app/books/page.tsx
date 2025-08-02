'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  BookOpen, 
  Star, 
  Calendar, 
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { useBookCategoriesQuery, useBooksQuery } from '@/hooks/useBooks';
import { Book } from '@/services/bookService';
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

interface FilterState {
  search: string;
  category: string;
  format: string;
  available: string;
  sort: string;
}

export default function BooksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // View mode state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    format: searchParams.get("format") || "",
    available: searchParams.get("available") || "",
    sort: searchParams.get("sort") || "title",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );
  const [itemsPerPage, setItemsPerPage] = useState(
    parseInt(searchParams.get("limit") || "12")
  );

  // Build query params
  const queryParams = {
    page: currentPage,
    limit: itemsPerPage,
    ...(filters.search && { search: filters.search }),
    ...(filters.category && { category: filters.category }),
    ...(filters.format && { format: filters.format }),
    ...(filters.available && { available: filters.available === "true" }),
    ...(filters.sort && { sort: filters.sort }),
  };

  // Data fetching
  const { data: booksResponse, isLoading, error } = useBooksQuery(queryParams);
  const { data: categoriesResponse } = useBookCategoriesQuery();

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.format) params.set("format", filters.format);
    if (filters.available) params.set("available", filters.available);
    if (filters.sort) params.set("sort", filters.sort);
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (itemsPerPage !== 12) params.set("limit", itemsPerPage.toString());

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/books${newUrl}`, { scroll: false });
  }, [filters, currentPage, itemsPerPage, router]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      format: "",
      available: "",
      sort: "title",
    });
    setCurrentPage(1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading books...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Failed to Load Books
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                There was an error loading the books. Please try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const books = booksResponse?.data?.books || [];
  const pagination = booksResponse?.data?.pagination;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              All Books
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {pagination
                ? `Showing ${
                    (pagination.currentPage - 1) * itemsPerPage + 1
                  }-${Math.min(
                    pagination.currentPage * itemsPerPage,
                    pagination.totalBooks
                  )} of ${pagination.totalBooks} books`
                : "Browse our collection"}
            </p>
          </div>

          {/* Search and Controls */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search books..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Filter Toggle and Clear */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>

                {(filters.search ||
                  filters.category ||
                  filters.format ||
                  filters.available) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* View Mode and Items Per Page */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Show:
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                  >
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </div>

                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400"
                    } hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400"
                    } hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Categories</option>
                    {categoriesResponse?.data?.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Format Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Format
                  </label>
                  <select
                    value={filters.format}
                    onChange={(e) =>
                      handleFilterChange("format", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Formats</option>
                    <option value="physical">Physical</option>
                    <option value="digital">Digital</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Availability
                  </label>
                  <select
                    value={filters.available}
                    onChange={(e) =>
                      handleFilterChange("available", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Books</option>
                    <option value="true">Available Only</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sort By
                  </label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="title">Title A-Z</option>
                    <option value="-title">Title Z-A</option>
                    <option value="publishedYear">Year (Oldest)</option>
                    <option value="-publishedYear">Year (Newest)</option>
                    <option value="-createdAt">Recently Added</option>
                    <option value="createdAt">Oldest Added</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Books Content */}
          {books.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No books found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {filters.search ||
                filters.category ||
                filters.format ||
                filters.available
                  ? "Try adjusting your filters to see more results."
                  : "No books are available at the moment."}
              </p>
              {(filters.search ||
                filters.category ||
                filters.format ||
                filters.available) && (
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Books Grid/List */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
                    : "space-y-4 mb-8"
                }
              >
                {books.map((book) => (
                  <BookCard key={book._id} book={book} viewMode={viewMode} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalBooks} total books)
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={!pagination.hasPrev}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Page Numbers */}
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      const startPage = Math.max(1, currentPage - 2);
                      const pageNum = startPage + i;

                      if (pageNum > pagination.totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 border rounded-lg transition-colors ${
                            pageNum === currentPage
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handlePageChange(pagination.totalPages)}
                      disabled={!pagination.hasNext}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Book Card Component
interface BookCardProps {
  book: Book;
  viewMode: "grid" | "list";
}

function BookCard({ book, viewMode }: BookCardProps) {
  if (viewMode === "list") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow">
        <div className="flex gap-4">
          {/* Book Cover */}
          <div className="w-20 h-28 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0 flex items-center justify-center">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <BookOpen className="h-8 w-8 text-gray-400" />
            )}
          </div>

          {/* Book Info */}
          <div className="flex-grow min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="min-w-0 flex-grow">
                <Link href={`/books/${book._id}`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                </Link>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  by {Array.isArray(book.authors) ? book.authors.join(", ") : book.authors}
                </p>

                <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {book.publishedYear}
                  </span>
                  {book.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {book.location.section} - {book.location.shelf}
                    </span>
                  )}
                  {book.rating && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-yellow-400" />
                      {book.rating.average.toFixed(1)} ({book.rating.count})
                    </span>
                  )}
                </div>

                {book.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">
                    {book.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                  {book.category}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    book.availableCopies > 0
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                  }`}
                >
                  {book.availableCopies > 0 ? "Available" : "Not Available"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {book.availableCopies}/{book.totalCopies} copies
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Book Cover */}
      <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <BookOpen className="h-16 w-16 text-gray-400" />
        )}
      </div>

      {/* Book Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
            {book.category}
          </span>
          {book.isFeatured && (
            <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
              Featured
            </span>
          )}
        </div>

        <Link href={`/books/${book._id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 mb-1">
            {book.title}
          </h3>
        </Link>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
          by {Array.isArray(book.authors) ? book.authors.join(", ") : book.authors}
        </p>

        {book.rating && (
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(book.rating!.average)
                      ? "fill-current"
                      : "stroke-current fill-transparent"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              {book.rating.average.toFixed(1)} ({book.rating.count})
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs">
          <span
            className={`px-2 py-1 rounded ${
              book.availableCopies > 0
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            }`}
          >
            {book.availableCopies > 0 ? "Available" : "Not Available"}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            {book.availableCopies}/{book.totalCopies}
          </span>
        </div>
      </div>
    </div>
  );
}
