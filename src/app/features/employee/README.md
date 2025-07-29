# 員工功能模組

## 目的

這個資料夾包含完整的員工管理功能，是一個獨立的業務功能模組。遵循 Angular 20+ 的功能優先架構，提供完整的員工 CRUD（建立、讀取、更新、刪除）操作。

## 資料夾結構

```
employee/
├── models/           # 資料模型和介面定義
├── services/         # 業務邏輯和 API 服務
├── pages/           # 頁面元件
├── components/      # 可重用的業務元件（待建立）
├── store/           # 狀態管理（未來功能）
├── employee.routes.ts  # 路由設定
└── README.md        # 說明文件
```

## 功能概述

### 📋 員工列表管理

- 顯示所有員工的分頁列表
- 按姓名和部門進行搜尋過濾
- 快速操作：檢視、編輯、刪除
- 響應式表格設計，支援手機和桌面

### 👤 員工詳細資訊

- 顯示員工的完整資訊
- 部門關聯資訊顯示
- 操作歷史和課程註冊（未來功能）
- 直接編輯和刪除操作

### ✏️ 員工新增/編輯

- 統一的表單介面處理新增和編輯
- 即時表單驗證和錯誤提示
- 部門下拉選單整合
- 友善的使用者體驗

### 🗑️ 員工刪除

- 確認對話框防止誤刪
- 軟刪除或硬刪除支援
- 相關資料完整性檢查

## 技術特色

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
