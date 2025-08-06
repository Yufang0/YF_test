# Employee Components

這個目錄包含員工功能模組中可重用的共享元件。

## 元件列表

### 1. AlertComponent

- **檔案**: `alert/alert.component.ts`
- **用途**: 顯示各種類型的警告訊息（成功、錯誤、警告、資訊）
- **特色**: 可關閉、支援多種樣式類型
- **使用範例**:
  ```html
  <app-alert type="success" message="操作成功！" [dismissible]="true" (dismiss)="onAlertDismiss()"> </app-alert>
  ```

### 2. LoadingSpinnerComponent

- **檔案**: `loading-spinner/loading-spinner.component.ts`
- **用途**: 顯示載入狀態指示器
- **特色**: 可自訂大小、訊息、全螢幕模式
- **使用範例**:
  ```html
  <app-loading-spinner [loading]="isLoading" message="載入中..." [size]="40"> </app-loading-spinner>
  ```

### 3. ConfirmDialogComponent

- **檔案**: `confirm-dialog/confirm-dialog.component.ts`
- **用途**: 顯示確認對話框
- **特色**: 可自訂標題、訊息、按鈕文字、類型
- **使用範例**:
  ```html
  <app-confirm-dialog [show]="showConfirm" title="確認刪除" message="確定要刪除這個員工嗎？" confirmText="刪除" cancelText="取消" type="danger" (confirm)="onConfirmDelete()" (dismissed)="onCancelDelete()"> </app-confirm-dialog>
  ```

### 4. EmployeeCardComponent

- **檔案**: `employee-card/employee-card.component.ts`
- **用途**: 顯示單個員工的卡片資訊
- **特色**: 包含員工基本資訊、狀態顯示、操作按鈕
- **使用範例**:
  ```html
  <app-employee-card [employee]="employee" (edit)="onEditEmployee($event)" (delete)="onDeleteEmployee($event)"> </app-employee-card>
  ```

## 設計原則

1. **獨立性**: 每個元件都是 standalone，可以單獨使用
2. **可重用性**: 設計為通用元件，可在多處使用
3. **Angular 20**: 使用最新的 Angular 20 語法（signals、新控制流）
4. **無障礙性**: 遵循無障礙設計原則
5. **響應式**: 支援行動裝置和桌面版

## 使用方法

1. 從索引檔案匯入需要的元件：

   ```typescript
   import { AlertComponent, LoadingSpinnerComponent } from "../components";
   ```

2. 在元件的 imports 陣列中加入：

   ```typescript
   @Component({
     // ...
     imports: [AlertComponent, LoadingSpinnerComponent]
   })
   ```

3. 在模板中使用元件

## 擴展

如需新增更多共享元件，請：

1. 在適當的資料夾中建立元件
2. 更新 `index.ts` 以匯出新元件
3. 更新此 README 檔案
4. 新增適當的測試檔案
