export interface ApiResponse<T> {
  isSuccess: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
}

export interface PaginatedList<T> {
  items: T[];
  totalRecords: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}