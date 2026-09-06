export interface ApiResponse<T> {
  isSuccess: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
}

// Maps to your C# PagedList<T>
export interface PaginatedList<T> {
  items: T[]; // Use 'items' globally instead of 'categories', 'products', etc.
  totalRecords: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}