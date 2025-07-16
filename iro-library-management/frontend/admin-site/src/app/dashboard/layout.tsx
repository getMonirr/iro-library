"use client";

import { useState } from "react";
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings, 
  BookMarked,
  UserCog,
  PlusCircle,
  Menu,
  X,
  Home,
  Library,
  Tags,
  FileText,
  MessageSquare,
  Calendar
} from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

const menuItems = [
  { 
    label: "Dashboard", 
    href: "/dashboard", 
    icon: Home,
    description: "Overview and statistics"
  },
  { 
    label: "Books", 
    href: "/dashboard/books", 
    icon: BookOpen,
    description: "Manage book inventory"
  },
  { 
    label: "Categories", 
    href: "/dashboard/categories", 
    icon: Tags,
    description: "Organize book categories"
  },
  { 
    label: "Users", 
    href: "/dashboard/users", 
    icon: Users,
    description: "Manage library members"
  },
  { 
    label: "Borrowing", 
    href: "/dashboard/borrowing", 
    icon: BookMarked,
    description: "Track borrowed books"
  },
  { 
    label: "Reports", 
    href: "/dashboard/reports", 
    icon: BarChart3,
    description: "Analytics and reports"
  },
  { 
    label: "Reviews", 
    href: "/dashboard/reviews", 
    icon: MessageSquare,
    description: "Manage book reviews"
  },
  { 
    label: "Events", 
    href: "/dashboard/events", 
    icon: Calendar,
    description: "Library events"
  },
  { 
    label: "Settings", 
    href: "/dashboard/settings", 
    icon: Settings,
    description: "System configuration"
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
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
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
