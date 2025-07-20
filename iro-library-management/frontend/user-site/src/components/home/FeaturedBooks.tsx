"use client";

import { useFeaturedBooksQuery } from "@/hooks/useBooks";

export function FeaturedBooks() {
  const { data: response, isLoading: loading, error } = useFeaturedBooksQuery();

  const featuredBooks = response?.data?.books?.slice(0, 4) || [];

  console.log("Featured Books Response:", response);

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Books
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our handpicked selection of must-read books from various
              genres
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 animate-pulse"
              >
                <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Books
            </h2>
            <p className="text-red-600 dark:text-red-400">
              {error?.message || "Failed to load featured books"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Books
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our handpicked selection of must-read books from various
            genres
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <div
              key={book._id}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg transition duration-200"
            >
              <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    Book Cover
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                {book.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                by {book.authors.join(", ")}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {book.category}
                </span>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                    {book?.rating?.average?.toFixed(1) || "N/A"}
                  </span>
                </div>
              </div>
              <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm transition duration-200">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
