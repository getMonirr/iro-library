import api from "@/lib/api";

export interface Book {
  _id: string;
  bookId?: string;
  title: string;
  subtitle?: string;
  authors: string[] | any[];
  publisher?: string | any;
  isbn?: string;
  description?: string;
  category: string;
  categories?: string[];
  publishedYear?: number;
  publishedDate?: string;
  language?: string;
  pages?: number;
  totalCopies: number;
  availableCopies: number;
  format: "physical" | "digital" | "both";
  digitalFormats?: ("pdf" | "epub" | "mobi" | "audiobook")[];
  fileUrl?: string;
  audioUrl?: string;
  location?: {
    shelf: string;
    section: string;
    floor?: string;
  };
  acquisitionInfo?: {
    acquisitionDate: string;
    source: "purchase" | "donation" | "exchange" | "other";
    cost?: number;
    donor?: string;
    notes?: string;
  };
  condition?: "excellent" | "good" | "fair" | "poor" | "damaged";
  coverImage?: string;
  thumbnailImage?: string;
  tags?: string[];
  rating?: {
    average: number;
    count: number;
  };
  statistics?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    borrows: number;
  };
  totalRatings?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isRestricted?: boolean;
  restrictionReason?: string;
  minimumAge?: number;
  maxBorrowDays?: number;
  renewalLimit?: number;
  reservationLimit?: number;
  metadata?: {
    addedBy: string;
    lastModifiedBy: string;
    lastModifiedAt: string;
  };
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
  console.log("Calling getFeaturedBooks API");
  const response = await api.get("/books/featured");
  console.log("getFeaturedBooks response:", response.data);
  return response.data;
};

// Get popular books
export const getPopularBooks = async (): Promise<BooksResponse> => {
  console.log("Calling getPopularBooks API");
  const response = await api.get("/books/popular");
  console.log("getPopularBooks response:", response.data);
  return response.data;
};

// Get book categories
export const getBookCategories = async (): Promise<CategoriesResponse> => {
  console.log("Calling getBookCategories API");
  const response = await api.get("/books/categories");
  console.log("getBookCategories response:", response.data);
  return response.data;
};

// Search books
export const searchBooks = async (
  query: string,
  filters: GetBooksParams = {}
): Promise<BooksResponse> => {
  console.log(
    "Calling searchBooks API with query:",
    query,
    "filters:",
    filters
  );
  const response = await api.get("/books/search", {
    params: { q: query, ...filters },
  });
  console.log("searchBooks response:", response.data);
  return response.data;
};

// Get single book
export const getBook = async (id: string): Promise<BookResponse> => {
  console.log("Calling getBook API with id:", id);
  const response = await api.get(`/books/${id}`);
  console.log("getBook response:", response.data);
  return response.data;
};

// Get library stats (for homepage)
export const getLibraryStats = async (): Promise<StatsResponse> => {
  console.log("Calling getLibraryStats API");
  const response = await api.get("/books/stats");
  console.log("getLibraryStats response:", response.data);
  return response.data;
};
