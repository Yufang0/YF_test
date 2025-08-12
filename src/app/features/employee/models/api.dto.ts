/**
 * API 回應基礎介面
 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data?: T;
}

/**
 * 分頁回應介面 - 對應後端 PageResponse
 */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  total_elements: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  is_first: boolean;
  is_last: boolean;
}

/**
 * 分頁查詢回應介面
 */
export interface PaginatedResponse<T> {
  dataList: T[];
  totalRecords: number;
  firstIndexInPage: number;
  lastIndexInPage: number;
}

/**
 * 分頁查詢參數介面
 */
export interface PaginationParams {
  firstIndexInPage?: number;
  lastIndexInPage?: number;
}
