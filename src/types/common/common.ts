export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string | null;
  timestamp?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isLast?: boolean;
  last?: boolean;
  first?: boolean;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}
