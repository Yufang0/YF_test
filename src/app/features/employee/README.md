# 員工管理功能

## 概述

員工管理功能是 ERP 系統的核心模組之一，提供完整的員工資料管理能力，包括新增、查詢、編輯和刪除員工資訊。該功能採用 Angular 20+ 的最新架構，使用 signals、standalone 組件和原生控制流語法。

## 資料夾結構

```
employee/
├── README.md                           # 功能說明文件
├── employee.routes.ts                  # 路由配置
├── models/                            # 資料模型
│   ├── employee.model.ts              # 員工相關介面定義
│   └── api.dto.ts                     # API 回應格式定義
├── services/                          # 服務層
│   ├── README.md                      # 服務說明
│   ├── employee.service.ts            # 員工資料服務
│   └── department.service.ts          # 部門資料服務
├── components/                        # 可重用組件
│   ├── employee-list.component.ts     # 員工列表組件
│   ├── employee-list.component.html   # 員工列表模板
│   ├── employee-list.component.scss   # 員工列表樣式
│   ├── employee-form.component.ts     # 員工表單組件
│   ├── employee-form.component.html   # 員工表單模板
│   └── employee-form.component.scss   # 員工表單樣式
└── pages/                             # 頁面組件
    ├── README.md                      # 頁面說明
    ├── employee-management.component.ts   # 主管理頁面
    ├── employee-management.component.html # 主管理頁面模板
    └── employee-management.component.scss # 主管理頁面樣式
```

## 主要功能

### 1. 員工列表顯示

- 支援分頁瀏覽員工資料
- 顯示員工編號、姓名、部門資訊
- 提供編輯和刪除操作按鈕

### 2. 員工搜尋功能

- 支援按員工姓名模糊搜尋
- 支援按部門篩選
- 即時搜尋結果更新

### 3. 員工資料管理

- 新增員工：填寫姓名和選擇部門
- 編輯員工：修改現有員工資訊
- 刪除員工：安全刪除確認

### 4. 表單驗證

- 員工姓名必填驗證（2-50 字元）
- 部門選擇必填驗證
- 即時錯誤訊息顯示

## 資料模型

### Employee（員工介面）

```typescript
interface Employee {
  id: number; // 員工編號
  name: string; // 員工姓名
  departmentId: number; // 部門編號
  departmentName?: string; // 部門名稱（顯示用）
}
```

### CreateEmployeeDto（新增員工 DTO）

```typescript
interface CreateEmployeeDto {
  name: string; // 員工姓名
  departmentId: number; // 部門編號
}
```

### EmployeeQueryDto（查詢條件 DTO）

```typescript
interface EmployeeQueryDto {
  name?: string; // 員工姓名（模糊搜尋）
  departmentId?: number; // 部門編號
  firstIndexInPage?: number; // 分頁起始索引
  lastIndexInPage?: number; // 分頁結束索引
}
```

## 使用方式

### 1. 在路由中使用

```typescript
// 在 app.routes.ts 中配置
{
  path: 'employee',
  loadChildren: () => import('./features/employee/employee.routes').then(r => r.employeeRoutes)
}
```

### 2. 服務注入

```typescript
// 在組件中注入員工服務
constructor() {
  private readonly employeeService = inject(EmployeeService);
}

// 查詢員工列表
this.employeeService.searchEmployees(queryDto).subscribe(response => {
  // 處理回應資料
});
```

### 3. 組件使用

```typescript
// 員工管理主頁面
<app-employee-management></app-employee-management>

// 員工列表組件
<app-employee-list
  [searchQuery]="searchQuery()"
  (editEmployee)="onEditEmployee($event)"
  (deleteEmployee)="onDeleteEmployee($event)">
</app-employee-list>

// 員工表單組件
<app-employee-form
  [employee]="selectedEmployee()"
  (formSubmit)="onFormSubmit()"
  (formCancel)="onFormCancel()">
</app-employee-form>
```

## API 端點

### 員工相關 API

- `POST /api/employees/search` - 搜尋員工列表
- `GET /api/employees/{id}` - 取得單一員工資訊
- `POST /api/employees` - 建立新員工
- `PUT /api/employees/{id}` - 更新員工資訊
- `DELETE /api/employees/{id}` - 刪除員工

### 部門相關 API

- `GET /api/departments` - 取得所有部門列表
- `GET /api/departments/{id}` - 取得單一部門資訊

## 技術規範

### Angular 20+ 特性

- **Standalone 組件**：所有組件都是獨立的，不依賴 NgModule
- **Signals**：使用 signals 管理組件狀態
- **Native Control Flow**：使用 @if、@for、@defer 控制流語法
- **inject() 函式**：使用函式式依賴注入取代構造函式注入
- **Reactive Forms**：表單驗證和狀態管理

### 樣式規範

- 採用 Swiss International Style 設計原則
- 使用模組化 SCSS 架構
- 響應式設計支援行動裝置
- 一致的間距和色彩系統

### 錯誤處理

- 統一使用 HttpErrorHandlerService 處理 HTTP 錯誤
- 使用者友善的錯誤訊息顯示
- 載入狀態和錯誤狀態管理

## 開發指南

### 新增功能

1. 在 `models/` 目錄新增相關介面定義
2. 在 `services/` 目錄實作業務邏輯
3. 在 `components/` 目錄建立可重用組件
4. 在 `pages/` 目錄建立頁面組件
5. 更新路由配置和 README

