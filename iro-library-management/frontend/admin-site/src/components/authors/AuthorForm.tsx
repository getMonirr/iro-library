"use client";

import {
  Author,
  CreateAuthorData,
  UpdateAuthorData,
} from "@/services/authorService";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface AuthorFormProps {
  author?: Author | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAuthorData | UpdateAuthorData) => void;
  loading?: boolean;
}

export function AuthorForm({
  author,
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}: AuthorFormProps) {
  const [formData, setFormData] = useState<CreateAuthorData>({
    name: "",
    description: "",
    biography: "",
    birthDate: "",
    deathDate: "",
    nationality: "",
    photo: "",
    website: "",
    socialMedia: {
      twitter: "",
      facebook: "",
      instagram: "",
      linkedin: "",
    },
    genres: [],
    awards: [],
    isActive: true,
  });

  const [genreInput, setGenreInput] = useState("");
  const [awardInput, setAwardInput] = useState("");

  useEffect(() => {
    if (author) {
      setFormData({
        name: author.name,
        description: author.description || "",
        biography: author.biography || "",
        birthDate: author.birthDate || "",
        deathDate: author.deathDate || "",
        nationality: author.nationality || "",
        photo: author.photo || "",
        website: author.website || "",
        socialMedia: author.socialMedia || {
          twitter: "",
          facebook: "",
          instagram: "",
          linkedin: "",
        },
        genres: author.genres || [],
        awards: author.awards || [],
        isActive: author.isActive !== undefined ? author.isActive : true,
      });
    } else {
      // Reset form for new author
      setFormData({
        name: "",
        description: "",
        biography: "",
        birthDate: "",
        deathDate: "",
        nationality: "",
        photo: "",
        website: "",
        socialMedia: {
          twitter: "",
          facebook: "",
          instagram: "",
          linkedin: "",
        },
        genres: [],
        awards: [],
        isActive: true,
      });
    }
  }, [author]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name.startsWith("socialMedia.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialMedia: { ...prev.socialMedia, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addGenre = () => {
    if (genreInput.trim() && !formData.genres?.includes(genreInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        genres: [...(prev.genres || []), genreInput.trim()],
      }));
      setGenreInput("");
    }
  };

  const removeGenre = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres?.filter((g) => g !== genre) || [],
    }));
  };

  const addAward = () => {
    if (awardInput.trim() && !formData.awards?.includes(awardInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        awards: [...(prev.awards || []), awardInput.trim()],
      }));
      setAwardInput("");
    }
  };

  const removeAward = (award: string) => {
    setFormData((prev) => ({
      ...prev,
      awards: prev.awards?.filter((a) => a !== award) || [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      return;
    }

    // Clean up data
    const cleanedData = {
      ...formData,
      description: formData.description?.trim() || undefined,
      biography: formData.biography?.trim() || undefined,
      nationality: formData.nationality?.trim() || undefined,
      photo: formData.photo?.trim() || undefined,
      website: formData.website?.trim() || undefined,
      socialMedia: {
        twitter: formData.socialMedia?.twitter?.trim() || undefined,
        facebook: formData.socialMedia?.facebook?.trim() || undefined,
        instagram: formData.socialMedia?.instagram?.trim() || undefined,
        linkedin: formData.socialMedia?.linkedin?.trim() || undefined,
      },
    };

    onSubmit(cleanedData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {author ? "Edit Author" : "Add New Author"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description{" "}
                <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Biography{" "}
                <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <textarea
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Birth Date{" "}
                <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Death Date{" "}
                <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                type="date"
                name="deathDate"
                value={formData.deathDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nationality{" "}
                <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Photo URL{" "}
                <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                type="url"
                name="photo"
                value={formData.photo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website{" "}
                <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Social Media{" "}
              <span className="text-gray-400 text-xs font-normal">
                (all optional)
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Twitter
                </label>
                <input
                  type="text"
                  name="socialMedia.twitter"
                  value={formData.socialMedia?.twitter || ""}
                  onChange={handleInputChange}
                  placeholder="@username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facebook
                </label>
                <input
                  type="text"
                  name="socialMedia.facebook"
                  value={formData.socialMedia?.facebook || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  name="socialMedia.instagram"
                  value={formData.socialMedia?.instagram || ""}
                  onChange={handleInputChange}
                  placeholder="@username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn
                </label>
                <input
                  type="text"
                  name="socialMedia.linkedin"
                  value={formData.socialMedia?.linkedin || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Genres */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Genres/Specializations{" "}
              <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addGenre())
                }
                placeholder="Add a genre..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={addGenre}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.genres?.map((genre, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-md"
                >
                  {genre}
                  <button
                    type="button"
                    onClick={() => removeGenre(genre)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Awards <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={awardInput}
                onChange={(e) => setAwardInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addAward())
                }
                placeholder="Add an award..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={addAward}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.awards?.map((award, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-md"
                >
                  {award}
                  <button
                    type="button"
                    onClick={() => removeAward(award)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Active (author is visible in the system)
              </span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {author ? "Update Author" : "Add Author"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
