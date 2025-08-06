"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { useBookCategoriesQuery, useBooksQuery } from "@/hooks/useBooks";
import { Book } from "@/services/bookService";
import { BookOpen, Eye, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CategoryWithBooks {
  name: string;
  bookCount: number;
  icon: string;
  description: string;
  books: Book[];
}

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [booksPerCategory] = useState(6);

  // Fetch categories and all books
  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useBookCategoriesQuery();
  const { data: booksResponse, isLoading: booksLoading } = useBooksQuery({
    limit: 1000,
  });

  const isLoading = categoriesLoading || booksLoading;

  // Category icons and descriptions
  const categoryIcons: Record<string, { icon: string; description: string }> = {
    Fiction: {
      icon: "📚",
      description: "Novels, short stories, and literary fiction",
    },
    "Non-Fiction": {
      icon: "📖",
      description: "Biography, history, and educational content",
    },
    "Science & Technology": {
      icon: "🔬",
      description: "Computer science, engineering, and research",
    },
    "Arts & Literature": {
      icon: "🎨",
      description: "Poetry, drama, and artistic expression",
    },
    Business: {
      icon: "💼",
      description: "Entrepreneurship, management, and economics",
    },
    "Health & Wellness": {
      icon: "🏃",
      description: "Fitness, nutrition, and mental health",
    },
    "Mystery & Thriller": {
      icon: "🔍",
      description: "Crime, suspense, and detective stories",
    },
    "Children's Books": {
      icon: "🧸",
      description: "Picture books, early readers, and young adult",
    },
    Religion: {
      icon: "🕌",
      description: "Islamic studies and religious texts",
    },
    History: {
      icon: "📜",
      description: "Historical accounts and research",
    },
  };

  // Process categories with books
  const categoriesWithBooks: CategoryWithBooks[] =
    categoriesResponse?.success && booksResponse?.success
      ? categoriesResponse.data
          .map((categoryName) => {
            const categoryBooks = booksResponse.data.books.filter((book) => {
              // Handle both category (string) and categories (array of objects) formats
              if (book.category && book.category === categoryName) {
                return true;
              }
              if (book.categories && Array.isArray(book.categories)) {
                return book.categories.some((cat: any) =>
                  typeof cat === "string"
                    ? cat === categoryName
                    : cat.name === categoryName
                );
              }
              return false;
            });
            const categoryInfo = categoryIcons[categoryName] || {
              icon: "📖",
              description: "Various books and resources",
            };

            return {
              name: categoryName,
              bookCount: categoryBooks.length,
              icon: categoryInfo.icon,
              description: categoryInfo.description,
              books: categoryBooks.slice(0, booksPerCategory),
            };
          })
          .filter((category) => category.bookCount > 0) // Only show categories that have books
      : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Book Categories
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Explore books organized by categories
              </p>
            </div>

            {/* Loading skeleton */}
            <div className="space-y-12">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mr-4"></div>
                    <div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, bookIndex) => (
                      <div
                        key={bookIndex}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 animate-pulse"
                      >
                        <div className="h-48 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Book Categories
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              Discover our extensive collection organized by categories. Each
              category features the latest and most popular books.
            </p>
          </div>

          {/* Categories Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {categoriesWithBooks.map((category) => (
              <div
                key={category.name}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.name ? null : category.name
                  )
                }
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    {category.description}
                  </p>
                  <div className="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                    {category.bookCount} books
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Categories with Books */}
          <div className="space-y-16">
            {categoriesWithBooks.map((category) => (
              <div
                key={category.name}
                id={category.name}
                className={`bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm transition-all duration-300 ${
                  selectedCategory === category.name
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="text-5xl mr-4">{category.icon}</div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {category.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {category.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {category.bookCount} total books
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          Showing{" "}
                          {Math.min(category.books.length, booksPerCategory)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/books?category=${encodeURIComponent(
                      category.name
                    )}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition duration-200"
                  >
                    View All
                  </Link>
                </div>

                {/* Books Grid */}
                {category.books.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.books.map((book) => (
                      <Link
                        key={book._id}
                        href={`/books/${book._id}`}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition duration-200 group"
                      >
                        <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                          {book.coverImage ? (
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                            />
                          ) : (
                            <BookOpen className="w-16 h-16 text-blue-500 dark:text-blue-400" />
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition duration-200">
                          {book.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-1">
                          by{" "}
                          {Array.isArray(book.authors)
                            ? book.authors.join(", ")
                            : "Unknown Author"}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full">
                            {book.category}
                          </span>
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                              {book.rating?.average?.toFixed(1) || "N/A"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No books available in this category yet.</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Can't find what you're looking for?
              </h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Browse our complete collection or use our advanced search to
                find the perfect book for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/books"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition duration-200"
                >
                  Browse All Books
                </Link>
                <Link
                  href="/books?search="
                  className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition duration-200 border border-blue-500"
                >
                  Advanced Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
