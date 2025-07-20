import {
  BookResponse,
  BooksResponse,
  CategoriesResponse,
  createBook,
  CreateBookData,
  deleteBook,
  DeleteResponse,
  getBook,
  getBookCategories,
  getBooks,
  GetBooksParams,
  updateBook,
  UpdateBookData,
} from "@/services/bookService";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

// Query Keys
export const bookKeys = {
  all: ["books"] as const,
  lists: () => [...bookKeys.all, "list"] as const,
  list: (params: GetBooksParams) => [...bookKeys.lists(), params] as const,
  details: () => [...bookKeys.all, "detail"] as const,
  detail: (id: string) => [...bookKeys.details(), id] as const,
  categories: () => [...bookKeys.all, "categories"] as const,
};

// Books List Query
export const useBooksQuery = (
  params: GetBooksParams = {},
  options?: Omit<UseQueryOptions<BooksResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: bookKeys.list(params),
    queryFn: () => getBooks(params),
    ...options,
  });
};

// Single Book Query
export const useBookQuery = (
  id: string,
  options?: Omit<UseQueryOptions<BookResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: () => getBook(id),
    enabled: !!id,
    ...options,
  });
};

// Book Categories Query
export const useBookCategoriesQuery = (
  options?: Omit<UseQueryOptions<CategoriesResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: bookKeys.categories(),
    queryFn: getBookCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
};

// Create Book Mutation
export const useCreateBookMutation = (
  options?: UseMutationOptions<BookResponse, Error, CreateBookData>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBook,
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch books list
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
      toast.success("Book created successfully");
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to create book");
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

// Update Book Mutation
export const useUpdateBookMutation = (
  options?: UseMutationOptions<
    BookResponse,
    Error,
    { id: string; data: UpdateBookData }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateBook(id, data),
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch books list
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
      // Update the specific book cache
      queryClient.invalidateQueries({
        queryKey: bookKeys.detail(variables.id),
      });
      toast.success("Book updated successfully");
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to update book");
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

// Delete Book Mutation
export const useDeleteBookMutation = (
  options?: UseMutationOptions<DeleteResponse, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: (data, bookId, context) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: bookKeys.detail(bookId) });
      // Invalidate and refetch books list
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
      toast.success("Book deleted successfully");
      options?.onSuccess?.(data, bookId, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to delete book");
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};
