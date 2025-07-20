import api from "@/lib/api";

export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "admin" | "super_admin" | "librarian";
  isActive: boolean;
  isFirstLogin?: boolean;
  mustChangePassword?: boolean;
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "admin" | "librarian";
}

export interface ChangePasswordData {
  currentPassword?: string;
  newPassword: string;
  confirmPassword?: string;
  requirePasswordChange?: boolean;
}

export interface ActivityLog {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  action: string;
  resource: string;
  category:
    | "auth"
    | "user_management"
    | "book_management"
    | "borrowing"
    | "system"
    | "security";
  severity: "low" | "medium" | "high" | "critical";
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

// Get all admins
export const getAllAdmins = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) => {
  const response = await api.get("/admin/admins", { params });
  return response.data;
};

// Create new admin
export const createAdmin = async (data: CreateAdminData) => {
  const response = await api.post("/admin/create", data);
  return response.data;
};

// Toggle admin status
export const toggleAdminStatus = async (adminId: string) => {
  const response = await api.patch(`/admin/${adminId}/toggle-status`);
  return response.data;
};

// Reset admin password
export const resetAdminPassword = async (adminId: string) => {
  const response = await api.patch(`/admin/${adminId}/reset-password`);
  return response.data;
};

// Update admin password with custom password
export const updateAdminPassword = async (
  adminId: string,
  data: {
    newPassword: string;
    requirePasswordChange?: boolean;
  }
) => {
  const response = await api.patch(`/admin/${adminId}/update-password`, data);
  return response.data;
};

// Change password (first login)
export const changeFirstLoginPassword = async (data: ChangePasswordData) => {
  const response = await api.patch("/admin/change-first-login-password", data);
  return response.data;
};

// Get activity logs
export const getActivityLogs = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  severity?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const response = await api.get("/admin/activity-logs", { params });
  return response.data;
};
