/**
 * 課程模型
 * 用於表示課程資料的 TypeScript 介面
 */
export interface Course {
  id: number;
  name: string;
  description: string;
}

/**
 * 建立課程 DTO
 */
export interface CreateCourseDto {
  name: string;
  description: string;
}

/**
 * 更新課程 DTO
 */
export interface UpdateCourseDto {
  id: number;
  name: string;
  description: string;
}
