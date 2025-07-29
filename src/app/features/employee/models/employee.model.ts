/**
 * 員工模型
 * 用於表示員工資料的 TypeScript 介面
 */
export interface Employee {
  id: number;
  name: string;
  departmentId: number;
  departmentName?: string; // 可選，用於顯示部門名稱
}

/**
 * 建立員工 DTO
 */
export interface CreateEmployeeDto {
  name: string;
  departmentId: number;
}

/**
 * 更新員工 DTO
 */
export interface UpdateEmployeeDto {
  id: number;
  name: string;
  departmentId: number;
}

/**
 * 員工查詢 DTO
 */
export interface EmployeeQueryDto {
  name?: string;
  departmentId?: number;
  firstIndexInPage?: number;
  lastIndexInPage?: number;
}

/**
 * 員工查詢回應 DTO
 */
export interface EmployeeQueryResponse {
  dataList: Employee[];
  totalRecords: number;
  firstIndexInPage: number;
  lastIndexInPage: number;
}
