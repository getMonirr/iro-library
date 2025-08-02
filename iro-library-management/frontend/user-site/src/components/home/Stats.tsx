"use client";

import { useLibraryStatsQuery } from "@/hooks/useBooks";

export function Stats() {
  const { data: response, isLoading: loading, error } = useLibraryStatsQuery();

  console.log("Stats Response:", response);
  console.log("Stats Error:", error);
  console.log("Stats Loading:", loading);

  // Use actual data or fallback on error
  const stats = response?.data || {
    totalBooks: 10000,
    totalBorrows: 15000,
    totalMembers: 2500,
    totalCategories: 50,
  };

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
