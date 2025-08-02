import api from "@/lib/api";

// Base interfaces for populated references
interface Author {
  _id: string;
  name: string;
}

interface Publisher {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

export interface Book {
  _id: string;
  bookId: string;
  title: string;
  subtitle?: string;
  authors: (string | Author)[];
  publisher?: string | Publisher;
  publishedDate?: string;
  language?: string;
  pages?: number;
  description?: string;
  categories: (string | Category)[];
  tags: string[];
  coverImage?: string;
  thumbnailImage?: string;
  format: "physical" | "digital" | "both";
  digitalFormats: ("pdf" | "epub" | "mobi" | "audiobook")[];
  fileUrl?: string;
  audioUrl?: string;
  totalCopies: number;
  availableCopies: number;
  location: {
    shelf: string;
    section: string;
    floor?: string;
  };
  acquisitionInfo: {
    acquisitionDate: string;
    source: "purchase" | "donation" | "exchange" | "other";
    cost?: number;
    donor?: string;
    notes?: string;
  };
  condition: "excellent" | "good" | "fair" | "poor" | "damaged";
  rating: {
    average: number;
    count: number;
  };
  statistics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    borrows: number;
  };
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookData {
  title: string;
  subtitle?: string;
  authors: string[];
  publisher?: string;
  publishedDate?: string;
  language?: string;
  pages?: number;
  description?: string;
  categories: string[];
  tags: string[];
  coverImage?: string;
  thumbnailImage?: string;
  format: "physical" | "digital" | "both";
  digitalFormats?: ("pdf" | "epub" | "mobi" | "audiobook")[];
  fileUrl?: string;
  audioUrl?: string;
  totalCopies: number;
  availableCopies: number;
  location: {
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
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface UpdateBookData extends Partial<CreateBookData> {
  availableCopies?: number;
}

export interface GetBooksParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  format?: string;
  available?: boolean;
  isActive?: boolean;
  language?: string;
  isFeatured?: boolean;
  sort?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface BooksResponse {
  status: string;
  results: number;
  data: {
    books: Book[];
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBooks: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface BookResponse {
  status: string;
  data: {
    book: Book;
  };
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: string[];
}

export interface DashboardStats {
  totalBooks: number;
  totalMembers: number;
  totalBorrows: number;
  totalCategories: number;
  recentBorrows: number;
  overdueBooks: number;
  activeMembers: number;
  popularBooks: Book[];
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
}

// Get all books with pagination and filters
export const getBooks = async (
  params: GetBooksParams = {}
): Promise<BooksResponse> => {
  const response = await api.get("/books", { params });
  return response.data;
};

// Get single book
export const getBook = async (id: string): Promise<BookResponse> => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

// Create new book
export const createBook = async (
  bookData: CreateBookData
): Promise<BookResponse> => {
  try {
    const response = await api.post("/books", bookData);
    return response.data;
  } catch (error: any) {
    console.error("Create book error:", error);
    throw error;
  }
};

// Update book
export const updateBook = async (
  id: string,
  bookData: UpdateBookData
): Promise<BookResponse> => {
  try {
    const response = await api.patch(`/books/${id}`, bookData);
    return response.data;
  } catch (error: any) {
    console.error("Update book error:", error);
    throw error;
  }
};

// Delete book
export const deleteBook = async (id: string): Promise<DeleteResponse> => {
  const response = await api.delete(`/books/${id}`);
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

// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const response = await api.get("/admin/dashboard/stats");
  return response.data;
};

// Bulk import books
export const importBooks = async (
  file: File
): Promise<{ success: boolean; message: string; imported: number }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/books/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Export books
export const exportBooks = async (
  format: "csv" | "excel" = "csv"
): Promise<Blob> => {
  const response = await api.get(`/books/export?format=${format}`, {
    responseType: "blob",
  });
  return response.data;
};
