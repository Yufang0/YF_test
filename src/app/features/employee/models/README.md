# 員工功能模型資料夾

## 目的

這個資料夾包含員工管理功能相關的所有 TypeScript 模型、介面和 DTO（資料傳輸物件）。這些模型定義了應用程式中使用的資料結構，確保型別安全和程式碼的一致性。

## 檔案說明

### `employee.model.ts`

- **Employee**: 員工主要資料模型
- **CreateEmployeeDto**: 建立員工時使用的資料傳輸物件
- **UpdateEmployeeDto**: 更新員工時使用的資料傳輸物件
- **EmployeeQueryDto**: 查詢員工時使用的參數物件
- **EmployeeQueryResponse**: 員工查詢結果的回應格式

### `department.model.ts`

- **Department**: 部門資料模型
- **CreateDepartmentDto**: 建立部門時使用的資料傳輸物件
- **UpdateDepartmentDto**: 更新部門時使用的資料傳輸物件

### `course.model.ts`

- **Course**: 課程資料模型
- **CreateCourseDto**: 建立課程時使用的資料傳輸物件
- **UpdateCourseDto**: 更新課程時使用的資料傳輸物件

### `enrollment.model.ts`

- **Enrollment**: 員工課程註冊資料模型
- **CreateEnrollmentDto**: 建立註冊記錄時使用的資料傳輸物件
- **EnrollmentQueryDto**: 查詢註冊記錄時使用的參數物件
- **EnrollmentQueryResponse**: 註冊查詢結果的回應格式

### `api.dto.ts`

- **ApiResponse**: 所有 API 回應的基礎格式
- **PaginatedResponse**: 分頁查詢回應的統一格式
- **PaginationParams**: 分頁查詢參數的基礎介面

## 使用慣例

1. **命名規則**:

   - 主要模型使用 PascalCase（如：`Employee`）
   - DTO 模型以用途為後綴（如：`CreateEmployeeDto`、`UpdateEmployeeDto`）

2. **資料轉換**:

   - 前端元件中使用 camelCase 格式
   - API 呼叫時需要轉換為 snake_case 格式
   - 使用 `objectToSnakeCase()` 和 `objectToCamelCase()` 工具函式進行轉換

3. **可選屬性**:
   - 顯示用的關聯資料標記為可選（如：`departmentName?`、`employeeName?`）
   - 查詢參數根據需求設為可選

## 最小工作範例

```typescript
import { Employee, CreateEmployeeDto } from "./employee.model";

// 建立新員工
const newEmployee: CreateEmployeeDto = {
  name: "張三",
  departmentId: 1,
};

// 使用員工資料
const employee: Employee = {
  id: 1,
  name: "張三",
  departmentId: 1,
  departmentName: "資訊部", // 可選，從部門查詢中取得
};
```

## 注意事項

- 所有模型都應該保持簡潔，只包含必要的屬性
- 避免在模型中包含業務邏輯
- 使用 TypeScript 的嚴格型別檢查確保資料的正確性
- 遵循專案的命名慣例和檔案組織原則
