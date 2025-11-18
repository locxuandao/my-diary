import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteMemori, getMemories, getMemoryById } from "./request";
import { PAGINATION } from "./type";

export const useMemories = ({
  page = PAGINATION.PAGE,
  limit = PAGINATION.LIMIT,
  query = "",
}: {
  page?: number;
  limit?: number;
  query?: string;
}) => {
  return useQuery({
    queryKey: ["memories", page, limit, query],
    queryFn: () => getMemories(page, limit, query),
  });
};

export const useDeleteMemory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMemori(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
    },
    onError: (error) => {
      console.error("ERROR", error);
    },
  });
};

export const useMemoryById = (id: string) => {
  return useQuery({
    queryKey: ["memory", id],
    queryFn: () => getMemoryById(id),
    enabled: !!id,
  });
};
