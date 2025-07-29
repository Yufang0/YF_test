# 員工功能服務資料夾

## 目的

這個資料夾包含員工管理功能相關的所有服務類別。服務負責處理 API 呼叫、資料管理、狀態管理，以及與後端伺服器的通訊。

## 檔案說明

### `employee.service.ts`

員工管理的核心服務，提供完整的 CRUD 操作：

- **查詢功能**：

  - `searchEmployees()`: 根據條件查詢員工列表，支援分頁
  - `getEmployee()`: 取得單一員工的詳細資訊

- **維護功能**：

  - `createEmployee()`: 建立新員工
  - `updateEmployee()`: 更新員工資訊
  - `deleteEmployee()`: 刪除員工

- **輔助功能**：
  - `getDepartments()`: 取得部門列表（用於下拉選單）
  - `loading` signal: 追蹤載入狀態

## 設計原則

1. **使用 inject() 函式**: 遵循 Angular 20+ 的相依性注入最佳實務
2. **Signal 狀態管理**: 使用 `signal()` 管理載入狀態
3. **統一錯誤處理**: 使用 `HttpErrorHandlerService` 處理所有錯誤
4. **Observable 模式**: 所有 API 呼叫都回傳 Observable
5. **型別安全**: 使用 TypeScript 介面確保型別正確性

## 使用慣例

### API 呼叫模式

```typescript
// 在元件中使用服務
export class EmployeeListComponent {
  private readonly employeeService = inject(EmployeeService);

  searchEmployees(): void {
    const queryDto: EmployeeQueryDto = {
      name: this.searchForm.value.name,
      departmentId: this.searchForm.value.departmentId,
      firstIndexInPage: 0,
      lastIndexInPage: 19,
    };

    this.employeeService.searchEmployees(queryDto).subscribe({
      next: (response) => {
        this.employees.set(response.dataList);
        this.totalRecords.set(response.totalRecords);
      },
      error: (error) => {
        // 錯誤已由 HttpErrorHandlerService 處理
        console.error("查詢失敗:", error.message);
      },
    });
  }
}
```

### 載入狀態監控

```typescript
// 監控載入狀態
readonly isLoading = this.employeeService.loading;

// 在樣板中使用
// @if (isLoading()) {
//   <div>載入中...</div>
// }
```

### 錯誤處理

- 所有錯誤都會透過 `HttpErrorHandlerService` 統一處理
- 服務會自動轉換 HTTP 錯誤為使用者友善的訊息
- 不需要在元件中實作個別的錯誤處理邏輯

## 資料轉換

- 服務會處理前端 camelCase 與後端 snake_case 之間的轉換
- 使用 `objectToSnakeCase()` 和 `objectToCamelCase()` 工具函式
- 確保與後端 API 的資料格式一致性

## 最小工作範例

```typescript
import { Component, inject, signal } from "@angular/core";
import { EmployeeService } from "./employee.service";
import { Employee, EmployeeQueryDto } from "../models/employee.model";

@Component({
  selector: "app-employee-example",
  template: `
    @if (loading()) {
    <div>載入中...</div>
    } @else {
    <div>員工數量: {{ employees().length }}</div>
    }
  `,
})
export class EmployeeExampleComponent {
  private readonly employeeService = inject(EmployeeService);

  readonly employees = signal<Employee[]>([]);
  readonly loading = this.employeeService.loading;

  ngOnInit(): void {
    this.loadEmployees();
  }

  private loadEmployees(): void {
    const queryDto: EmployeeQueryDto = {
      firstIndexInPage: 0,
      lastIndexInPage: 19,
    };

    this.employeeService.searchEmployees(queryDto).subscribe({
      next: (response) => this.employees.set(response.dataList),
      error: (error) => console.error("載入失敗:", error.message),
    });
  }
}
```

## 注意事項

- 服務使用 `providedIn: 'root'` 註冊為單例模式
- 所有 API 呼叫都包含適當的錯誤處理
- 載入狀態會自動管理，無需手動設定
- 遵循 Angular 的反應式程式設計模式
