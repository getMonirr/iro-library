import {
  CategoriesQueryParams,
  categoryService,
  CreateCategoryData,
  UpdateCategoryData,
} from "@/services/categoryService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Query Keys
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters: CategoriesQueryParams) =>
    [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  active: () => [...categoryKeys.all, "active"] as const,
};

// Get categories with pagination and filters
export function useCategoriesQuery(params: CategoriesQueryParams = {}) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryService.getCategories(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get active categories for dropdowns
export function useActiveCategoriesQuery() {
  return useQuery({
    queryKey: categoryKeys.active(),
    queryFn: () => categoryService.getActiveCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get single category
export function useCategoryQuery(id: string, includeBooksCount = false) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategory(id, includeBooksCount),
    enabled: !!id,
  });
}

// Create category mutation
export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryData) =>
      categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("Category created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create category");
    },
  });
}

// Update category mutation
export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryData }) =>
      categoryService.updateCategory(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
      toast.success("Category updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update category");
    },
  });
}

// Delete category mutation
export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("Category deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete category");
    },
  });
}
