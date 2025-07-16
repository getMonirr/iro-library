"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface Stat {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  color: string;
}

interface DashboardStatsProps {
  stats: Stat[];
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-100 dark:bg-blue-900",
          text: "text-blue-600 dark:text-blue-400",
          icon: "text-blue-600 dark:text-blue-400"
        };
      case "green":
        return {
          bg: "bg-green-100 dark:bg-green-900",
          text: "text-green-600 dark:text-green-400",
          icon: "text-green-600 dark:text-green-400"
        };
      case "purple":
        return {
          bg: "bg-purple-100 dark:bg-purple-900",
          text: "text-purple-600 dark:text-purple-400",
          icon: "text-purple-600 dark:text-purple-400"
        };
      case "orange":
        return {
          bg: "bg-orange-100 dark:bg-orange-900",
          text: "text-orange-600 dark:text-orange-400",
          icon: "text-orange-600 dark:text-orange-400"
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-800",
          text: "text-gray-600 dark:text-gray-400",
          icon: "text-gray-600 dark:text-gray-400"
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colors = getColorClasses(stat.color);
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
        const trendColor = stat.trend === "up" ? "text-green-600" : "text-red-600";

        return (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${colors.bg}`}>
                <Icon className={`h-6 w-6 ${colors.icon}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendIcon className={`h-4 w-4 ${trendColor}`} />
              <span className={`ml-2 text-sm font-medium ${trendColor}`}>
                {stat.change}
              </span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                from last month
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
