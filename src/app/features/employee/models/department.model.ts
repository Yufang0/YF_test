/**
 * 部門模型
 * 用於表示部門資料的 TypeScript 介面
 */
export interface Department {
  id: number;
  name: string;
}

/**
 * 建立部門 DTO
 */
export interface CreateDepartmentDto {
  name: string;
}

/**
 * 更新部門 DTO
 */
export interface UpdateDepartmentDto {
  id: number;
  name: string;
}
