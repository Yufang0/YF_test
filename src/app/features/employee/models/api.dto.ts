/**
 * API 回應基礎介面
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
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
