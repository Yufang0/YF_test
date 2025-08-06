# Angular Employee Management - 變更日誌

## 概要

為配合 Spring Boot 3.5.4 後端 API，完全重構了 Angular 前端的員工管理功能，包含 Service、Component 和相關模型。

## 主要變更

### 1. 員工模型更新 (employee.model.ts)

**變更内容：**

- 完全重寫模型介面以符合後端 DTO 結構
- 使用 snake_case 格式對應後端 JSON 屬性名稱
- 新增完整的員工資訊欄位

**新增介面：**

```typescript
// 主要員工模型
interface Employee {
  emp_id: number;
  emp_code: string;
  emp_name: string;
  emp_email?: string;
  dept_id?: number;
  job_title?: string;
  hire_date?: string;
  resign_date?: string;
  is_active?: boolean;
  status_text?: string;
  create_time?: string;
  create_user?: string;
  working_days?: number;
}

// 建立員工 DTO
interface EmployeeCreateDto { ... }

// 更新員工 DTO
interface EmployeeUpdateDto { ... }

// 員工摘要 DTO
interface EmployeeSummaryDto { ... }
```

### 2. 員工服務重構 (employee.service.ts)

**變更内容：**

- 完全重寫服務以對應後端 REST API 端點
- 使用 Angular 20 最佳實踐：`inject()` 函數、`signal()` 狀態管理
- 統一錯誤處理機制使用 `HttpErrorHandlerService`

**新增方法：**

```typescript
// CRUD 操作
createEmployee(createDto: EmployeeCreateDto): Observable<Employee>
getEmployeeById(empId: number): Observable<Employee>
getEmployeeByCode(empCode: string): Observable<Employee>
updateEmployee(empId: number, updateDto: EmployeeUpdateDto): Observable<Employee>
deleteEmployee(empId: number): Observable<void>

// 查詢操作
getAllEmployees(page = 0, size = 10): Observable<Employee[]>
getEmployeesByStatus(isActive: boolean, page = 0, size = 10): Observable<Employee[]>
getEmployeesByDepartment(deptId: number): Observable<Employee[]>

// 搜尋操作
searchEmployeesByName(empName: string): Observable<Employee[]>
searchEmployeesByJobTitle(jobTitle: string): Observable<Employee[]>
getEmployeesByHireDateRange(startDate: string, endDate: string): Observable<Employee[]>

// 統計操作
getEmployeeSummaryByDepartment(deptId: number): Observable<EmployeeSummaryDto[]>
countActiveEmployeesByDepartment(deptId: number): Observable<number>
```

### 3. 員工列表元件重構 (employee-list.component.ts)

**變更内容：**

- 完全重寫元件邏輯遵循 Angular 20 指導原則
- 使用 `signal()` 進行狀態管理，避免類別屬性狀態
- 實作完整的 CRUD 功能，包含模態對話框
- 使用 Reactive Forms 進行表單驗證

**主要功能：**

- 員工列表顯示與搜尋
- 按姓名、職位、狀態篩選
- 新增員工（模態對話框）
- 編輯員工（模態對話框）
- 刪除員工（確認對話框）
- 即時錯誤處理與使用者友善訊息

**狀態管理：**

```typescript
readonly employees = signal<Employee[]>([]);
readonly selectedEmployee = signal<Employee | null>(null);
readonly showCreateForm = signal(false);
readonly showEditForm = signal(false);
readonly error = signal<string | null>(null);
```

### 4. HTML 模板重構 (employee-list.component.html)

**變更内容：**

- 使用 Angular 20 新控制流語法：`@if`, `@for`, `@else`
- 完整的響應式 UI 設計
- 模態對話框用於新增/編輯員工
- 即時表單驗證錯誤顯示

**主要區塊：**

- 頁面標題與操作按鈕
- 多重搜尋條件區域
- 員工資料表格
- 新增員工模態對話框
- 編輯員工模態對話框
- 載入狀態指示器
- 錯誤訊息顯示

### 5. SCSS 樣式設計 (employee-list.component.scss)

**變更内容：**

- 完整的現代化 UI 設計
- 響應式佈局支援行動裝置
- 專業的表格、按鈕、模態對話框樣式
- 一致的顏色主題和間距

**主要樣式：**

