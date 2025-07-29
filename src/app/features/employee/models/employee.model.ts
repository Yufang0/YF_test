/**
 * 員工模型
 * 用於表示員工資料的 TypeScript 介面
 */
export interface Employee {
  /** 員工編號 */
  id: number;
  /** 員工姓名 */
  name: string;
  /** 部門編號 */
  departmentId: number;
  /** 部門名稱（可選，用於顯示） */
  departmentName?: string;
}

/**
 * 建立員工 DTO
 * 用於新增員工時傳送的資料
 */
export interface CreateEmployeeDto {
  /** 員工姓名 */
  name: string;
  /** 部門編號 */
  departmentId: number;
}

/**
 * 更新員工 DTO
 * 用於更新員工資料時傳送的資料
 */
export interface UpdateEmployeeDto {
  /** 員工編號 */
  id: number;
  /** 員工姓名 */
  name: string;
  /** 部門編號 */
  departmentId: number;
}

/**
 * 員工查詢 DTO
 * 用於搜尋員工時的查詢條件
 */
export interface EmployeeQueryDto {
  /** 員工姓名（模糊搜尋） */
  name?: string;
  /** 部門編號 */
  departmentId?: number;
  /** 分頁起始索引 */
  firstIndexInPage?: number;
  /** 分頁結束索引 */
  lastIndexInPage?: number;
}

/**
 * 員工查詢回應 DTO
 * 包含分頁資訊的員工列表回應
 */
export interface EmployeeQueryResponse {
  /** 員工資料列表 */
  dataList: Employee[];
  /** 總記錄數 */
  totalRecords: number;
  /** 分頁起始索引 */
  firstIndexInPage: number;
  /** 分頁結束索引 */
  lastIndexInPage: number;
}
