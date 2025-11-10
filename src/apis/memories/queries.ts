import { useQuery } from "@tanstack/react-query";
import { getMemories } from "./request";
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
