import api from "@/lib/api";

export interface Book {
  _id: string;
  title: string;
  authors: string[];
  isbn?: string;
  description?: string;
  category: string;
  publishedYear?: number;
  totalCopies: number;
  availableCopies: number;
  format: "physical" | "digital" | "both";
  location?: {
    shelf: string;
    section: string;
  };
  coverImage?: string;
  tags?: string[];
  rating?: number;
  totalRatings?: number;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetBooksParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  format?: string;
  available?: boolean;
  sort?: string;
}

export interface BooksResponse {
  success: boolean;
  data: {
    books: Book[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalBooks: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface BookResponse {
  success: boolean;
  data: Book;
}

export interface CategoriesResponse {
  success: boolean;
  data: string[];
}

export interface StatsResponse {
  success: boolean;
  data: {
    totalBooks: number;
    totalBorrows: number;
    totalMembers: number;
    totalCategories: number;
  };
}

// Get all books with pagination and filters
export const getBooks = async (
  params: GetBooksParams = {}
): Promise<BooksResponse> => {
  const response = await api.get("/books", { params });
  return response.data;
};

// Get featured books
export const getFeaturedBooks = async (): Promise<BooksResponse> => {
  const response = await api.get("/books/featured");
  return response.data;
};

// Get popular books
export const getPopularBooks = async (): Promise<BooksResponse> => {
  const response = await api.get("/books/popular");
  return response.data;
};

// Get book categories
export const getBookCategories = async (): Promise<CategoriesResponse> => {
  const response = await api.get("/books/categories");
  return response.data;
};

// Search books
export const searchBooks = async (
  query: string,
  filters: GetBooksParams = {}
): Promise<BooksResponse> => {
  const response = await api.get("/books/search", {
    params: { q: query, ...filters },
  });
  return response.data;
};

// Get single book
export const getBook = async (id: string): Promise<BookResponse> => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

// Get library stats (for homepage)
export const getLibraryStats = async (): Promise<StatsResponse> => {
  const response = await api.get("/books/stats");
  return response.data;
};