### 程式碼規範

- 使用 TypeScript 嚴格模式
- 遵循 Angular 官方程式碼規範
- 使用 ESLint 和 Prettier 格式化程式碼
- 所有公開方法需要 JSDoc 註解

### 測試

- 單元測試覆蓋率 > 80%
- 整合測試涵蓋主要業務流程
- E2E 測試覆蓋關鍵使用者路徑

## 注意事項

1. **權限控制**：確保只有授權使用者可以執行 CRUD 操作
2. **資料驗證**：前端和後端都要進行資料驗證
3. **效能最佳化**：使用分頁和虛擬滾動處理大量資料
4. **無障礙設計**：確保符合 WCAG 2.1 AA 標準
5. **國際化**：所有文字內容支援多語言

### 🎯 **Angular 20+ 最佳實務**

- **Standalone 元件**：無 NgModule 依賴
- **Signal 狀態管理**：使用 `signal()`, `computed()`, `effect()`
- **新式控制流**：`@if`, `@for`, `@defer`
- **inject() 函式**：現代相依性注入
- **httpResource()**：反應式資料載入

### 🔧 **架構設計**

- **功能優先**：完整的業務功能封裝
- **三檔案分離**：邏輯、樣板、樣式分離
- **型別安全**：完整的 TypeScript 介面定義
- **錯誤處理**：統一的錯誤處理機制

### 🎨 **使用者體驗**

- **載入狀態**：所有操作都有載入指示
- **錯誤回饋**：清楚的錯誤訊息
- **響應式設計**：支援各種螢幕尺寸
- **無障礙支援**：符合 WCAG 標準

## 快速開始

### 1. 路由設定

在主要路由檔案中加入：

```typescript
{
  path: 'employees',
  loadChildren: () => import('./features/employee/employee.routes').then(r => r.employeeRoutes)
}
```

### 2. 導航連結

```html
<a routerLink="/employees">員工管理</a>
```

### 3. 程式化導航

```typescript
this.router.navigate(["/employees"]);
```

## API 整合

### 後端端點需求

```
GET    /api/employees/search      # 搜尋員工
GET    /api/employees/:id         # 取得員工詳細資訊
POST   /api/employees             # 建立新員工
PUT    /api/employees/:id         # 更新員工
DELETE /api/employees/:id         # 刪除員工
GET    /api/departments           # 取得部門列表
```

### 資料格式

- **請求**：使用 snake_case 格式
- **回應**：統一的 `ApiResponse<T>` 包裝格式
- **轉換**：自動處理 camelCase ↔ snake_case 轉換

## 最小工作範例

### 在其他元件中使用員工服務

```typescript
import { Component, inject } from "@angular/core";
import { EmployeeService } from "./features/employee/services/employee.service";
import { EmployeeQueryDto } from "./features/employee/models/employee.model";

@Component({
  selector: "app-dashboard",
  template: `
    <h2>最新員工</h2>
    @for (employee of recentEmployees(); track employee.id) {
    <div>{{ employee.name }} - {{ employee.departmentName }}</div>
    }
  `,
})
export class DashboardComponent {
  private readonly employeeService = inject(EmployeeService);
  readonly recentEmployees = signal<Employee[]>([]);

  ngOnInit(): void {
    const query: EmployeeQueryDto = {
      firstIndexInPage: 0,
      lastIndexInPage: 4, // 只取前 5 筆
    };

    this.employeeService.searchEmployees(query).subscribe({
      next: (response) => this.recentEmployees.set(response.dataList),
      error: (error) => console.error("載入員工失敗:", error.message),
    });
  }
}
```

## 擴展功能

### 已規劃的功能

- **批次操作**：批次匯入、匯出、刪除
- **進階搜尋**：多條件組合搜尋
- **員工照片**：上傳和顯示員工照片
- **課程註冊**：員工課程註冊管理
- **報表功能**：員工統計報表

### 自定義擴展

1. 在 `components/` 資料夾中建立新元件
2. 在 `services/` 中擴展業務邏輯
3. 在 `models/` 中定義新的資料結構
4. 更新路由設定以支援新功能

## 測試策略

- **單元測試**：每個服務和元件都有對應的 `.spec.ts` 檔案
- **整合測試**：完整的使用者操作流程測試
- **E2E 測試**：關鍵業務流程的端到端測試

## 效能優化

- **延遲載入**：使用 `loadComponent()` 進行元件延遲載入
- **虛擬滾動**：大量資料的高效顯示
- **快取機制**：適當的資料快取策略
- **分頁載入**：避免一次載入過多資料

## 常見問題

### Q: 如何自定義表格欄位？

A: 修改 `employee-list.component.html` 中的表格結構，並在對應的模型中加入新欄位。

### Q: 如何加入新的搜尋條件？

A: 更新 `EmployeeQueryDto` 介面，並在搜尋表單中加入新的表單控制項。

### Q: 如何整合第三方 UI 函式庫？

A: 在元件的 `imports` 陣列中加入所需的模組，並遵循該函式庫的使用指南。

## 貢獻指南

1. 遵循現有的檔案和資料夾命名慣例
2. 確保所有新功能都有適當的測試覆蓋
3. 更新相關的 README.md 文件
4. 遵循 TypeScript 和 ESLint 規則
5. 確保響應式設計和無障礙支援
