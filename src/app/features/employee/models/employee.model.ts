/**
 * 員工模型
 * 對應後端 EmployeeVo，用於表示員工資料的 TypeScript 介面
 */
export interface Employee {
  /** 員工 ID */
  emp_id: number;
  /** 員工編號 */
  emp_code: string;
  /** 員工姓名 */
  emp_name: string;
  /** 員工電子郵箱 */
  emp_email?: string;
  /** 員工連絡電話 */
  emp_phone?: string;
  /** 部門 ID */
  dept_id?: number;
  /** 職位名稱 */
  job_title?: string;
  /** 入職日期 (YYYY-MM-DD) */
  hire_date?: string;
  /** 離職日期 (YYYY-MM-DD) */
  resign_date?: string;
  /** 員工狀態 */
  is_active?: boolean;
  /** 狀態文字 */
  status_text?: string;
  /** 建立時間 */
  create_time?: string;
  /** 建立使用者 */
  create_user?: string;
  /** 更新時間 */
  update_time?: string;
  /** 更新使用者 */
  update_user?: string;
  /** 工作天數 */
  working_days?: number;
}

/**
 * 建立員工 DTO
 * 對應後端 EmployeeCreateDto，用於新增員工時傳送的資料
 */
export interface EmployeeCreateDto {
  /** 員工編號 */
  emp_code: string;
  /** 員工姓名 */
  emp_name: string;
  /** 員工電子郵箱 */
  emp_email?: string;
  /** 員工連絡電話 */
  emp_phone?: string;
  /** 部門 ID */
  dept_id: number;
  /** 職位名稱 */
  job_title?: string;
  /** 入職日期 (YYYY-MM-DD) */
  hire_date?: string;
  /** 離職日期 (YYYY-MM-DD) */
  resign_date?: string;
  /** 員工狀態 */
  is_active: boolean;
  /** 建立使用者 */
  create_user: string;
}

/**
 * 更新員工 DTO
 * 對應後端 EmployeeUpdateDto，用於更新員工資料時傳送的資料
 */
export interface EmployeeUpdateDto {
  /** 員工 ID */
  emp_id: number;
  /** 員工編號 */
  emp_code?: string;
  /** 員工姓名 */
  emp_name?: string;
  /** 員工電子郵箱 */
  emp_email?: string;
  /** 員工連絡電話 */
  emp_phone?: string;
  /** 部門 ID */
  dept_id?: number;
  /** 職位名稱 */
  job_title?: string;
  /** 入職日期 (YYYY-MM-DD) */
  hire_date?: string;
  /** 離職日期 (YYYY-MM-DD) */
  resign_date?: string;
  /** 員工狀態 */
  is_active?: boolean;
  /** 更新使用者 */
  update_user: string;
}

/**
 * 員工摘要 DTO
 * 對應後端 EmployeeSummaryDto，用於下拉選單等簡化顯示
 */
export interface EmployeeSummaryDto {
  /** 員工 ID */
  emp_id: number;
  /** 員工編號 */
  emp_code: string;
  /** 員工姓名 */
  emp_name: string;
}

/**
 * 員工查詢參數
 * 用於員工搜尋和篩選的參數
 */
export interface EmployeeSearchParams {
  /** 員工編號 */
  emp_code?: string;
  /** 員工姓名 (模糊搜尋) */
  emp_name?: string;
  /** 職位名稱 (模糊搜尋) */
  job_title?: string;
  /** 員工狀態 */
  is_active?: boolean;
  /** 部門 ID */
  dept_id?: number;
  /** 入職日期開始 */
  hire_date_start?: string;
  /** 入職日期結束 */
  hire_date_end?: string;
}

/**
 * 員工查詢 DTO
 * 用於前端查詢請求的標準 DTO，包含分頁和排序參數
 */
export interface EmployeeQueryDto {
  /** 員工編號 (精確搜尋) */
  emp_code?: string;
  /** 員工姓名 (模糊搜尋) */
  emp_name?: string;
  /** 部門代碼/ID */
  dept_id?: number;
  /** 員工狀態 */
  is_active?: boolean;
  /** 職位名稱 (模糊搜尋) */
  job_title?: string;
  /** 入職日期開始 */
  hire_date_start?: string;
  /** 入職日期結束 */
  hire_date_end?: string;
  /** 離職日期開始 */
  resign_date_start?: string;
  /** 離職日期結束 */
  resign_date_end?: string;
  /** 頁碼 (從 1 開始) */
  page?: number;
  /** 每頁筆數 */
  size?: number;
  /** 排序欄位 */
  sort_by?: string;
  /** 排序方向 */
  sort_order?: 'ASC' | 'DESC';
}
