# 佈局資料夾

## 目的
這個資料夾包含應用程式的所有佈局元件。佈局元件負責定義應用程式的整體結構，包括導航、側邊欄、頁首頁尾等共用介面元素。

## 佈局元件列表

### `main-layout/`
**主要佈局元件** - 包含側邊欄導航的主要應用程式佈局

- **功能**：
  - 持久化側邊欄導航
  - 頂部導航列
  - 響應式設計
  - 主要內容區域路由出口
  - 使用者資訊顯示

- **使用場景**：所有需要導航的頁面都使用此佈局

### 未來的佈局元件
- `auth-layout/` - 登入/註冊頁面佈局
- `admin-layout/` - 管理員專用佈局
- `print-layout/` - 列印友善佈局

## 設計原則

### 1. **佈局分離**
- 佈局元件專注於結構和導航
- 不包含業務邏輯
- 透過 `<router-outlet>` 展示頁面內容

### 2. **響應式設計**
- 支援桌面和行動裝置
- 適應性側邊欄（手機版可收摺）
- 彈性網格佈局

### 3. **一致性**
- 統一的視覺風格
- 標準化的間距和色彩
- 跨瀏覽器相容性

## 佈局結構

### 主要佈局結構
```html
<div class="main-layout">
  <aside class="sidebar">
    <!-- 側邊欄導航 -->
  </aside>
  <main class="main-content">
    <header class="top-header">
      <!-- 頂部導航 -->
    </header>
    <div class="content-wrapper">
      <router-outlet></router-outlet>
    </div>
  </main>
</div>
```

### 導航架構
- **Logo 區域**：品牌標識
- **主要導航**：功能模組連結
- **使用者區域**：使用者資訊和設定

## 使用方式

### 在路由中使用佈局
```typescript
// 在主要路由中設定
{
  path: '',
  component: MainLayoutComponent,
  children: [
    {
      path: 'dashboard',
      loadChildren: () => import('./features/dashboard/dashboard.routes')
    },
    // 其他子路由...
  ]
}
```

### 新增導航項目
在 `main-layout.component.ts` 中更新 `navigationItems` 陣列：
```typescript
readonly navigationItems = [
  {
    label: '新功能',
    path: '/new-feature',
    icon: '🆕'
  }
];
```

## 樣式規範

### CSS 變數
- 使用 CSS 自訂屬性定義主要顏色
- 統一的陰影和圓角值
- 標準化的 z-index 層級

### 響應式斷點
- 手機：< 768px
- 平板：768px - 1024px
- 桌面：> 1024px

### 動畫和轉場
- 300ms 的標準轉場時間
- 緩入緩出的動畫曲線
- 適當的 hover 效果

## 最小工作範例

### 建立新佈局元件
```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-new-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="new-layout">
      <!-- 佈局結構 -->
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .new-layout {
      /* 佈局樣式 */
    }
  `]
})
export class NewLayoutComponent {}
```

### 無障礙設計
- 適當的 ARIA 標籤
- 鍵盤導航支援
- 高對比度支援
- 螢幕閱讀器友善

## 效能優化
- 延遲載入內容
- CSS 最佳化
- 最小化重新繪製
- 適當的快取策略

## 注意事項
- 佈局元件應保持輕量
- 避免在佈局中處理業務邏輯
- 確保所有裝置上的一致體驗
- 定期測試響應式設計
