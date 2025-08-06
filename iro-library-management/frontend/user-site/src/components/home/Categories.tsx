"use client";

import { Book, getBookCategories, getBooks } from "@/services/bookService";
import { BookOpen, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CategoryData {
  name: string;
  bookCount: number;
  icon: string;
  description: string;
  sampleBooks: Book[];
}

export function Categories() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, booksResponse] = await Promise.all([
          getBookCategories(),
          getBooks({ limit: 1000 }), // Get all books to count by category
        ]);

        if (categoriesResponse.success && booksResponse.success) {
          const categoryIcons: Record<
            string,
            { icon: string; description: string }
          > = {
            Fiction: {
              icon: "📚",
              description: "Novels, short stories, and literary fiction",
            },
            "Non-Fiction": {
              icon: "📖",
              description: "Biography, history, and educational content",
            },
            "Science Fiction": {
              icon: "🚀",
              description: "Futuristic and speculative fiction",
            },
            Fantasy: {
              icon: "🐉",
              description: "Magical worlds and mythical creatures",
            },
            Mystery: {
              icon: "🔍",
              description: "Crime, detective, and suspense stories",
            },
            Romance: {
              icon: "❤️",
              description: "Love stories and romantic fiction",
            },
            Thriller: {
              icon: "⚡",
              description: "High-stakes and suspenseful narratives",
            },
            Biography: {
              icon: "👤",
              description: "Life stories of notable people",
            },
            History: {
              icon: "🏛️",
              description: "Historical events and periods",
            },
            Psychology: {
              icon: "🧠",
              description: "Human behavior and mental processes",
            },
            Business: {
              icon: "💼",
              description: "Entrepreneurship and business strategy",
            },
            Technology: {
              icon: "💻",
              description: "Computer science and innovation",
            },
            "Classic Literature": {
              icon: "📜",
              description: "Timeless literary masterpieces",
            },
            "Dystopian Fiction": {
              icon: "🏙️",
              description: "Dark future societies and control",
            },
            "Coming of Age": {
              icon: "🌱",
              description: "Stories of growth and self-discovery",
            },
            "Political Satire": {
              icon: "🎭",
              description: "Humor and criticism of politics",
            },
            "Magical Realism": {
              icon: "✨",
              description: "Reality blended with magical elements",
            },
            Philosophy: {
              icon: "🤔",
              description: "Deep thinking about existence and reality",
            },
            "Contemporary Fiction": {
              icon: "🌆",
              description: "Modern stories reflecting current times",
            },
            Adventure: {
              icon: "🗺️",
              description: "Exciting journeys and explorations",
            },
            "Historical Fiction": {
              icon: "⚔️",
              description: "Stories set in historical periods",
            },
            "Dark Comedy": {
              icon: "😅",
              description: "Humor with darker, satirical elements",
            },
          };

          const books = booksResponse.data.books;
          console.log("Categories component - All books:", books.length);
          console.log(
            "Categories component - Sample book structure:",
            books[0]
          );

          const categoryData: CategoryData[] = categoriesResponse.data.map(
            (categoryName: string) => {
              // Filter books that have this category name
              const categoryBooks = books.filter((book) => {
                // Check if book has categories array and if any category matches the categoryName
                if (book.categories && Array.isArray(book.categories)) {
                  return book.categories.some((cat) => {
                    // Handle both string and object category formats
                    if (typeof cat === "string") {
                      return cat === categoryName;
                    }
                    // Handle object format with name property
                    if (typeof cat === "object" && cat && "name" in cat) {
                      return (cat as any).name === categoryName;
                    }
                    return false;
                  });
                }
                // Fallback check for books that might have category as string
                if (book.category && typeof book.category === "string") {
                  return book.category === categoryName;
                }
                return false;
              });

              console.log(
                `Categories component - ${categoryName}: ${categoryBooks.length} books`
              );
              if (categoryBooks.length > 0) {
                console.log(
                  `Categories component - Sample books for ${categoryName}:`,
                  categoryBooks
                    .slice(0, 2)
                    .map((b) => ({ title: b.title, categories: b.categories }))
                );
              }

              const categoryInfo = categoryIcons[categoryName] || {
                icon: "📁",
                description: "Discover books in this category",
              };

              return {
                name: categoryName,
                bookCount: categoryBooks.length,
                icon: categoryInfo.icon,
                description: categoryInfo.description,
                sampleBooks: categoryBooks.slice(0, 3), // Get first 3 books as samples
              };
            }
          );

          // Sort by book count (descending) and show only categories with books
          const sortedCategories = categoryData
            .filter((cat) => cat.bookCount > 0)
            .sort((a, b) => b.bookCount - a.bookCount)
            .slice(0, 8); // Show top 8 categories

          setCategories(sortedCategories);
        } else {
          setError("Failed to fetch categories or books");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("An error occurred while fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Browse by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our diverse collection organized by subject and genre
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 animate-pulse"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20 mx-auto"></div>
                </div>
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
              Browse by Category
            </h2>
            <p className="text-red-600 dark:text-red-400">{error}</p>
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
            Browse by Category
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our diverse collection organized by subject and genre
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/categories?category=${encodeURIComponent(category.name)}`}
              className="group bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {category.description}
                </p>
                <div className="flex items-center justify-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {category.bookCount}{" "}
                    {category.bookCount === 1 ? "book" : "books"}
                  </span>
                </div>
              </div>

              {/* Sample books preview */}
              {category.sampleBooks.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Sample Books
                  </h4>
                  <div className="space-y-1">
                    {category.sampleBooks.map((book, index) => (
                      <div
                        key={book._id}
                        className="flex items-center text-xs text-gray-600 dark:text-gray-300"
                      >
                        <div className="flex items-center min-w-0 flex-1">
                          <Star className="w-2.5 h-2.5 text-yellow-400 mr-1.5 flex-shrink-0" />
                          <span className="truncate">{book.title}</span>
                        </div>
                        {index < category.sampleBooks.length - 1 && (
                          <ChevronRight className="w-2.5 h-2.5 text-gray-400 ml-1 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            View All Categories
            <ChevronRight className="ml-2 -mr-1 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
