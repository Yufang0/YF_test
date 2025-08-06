# Angular Employee Management - 變更日誌

## 🔍 搜尋功能重大改進 (2025-08-06 最新)

### 問題修復

**原問題**：員工查詢功能不管搜尋條件是什麼，都會查出全部員工，Spring Boot log 看到的 SQL 沒有任何 where 條件。

**解決方案**：

1. **前端修復**：`onSearch()` 方法原本只呼叫 `loadEmployees()`，現在正確使用搜尋表單的值
2. **後端新增**：實作綜合條件搜尋 API，支援動態 SQL 產生
3. **UI 改進**：移除編輯彈窗的水平滾動條，內容自適應

### 🚀 新增功能

#### 綜合搜尋 API

- **端點**：`GET /api/employees/search/criteria`
- **參數**：`empCode`, `empName`, `deptId`, `jobTitle` (全部可選)
- **特色**：
  - 動態 SQL：只有非空參數才加入 WHERE 條件
  - 模糊匹配：員工編號、姓名、職位支援部分匹配
  - 精確匹配：部門 ID 使用精確匹配
  - 排序：按員工編號升序排列

#### 前端智慧搜尋

```typescript
// 檢查是否有搜尋條件
const hasSearchCriteria = formValue.emp_code?.trim() || formValue.emp_name?.trim() || formValue.dept_id || formValue.job_title?.trim();

// 無條件時載入全部，有條件時執行搜尋
if (!hasSearchCriteria) {
  this.loadEmployees();
} else {
  this.searchEmployeesByCriteria(criteria);
}
```

#### 後端動態查詢

```java
@Query("SELECT e FROM EmployeeEntity e WHERE " +
       "(:empCode IS NULL OR e.empCode LIKE %:empCode%) AND " +
       "(:empName IS NULL OR e.empName LIKE %:empName%) AND " +
       "(:deptId IS NULL OR e.deptId = :deptId) AND " +
       "(:jobTitle IS NULL OR e.jobTitle LIKE %:jobTitle%) " +
       "ORDER BY e.empCode ASC")
List<EmployeeEntity> findByCriteria(@Param("empCode") String empCode, ...);
```

### 🎨 UI/UX 大幅改進

#### Modal 彈窗優化

- **移除水平滾動條**：設定 `overflow-x: hidden`
- **增加彈窗尺寸**：最大寬度 600px → 800px，高度 90vh → 95vh
- **CSS Grid 佈局**：自適應表單佈局 `repeat(auto-fit, minmax(250px, 1fr))`
- **內容自適應**：長文字自動換行，欄位排列自動調整

#### 響應式設計

- **桌面版**：2 欄 Grid 佈局，最佳化空間利用
- **行動版**：單欄佈局，全寬按鈕，垂直排列
- **字體優化**：iOS 輸入框 16px 防止自動縮放

```scss
.modal-body {
  overflow-x: hidden; // 禁止水平滾動

  form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .full-width {
    grid-column: 1 / -1; // 某些欄位佔滿整行
  }
}
```

### 📱 行動裝置體驗提升

- **彈窗從頂部開始**：避免鍵盤遮擋
- **按鈕垂直排列**：改善觸控體驗
- **全寬度表單**：行動裝置上佔滿螢幕
- **觸控友善**：按鈕大小和間距優化

### 🔧 技術實作亮點

#### 架構設計

```
前端: Angular Component → Service → HTTP Client
                ↓
後端: REST Controller → Service → Repository → Database
```

#### API 端點整理

- `GET /api/employees` - 分頁查詢所有員工
- `GET /api/employees/search/criteria` - **新增**：綜合條件搜尋
- `GET /api/employees/search?empName=` - 姓名搜尋
- `GET /api/employees/search/job-title?jobTitle=` - 職位搜尋
- `GET /api/employees/department/{deptId}` - 部門員工

#### 效能優化建議

- 在 `emp_code`, `emp_name`, `dept_id`, `job_title` 建立資料庫索引
- 實作查詢結果快取機制
- 大數據量時考慮分頁搜尋

---

## UI/UX 改善 (之前更新)

### 員工查詢表單布局優化

- **修正查詢表單欄位間距問題**：

  - 更新 CSS Grid 布局，避免輸入欄位黏在一起或重疊
  - 桌機版：使用 `grid-template-columns: repeat(4, 1fr) auto` 確保 4 個查詢欄位 + 按鈕區域的均勻分布
  - 增加 `gap: 24px` 提供充足的欄位間距
  - 每個輸入欄位設定 `max-width: 220px` 避免過寬

- **響應式設計改善**：

  - 手機版：改為垂直堆疊布局 (`grid-template-columns: 1fr`)
  - 增加垂直間距 `gap: 16px` 提供清晰的視覺分離
  - 按鈕在手機版自動展開為全寬 (`width: 100%`)

- **視覺細節優化**：
  - 增加輸入框內距：`padding: 10px 12px`
  - 增加標籤間距：`margin-bottom: 8px`
  - 按鈕間距調整：桌機版 `gap: 12px`，手機版 `gap: 12px`

### 後端 API 修正

#### 員工資料顯示問題修正

- **修正 emp_phone 欄位顯示**：
  - 後端 `convertEntityToVo()` 方法添加 `vo.setEmpPhone(entity.getEmpPhone())` 映射
  - 修正 API 回應缺少電話號碼的問題

#### 員工更新功能修正

- **完善員工更新邏輯**：
  - 後端 `updateEntityFromDto()` 方法添加 `emp_phone` 和 `update_user` 欄位更新
  - 前端更新 DTO 添加 `emp_code` 欄位確保完整更新
  - 修正更新功能僅更新 `update_time` 而其他欄位未更新的問題

---

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
