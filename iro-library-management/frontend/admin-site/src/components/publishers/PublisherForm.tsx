"use client";

import {
  useCreatePublisherMutation,
  useUpdatePublisherMutation,
} from "@/hooks/usePublishers";
import {
  CreatePublisherData,
  Publisher,
  UpdatePublisherData,
} from "@/services/publisherService";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface PublisherFormProps {
  publisher?: Publisher | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PublisherForm({
  publisher,
  isOpen,
  onClose,
  onSuccess,
}: PublisherFormProps) {
  const [formData, setFormData] = useState<CreatePublisherData>({
    name: "",
    description: "",
    website: "",
    email: "",
    phone: "",
    isActive: true,
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createPublisher = useCreatePublisherMutation();
  const updatePublisher = useUpdatePublisherMutation();

  const isEditing = !!publisher;
  const loading = createPublisher.isPending || updatePublisher.isPending;

  // Reset form when publisher changes
  useEffect(() => {
    if (publisher) {
      setFormData({
        name: publisher.name,
        description: publisher.description || "",
        website: publisher.website || "",
        email: publisher.email || "",
        phone: publisher.phone || "",
        isActive: publisher.isActive,
        address: {
          street: publisher.address?.street || "",
          city: publisher.address?.city || "",
          state: publisher.address?.state || "",
          zipCode: publisher.address?.zipCode || "",
          country: publisher.address?.country || "",
        },
      });
    } else {
      setFormData({
        name: "",
        description: "",
        website: "",
        email: "",
        phone: "",
        isActive: true,
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
      });
    }
    setErrors({});
  }, [publisher]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = "Publisher name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Publisher name must be at least 2 characters";
    } else if (formData.name.length > 100) {
      newErrors.name = "Publisher name cannot exceed 100 characters";
    }

    // Optional field validation
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters";
    }

    if (formData.website && formData.website.trim()) {
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(formData.website)) {
        newErrors.website =
          "Website must be a valid URL starting with http:// or https://";
      }
    }

    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (formData.phone && formData.phone.length > 20) {
      newErrors.phone = "Phone number cannot exceed 20 characters";
    }

    // Address validation
    if (formData.address?.zipCode && formData.address.zipCode.length > 20) {
      newErrors["address.zipCode"] = "ZIP code cannot exceed 20 characters";
    }

    ["street", "city", "state", "country"].forEach((field) => {
      const value = formData.address?.[field as keyof typeof formData.address];
      if (value && value.length > 100) {
        newErrors[`address.${field}`] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } cannot exceed 100 characters`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing && publisher) {
        await updatePublisher.mutateAsync({
          id: publisher._id,
          data: formData as UpdatePublisherData,
        });
      } else {
        await createPublisher.mutateAsync(formData);
      }
      onSuccess();
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error("Form submission error:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (name.includes(".")) {
      const [section, field] = name.split(".");
      if (section === "address") {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            [field]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Publisher" : "Add New Publisher"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-900">
              Basic Information
            </h3>

            {/* Publisher Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Publisher Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter publisher name"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description{" "}
                <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter publisher description (optional)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Website */}
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Website{" "}
                <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.website ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="https://example.com"
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">{errors.website}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className="ml-2 block text-sm text-gray-700"
              >
                Active publisher
              </label>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-900">
              Contact Information{" "}
              <span className="text-gray-400 text-xs font-normal">
                (all optional)
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="contact@publisher.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-900">
              Address{" "}
              <span className="text-gray-400 text-xs font-normal">
                (all optional)
              </span>
            </h3>

            {/* Street */}
            <div>
              <label
                htmlFor="address.street"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Street Address
              </label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                value={formData.address?.street || ""}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors["address.street"]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="123 Main Street"
              />
              {errors["address.street"] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors["address.street"]}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City */}
              <div>
                <label
                  htmlFor="address.city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City
                </label>
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={formData.address?.city || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors["address.city"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="New York"
                />
                {errors["address.city"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["address.city"]}
                  </p>
                )}
              </div>

              {/* State */}
              <div>
                <label
                  htmlFor="address.state"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  State/Province
                </label>
                <input
                  type="text"
                  id="address.state"
                  name="address.state"
                  value={formData.address?.state || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors["address.state"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="NY"
                />
                {errors["address.state"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["address.state"]}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ZIP Code */}
              <div>
                <label
                  htmlFor="address.zipCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  id="address.zipCode"
                  name="address.zipCode"
                  value={formData.address?.zipCode || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors["address.zipCode"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="10001"
                />
                {errors["address.zipCode"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["address.zipCode"]}
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="address.country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="address.country"
                  name="address.country"
                  value={formData.address?.country || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors["address.country"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="United States"
                />
                {errors["address.country"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["address.country"]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {isEditing ? "Update Publisher" : "Create Publisher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
