"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Activity,
  BarChart3,
  BookMarked,
  BookOpen,
  Building2,
  Calendar,
  Home,
  MessageSquare,
  Settings,
  Shield,
  Tags,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const baseMenuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: Home,
      description: "Overview and statistics",
    },
    {
      label: "Books",
      href: "/dashboard/books",
      icon: BookOpen,
      description: "Manage book inventory",
    },
    {
      label: "Authors",
      href: "/dashboard/authors",
      icon: UserCheck,
      description: "Manage book authors",
    },
    {
      label: "Publishers",
      href: "/dashboard/publishers",
      icon: Building2,
      description: "Manage book publishers",
    },
    {
      label: "Categories",
      href: "/dashboard/categories",
      icon: Tags,
      description: "Organize book categories",
    },
    {
      label: "Users",
      href: "/dashboard/users",
      icon: Users,
      description: "Manage library members",
    },
    {
      label: "Borrowing",
      href: "/dashboard/borrowing",
      icon: BookMarked,
      description: "Track borrowed books",
    },
    {
      label: "Reports",
      href: "/dashboard/reports",
      icon: BarChart3,
      description: "Analytics and reports",
    },
    {
      label: "Reviews",
      href: "/dashboard/reviews",
      icon: MessageSquare,
      description: "Manage book reviews",
    },
    {
      label: "Events",
      href: "/dashboard/events",
      icon: Calendar,
      description: "Library events",
    },
  ];

  const superAdminMenuItems = [
    {
      label: "Admin Management",
      href: "/dashboard/admin-management",
      icon: Shield,
      description: "Manage admin accounts",
    },
    {
      label: "Activity Logs",
      href: "/dashboard/activity-logs",
      icon: Activity,
      description: "System activity monitoring",
    },
  ];

  const settingsMenuItems = [
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: User,
      description: "Manage your profile",
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      description: "System configuration",
    },
  ];

  // Build menu based on user role
  const menuItems = [
    ...baseMenuItems,
    ...(user?.role === "super_admin" ? superAdminMenuItems : []),
    ...settingsMenuItems,
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <DashboardSidebar
          menuItems={menuItems}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <div className="lg:ml-64">
          {/* Header */}
          <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

          {/* Page content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
