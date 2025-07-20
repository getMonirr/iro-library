import {
  AdminUser,
  changeFirstLoginPassword,
  ChangePasswordData,
  createAdmin,
  CreateAdminData,
  getActivityLogs,
  getAllAdmins,
  resetAdminPassword,
  toggleAdminStatus,
  updateAdminPassword,
} from "@/services/adminService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Export the AdminUser interface as Admin for convenience
export type Admin = AdminUser;

// Query keys
const QUERY_KEYS = {
  ADMINS: "admins",
  ACTIVITY_LOGS: "activity-logs",
} as const;

// Get all admins query
export const useAdminsQuery = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMINS, params],
    queryFn: () => getAllAdmins(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create admin mutation
export const useCreateAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdminData) => createAdmin(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
      toast.success("Admin created successfully");
      return data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create admin");
    },
  });
};

// Toggle admin status mutation
export const useToggleAdminStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adminId: string) => toggleAdminStatus(adminId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
      toast.success("Admin status updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update admin status"
      );
    },
  });
};

// Reset admin password mutation
export const useResetAdminPasswordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adminId: string) => resetAdminPassword(adminId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
      toast.success("Password reset successfully");
      return data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reset password");
    },
  });
};

// Update admin password mutation
export const useUpdateAdminPasswordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      adminId,
      data,
    }: {
      adminId: string;
      data: { newPassword: string; requirePasswordChange?: boolean };
    }) => updateAdminPassword(adminId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
      toast.success("Password updated successfully");
      return data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update password");
    },
  });
};

// Change first login password mutation
export const useChangeFirstLoginPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => changeFirstLoginPassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to change password");
    },
  });
};

// Get activity logs query
export const useActivityLogsQuery = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  severity?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACTIVITY_LOGS, params],
    queryFn: () => getActivityLogs(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
