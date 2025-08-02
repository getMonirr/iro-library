import api from "@/lib/api";

export interface Author {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  biography?: string;
  birthDate?: string;
  deathDate?: string;
  nationality?: string;
  photo?: string;
  website?: string;
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  genres?: string[];
  awards?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAuthorData {
  name: string;
  description?: string;
  biography?: string;
  birthDate?: string;
  deathDate?: string;
  nationality?: string;
  photo?: string;
  website?: string;
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  genres?: string[];
  awards?: string[];
  isActive?: boolean;
}

export interface UpdateAuthorData extends Partial<CreateAuthorData> {}

export interface GetAuthorsParams {
  page?: number;
  limit?: number;
  search?: string;
  nationality?: string;
  isActive?: boolean;
}

export interface GetAuthorsResponse {
  status: string;
  data: {
    authors: Author[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalAuthors: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface AuthorResponse {
  status: string;
  data: {
    author: Author;
  };
}

export const authorService = {
  // Get all authors with pagination and filtering
  getAuthors: async (
    params: GetAuthorsParams = {}
  ): Promise<GetAuthorsResponse> => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.nationality)
      queryParams.append("nationality", params.nationality);
    if (params.isActive !== undefined)
      queryParams.append("isActive", params.isActive.toString());

    const response = await api.get(`/authors?${queryParams.toString()}`);
    return response.data;
  },

  // Get single author by ID or slug
  getAuthor: async (id: string): Promise<AuthorResponse> => {
    const response = await api.get(`/authors/${id}`);
    return response.data;
  },

  // Create new author
  createAuthor: async (data: CreateAuthorData): Promise<AuthorResponse> => {
    const response = await api.post("/authors", data);
    return response.data;
  },

  // Update author
  updateAuthor: async (
    id: string,
    data: UpdateAuthorData
  ): Promise<AuthorResponse> => {
    const response = await api.patch(`/authors/${id}`, data);
    return response.data;
  },

  // Delete author
  deleteAuthor: async (id: string): Promise<void> => {
    await api.delete(`/authors/${id}`);
  },

  // Get authors for select/dropdown (simplified data)
  getAuthorsForSelect: async (): Promise<{
    status: string;
    data: {
      authors: Array<{
        _id: string;
        name: string;
        description?: string;
      }>;
    };
  }> => {
    const response = await api.get("/authors/select");
    return response.data;
  },
};
