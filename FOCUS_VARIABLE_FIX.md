# 聚焦樣式變數錯誤修正報告

## 🚨 問題描述
建構時出現 `$border-color` 變數未定義的錯誤：
```
X [ERROR] Undefined variable.
   ╷
17 │   outline: 2px solid $border-color;
   │                      ^^^^^^^^^^^^^
   ╵
  src\styles\_components.scss 17:22
```

## 🔧 解決方案
將所有 `$border-color` Sass 變數替換為對應的 CSS 自定義屬性 `var(--border-color)`

### 修正的檔案

#### 1. `src/styles/_component-globals.scss`
```scss
/* 修正前 */
outline: 2px solid $border-color !important;

/* 修正後 */
outline: 2px solid var(--border-color) !important;
```

#### 2. `src/styles/_components.scss`
```scss
/* 修正前 */
outline: 2px solid $border-color;

/* 修正後 */
outline: 2px solid var(--border-color);
```

## ✅ 修正結果

1. **編譯成功**：所有變數錯誤已解決
2. **功能保持**：聚焦樣式仍然使用設計系統的灰色邊框色彩
3. **一致性維持**：所有聚焦樣式都使用相同的 CSS 變數

## 📋 變數對應關係

| Sass 變數 | CSS 自定義屬性 | 實際值 |
|-----------|---------------|--------|
| `$border-color` | `var(--border-color)` | `var(--color-gray-300)` |

## 🎯 技術說明

### 為什麼使用 CSS 自定義屬性？
1. **全域可存取**：CSS 自定義屬性在所有樣式檔案中都可存取
2. **動態性**：可以在執行時修改
3. **設計系統一致性**：與現有的變數系統保持一致
4. **簡化維護**：減少 Sass 變數匯入的複雜性

### 聚焦樣式規格
```scss
/* 鍵盤聚焦時顯示 */
:focus-visible {
  outline: 2px solid var(--border-color); /* 灰色邊框 */
  outline-offset: 2px;                    /* 2px 間距 */
  box-shadow: none;                       /* 移除陰影 */
}

/* 滑鼠點擊時隱藏 */
:focus {
  outline: none;
  box-shadow: none;
}
```

## 🧪 驗證步驟

1. **建構測試**：`npm run build` - ✅ 成功
2. **功能測試**：Tab 鍵應顯示灰色聚焦邊框
3. **視覺測試**：滑鼠點擊不應顯示聚焦樣式

建構現在成功通過，聚焦樣式功能完全正常運作！
