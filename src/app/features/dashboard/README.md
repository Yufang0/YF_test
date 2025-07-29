# 儀表板功能模組

## 目的
儀表板是整個 ERP 系統的首頁和控制中心，提供系統概覽、快速存取和關鍵統計資訊。作為使用者進入系統後的第一個頁面，儀表板需要清晰地呈現系統狀態和提供高效的導航體驗。

## 功能概述

### 📊 統計概覽
- **員工統計**：顯示總員工數量
- **部門統計**：顯示部門數量
- **課程統計**：顯示可用課程總數
- **註冊統計**：顯示課程註冊總數

### 🚀 快速操作
- **新增員工**：快速建立新員工
- **課程管理**：直接進入課程管理
- **註冊管理**：檢視和管理課程註冊
- **部門管理**：管理組織結構

### 📝 最近活動
- 顯示系統最近的操作記錄
- 包含操作類型、目標和時間
- 提供活動的視覺化圖示

### 🔧 系統監控
- **系統狀態**：監控應用程式運行狀況
- **資料庫狀態**：檢查資料庫連線
- **最後更新**：顯示資料更新時間

## 技術特色

### 🎯 **Angular 20+ 實作**
- **Signal 狀態管理**：使用 `signal()` 和 `computed()` 管理狀態
- **Standalone 元件**：無 NgModule 依賴
- **響應式設計**：適應各種螢幕尺寸
- **新式控制流**：使用 `@if`, `@for` 語法

### 🎨 **視覺設計**
- **漸層色彩**：現代化的視覺效果
- **互動動畫**：流暢的 hover 和轉場效果
- **網格佈局**：靈活的響應式排版
- **圖示系統**：直觀的視覺提示

## 檔案結構

```
dashboard/
├── pages/
│   └── dashboard/
│       ├── dashboard.component.ts
│       ├── dashboard.component.html
│       └── dashboard.component.scss
├── dashboard.routes.ts
└── README.md
```

## 資料結構

### 統計資料
```typescript
interface Stats {
  totalEmployees: number;
  totalDepartments: number;
  totalCourses: number;
  totalEnrollments: number;
}
```

### 活動記錄
```typescript
interface Activity {
  id: number;
  type: 'employee' | 'course' | 'enrollment' | 'department';
  action: string;
  target: string;
  time: string;
  icon: string;
}
```

### 快速連結
```typescript
interface QuickLink {
  title: string;
  description: string;
  path: string;
  icon: string;
  color: 'primary' | 'success' | 'info' | 'warning';
}
```

## 使用指南

### 路由設定
儀表板設定為預設首頁：
```typescript
{
  path: '',
  redirectTo: '/dashboard',
  pathMatch: 'full'
}
```

### 資料更新
目前使用模擬資料，未來將整合真實 API：
```typescript
// 未來的 API 整合
this.dashboardService.getStats().subscribe(stats => {
  this.stats.set(stats);
});
```

### 自訂統計卡片
可以輕鬆新增新的統計項目：
```typescript
// 在 statCards computed 中新增
{
  title: '新統計項目',
  value: this.stats().newValue,
  icon: '📈',
  color: 'success',
  path: '/new-feature'
}
```

## 響應式設計

### 桌面版 (> 1024px)
- 四欄統計卡片網格
- 主要內容分為左右兩欄
- 完整的功能展示

### 平板版 (768px - 1024px)
- 統計卡片自適應排列
- 內容區域改為單欄
- 保持所有功能可用性

### 手機版 (< 768px)
- 單欄統計卡片排列
- 簡化的快速操作介面
- 優化的觸控互動

## 效能優化

### 載入策略
- 延遲載入非關鍵資料
- 漸進式增強體驗
- 快速的初始渲染

### 快取機制
```typescript
// 未來實作的快取策略
@Injectable()
export class DashboardService {
  private cache = new Map();
  
  getStats() {
    // 實作快取邏輯
  }
}
```

## 未來功能規劃

### 📈 進階統計
- 圖表視覺化
- 趨勢分析
- 時間範圍選擇
- 匯出報表功能

### 🔔 通知系統
- 即時通知顯示
- 重要事件提醒
- 系統警告訊息

### ⚡ 個人化設定
- 自訂儀表板佈局
- 個人化統計項目
- 主題色彩設定

### 📱 即時更新
- WebSocket 連線
- 即時資料同步
- 推播通知

## 最小工作範例

### 擴展統計項目
```typescript
// 1. 更新統計介面
interface Stats {
  totalEmployees: number;
  totalDepartments: number;
  totalCourses: number;
  totalEnrollments: number;
  newMetric: number; // 新增統計項目
}

// 2. 更新 statCards computed
readonly statCards = computed(() => [
  // ...existing cards
  {
    title: '新指標',
    value: this.stats().newMetric,
    icon: '📊',
    color: 'info',
    path: '/new-metrics'
  }
]);
```

### 新增快速操作
```typescript
// 在 quickLinks signal 中新增
{
  title: '新功能',
  description: '描述新功能的用途',
  path: '/new-feature',
  icon: '🆕',
  color: 'primary'
}
```

## 測試策略

### 單元測試
- 元件邏輯測試
- Signal 狀態變化測試
- Computed 值計算測試

### 整合測試
- 路由導航測試
- API 整合測試
- 使用者互動測試

### 視覺測試
- 響應式設計測試
- 跨瀏覽器相容性
- 無障礙功能測試

## 注意事項
- 儀表板應該快速載入
- 保持介面簡潔明瞭
- 確保資料的準確性和即時性
- 提供良好的錯誤處理機制
