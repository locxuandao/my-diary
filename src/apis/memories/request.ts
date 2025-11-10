import api from "@/lib/axios";
import { MemoriesResponse, PAGINATION } from "./type";

export const getMemories = async (
  page = PAGINATION.PAGE,
  limit = PAGINATION.LIMIT,
  query = ""
): Promise<MemoriesResponse> => {
  const { data } = await api.get<MemoriesResponse>("api/memories", {
    params: { page, limit, query },
  });
  return data;
};
