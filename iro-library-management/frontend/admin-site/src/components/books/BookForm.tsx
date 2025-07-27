"use client";

import { SearchableSelect } from "@/components/ui";
import { useBookFormDataQuery } from "@/hooks/useBookForm";
import { Book, CreateBookData, UpdateBookData } from "@/services/bookService";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface BookFormProps {
  book?: Book;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBookData | UpdateBookData) => void;
  loading?: boolean;
}

export function BookForm({
  book,
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}: BookFormProps) {
  const [formData, setFormData] = useState<CreateBookData>({
    title: "",
    subtitle: "",
    authors: [],
    isbn: "",
    isbn13: "",
    publisher: "",
    publishedDate: "",
    language: "English",
    pages: 1,
    description: "",
    categories: [],
    tags: [],
    coverImage: "",
    thumbnailImage: "",
    format: "physical",
    digitalFormats: [],
    fileUrl: "",
    audioUrl: "",
    totalCopies: 1,
    availableCopies: 1,
    location: {
      shelf: "",
      section: "",
      floor: "",
    },
    acquisitionInfo: {
      acquisitionDate: new Date().toISOString().split("T")[0],
      source: "purchase",
      cost: 0,
      donor: "",
      notes: "",
    },
    condition: "excellent",
    isActive: true,
    isFeatured: false,
  });

  const [authorInput, setAuthorInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Get form data (categories and publishers)
  const { data: bookFormData, isLoading: isLoadingFormData } =
    useBookFormDataQuery();

  // Extract categories and publishers from API
  const categories = bookFormData?.data?.categories || [];
  const publishers = bookFormData?.data?.publishers || [];

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        subtitle: book.subtitle || "",
        authors: book.authors,
        isbn: book.isbn || "",
        isbn13: book.isbn13 || "",
        publisher: book.publisher || "",
        publishedDate: book.publishedDate || "",
        language: book.language || "English",
        pages: book.pages || 0,
        description: book.description || "",
        categories: book.categories,
        tags: book.tags || [],
        coverImage: book.coverImage || "",
        thumbnailImage: book.thumbnailImage || "",
        format: book.format,
        digitalFormats: book.digitalFormats || [],
        fileUrl: book.fileUrl || "",
        audioUrl: book.audioUrl || "",
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        location: book.location || { shelf: "", section: "", floor: "" },
        acquisitionInfo: book.acquisitionInfo || {
          acquisitionDate: new Date().toISOString().split("T")[0],
          source: "purchase",
          cost: 0,
          donor: "",
          notes: "",
        },
        condition: book.condition || "excellent",
        isActive: book.isActive !== undefined ? book.isActive : true,
        isFeatured: book.isFeatured || false,
      });
    } else {
      // Reset form for new book
      setFormData({
        title: "",
        subtitle: "",
        authors: [],
        isbn: "",
        isbn13: "",
        publisher: "",
        publishedDate: "",
        language: "English",
        pages: 1,
        description: "",
        categories: [],
        tags: [],
        coverImage: "",
        thumbnailImage: "",
        format: "physical",
        digitalFormats: [],
        fileUrl: "",
        audioUrl: "",
        totalCopies: 1,
        availableCopies: 1,
        location: {
          shelf: "",
          section: "",
          floor: "",
        },
        acquisitionInfo: {
          acquisitionDate: new Date().toISOString().split("T")[0],
          source: "purchase",
          cost: 0,
          donor: "",
          notes: "",
        },
        condition: "excellent",
        isActive: true,
        isFeatured: false,
      });
    }
  }, [book, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up the form data by removing empty strings for optional fields
    const cleanedData = {
      ...formData,
      isbn: formData.isbn?.trim() || undefined,
      isbn13: formData.isbn13?.trim() || undefined,
      subtitle: formData.subtitle?.trim() || undefined,
      publisher: formData.publisher?.trim() || undefined,
      description: formData.description?.trim() || undefined,
      coverImage: formData.coverImage?.trim() || undefined,
      thumbnailImage: formData.thumbnailImage?.trim() || undefined,
      fileUrl: formData.fileUrl?.trim() || undefined,
      audioUrl: formData.audioUrl?.trim() || undefined,
      location: {
        shelf: formData.location.shelf.trim(),
        section: formData.location.section.trim(),
        floor: formData.location.floor?.trim() || undefined,
      },
      acquisitionInfo: formData.acquisitionInfo
        ? {
            ...formData.acquisitionInfo,
            donor: formData.acquisitionInfo.donor?.trim() || undefined,
            notes: formData.acquisitionInfo.notes?.trim() || undefined,
          }
        : undefined,
    };

    if (book) {
      // For update, include availableCopies
      const updateData: UpdateBookData = {
        ...cleanedData,
        availableCopies: book.availableCopies,
      };
      onSubmit(updateData);
    } else {
      onSubmit(cleanedData);
    }
  };

  const addAuthor = () => {
    if (authorInput.trim() && !formData.authors.includes(authorInput.trim())) {
      setFormData({
        ...formData,
        authors: [...formData.authors, authorInput.trim()],
      });
      setAuthorInput("");
    }
  };

  const removeAuthor = (index: number) => {
    setFormData({
      ...formData,
      authors: formData.authors.filter((_, i) => i !== index),
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !(formData.tags || []).includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((_, i) => i !== index),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {book ? "Edit Book" : "Add New Book"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isLoadingFormData && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">
                Loading form data...
              </span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Authors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Authors *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={authorInput}
                onChange={(e) => setAuthorInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addAuthor())
                }
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter author name"
              />
              <button
                type="button"
                onClick={addAuthor}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.authors.map((author, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                >
                  {author}
                  <button
                    type="button"
                    onClick={() => removeAuthor(index)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* ISBN Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ISBN
              </label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) =>
                  setFormData({ ...formData, isbn: e.target.value })
                }
                placeholder="10-digit ISBN"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ISBN-13
              </label>
              <input
                type="text"
                value={formData.isbn13}
                onChange={(e) =>
                  setFormData({ ...formData, isbn13: e.target.value })
                }
                placeholder="13-digit ISBN"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Category Row */}
          <SearchableSelect
            label="Category"
            options={categories}
            value={formData.categories[0] || ""}
            onChange={(value) =>
              setFormData({
                ...formData,
                categories: value ? [value] : [],
              })
            }
            placeholder="Select a category..."
            required
            loading={isLoadingFormData}
          />

          {/* Publisher */}
          <SearchableSelect
            label="Publisher"
            options={publishers}
            value={formData.publisher || ""}
            onChange={(value) =>
              setFormData({
                ...formData,
                publisher: value,
              })
            }
            placeholder="Select a publisher..."
            loading={isLoadingFormData}
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Published Year and Total Copies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Published Date
              </label>
              <input
                type="date"
                value={formData.publishedDate}
                onChange={(e) =>
                  setFormData({ ...formData, publishedDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Copies *
              </label>
              <input
                type="number"
                value={formData.totalCopies}
                onChange={(e) => {
                  const totalCopies = parseInt(e.target.value) || 1;
                  setFormData({
                    ...formData,
                    totalCopies,
                    // For new books, set available copies to total copies
                    availableCopies: !book
                      ? totalCopies
                      : formData.availableCopies,
                  });
                }}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Available Copies *
              </label>
              <input
                type="number"
                value={formData.availableCopies}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availableCopies: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
                max={formData.totalCopies}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Format
            </label>
            <select
              value={formData.format}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  format: e.target.value as "physical" | "digital" | "both",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="physical">Physical</option>
              <option value="digital">Digital</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Shelf
              </label>
              <input
                type="text"
                value={formData.location?.shelf || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      shelf: e.target.value,
                      section: formData.location?.section || "",
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section
              </label>
              <input
                type="text"
                value={formData.location?.section || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      section: e.target.value,
                      shelf: formData.location?.shelf || "",
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              value={formData.coverImage}
              onChange={(e) =>
                setFormData({ ...formData, coverImage: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.tags || []).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-green-600 hover:text-green-800 dark:text-green-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) =>
                setFormData({ ...formData, isFeatured: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isFeatured"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              Featured Book
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading || !formData.title || formData.authors.length === 0
              }
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : book ? "Update Book" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
