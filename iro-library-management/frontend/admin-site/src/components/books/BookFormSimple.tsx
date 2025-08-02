"use client";

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
    description: "",
    categories: [],
    tags: [],
    coverImage: "",
    format: "physical",
    totalCopies: 1,
    availableCopies: 1,
    location: {
      shelf: "",
      section: "",
    },
    isActive: true,
    isFeatured: false,
  });

  const [authorInput, setAuthorInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");

  // Predefined categories
  const predefinedCategories = [
    "Philosophy",
    "Islamic Studies",
    "Religion",
    "Science",
    "History",
    "Language",
    "Art",
    "Literature",
    "Biography",
    "Reference",
  ];

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        subtitle: book.subtitle || "",
        // Handle both populated objects and ID strings for authors
        authors: Array.isArray(book.authors)
          ? book.authors.map((author: any) =>
              typeof author === "object" ? author.name : author
            )
          : [],
        description: book.description || "",
        // Handle both populated objects and ID strings for categories
        categories: Array.isArray(book.categories)
          ? book.categories.map((category: any) =>
              typeof category === "object" ? category.name : category
            )
          : [],
        tags: book.tags || [],
        coverImage: book.coverImage || "",
        format: book.format,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies, // <-- add this line
        location: book.location || { shelf: "", section: "" },
        isActive: book.isActive !== undefined ? book.isActive : true,
        isFeatured: book.isFeatured || false,
      });
    } else {
      // Reset form for new book
      setFormData({
        title: "",
        subtitle: "",
        authors: [],
        description: "",
        categories: [],
        tags: [],
        coverImage: "",
        format: "physical",
        totalCopies: 1,
        availableCopies: 1,
        location: {
          shelf: "",
          section: "",
        },
        isActive: true,
        isFeatured: false,
      });
    }
  }, [book, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Remove bookId from formData to avoid backend validation issues
    const { bookId, ...cleanFormData } = formData as any;

    if (book) {
      // For update, include availableCopies
      const updateData: UpdateBookData = {
        ...cleanFormData,
        availableCopies: book.availableCopies,
      };
      onSubmit(updateData);
    } else {
      onSubmit(cleanFormData);
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

  const addCategory = () => {
    if (
      categoryInput.trim() &&
      !formData.categories.includes(categoryInput.trim())
    ) {
      setFormData({
        ...formData,
        categories: [...formData.categories, categoryInput.trim()],
      });
      setCategoryInput("");
    }
  };

  const removeCategory = (index: number) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((_, i) => i !== index),
    });
  };

  const addTag = () => {
    if (tagInput.trim()) {
      // Split by comma and add multiple tags
      const newTags = tagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag && !(formData.tags || []).includes(tag));

      if (newTags.length > 0) {
        setFormData({
          ...formData,
          tags: [...(formData.tags || []), ...newTags],
        });
      }
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

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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

          {/* Book ID Display (if editing) and Total Copies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {book && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Book ID
                </label>
                <input
                  type="text"
                  value={book.bookId || ""}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Copies *
              </label>
              <input
                type="number"
                value={formData.totalCopies}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalCopies: parseInt(e.target.value),
                  })
                }
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categories *
            </label>
            <div className="flex gap-2 mb-2">
              <select
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a category</option>
                {predefinedCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addCategory}
                disabled={!categoryInput}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.categories.map((category, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full"
                >
                  {category}
                  <button
                    type="button"
                    onClick={() => removeCategory(index)}
                    className="text-purple-600 hover:text-purple-800 dark:text-purple-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

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
                placeholder="Enter tags (comma-separated)"
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
                loading ||
                !formData.title ||
                formData.authors.length === 0 ||
                formData.categories.length === 0
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
