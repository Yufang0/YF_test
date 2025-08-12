# 員工管理分頁功能使用指南

## 📖 功能概述

本文件說明如何使用新實作的員工管理分頁功能，包括前端介面操作和後端 API 呼叫方式。

## 🔧 前端操作指南

### 基本分頁操作

#### 1. 頁面導航

- **首頁**：點擊 "<<" 按鈕跳至第一頁
- **上一頁**：點擊 "<" 按鈕跳至上一頁
- **下一頁**：點擊 ">" 按鈕跳至下一頁
- **末頁**：點擊 ">>" 按鈕跳至最後一頁
- **直接跳轉**：點擊具體頁碼數字直接跳至該頁

#### 2. 頁面大小設定

- 頁面右上角的下拉選單可選擇每頁顯示筆數
- 可選擇：5 筆/頁、10 筆/頁、20 筆/頁、50 筆/頁
- 變更頁面大小會自動重置到第一頁

#### 3. 分頁資訊顯示

分頁控制器會顯示以下資訊：

```
顯示第 1 - 10 筆，共 25 筆資料 (第 1 / 3 頁)
```

### 搜尋結果分頁

#### 1. 搜尋時的分頁行為

- 執行搜尋時會自動重置到第一頁
- 搜尋結果支援完整的分頁功能
- 切換頁面時會保持搜尋條件

#### 2. 重設搜尋時的分頁行為

- 點擊「重設」按鈕會清除搜尋條件
- 同時重置分頁到第一頁
- 回到顯示所有員工的狀態

## 🔌 後端 API 使用指南

### 分頁端點

#### 1. 查詢所有員工（分頁）

```http
GET /api/employees?page=0&size=10&sortBy=createTime&sortDir=desc
```

**參數說明：**

- `page`：頁碼（從 0 開始），預設值：0
- `size`：每頁筆數，預設值：10
- `sortBy`：排序欄位，預設值：createTime
- `sortDir`：排序方向（asc/desc），預設值：desc

#### 2. 根據狀態查詢員工（分頁）

```http
GET /api/employees/status/{isActive}?page=0&size=10&sortBy=createTime&sortDir=desc
```

#### 3. 綜合條件搜尋員工（分頁）

```http
GET /api/employees/search?empCode=EMP&empName=王&deptId=1&jobTitle=工程師&page=0&size=10&sortBy=createTime&sortDir=desc
```

**搜尋參數說明：**

- `empCode`：員工編號（可選，部分匹配）
- `empName`：員工姓名（可選，部分匹配）
- `deptId`：部門 ID（可選，精確匹配）
- `jobTitle`：職位（可選，部分匹配）
- 其他分頁參數同上

### 回應格式

所有分頁 API 都遵循統一的回應格式：

```json
{
  "code": 1000,
  "message": "查詢成功",
  "data": {
    "content": [
      {
        "empId": 1,
        "empCode": "EMP001",
        "empName": "王小明",
        "empEmail": "wang@example.com",
        "deptId": 1,
        "jobTitle": "軟體工程師",
        "hireDate": "2024-01-15",
        "salary": 50000.0,
        "isActive": true,
        "createTime": "2024-01-15T09:00:00",
        "updateTime": "2024-01-15T09:00:00"
      }
    ],
    "total_elements": 25,
    "total_pages": 3,
    "current_page": 0,
    "page_size": 10,
    "has_next": true,
    "has_previous": false
  },
  "timestamp": "2025-08-11T17:20:00"
}
```

## 🎯 最佳實踐

### 前端開發建議

#### 1. 狀態管理

```typescript
// 使用 Signal 進行響應式狀態管理
readonly currentPage = signal(0);
readonly pageSize = signal(10);
readonly totalElements = signal(0);
readonly totalPages = signal(0);

// 搜尋狀態分離管理
readonly isSearching = signal(false);
readonly currentSearchCriteria = signal<SearchCriteria | null>(null);
```

#### 2. 載入邏輯

```typescript
// 統一的載入方法，自動判斷搜尋或一般模式
loadEmployees(): void {
  if (this.isSearching()) {
    const criteria = this.currentSearchCriteria();
    if (criteria) {
      this.loadEmployeesWithSearch(criteria);
      return;
    }
  }
  this.loadAllEmployees();
}
```

#### 3. 事件處理

