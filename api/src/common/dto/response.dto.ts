export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ResponseDto<T = void> {
  success: boolean;
  data?: T;
  pagination?: Pagination;
}
