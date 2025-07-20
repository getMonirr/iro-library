import {
  BookResponse,
  BooksResponse,
  CategoriesResponse,
  getBook,
  getBookCategories,
  getBooks,
  GetBooksParams,
  getFeaturedBooks,
  getLibraryStats,
  getPopularBooks,
  searchBooks,
  StatsResponse,
} from "@/services/bookService";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

// Query Keys
export const bookKeys = {
  all: ["books"] as const,
  lists: () => [...bookKeys.all, "list"] as const,
  list: (params: GetBooksParams) => [...bookKeys.lists(), params] as const,
  details: () => [...bookKeys.all, "detail"] as const,
  detail: (id: string) => [...bookKeys.details(), id] as const,
  categories: () => [...bookKeys.all, "categories"] as const,
  featured: () => [...bookKeys.all, "featured"] as const,
  popular: () => [...bookKeys.all, "popular"] as const,
  search: (query: string, filters: GetBooksParams) =>
    [...bookKeys.all, "search", query, filters] as const,
  stats: () => ["library", "stats"] as const,
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

// Featured Books Query
export const useFeaturedBooksQuery = (
  options?: Omit<UseQueryOptions<BooksResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: bookKeys.featured(),
    queryFn: getFeaturedBooks,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// Popular Books Query
export const usePopularBooksQuery = (
  options?: Omit<UseQueryOptions<BooksResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: bookKeys.popular(),
    queryFn: getPopularBooks,
    staleTime: 15 * 60 * 1000, // 15 minutes
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

// Search Books Query
export const useSearchBooksQuery = (
  query: string,
  filters: GetBooksParams = {},
  options?: Omit<UseQueryOptions<BooksResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: bookKeys.search(query, filters),
    queryFn: () => searchBooks(query, filters),
    enabled: !!query,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

// Library Stats Query
export const useLibraryStatsQuery = (
  options?: Omit<UseQueryOptions<StatsResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: bookKeys.stats(),
    queryFn: getLibraryStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
