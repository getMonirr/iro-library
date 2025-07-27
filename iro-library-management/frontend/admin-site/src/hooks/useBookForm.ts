import { bookFormService } from "@/services/bookFormService";
import { useQuery } from "@tanstack/react-query";

// Query key for book form data
export const bookFormKeys = {
  formData: ["book-form-data"] as const,
};

// Get book form data (categories and publishers)
export function useBookFormDataQuery() {
  return useQuery({
    queryKey: bookFormKeys.formData,
    queryFn: () => bookFormService.getFormData(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
