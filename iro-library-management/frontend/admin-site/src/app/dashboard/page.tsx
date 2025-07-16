"use client";

import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { OverdueBooks } from "@/components/dashboard/OverdueBooks";
import { PopularBooks } from "@/components/dashboard/PopularBooks";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import {
  DashboardStats as DashboardStatsType,
  getDashboardStats,
} from "@/services/bookService";
import {
  AlertCircle,
  BookMarked,
  BookOpen,
  CalendarDays,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardStatsType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard data");
        console.error("Error fetching dashboard data:", err);
        // Use fallback data on error
        setDashboardData({
          totalBooks: 12547,
          totalMembers: 3284,
          totalBorrows: 1856,
          totalCategories: 45,
          recentBorrows: 127,
          overdueBooks: 23,
          activeMembers: 2891,
          popularBooks: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = dashboardData
    ? [
        {
          title: "Total Books",
          value: dashboardData.totalBooks.toLocaleString(),
          change: "+12%",
          trend: "up" as const,
          icon: BookOpen,
          color: "blue",
        },
        {
          title: "Active Members",
          value: dashboardData.activeMembers.toLocaleString(),
          change: "+8%",
          trend: "up" as const,
          icon: Users,
          color: "green",
        },
        {
          title: "Books Borrowed",
          value: dashboardData.totalBorrows.toLocaleString(),
          change: "-3%",
          trend: "down" as const,
          icon: BookMarked,
          color: "purple",
        },
        {
          title: "Recent Borrows",
          value: dashboardData.recentBorrows.toLocaleString(),
          change: "+15%",
          trend: "up" as const,
          icon: TrendingUp,
          color: "orange",
        },
      ]
    : [];

  const recentActivities = [
    {
      id: 1,
      type: "borrow" as "borrow",
      user: "John Doe",
      book: "The Great Gatsby",
      timestamp: "2 minutes ago",
      status: "completed" as "completed",
    },
    {
      id: 2,
      type: "return" as "return",
      user: "Jane Smith",
      book: "To Kill a Mockingbird",
      timestamp: "15 minutes ago",
      status: "completed" as "completed",
    },
    {
      id: 3,
      type: "new_member" as "new_member",
      user: "Mike Johnson",
      book: null,
      timestamp: "1 hour ago",
      status: "pending" as "pending",
    },
    {
      id: 4,
      type: "overdue" as "overdue",
      user: "Sarah Wilson",
      book: "1984",
      timestamp: "2 hours ago",
      status: "overdue" as "overdue",
    },
  ];

  const popularBooks = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      borrowCount: 45,
      rating: 4.8,
      trend: "up" as const,
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      borrowCount: 38,
      rating: 4.9,
      trend: "up" as const,
    },
    {
      id: 3,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      borrowCount: 32,
      rating: 4.6,
      trend: "down" as const,
    },
  ];

  const overdueBooks = [
    {
      id: 1,
      title: "Pride and Prejudice",
      borrower: "Emily Davis",
      dueDate: "2025-07-10",
      daysOverdue: 6,
      contact: "emily@example.com",
    },
    {
      id: 2,
      title: "The Catcher in the Rye",
      borrower: "David Brown",
      dueDate: "2025-07-08",
      daysOverdue: 8,
      contact: "david@example.com",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-300">
          Welcome back! Here's what's happening in your library today.
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <RecentActivity activities={recentActivities} />

        {/* Popular Books */}
        <PopularBooks books={popularBooks} />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overdue Books */}
        <div className="lg:col-span-2">
          <OverdueBooks books={overdueBooks} />
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left">
              <BookOpen className="h-4 w-4 mr-2" />
              Add New Book
            </button>
            <button className="w-full btn-outline text-left">
              <Users className="h-4 w-4 mr-2" />
              Register Member
            </button>
            <button className="w-full btn-outline text-left">
              <CalendarDays className="h-4 w-4 mr-2" />
              Create Event
            </button>
            <button className="w-full btn-outline text-left">
              <AlertCircle className="h-4 w-4 mr-2" />
              Send Overdue Notice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
