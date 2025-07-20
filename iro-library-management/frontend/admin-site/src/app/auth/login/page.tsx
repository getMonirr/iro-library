"use client";

import { useAuth } from "@/contexts/AuthContext";
import { changeFirstLoginPassword } from "@/services/adminService";
import { login } from "@/services/authService";
import { BookOpen, Eye, EyeOff, Lock, Mail, Phone, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [userNeedsPasswordChange, setUserNeedsPasswordChange] =
    useState<any>(null);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await login({ identifier, password });

      if (response.success) {
        // Check if password change is required
        if (
          response.data.user.mustChangePassword ||
          response.mustChangePassword
        ) {
          setUserNeedsPasswordChange(response.data.user);
          setShowPasswordChangeModal(true);
          toast("Please set a new password to continue", {
            icon: "🔒",
          });
        } else {
          authLogin(response.data.user); // Update auth context
          toast.success("Login successful!");
          router.push("/dashboard");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (data: { newPassword: string }) => {
    try {
      const response = await changeFirstLoginPassword({
        newPassword: data.newPassword,
        requirePasswordChange: false,
      });

      if (response.status === "success") {
        toast.success(
          "Password updated successfully! Please login with your new password."
        );
        setShowPasswordChangeModal(false);
        setUserNeedsPasswordChange(null);
        setIdentifier("");
        setPassword("");
      } else {
        toast.error(response.message || "Failed to update password");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              IRO Library Admin
            </span>
          </div>
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span className="ml-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Administrator Access
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identifier Input */}
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email or Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="flex">
                  <Mail className="h-4 w-4 text-gray-400 mr-1" />
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter email or phone number"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Sign In as Admin
              </>
            )}
          </button>
        </form>

        {/* Admin Access Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Only authorized administrators can access this system.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Contact your super administrator for account creation.
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Secure Access
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                This area is restricted to authorized administrators only
              </p>
            </div>
          </div>
        </div>

        {/* Back to User Site */}
        <div className="mt-6 text-center">
          <a
            href="http://localhost:3000"
            className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            ← Back to User Site
          </a>
        </div>
      </div>

      {/* First Time Password Change Modal */}
      {showPasswordChangeModal && userNeedsPasswordChange && (
        <FirstTimePasswordChangeModal
          isOpen={showPasswordChangeModal}
          onClose={() => {
            setShowPasswordChangeModal(false);
            setUserNeedsPasswordChange(null);
          }}
          onSubmit={handlePasswordChange}
          adminName={`${userNeedsPasswordChange.firstName} ${userNeedsPasswordChange.lastName}`}
        />
      )}
    </div>
  );
}

// First Time Password Change Modal Component
interface FirstTimePasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { newPassword: string }) => void;
  adminName: string;
}

function FirstTimePasswordChangeModal({
  isOpen,
  onClose,
  onSubmit,
  adminName,
}: FirstTimePasswordChangeModalProps) {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        newPassword: formData.newPassword,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <Lock className="h-6 w-6 text-yellow-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Set New Password
          </h2>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-md p-4 mb-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Welcome, {adminName}!</strong>
            <br />
            For security purposes, please set a new password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
                minLength={8}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter new password (min 8 characters)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> After setting your new password, you will
              need to log in again with your new credentials.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              disabled={
                loading ||
                formData.newPassword !== formData.confirmPassword ||
                formData.newPassword.length < 8
              }
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Set Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
