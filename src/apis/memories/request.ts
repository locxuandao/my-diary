import api from "@/lib/axios";
import { MemoriesResponse, Memory, PAGINATION } from "./type";

export const getMemories = async (
  page = PAGINATION.PAGE,
  limit = PAGINATION.LIMIT,
  query = ""
): Promise<MemoriesResponse> => {
  const { data } = await api.get<MemoriesResponse>("/api/memories", {
    params: { page, limit, query },
  });
  return data;
};

export const deleteMemori = async (id: string) => {
  const { data } = await api.delete(`/api/memories`, {
    params: { id },
  });
  return data;
};

export const getMemoryById = async (id: string) => {
  const { data } = await api.get<Memory>(`/api/memories/${id}`);
  return data;
};
