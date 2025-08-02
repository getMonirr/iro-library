import api from "../lib/api";

export interface BookFormData {
  categories: Array<{
    _id: string;
    name: string;
    description: string;
    slug: string;
  }>;
  publishers: Array<{
    _id: string;
    name: string;
    description: string;
    website?: string;
  }>;
  authors: Array<{
    _id: string;
    name: string;
    description?: string;
    nationality?: string;
  }>;
}

export interface BookFormDataResponse {
  status: string;
  data: BookFormData;
}

export const bookFormService = {
  // Get form data (categories and publishers) for book forms
  getFormData: async (): Promise<BookFormDataResponse> => {
    const response = await api.get("/books/form-data");
    return response.data;
  },
};
