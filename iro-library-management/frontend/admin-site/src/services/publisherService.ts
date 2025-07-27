import api from "../lib/api";

export interface Publisher {
  _id: string;
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  establishedYear?: number;
  logo?: string;
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

export interface CreatePublisherData {
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  establishedYear?: number;
  logo?: string;
  isActive?: boolean;
}

export interface UpdatePublisherData {
  name?: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  establishedYear?: number;
  logo?: string;
  isActive?: boolean;
}

export interface PublishersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
  country?: string;
  includeBooksCount?: boolean;
}

export interface PublishersResponse {
  status: string;
  results: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPublishers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  data: {
    publishers: Publisher[];
  };
}

export interface PublisherResponse {
  status: string;
  data: {
    publisher: Publisher;
  };
}

export interface ActivePublishersResponse {
  status: string;
  results: number;
  data: {
    publishers: Pick<Publisher, "_id" | "name" | "description" | "website">[];
  };
}

export const publisherService = {
  // Get all publishers with pagination and filters
  getPublishers: async (
    params: PublishersQueryParams = {}
  ): Promise<PublishersResponse> => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const response = await api.get(`/publishers?${searchParams.toString()}`);
    return response.data;
  },

  // Get active publishers for dropdowns
  getActivePublishers: async (): Promise<ActivePublishersResponse> => {
    const response = await api.get("/publishers/active");
    return response.data;
  },

  // Get single publisher by ID
  getPublisher: async (
    id: string,
    includeBooksCount = false
  ): Promise<PublisherResponse> => {
    const params = includeBooksCount ? "?includeBooksCount=true" : "";
    const response = await api.get(`/publishers/${id}${params}`);
    return response.data;
  },

  // Create new publisher
  createPublisher: async (
    data: CreatePublisherData
  ): Promise<PublisherResponse> => {
    const response = await api.post("/publishers", data);
    return response.data;
  },

  // Update publisher
  updatePublisher: async (
    id: string,
    data: UpdatePublisherData
  ): Promise<PublisherResponse> => {
    const response = await api.patch(`/publishers/${id}`, data);
    return response.data;
  },

  // Delete publisher (soft delete)
  deletePublisher: async (id: string): Promise<void> => {
    await api.delete(`/publishers/${id}`);
  },
};
