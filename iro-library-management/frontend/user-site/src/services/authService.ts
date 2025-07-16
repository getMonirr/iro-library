import api from "@/lib/api";
import Cookies from "js-cookie";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "librarian" | "admin";
  isActive: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  identifier: string; // email or phone
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

export interface ProfileResponse {
  success: boolean;
  data: User;
}

// Login user
export const login = async (loginData: LoginData): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", loginData);

  if (response.data.success) {
    // Store token in cookies
    Cookies.set("auth-token", response.data.data.token, { expires: 7 });
    // Store user in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
  }

  return response.data;
};

// Register user
export const register = async (
  registerData: RegisterData
): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", registerData);

  if (response.data.success) {
    // Store token in cookies
    Cookies.set("auth-token", response.data.data.token, { expires: 7 });
    // Store user in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
  }

  return response.data;
};

// Logout user
export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } finally {
    // Clear tokens and user data
    Cookies.remove("auth-token");
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  }
};

// Get current user profile
export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get("/auth/profile");
  return response.data;
};

// Update user profile
export const updateProfile = async (
  profileData: Partial<User>
): Promise<ProfileResponse> => {
  const response = await api.patch("/auth/profile", profileData);

  if (response.data.success && typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(response.data.data));
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

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!Cookies.get("auth-token");
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};
