import api from "../lib/api";

export interface Category {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  metadata: {
    addedBy: string;
    lastModifiedBy: string;
    addedAt: string;
    lastModifiedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  booksCount?: number;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface CategoriesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
  includeBooksCount?: boolean;
}

export interface CategoriesResponse {
  status: string;
  results: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCategories: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  data: {
    categories: Category[];
  };
}

export interface CategoryResponse {
  status: string;
  data: {
    category: Category;
  };
}

export interface ActiveCategoriesResponse {
  status: string;
  results: number;
  data: {
    categories: Pick<Category, "_id" | "name" | "description" | "slug">[];
  };
}

export const categoryService = {
  // Get all categories with pagination and filters
  getCategories: async (
    params: CategoriesQueryParams = {}
  ): Promise<CategoriesResponse> => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const response = await api.get(`/categories?${searchParams.toString()}`);
    return response.data;
  },

  // Get active categories for dropdowns
  getActiveCategories: async (): Promise<ActiveCategoriesResponse> => {
    const response = await api.get("/categories/active");
    return response.data;
  },

  // Get single category by ID
  getCategory: async (
    id: string,
    includeBooksCount = false
  ): Promise<CategoryResponse> => {
    const params = includeBooksCount ? "?includeBooksCount=true" : "";
    const response = await api.get(`/categories/${id}${params}`);
    return response.data;
  },

  // Create new category
  createCategory: async (
    data: CreateCategoryData
  ): Promise<CategoryResponse> => {
    const response = await api.post("/categories", data);
    return response.data;
  },

  // Update category
  updateCategory: async (
    id: string,
    data: UpdateCategoryData
  ): Promise<CategoryResponse> => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },

  // Delete category (soft delete)
  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
