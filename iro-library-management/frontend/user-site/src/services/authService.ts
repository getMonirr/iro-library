import api from "@/lib/api";
import Cookies from "js-cookie";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: "admin" | "librarian" | "member";
  isActive: boolean;
  profilePicture?: string;
  membershipStatus: "active" | "suspended" | "expired";
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  identifier: string; // email or phone
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  password: string;
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
  try {
    const response = await api.post("/auth/login", loginData);

    if (response.data.status === "success") {
      // Store token in cookies
      Cookies.set("auth-token", response.data.token, { expires: 7 });
      // Store user in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }
      // Return in expected format
      return {
        success: true,
        data: {
          user: response.data.data.user,
          token: response.data.token,
        },
        message: "Login successful",
      };
    }

    throw new Error(response.data.message || "Login failed");
  } catch (error: any) {
    console.error("Login error:", error);

    // Extract error message from different possible sources
    let errorMessage = "Login failed";

    if (error.response?.data) {
      // API error response
      errorMessage =
        error.response.data.message ||
        error.response.data.error ||
        error.response.data.details ||
        `Server error: ${error.response.status}`;
    } else if (error.message) {
      // JavaScript error or network error
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

// Register user
export const register = async (
  registerData: RegisterData
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/signup", registerData);

    if (response.data.status === "success") {
      // Store token in cookies
      Cookies.set("auth-token", response.data.token, { expires: 7 });
      // Store user in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }
      // Return in expected format
      return {
        success: true,
        data: {
          user: response.data.data.user,
          token: response.data.token,
        },
        message: "Registration successful",
      };
    }

    throw new Error(response.data.message || "Registration failed");
  } catch (error: any) {
    console.error("Registration error:", error);

    // Extract error message from different possible sources
    let errorMessage = "Registration failed";

    if (error.response?.data) {
      // API error response
      errorMessage =
        error.response.data.message ||
        error.response.data.error ||
        error.response.data.details ||
        `Server error: ${error.response.status}`;
    } else if (error.message) {
      // JavaScript error or network error
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
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
  const response = await api.get("/auth/me");
  return {
    success: response.data.status === "success",
    data: response.data.data.user,
  };
};

// Update user profile
export const updateProfile = async (
  profileData: Partial<User>
): Promise<ProfileResponse> => {
  const response = await api.patch("/auth/me", profileData);

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
  const response = await api.patch("/auth/update-password", {
    currentPassword: passwordData.currentPassword,
    password: passwordData.newPassword,
    passwordConfirm: passwordData.confirmPassword,
  });
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