- 網格式搜尋表單佈局
- 美觀的資料表格設計
- 專業的模態對話框
- 完整的按鈕樣式系統
- 載入動畫和狀態指示器

## API 端點對應

| 前端方法                         | HTTP 方法 | 後端端點                                         | 說明                 |
| -------------------------------- | --------- | ------------------------------------------------ | -------------------- |
| createEmployee                   | POST      | `/employees`                                     | 建立新員工           |
| getEmployeeById                  | GET       | `/employees/{empId}`                             | 根據 ID 取得員工     |
| getEmployeeByCode                | GET       | `/employees/code/{empCode}`                      | 根據編號取得員工     |
| getAllEmployees                  | GET       | `/employees?page=&size=`                         | 分頁查詢所有員工     |
| getEmployeesByStatus             | GET       | `/employees/status/{isActive}?page=&size=`       | 根據狀態查詢員工     |
| getEmployeesByDepartment         | GET       | `/employees/department/{deptId}`                 | 根據部門查詢員工     |
| searchEmployeesByName            | GET       | `/employees/search?empName=`                     | 根據姓名搜尋員工     |
| searchEmployeesByJobTitle        | GET       | `/employees/search/job-title?jobTitle=`          | 根據職位搜尋員工     |
| getEmployeesByHireDateRange      | GET       | `/employees/hire-date-range?startDate=&endDate=` | 根據入職日期範圍查詢 |
| updateEmployee                   | PUT       | `/employees/{empId}`                             | 更新員工資訊         |
| deleteEmployee                   | DELETE    | `/employees/{empId}`                             | 刪除員工             |
| getEmployeeSummaryByDepartment   | GET       | `/employees/department/{deptId}/summary`         | 取得部門員工摘要     |
| countActiveEmployeesByDepartment | GET       | `/employees/department/{deptId}/count`           | 統計部門啟用員工數量 |

## 錯誤處理機制

所有 API 呼叫都透過 `HttpErrorHandlerService` 進行統一錯誤處理：

- 400: 請求參數錯誤
- 401: 您尚未登入或登入已過期
- 403: 您沒有權限執行此操作
- 404: 找不到請求的資源
- 409: 員工編號已存在（針對員工管理）
- 500: 伺服器發生錯誤，請稍後再試

## 使用說明

### 啟動前端應用程式

```bash
cd YF_test
ng serve
```

應用程式將在 http://localhost:4200 執行

### 啟動後端 API

```bash
cd YF_test_back
mvn spring-boot:run
```

API 將在 http://localhost:8080 執行

### 主要功能操作

1. **查看員工列表**

   - 開啟應用程式自動載入所有員工

2. **搜尋員工**

   - 輸入姓名並點擊「姓名搜尋」
   - 輸入職位並點擊「職位搜尋」
   - 選擇狀態並點擊「狀態篩選」

3. **新增員工**

   - 點擊「新增員工」按鈕
   - 填寫必要資訊（員工編號、姓名）
   - 點擊「建立」完成新增

4. **編輯員工**

   - 點擊員工列表中的「編輯」按鈕
   - 修改相關資訊
   - 點擊「更新」完成修改

5. **刪除員工**
   - 點擊員工列表中的「刪除」按鈕
   - 確認刪除操作

## 技術規範

- **Angular 版本**: 20
- **TypeScript**: 最新 ES 標準
- **響應式程式設計**: 使用 RxJS Observables
- **狀態管理**: Angular Signals
- **表單處理**: Reactive Forms
- **HTTP 通訊**: HttpClient
- **錯誤處理**: 統一錯誤處理服務
- **樣式設計**: SCSS with BEM 方法論
- **控制流**: Angular 20 新語法 (@if, @for)

## 程式碼品質

- 遵循 Angular 20 最佳實踐
- 使用 TypeScript 嚴格模式
- 完整的型別註解
- 詳細的 JSDoc 註解
- 響應式設計支援
- 可維護性和擴展性考量

## 測試建議

1. **單元測試**

   - 服務方法測試
   - 元件邏輯測試
   - 表單驗證測試

2. **整合測試**

   - API 通訊測試
   - 錯誤處理測試
   - 使用者互動測試

3. **端到端測試**
   - 完整工作流程測試
   - 跨瀏覽器兼容性測試
