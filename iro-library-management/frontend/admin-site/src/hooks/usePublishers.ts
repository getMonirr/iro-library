import {
  CreatePublisherData,
  publisherService,
  PublishersQueryParams,
  UpdatePublisherData,
} from "@/services/publisherService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Query Keys
export const publisherKeys = {
  all: ["publishers"] as const,
  lists: () => [...publisherKeys.all, "list"] as const,
  list: (filters: PublishersQueryParams) =>
    [...publisherKeys.lists(), filters] as const,
  details: () => [...publisherKeys.all, "detail"] as const,
  detail: (id: string) => [...publisherKeys.details(), id] as const,
  active: () => [...publisherKeys.all, "active"] as const,
};

// Get publishers with pagination and filters
export function usePublishersQuery(params: PublishersQueryParams = {}) {
  return useQuery({
    queryKey: publisherKeys.list(params),
    queryFn: () => publisherService.getPublishers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get active publishers for dropdowns
export function useActivePublishersQuery() {
  return useQuery({
    queryKey: publisherKeys.active(),
    queryFn: () => publisherService.getActivePublishers(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get single publisher
export function usePublisherQuery(id: string, includeBooksCount = false) {
  return useQuery({
    queryKey: publisherKeys.detail(id),
    queryFn: () => publisherService.getPublisher(id, includeBooksCount),
    enabled: !!id,
  });
}

// Create publisher mutation
export function useCreatePublisherMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePublisherData) =>
      publisherService.createPublisher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: publisherKeys.all });
      toast.success("Publisher created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create publisher");
    },
  });
}

// Update publisher mutation
export function useUpdatePublisherMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePublisherData }) =>
      publisherService.updatePublisher(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: publisherKeys.all });
      queryClient.invalidateQueries({ queryKey: publisherKeys.detail(id) });
      toast.success("Publisher updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update publisher");
    },
  });
}

// Delete publisher mutation
export function useDeletePublisherMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => publisherService.deletePublisher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: publisherKeys.all });
      toast.success("Publisher deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete publisher");
    },
  });
}
