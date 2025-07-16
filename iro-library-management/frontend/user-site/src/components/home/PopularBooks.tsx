"use client";

import { Book, getPopularBooks } from "@/services/bookService";
import { useEffect, useState } from "react";

export function PopularBooks() {
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        setLoading(true);
        const response = await getPopularBooks();
        if (response.success) {
          setPopularBooks(response.data.books.slice(0, 5)); // Show only 5 popular books
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch popular books");
        console.error("Error fetching popular books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularBooks();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Books
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See what other readers are loving this month
            </p>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 flex items-center gap-4 animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-grow space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Books
            </h2>
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Popular Books
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            See what other readers are loving this month
          </p>
        </div>

        <div className="space-y-4">
          {popularBooks.map((book, index) => (
            <div
              key={book._id}
              className="bg-white dark:bg-gray-900 rounded-lg p-6 flex items-center gap-4 hover:shadow-md transition duration-200"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>
              </div>

              <div className="flex-grow">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                  {book.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  by {book.authors.join(", ")}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    {book.category}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {book.totalCopies - book.availableCopies} borrowed
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="text-gray-600 dark:text-gray-300 ml-1">
                      {book.rating?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={book.availableCopies === 0}
                >
                  {book.availableCopies === 0 ? "Out of Stock" : "Borrow"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200">
            View All Popular Books
          </button>
        </div>
      </div>
    </section>
  );
}
