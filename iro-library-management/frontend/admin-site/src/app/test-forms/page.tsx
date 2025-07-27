"use client";

import { BookForm } from "@/components/books/BookForm";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { PublisherForm } from "@/components/publishers/PublisherForm";
import { useBookFormDataQuery } from "@/hooks/useBookForm";
import { useState } from "react";

export default function TestFormsPage() {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showPublisherForm, setShowPublisherForm] = useState(false);
  const [showBookForm, setShowBookForm] = useState(false);

  const { data: bookFormData, isLoading } = useBookFormDataQuery();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Test CRUD Forms
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Data</h2>

          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading data...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Categories ({bookFormData?.data?.categories?.length || 0})
                </h3>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {bookFormData?.data?.categories?.map((category) => (
                    <div
                      key={category._id}
                      className="text-sm text-gray-600 bg-gray-50 p-2 rounded"
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Publishers ({bookFormData?.data?.publishers?.length || 0})
                </h3>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {bookFormData?.data?.publishers?.map((publisher) => (
                    <div
                      key={publisher._id}
                      className="text-sm text-gray-600 bg-gray-50 p-2 rounded"
                    >
                      {publisher.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowCategoryForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Add Category
          </button>

          <button
            onClick={() => setShowPublisherForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Add Publisher
          </button>

          <button
            onClick={() => setShowBookForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Add Book
          </button>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Management Pages</h2>
          <div className="space-y-2">
            <a
              href="/admin/categories"
              className="block text-blue-600 hover:text-blue-800 underline"
            >
              Manage Categories
            </a>
            <a
              href="/admin/publishers"
              className="block text-blue-600 hover:text-blue-800 underline"
            >
              Manage Publishers
            </a>
          </div>
        </div>
      </div>

      {/* Category Form Modal */}
      <CategoryForm
        isOpen={showCategoryForm}
        onClose={() => setShowCategoryForm(false)}
        onSuccess={() => {
          setShowCategoryForm(false);
          window.location.reload(); // Simple refresh for demo
        }}
      />

      {/* Publisher Form Modal */}
      <PublisherForm
        isOpen={showPublisherForm}
        onClose={() => setShowPublisherForm(false)}
        onSuccess={() => {
          setShowPublisherForm(false);
          window.location.reload(); // Simple refresh for demo
        }}
      />

      {/* Book Form Modal */}
      <BookForm
        isOpen={showBookForm}
        onClose={() => setShowBookForm(false)}
        onSubmit={(data) => {
          console.log("Book data:", data);
          setShowBookForm(false);
        }}
      />
    </div>
  );
}
