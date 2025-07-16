"use client";

import { Star, TrendingUp, TrendingDown } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  borrowCount: number;
  rating: number;
  trend: "up" | "down";
}

interface PopularBooksProps {
  books: Book[];
}

export function PopularBooks({ books }: PopularBooksProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Popular Books
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {books.map((book, index) => (
          <div key={book.id} className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {book.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                by {book.author}
              </p>
              <div className="flex items-center mt-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  {book.rating}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {book.borrowCount} borrows
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              {book.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-8">
          <Star className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">No popular books data</p>
        </div>
      )}
    </div>
  );
}
