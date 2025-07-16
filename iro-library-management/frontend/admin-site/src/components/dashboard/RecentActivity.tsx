"use client";

import { Clock, User, BookOpen, UserPlus, AlertTriangle } from "lucide-react";

interface Activity {
  id: number;
  type: "borrow" | "return" | "new_member" | "overdue";
  user: string;
  book: string | null;
  timestamp: string;
  status: "completed" | "pending" | "overdue";
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "borrow":
        return <BookOpen className="h-4 w-4 text-blue-600" />;
      case "return":
        return <BookOpen className="h-4 w-4 text-green-600" />;
      case "new_member":
        return <UserPlus className="h-4 w-4 text-purple-600" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "borrow":
        return `${activity.user} borrowed "${activity.book}"`;
      case "return":
        return `${activity.user} returned "${activity.book}"`;
      case "new_member":
        return `${activity.user} joined as a new member`;
      case "overdue":
        return `"${activity.book}" is overdue (${activity.user})`;
      default:
        return "Unknown activity";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="badge-success">Completed</span>;
      case "pending":
        return <span className="badge-warning">Pending</span>;
      case "overdue":
        return <span className="badge-danger">Overdue</span>;
      default:
        return <span className="badge-info">Unknown</span>;
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">
                {getActivityText(activity)}
              </p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.timestamp}
                </p>
                {getStatusBadge(activity.status)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
        </div>
      )}
    </div>
  );
}
