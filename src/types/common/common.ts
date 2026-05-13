export interface PageMeta {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first?: boolean;
  last?: boolean;
}

export interface ApiResponse<T, M = unknown> {
  success: boolean;
  message?: string | null;
  data: T;
  meta?: M | null;
  error?: string | null;
  timestamp?: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}