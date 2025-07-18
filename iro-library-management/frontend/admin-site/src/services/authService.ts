import api from "@/lib/api";

export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: "admin" | "librarian";
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

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Login admin/librarian
export const login = async (loginData: LoginData): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", loginData);

  if (response.data.status === "success") {
    const user = response.data.data.user;

    // Check if user has admin or librarian role
    if (user.role === "admin" || user.role === "librarian") {
      // Store token and user in localStorage for admin
      if (typeof window !== "undefined") {
        localStorage.setItem("admin-token", response.data.token);
        localStorage.setItem("admin-user", JSON.stringify(user));
      }

      return {
        success: true,
        data: {
          user: user,
          token: response.data.token,
        },
        message: "Login successful",
      };
    } else {
      throw new Error("Access denied. Admin or Librarian privileges required.");
    }
  }

  throw new Error(response.data.message || "Login failed");
};

// Register admin/librarian
export const register = async (
  registerData: RegisterData
): Promise<AuthResponse> => {
  const response = await api.post("/auth/signup", registerData);

  if (response.data.status === "success") {
    const { token, user } = response.data.data;

    // Store token and user data
    if (typeof window !== "undefined") {
      localStorage.setItem("admin-token", token);
      localStorage.setItem("admin-user", JSON.stringify(user));
    }

    // Check if user has admin/librarian role
    if (user.role === "admin" || user.role === "librarian") {
      return {
        success: true,
        data: { user, token },
        message: "Registration successful",
      };
    } else {
      throw new Error("Access denied. Admin or Librarian privileges required.");
    }
  }

  throw new Error(response.data.message || "Registration failed");
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
  const response = await api.get("/auth/me");
  return {
    success: response.data.status === "success",
    data: response.data.data.user,
  };
};

// Update admin profile
export const updateProfile = async (
  profileData: Partial<AdminUser>
): Promise<ProfileResponse> => {
  const response = await api.patch("/auth/me", profileData);

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
  const response = await api.patch("/auth/update-password", {
    currentPassword: passwordData.currentPassword,
    password: passwordData.newPassword,
    passwordConfirm: passwordData.confirmPassword,
  });
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
