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

export interface CreateBookData {
  title: string;
  authors: string[];
  isbn?: string;
  description?: string;
  category: string;
  publishedYear?: number;
  totalCopies: number;
  format: "physical" | "digital" | "both";
  location?: {
    shelf: string;
    section: string;
  };
  coverImage?: string;
  tags?: string[];
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
  const response = await api.post("/books", bookData);
  return response.data;
};

// Update book
export const updateBook = async (
  id: string,
  bookData: UpdateBookData
): Promise<BookResponse> => {
  const response = await api.patch(`/books/${id}`, bookData);
  return response.data;
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
