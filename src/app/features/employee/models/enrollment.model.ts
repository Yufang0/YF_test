/**
 * 註冊模型
 * 用於表示員工課程註冊資料的 TypeScript 介面
 */
export interface Enrollment {
  id: number;
  employeeId: number;
  courseId: number;
  enrolledAt: Date;
  employeeName?: string; // 可選，用於顯示員工名稱
  courseName?: string; // 可選，用於顯示課程名稱
}

/**
 * 建立註冊 DTO
 */
export interface CreateEnrollmentDto {
  employeeId: number;
  courseId: number;
}

/**
 * 註冊查詢 DTO
 */
export interface EnrollmentQueryDto {
  employeeId?: number;
  courseId?: number;
  firstIndexInPage?: number;
  lastIndexInPage?: number;
}

/**
 * 註冊查詢回應 DTO
 */
export interface EnrollmentQueryResponse {
  dataList: Enrollment[];
  totalRecords: number;
  firstIndexInPage: number;
  lastIndexInPage: number;
}
