import api from "@/lib/api";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "librarian";
  isActive: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  identifier: string; // email or phone
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: AdminUser;
    token: string;
  };
  message: string;
}

export interface ProfileResponse {
  success: boolean;
  data: AdminUser;
}

// Login admin/librarian
export const login = async (loginData: LoginData): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", loginData);

  if (
    response.data.success &&
    (response.data.data.user.role === "admin" ||
      response.data.data.user.role === "librarian")
  ) {
    // Store token and user in localStorage for admin
    if (typeof window !== "undefined") {
      localStorage.setItem("admin-token", response.data.data.token);
      localStorage.setItem(
        "admin-user",
        JSON.stringify(response.data.data.user)
      );
    }
  } else {
    throw new Error("Access denied. Admin or Librarian privileges required.");
  }

  return response.data;
};

// Logout admin
export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } finally {
    // Clear tokens and user data
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin-token");
      localStorage.removeItem("admin-user");
    }
  }
};

// Get current admin profile
export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get("/auth/profile");
  return response.data;
};

// Update admin profile
export const updateProfile = async (
  profileData: Partial<AdminUser>
): Promise<ProfileResponse> => {
  const response = await api.patch("/auth/profile", profileData);

  if (response.data.success && typeof window !== "undefined") {
    localStorage.setItem("admin-user", JSON.stringify(response.data.data));
  }

  return response.data;
};

// Change password
export const changePassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ success: boolean; message: string }> => {
  const response = await api.patch("/auth/change-password", passwordData);
  return response.data;
};

// Check if admin is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin-token");
    const user = localStorage.getItem("admin-user");
    if (token && user) {
      const userData = JSON.parse(user);
      return userData.role === "admin" || userData.role === "librarian";
    }
  }
  return false;
};

// Get current admin user from localStorage
export const getCurrentUser = (): AdminUser | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("admin-user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};
