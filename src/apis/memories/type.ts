export interface Memory {
  id: string;
  title: string | null;
  thoughts: string;
  mood?: string | null;
  photos?: string[] | null;
  createdAt: string;
}

export interface MemoriesResponse {
  data: Memory[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 2;

export const PAGINATION = {
  PAGE: DEFAULT_PAGE,
  LIMIT: DEFAULT_LIMIT,
};
