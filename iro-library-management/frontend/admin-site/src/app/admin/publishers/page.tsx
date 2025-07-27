"use client";

import { PublisherForm } from "@/components/publishers";
import {
  useDeletePublisherMutation,
  usePublishersQuery,
} from "@/hooks/usePublishers";
import { Publisher } from "@/services/publisherService";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Filter,
  Globe,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function PublishersPage() {
  // Form and modal state
  const [showForm, setShowForm] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(
    null
  );

  // Filter and search state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [countryFilter, setCountryFilter] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "createdAt">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // API calls
  const {
    data: publishersData,
    isLoading,
    error,
  } = usePublishersQuery({
    page: currentPage,
    limit,
    search,
    isActive: statusFilter === "all" ? undefined : statusFilter === "active",
    country: countryFilter || undefined,
    sortBy,
    sortOrder,
  });

  const deletePublisher = useDeletePublisherMutation();

  // Memoized data
  const publishers = publishersData?.data?.publishers || [];
  const totalCount = publishersData?.pagination?.totalPublishers || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // Get unique countries for filter dropdown
  const countries = useMemo(() => {
    const countrySet = new Set<string>();
    publishers.forEach((publisher: Publisher) => {
      if (publisher.address?.country) {
        countrySet.add(publisher.address.country);
      }
    });
    return Array.from(countrySet).sort();
  }, [publishers]);

  // Handle form success
  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedPublisher(null);
  };

  // Handle edit
  const handleEdit = (publisher: Publisher) => {
    setSelectedPublisher(publisher);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (publisher: Publisher) => {
    if (!confirm(`Are you sure you want to delete "${publisher.name}"?`)) {
      return;
    }

    try {
      await deletePublisher.mutateAsync(publisher._id);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  // Handle new publisher
  const handleNew = () => {
    setSelectedPublisher(null);
    setShowForm(true);
  };

  // Pagination helpers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  // Reset pagination when filters change
  const handleFilterChange = (newFilters: any) => {
    setCurrentPage(1);
    return newFilters;
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Publishers
          </h2>
          <p className="text-red-600">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Publishers</h1>
          <p className="text-gray-600 mt-1">
            Manage publisher information and details
          </p>
        </div>
        <button
          onClick={handleNew}
          className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Publisher
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search publishers..."
                value={search}
                onChange={(e) => handleFilterChange(setSearch(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) =>
                handleFilterChange(setStatusFilter(e.target.value as any))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Country Filter */}
          <div>
            <select
              value={countryFilter}
              onChange={(e) =>
                handleFilterChange(setCountryFilter(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                handleFilterChange(() => {
                  setSortBy(field as any);
                  setSortOrder(order as any);
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing {publishers.length} of {totalCount} publishers
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Publishers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading publishers...</p>
          </div>
        ) : publishers.length === 0 ? (
          <div className="p-8 text-center">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No publishers found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Publisher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {publishers.map((publisher: Publisher) => (
                  <tr key={publisher._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {publisher.name}
                        </div>
                        {publisher.description && (
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {publisher.description}
                          </div>
                        )}
                        {publisher.website && (
                          <div className="flex items-center gap-1 mt-1">
                            <Globe className="h-3 w-3 text-gray-400" />
                            <a
                              href={publisher.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Website
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {publisher.email && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="truncate max-w-[200px]">
                              {publisher.email}
                            </span>
                          </div>
                        )}
                        {publisher.phone && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span>{publisher.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {publisher.address && (
                        <div className="flex items-start gap-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="space-y-0.5">
                            {publisher.address.city && (
                              <div>{publisher.address.city}</div>
                            )}
                            {publisher.address.country && (
                              <div className="text-xs text-gray-500">
                                {publisher.address.country}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          publisher.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {publisher.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(publisher)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          title="Edit publisher"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(publisher)}
                          className="text-red-600 hover:text-red-800 p-1 rounded"
                          title="Delete publisher"
                          disabled={deletePublisher.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            {/* First Page */}
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>

            {/* Previous Page */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === "number" && goToPage(page)}
                  disabled={typeof page !== "number"}
                  className={`px-3 py-1 text-sm rounded ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : typeof page === "number"
                      ? "text-gray-600 hover:bg-gray-100"
                      : "text-gray-400 cursor-default"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next Page */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Last Page */}
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Publisher Form Modal */}
      <PublisherForm
        publisher={selectedPublisher}
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
