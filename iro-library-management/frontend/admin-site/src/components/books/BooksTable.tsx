"use client";

import { Book } from "@/services/bookService";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useState } from "react";

interface BooksTableProps {
  books: Book[];
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onView: (bookId: string) => void;
  onBulkDelete?: (bookIds: string[]) => void;
  onBulkStatusChange?: (bookIds: string[], isActive: boolean) => void;
}

export function BooksTable({
  books,
  onEdit,
  onDelete,
  onView,
  onBulkDelete,
  onBulkStatusChange,
}: BooksTableProps) {
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);

  const getStatusBadge = (available: number, total: number) => {
    if (available === 0) {
      return <span className="badge-danger">Out of Stock</span>;
    }
    if (available <= total * 0.2) {
      return <span className="badge-warning">Low Stock</span>;
    }
    return <span className="badge-success">Available</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBooks(books.map((book) => book._id));
    } else {
      setSelectedBooks([]);
    }
  };

  const handleSelectBook = (bookId: string, checked: boolean) => {
    if (checked) {
      setSelectedBooks([...selectedBooks, bookId]);
    } else {
      setSelectedBooks(selectedBooks.filter((id) => id !== bookId));
    }
  };

  const isAllSelected =
    selectedBooks.length === books.length && books.length > 0;
  const isIndeterminate =
    selectedBooks.length > 0 && selectedBooks.length < books.length;

  return (
    <div className="overflow-x-auto">
      {/* Bulk Actions */}
      {selectedBooks.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {selectedBooks.length} book{selectedBooks.length !== 1 ? "s" : ""}{" "}
              selected
            </span>
            <div className="flex gap-2">
              {onBulkStatusChange && (
                <>
                  <button
                    onClick={() => onBulkStatusChange(selectedBooks, true)}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => onBulkStatusChange(selectedBooks, false)}
                    className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Deactivate
                  </button>
                </>
              )}
              {onBulkDelete && (
                <button
                  onClick={() => {
                    if (
                      confirm(
                        `Are you sure you want to delete ${selectedBooks.length} books?`
                      )
                    ) {
                      onBulkDelete(selectedBooks);
                      setSelectedBooks([]);
                    }
                  }}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => setSelectedBooks([])}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="table">
        <thead className="table-header">
          <tr>
            <th className="table-header-cell">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) input.indeterminate = isIndeterminate;
                }}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="table-header-cell">Book Details</th>
            <th className="table-header-cell">Category</th>
            <th className="table-header-cell">Format</th>
            <th className="table-header-cell">Language</th>
            <th className="table-header-cell">Location</th>
            <th className="table-header-cell">Copies</th>
            <th className="table-header-cell">Status</th>
            <th className="table-header-cell">Added</th>
            <th className="table-header-cell">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {books.map((book) => (
            <tr
              key={book._id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="table-cell">
                <input
                  type="checkbox"
                  checked={selectedBooks.includes(book._id)}
                  onChange={(e) => handleSelectBook(book._id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="table-cell">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {book.title}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    by {book.authors.join(", ")}
                  </div>
                  <div className="text-xs text-gray-400">ISBN: {book.isbn}</div>
                </div>
              </td>
              <td className="table-cell">
                <div className="flex flex-wrap gap-1">
                  {book.categories.slice(0, 2).map((category, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {category}
                    </span>
                  ))}
                  {book.categories.length > 2 && (
                    <span className="text-xs text-gray-400">
                      +{book.categories.length - 2} more
                    </span>
                  )}
                </div>
              </td>
              <td className="table-cell">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    book.format === "physical"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : book.format === "digital"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                      : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  }`}
                >
                  {book.format.charAt(0).toUpperCase() + book.format.slice(1)}
                </span>
              </td>
              <td className="table-cell">
                <span className="text-sm text-gray-900 dark:text-white">
                  {book.language || "N/A"}
                </span>
              </td>
              <td className="table-cell">
                <div className="text-sm">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {book.location?.shelf || "N/A"}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">
                    {book.location?.section || "N/A"}
                  </div>
                </div>
              </td>
              <td className="table-cell">
                <div className="text-sm">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {book.availableCopies} / {book.totalCopies}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    Available / Total
                  </div>
                </div>
              </td>
              <td className="table-cell">
                {getStatusBadge(book.availableCopies, book.totalCopies)}
              </td>
              <td className="table-cell">{formatDate(book.createdAt)}</td>
              <td className="table-cell">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onView(book._id)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(book._id)}
                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    title="Edit Book"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(book._id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete Book"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {books.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">No books found</p>
            <p className="mt-1">Try adjusting your search or filters</p>
          </div>
        </div>
      )}

      {selectedBooks.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {selectedBooks.length} book(s) selected
            </span>
            <div className="flex space-x-2">
              <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Export Selected
              </button>
              <button className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
