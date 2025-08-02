"use client";

import { useSearchBooksQuery } from "@/hooks/useBooks";
import { BookOpen, Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const {
    data: searchResults,
    isLoading,
    error,
  } = useSearchBooksQuery(query, {}, { enabled: !!query });

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Search Books
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please enter a search query to find books.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Searching for "{query}"...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Search Error
          </h1>
          <p className="text-red-600 dark:text-red-400">
            An error occurred while searching. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const books = searchResults?.data?.books || [];
  const totalBooks = searchResults?.data?.pagination?.totalBooks || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Found {totalBooks} book{totalBooks !== 1 ? "s" : ""}
        </p>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No books found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search terms or browse our categories.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
          >
            Browse All Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book: any) => (
            <div
              key={book._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {book.title}
                  </h3>
                  {book.isFeatured && (
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="line-clamp-1">
                    {Array.isArray(book.authors)
                      ? book.authors
                          .map((author: any) =>
                            typeof author === "object" ? author.name : author
                          )
                          .join(", ")
                      : book.authors}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>
                    {Array.isArray(book.categories)
                      ? book.categories
                          .map((category: any) =>
                            typeof category === "object"
                              ? category.name
                              : category
                          )
                          .join(", ")
                      : book.categories}
                  </span>
                </div>

                {book.publishedYear && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{book.publishedYear}</span>
                  </div>
                )}

                {book.location && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>
                      {book.location.section} - {book.location.shelf}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-sm">
                  <span
                    className={`font-medium ${
                      book.availableCopies > 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {book.availableCopies > 0 ? "Available" : "Not Available"}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">
                    ({book.availableCopies}/{book.totalCopies} copies)
                  </span>
                </div>
                <span className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded">
                  {book.format}
                </span>
              </div>

              <Link
                href={`/books/${book._id}`}
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
