"use client";

import { getLibraryStats } from "@/services/bookService";
import { useEffect, useState } from "react";

interface LibraryStats {
  totalBooks: number;
  totalBorrows: number;
  totalMembers: number;
  totalCategories: number;
}

export function Stats() {
  const [stats, setStats] = useState<LibraryStats>({
    totalBooks: 0,
    totalBorrows: 0,
    totalMembers: 0,
    totalCategories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getLibraryStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch statistics");
        console.error("Error fetching stats:", err);
        // Use fallback static data on error
        setStats({
          totalBooks: 10000,
          totalBorrows: 15000,
          totalMembers: 2500,
          totalCategories: 50,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const displayStats = [
    { label: "Total Books", value: `${stats.totalBooks.toLocaleString()}+` },
    {
      label: "Active Members",
      value: `${stats.totalMembers.toLocaleString()}+`,
    },
    {
      label: "Books Borrowed",
      value: `${stats.totalBorrows.toLocaleString()}+`,
    },
    { label: "Categories", value: `${stats.totalCategories}+` },
  ];

  if (loading) {
    return (
      <section className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="text-center animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-100 dark:bg-gray-800 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {displayStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
