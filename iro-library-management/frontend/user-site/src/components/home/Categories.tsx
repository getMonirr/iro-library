"use client";

import { getBookCategories, getBooks } from "@/services/bookService";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CategoryData {
  name: string;
  bookCount: number;
  icon: string;
  description: string;
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

          const categoryData = categoriesResponse.data.map((categoryName) => {
            const bookCount = booksResponse.data.books.filter(
              (book) => book.category === categoryName
            ).length;
            const categoryInfo = categoryIcons[categoryName] || {
              icon: "📖",
              description: "Various books and resources",
            };

            return {
              name: categoryName,
              bookCount,
              icon: categoryInfo.icon,
              description: categoryInfo.description,
            };
          });

          setCategories(categoryData);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch categories");
        console.error("Error fetching categories:", err);
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
              href={`/books?category=${encodeURIComponent(category.name)}`}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition duration-200 cursor-pointer group block"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition duration-200">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {category.description}
                </p>
                <div className="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                  {category.bookCount} books
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/books"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200 inline-block"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