```typescript
// 頁面變更時保持搜尋狀態
onPageChange(page: number): void {
  if (page >= 0 && page < this.totalPages() && page !== this.currentPage()) {
    this.currentPage.set(page);
    this.loadEmployees(); // 會自動判斷載入模式
  }
}
```

### 後端開發建議

#### 1. Repository 查詢方法

```java
@Query("SELECT e FROM EmployeeEntity e WHERE " +
       "(:empCode IS NULL OR e.empCode LIKE %:empCode%) AND " +
       "(:empName IS NULL OR e.empName LIKE %:empName%) AND " +
       "(:deptId IS NULL OR e.deptId = :deptId) AND " +
       "(:jobTitle IS NULL OR e.jobTitle LIKE %:jobTitle%)")
Page<EmployeeEntity> findByCriteriaWithPagination(
    @Param("empCode") String empCode,
    @Param("empName") String empName,
    @Param("deptId") Integer deptId,
    @Param("jobTitle") String jobTitle,
    Pageable pageable);
```

#### 2. Service 層處理

```java
public Page<EmployeeDto> searchEmployeesByCriteriaWithPagination(
    String empCode, String empName, Integer deptId, String jobTitle,
    int page, int size, String sortBy, String sortDir) {

    // 建立排序規則
    Sort sort = Sort.by(Sort.Direction.fromString(sortDir.toUpperCase()), sortBy);
    Pageable pageable = PageRequest.of(page, size, sort);

    // 執行查詢
    Page<EmployeeEntity> entityPage = employeeRepository.findByCriteriaWithPagination(
        empCode, empName, deptId, jobTitle, pageable);

    // 轉換為 DTO
    List<EmployeeDto> dtoList = entityPage.getContent().stream()
        .map(employeeMapper::entityToDto)
        .collect(Collectors.toList());

    return new PageImpl<>(dtoList, pageable, entityPage.getTotalElements());
}
```

#### 3. Controller 參數處理

```java
@GetMapping("/search")
public ResponseEntity<ApiResponse<PageResponse<EmployeeDto>>> searchEmployeesByCriteriaWithPagination(
    @RequestParam(required = false) String empCode,
    @RequestParam(required = false) String empName,
    @RequestParam(required = false) Integer deptId,
    @RequestParam(required = false) String jobTitle,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(defaultValue = "createTime") String sortBy,
    @RequestParam(defaultValue = "desc") String sortDir) {

    Page<EmployeeDto> result = employeeService.searchEmployeesByCriteriaWithPagination(
        empCode, empName, deptId, jobTitle, page, size, sortBy, sortDir);

    return ResponseEntity.ok(ApiResponse.success(PageResponse.from(result)));
}
```

## 🔍 測試建議

### 前端測試

1. **基本分頁**：測試各種頁面導航操作
2. **頁面大小變更**：測試不同頁面大小的切換
3. **搜尋分頁**：測試搜尋結果的分頁功能
4. **狀態保持**：測試搜尋狀態的保持和重設
5. **邊界情況**：測試空結果、單頁結果等邊界情況

### 後端測試

1. **參數驗證**：測試各種參數組合
2. **排序功能**：測試不同欄位和方向的排序
3. **搜尋條件**：測試各種搜尋條件組合
4. **分頁邊界**：測試頁碼超出範圍等情況
5. **效能測試**：測試大數據量下的分頁效能

## 📋 故障排除

### 常見問題

#### 1. 分頁控制器不顯示

- 檢查 `totalPages()` 是否大於 1
- 確認 CSS 樣式是否正確載入

#### 2. 搜尋後分頁異常

- 檢查搜尋時是否正確重設 `currentPage` 為 0
- 確認搜尋狀態的設定和清除邏輯

#### 3. 後端分頁查詢錯誤

- 檢查 `@RequestParam` 的預設值設定
- 確認排序欄位名稱是否正確
- 檢查 JPA 查詢語法是否正確

#### 4. TypeScript 編譯錯誤

- 確認所有 Interface 定義正確
- 檢查 Signal 的型別定義
- 確認方法參數和回傳值型別

## 📚 相關文件

- [Angular Signals 官方文件](https://angular.io/guide/signals)
- [Spring Data JPA 分頁文件](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.special-parameters)
- [專案 CHANGELOG](./CHANGELOG_LATEST.md)

---

_最後更新：2025-08-11_
