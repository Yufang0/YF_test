# 聚焦樣式改善報告

## 🎯 專案目標
改善整個專案所有可聚焦元素的聚焦樣式，實現：
- 只在鍵盤操作時顯示聚焦樣式（`:focus-visible`）
- 滑鼠點擊不顯示紅框或藍框
- 使用設計系統的 `$border-color` 呈現一致的灰色描邊
- 符合 Swiss International Style 設計原則

## ✅ 完成的改善

### 1. 全域聚焦樣式設定
**檔案：** `src/styles/_component-globals.scss`

```scss
/* 全域聚焦樣式 - Swiss International Style */
/* 只在鍵盤操作時顯示聚焦樣式，滑鼠點擊不顯示 */
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible,
a:focus-visible,
[tabindex]:focus-visible,
.btn:focus-visible,
.form-control:focus-visible,
.btn-close:focus-visible {
  outline: 2px solid $border-color !important;
  outline-offset: 2px !important;
  box-shadow: none !important; // 移除任何預設的 box-shadow
}

/* 移除所有元素的預設 focus 樣式，只保留 focus-visible */
button:focus,
input:focus,
textarea:focus,
select:focus,
a:focus,
[tabindex]:focus,
.btn:focus,
.form-control:focus,
.btn-close:focus {
  outline: none !important;
  box-shadow: none !important;
}
```

### 2. 基礎元件樣式更新
**檔案：** `src/styles/_components.scss`

- 更新連結 (`a`) 的聚焦樣式
- 更新按鈕 (`.btn`) 的聚焦樣式
- 更新表單元素的聚焦樣式
- 所有樣式都改用 `:focus-visible` 而非 `:focus`

### 3. 舊瀏覽器相容性支援
```scss
/* 為無障礙考量，確保 focus-visible 在所有支援的瀏覽器中正常運作 */
@supports not selector(:focus-visible) {
  /* 對於不支援 :focus-visible 的舊瀏覽器，回退到 :focus */
  button:focus,
  input:focus,
  textarea:focus,
  select:focus,
  a:focus,
  [tabindex]:focus,
  .btn:focus,
  .form-control:focus,
  .btn-close:focus {
    outline: 2px solid $border-color !important;
    outline-offset: 2px !important;
    box-shadow: none !important;
  }
}
```

## 🎨 設計系統一致性

### 聚焦樣式規格
- **顏色：** `$border-color` (對應 `var(--color-gray-300)` - 灰色)
- **寬度：** `2px solid`
- **間距：** `outline-offset: 2px`
- **陰影：** 移除所有 `box-shadow`

### 符合 Swiss International Style 原則
- **簡潔性：** 使用單一、統一的聚焦樣式
- **功能性：** 只在需要時顯示（鍵盤操作）
- **一致性：** 所有元素使用相同的視覺處理
- **無障礙性：** 保持完整的鍵盤導航體驗

## 🧪 測試驗證

建立了測試頁面：`focus-test.html`
- 包含所有主要可聚焦元素類型
- 提供明確的測試步驟說明
- 驗證鍵盤 vs 滑鼠行為差異

### 測試步驟
1. **鍵盤測試：** 使用 Tab 鍵切換 → 應顯示灰色描邊
2. **滑鼠測試：** 點擊元素 → 不應顯示聚焦樣式
3. **一致性檢查：** 所有聚焦樣式都是相同的灰色描邊

## 📁 修改的檔案清單

1. **`src/styles/_component-globals.scss`**
   - 新增全域 `:focus-visible` 樣式
   - 新增 `:focus` 重置樣式
   - 新增舊瀏覽器相容性支援

2. **`src/styles/_components.scss`**
   - 更新連結聚焦樣式 (`a:focus-visible`)
   - 更新按鈕聚焦樣式 (`.btn:focus-visible`)
   - 更新表單元素聚焦樣式
   - 新增對應的 `:focus` 重置樣式

3. **`focus-test.html`** (測試檔案)
   - 用於驗證聚焦樣式實作的測試頁面

## 🔄 無障礙性考量

- **保持鍵盤導航：** 所有可聚焦元素仍然可以通過鍵盤存取
- **視覺指示清晰：** 鍵盤使用者有明確的聚焦指示
- **不干擾滑鼠使用者：** 滑鼠點擊時不會顯示不必要的聚焦樣式
- **符合 WCAG 標準：** 維持適當的對比度和視覺指示

## 🎉 效果總結

通過這次改善，整個專案現在具有：
- **統一的聚焦體驗**：所有元素使用相同的聚焦樣式
- **優化的使用者體驗**：滑鼠使用者不會看到干擾的聚焦框
- **完整的無障礙性**：鍵盤使用者仍有清晰的導航指示
- **符合設計系統**：使用既定的顏色變數和設計原則
- **現代化的實作**：使用 `:focus-visible` 這個現代 CSS 功能

這個實作完全符合 Swiss International Style 的簡潔、功能性設計原則，同時保持了良好的使用者體驗和無障礙性。
