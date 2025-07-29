# 員工功能頁面資料夾

## 目的

這個資料夾包含員工管理功能的所有頁面元件。每個頁面代表一個獨立的業務畫面，負責處理特定的使用者互動和資料展示。

## 頁面元件列表

### `employee-list/`

**員工列表頁面** - 顯示所有員工的列表，提供搜尋、分頁和基本操作功能

- **功能**：

  - 員工列表顯示（表格格式）
  - 按姓名和部門搜尋
  - 分頁瀏覽
  - 快速操作（檢視、編輯、刪除）
  - 新增員工入口

- **路由**：`/employees` 或 `/employees/list`

### `employee-detail/`

**員工詳細資訊頁面** - 顯示單一員工的完整資訊

- **功能**：

  - 顯示員工基本資訊
  - 顯示所屬部門資訊
  - 編輯和刪除操作
  - 課程註冊資訊（未來功能）
  - 操作歷史記錄（未來功能）

- **路由**：`/employees/:id`

### `employee-form/`

**員工表單頁面** - 新增或編輯員工資訊的表單頁面

- **功能**：

  - 新增員工表單
  - 編輯員工表單
  - 表單驗證和錯誤處理
  - 部門下拉選單
  - 取消和儲存操作

- **路由**：
  - 新增：`/employees/new`
  - 編輯：`/employees/:id/edit`

## 設計原則

### 1. **三檔案分離**

每個頁面元件都遵循三檔案分離原則：

- `.component.ts` - 邏輯和狀態管理
- `.component.html` - 樣板和 UI 結構
- `.component.scss` - 樣式和視覺設計

### 2. **Standalone 元件**

- 所有頁面元件都是 standalone 元件
- 使用 `imports` 陣列管理相依性
- 不依賴 NgModule

### 3. **Signal 狀態管理**

- 使用 `signal()` 管理本地狀態
- 使用 `computed()` 計算衍生狀態
- 使用 `input()` 接收路由參數

### 4. **反應式表單**

- 使用 ReactiveFormsModule
- 表單驗證和錯誤處理
- 動態表單狀態管理

## 共用功能

### 載入狀態

所有頁面都會顯示載入狀態，提供良好的使用者體驗：

```typescript
readonly loading = this.employeeService.loading;
```

### 錯誤處理

統一的錯誤處理機制，顯示使用者友善的錯誤訊息：

```typescript
readonly error = signal<string | null>(null);
```

### 導航處理

使用 Angular Router 進行頁面導航：

```typescript
private readonly router = inject(Router);
```

## 使用慣例

### 路由參數處理

```typescript
// 使用 input() 接收路由參數
readonly id = input.required<string>();

// 在 ngOnInit 中處理參數
ngOnInit(): void {
  const employeeId = parseInt(this.id(), 10);
  this.loadEmployee(employeeId);
}
```

### 服務呼叫模式

```typescript
// 標準的服務呼叫模式
this.employeeService.getEmployee(id).subscribe({
  next: (employee) => {
    this.employee.set(employee);
    this.error.set(null);
  },
  error: (error) => {
    this.error.set(error.message);
    console.error("操作失敗:", error.message);
  },
});
```

### 表單處理

```typescript
// 表單驗證和提交
onSubmit(): void {
  if (this.form.invalid) {
    this.markFormGroupTouched();
    return;
  }

  // 處理表單資料
  const formValue = this.form.value;
  // ...
}
```

## 最小工作範例

### 建立新頁面元件

```typescript
import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EmployeeService } from "../../services/employee.service";

@Component({
  selector: "app-new-employee-page",
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
    <div>載入中...</div>
    } @else {
    <div>頁面內容</div>
    }
  `,
  styles: [
    `
      /* 頁面樣式 */
    `,
  ],
})
export class NewEmployeePageComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);

  readonly loading = this.employeeService.loading;
  readonly data = signal<any>(null);

  ngOnInit(): void {
    // 初始化邏輯
  }
}
```

## 響應式設計

- 所有頁面都支援手機和桌面裝置
- 使用 CSS Grid 和 Flexbox 進行佈局
- 適當的斷點和媒體查詢

## 無障礙設計

- 適當的語意化 HTML
- 鍵盤導航支援
- 螢幕閱讀器支援
- 適當的 ARIA 標籤

## 注意事項

- 頁面元件應專注於 UI 和使用者互動
- 業務邏輯應委託給服務層
- 保持元件的單一職責原則
- 適當使用 Angular 的生命週期方法
