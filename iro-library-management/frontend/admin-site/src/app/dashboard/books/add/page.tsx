"use client";

import { SearchableSelect } from "@/components/ui";
import { useBookFormDataQuery } from "@/hooks/useBookForm";
import { useCreateBookMutation } from "@/hooks/useBooks";
import { CreateBookData } from "@/services/bookService";
import { ArrowLeft, Book, Save, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const DIGITAL_FORMATS = ["pdf", "epub", "mobi", "audiobook"];
const SOURCES = ["purchase", "donation", "exchange", "other"];
const CONDITIONS = ["excellent", "good", "fair", "poor", "damaged"];

export default function AddBookPage() {
  const router = useRouter();
  const createBookMutation = useCreateBookMutation({
    onSuccess: () => {
      toast.success("Book added successfully!");
      router.push("/dashboard/books");
    },
  });

  const { data: formOptions, isLoading: isLoadingOptions } =
    useBookFormDataQuery();

  const [formData, setFormData] = useState<CreateBookData>({
    title: "",
    subtitle: "",
    authors: [""],
    isbn: "",
    isbn13: "",
    publisher: "",
    publishedDate: "",
    language: "English",
    pages: 0,
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNestedChange = (
    section: "location" | "acquisitionInfo",
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleAuthorsChange = (index: number, value: string) => {
    const newAuthors = [...formData.authors];
    newAuthors[index] = value;
    setFormData((prev) => ({ ...prev, authors: newAuthors }));
  };

  const addAuthor = () => {
    setFormData((prev) => ({ ...prev, authors: [...prev.authors, ""] }));
  };

  const removeAuthor = (index: number) => {
    if (formData.authors.length > 1) {
      const newAuthors = formData.authors.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, authors: newAuthors }));
    }
  };

  const handleDigitalFormatsChange = (format: string) => {
    setFormData((prev) => ({
      ...prev,
      digitalFormats: prev.digitalFormats?.includes(format as any)
        ? prev.digitalFormats.filter((f) => f !== format)
        : [...(prev.digitalFormats || []), format as any],
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (formData.authors.some((author) => !author.trim())) {
      toast.error("All author fields must be filled");
      return;
    }

    if (formData.categories.length === 0) {
      toast.error("At least one category must be selected");
      return;
    }

    // Clean up data
    const cleanedData = {
      ...formData,
      authors: formData.authors.filter((author) => author.trim()),
      pages: formData.pages || undefined,
      cost: formData.acquisitionInfo?.cost || undefined,
    };

    createBookMutation.mutate(cleanedData);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/books"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Book className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add New Book
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Fill in the details to add a new book to the library
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Authors */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Authors *
              </label>
              {formData.authors.map((author, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => handleAuthorsChange(index, e.target.value)}
                    placeholder={`Author ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                  {formData.authors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAuthor(index)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-md"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addAuthor}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                + Add Author
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ISBN
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ISBN-13
              </label>
              <input
                type="text"
                name="isbn13"
                value={formData.isbn13}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Publisher
              </label>
              <SearchableSelect
                options={formOptions?.data?.publishers || []}
                value={formData.publisher || ""}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, publisher: value }))
                }
                placeholder="Select a publisher..."
                loading={isLoadingOptions}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Published Date
              </label>
              <input
                type="date"
                name="publishedDate"
                value={formData.publishedDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pages
              </label>
              <input
                type="number"
                name="pages"
                value={formData.pages || ""}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Categories and Tags */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Categories & Tags
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categories *
            </label>
            <SearchableSelect
              options={formOptions?.data?.categories || []}
              value={formData.categories[0] || ""}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  categories: value ? [value] : [],
                }))
              }
              placeholder="Select a category..."
              loading={isLoadingOptions}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags.join(", ")}
              onChange={handleTagsChange}
              placeholder="tag1, tag2, tag3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Format and Files */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Format & Digital Files
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Format *
              </label>
              <select
                name="format"
                value={formData.format}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="physical">Physical</option>
                <option value="digital">Digital</option>
                <option value="both">Both</option>
              </select>
            </div>

            {(formData.format === "digital" || formData.format === "both") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Digital Formats
                  </label>
                  <div className="space-y-2">
                    {DIGITAL_FORMATS.map((format) => (
                      <label key={format} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.digitalFormats?.includes(
                            format as any
                          )}
                          onChange={() => handleDigitalFormatsChange(format)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {format}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    File URL
                  </label>
                  <input
                    type="url"
                    name="fileUrl"
                    value={formData.fileUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Audio URL
                  </label>
                  <input
                    type="url"
                    name="audioUrl"
                    value={formData.audioUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover Image URL
              </label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thumbnail Image URL
              </label>
              <input
                type="url"
                name="thumbnailImage"
                value={formData.thumbnailImage}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Copies and Location */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Copies & Location
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Copies *
              </label>
              <input
                type="number"
                name="totalCopies"
                value={formData.totalCopies}
                onChange={handleInputChange}
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
                name="availableCopies"
                value={formData.availableCopies}
                onChange={handleInputChange}
                min="0"
                max={formData.totalCopies}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {(formData.format === "physical" || formData.format === "both") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Shelf *
                  </label>
                  <input
                    type="text"
                    value={formData.location.shelf}
                    onChange={(e) =>
                      handleNestedChange("location", "shelf", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Section *
                  </label>
                  <input
                    type="text"
                    value={formData.location.section}
                    onChange={(e) =>
                      handleNestedChange("location", "section", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Floor
                  </label>
                  <input
                    type="text"
                    value={formData.location.floor}
                    onChange={(e) =>
                      handleNestedChange("location", "floor", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Condition *
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        condition: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    {CONDITIONS.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition.charAt(0).toUpperCase() + condition.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Acquisition Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Acquisition Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Acquisition Date *
              </label>
              <input
                type="date"
                value={formData.acquisitionInfo?.acquisitionDate}
                onChange={(e) =>
                  handleNestedChange(
                    "acquisitionInfo",
                    "acquisitionDate",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Source *
              </label>
              <select
                value={formData.acquisitionInfo?.source}
                onChange={(e) =>
                  handleNestedChange(
                    "acquisitionInfo",
                    "source",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                {SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {source.charAt(0).toUpperCase() + source.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cost
              </label>
              <input
                type="number"
                value={formData.acquisitionInfo?.cost || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "acquisitionInfo",
                    "cost",
                    parseFloat(e.target.value) || 0
                  )
                }
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Donor (if source is donation)
              </label>
              <input
                type="text"
                value={formData.acquisitionInfo?.donor}
                onChange={(e) =>
                  handleNestedChange("acquisitionInfo", "donor", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                value={formData.acquisitionInfo?.notes}
                onChange={(e) =>
                  handleNestedChange("acquisitionInfo", "notes", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Settings
          </h2>

          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Active (book is available for borrowing)
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Featured (book will appear in featured section)
              </span>
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/books"
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createBookMutation.isPending}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {createBookMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            {createBookMutation.isPending ? "Adding..." : "Add Book"}
          </button>
        </div>
      </form>
    </div>
  );
}
