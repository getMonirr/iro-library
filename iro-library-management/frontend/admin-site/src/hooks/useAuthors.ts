import {
  authorService,
  CreateAuthorData,
  GetAuthorsParams,
  UpdateAuthorData,
} from "@/services/authorService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// Query keys
export const authorKeys = {
  all: ["authors"] as const,
  lists: () => [...authorKeys.all, "list"] as const,
  list: (params: GetAuthorsParams) => [...authorKeys.lists(), params] as const,
  details: () => [...authorKeys.all, "detail"] as const,
  detail: (id: string) => [...authorKeys.details(), id] as const,
  select: () => [...authorKeys.all, "select"] as const,
};

// Get all authors
export function useAuthorsQuery(params: GetAuthorsParams = {}) {
  return useQuery({
    queryKey: authorKeys.list(params),
    queryFn: () => authorService.getAuthors(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get single author
export function useAuthorQuery(id: string, enabled = true) {
  return useQuery({
    queryKey: authorKeys.detail(id),
    queryFn: () => authorService.getAuthor(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Get authors for select
export function useAuthorsSelectQuery() {
  return useQuery({
    queryKey: authorKeys.select(),
    queryFn: () => authorService.getAuthorsForSelect(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Create author mutation
export function useCreateAuthorMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAuthorData) => authorService.createAuthor(data),
    onSuccess: (data) => {
      // Invalidate and refetch authors list
      queryClient.invalidateQueries({ queryKey: authorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: authorKeys.select() });

      toast.success("Author created successfully!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create author");
      options?.onError?.(error);
    },
  });
}

// Update author mutation
export function useUpdateAuthorMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAuthorData }) =>
      authorService.updateAuthor(id, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: authorKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: authorKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: authorKeys.select() });

      toast.success("Author updated successfully!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update author");
      options?.onError?.(error);
    },
  });
}

// Delete author mutation
export function useDeleteAuthorMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => authorService.deleteAuthor(id),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: authorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: authorKeys.select() });

      toast.success("Author deleted successfully!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete author");
      options?.onError?.(error);
    },
  });
}
