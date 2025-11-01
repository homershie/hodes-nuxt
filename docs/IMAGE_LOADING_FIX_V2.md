# 文章頁面圖片載入問題修正文檔（第二版 - 最終修正）

## 問題描述

### 初始症狀
- 文章頁面的圖片在捲動時會消失
- 只有捲動停止時才會顯示正確圖片
- **重要**: 問題只在生產環境（build 後）出現，開發環境（dev）正常

### 第一次修正後的症狀
- 圖片不再完全消失，但在捲動時會顯示**連結失效圖示** (❌)
- 只有停止捲動才會載入並顯示正確圖片
- 證明了根本問題沒有解決

### 影響範圍
- 文章頁面 ([app/pages/article/[id].vue](../app/pages/article/[id].vue))
- 所有使用 OptimizedImage 元件的圖片
- 使用 ArticleImg 元件的文章內容圖片

## 問題根源分析（深層剖析）

### 核心問題：直接操作 DOM vs Vue 響應式系統衝突

#### 原始架構的致命缺陷

**錯誤的實作方式**:
```vue
<template>
  <!-- ❌ 沒有綁定 src 屬性 -->
  <img ref="imageRef" :data-src="src" :alt="alt" />
</template>

<script>
// 在 JavaScript 中直接操作 DOM
const loadImage = () => {
  img.src = src  // ❌ 這會被 Vue 的重新渲染覆蓋！
}
</script>
```

#### 問題流程

1. **初始狀態**:
   ```html
   <img data-src="image.jpg" alt="..." />
   <!-- 瀏覽器自動設定 src="" -->
   ```

2. **JavaScript 設定 src**:
   ```javascript
   img.src = "https://example.com/image.jpg"
   ```
   - ✅ 圖片開始載入
   - ✅ 圖片顯示正常

3. **使用者捲動，觸發 Vue 重新渲染**:
   - Vue 檢查模板：`<img :data-src="src" />`
   - Vue 發現模板中沒有 `:src` 綁定
   - Vue 更新 DOM，重置 `src` 屬性
   - ❌ `src` 變回空字串或被移除
   - ❌ 圖片顯示失效圖示

4. **停止捲動，IntersectionObserver 再次觸發**:
   - JavaScript 再次設定 `img.src`
   - ✅ 圖片重新載入

### 為什麼只在生產環境出現？

| 環境 | Vue 行為 | DOM 更新頻率 | 結果 |
|------|---------|-------------|------|
| **開發環境** | HMR 保持狀態 | 較少完全重新渲染 | ✅ 正常 |
| **生產環境** | 積極的 Virtual DOM diff | 頻繁的 DOM 更新 | ❌ 失效 |

### 為什麼 IntersectionObserver 無法解決？

IntersectionObserver 只能監聽元素的可見性，**無法防止 Vue 重新渲染時覆蓋 DOM 屬性**。

## 修正方案（完全重構）

### 核心概念：將 `src` 納入 Vue 響應式系統

**正確的實作方式**:
```vue
<template>
  <!-- ✅ 使用響應式的 imageSrc -->
  <img ref="imageRef" :src="imageSrc" :data-src="src" :alt="alt" />
</template>

<script setup>
// ✅ 使用 Vue ref 管理 src
const imageSrc = ref(TRANSPARENT_PLACEHOLDER)

// ✅ Vue 會自動同步 ref 的變化到 DOM
const setImageSrc = () => {
  imageSrc.value = props.src  // Vue 負責更新 DOM
}
</script>
```

### 完整修正

#### 1. 使用透明 Placeholder

```javascript
// 避免顯示失效圖示的透明 1x1 SVG
const TRANSPARENT_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'
const imageSrc = ref(TRANSPARENT_PLACEHOLDER)
```

**優點**:
- 不會顯示失效圖示
- 不產生額外網路請求
- 提供有效的 `src` 值

#### 2. 響應式 Src 管理

```javascript
const imageRef = ref(null)
const isLoaded = ref(false)
const imageSrc = ref(TRANSPARENT_PLACEHOLDER) // 關鍵！
let hasSetSrc = false // 防止重複設定

const setImageSrc = () => {
  if (hasSetSrc) return

  hasSetSrc = true
  imageSrc.value = props.src  // ✅ Vue 響應式更新

  // 檢查快取
  if (imageRef.value?.complete && imageRef.value?.naturalWidth > 0) {
    isLoaded.value = true
  }
}
```

**關鍵點**:
- `imageSrc.value` 的變化會自動同步到 DOM
- 即使 Vue 重新渲染，`:src` 綁定也會保持正確值
- 不會被重新渲染覆蓋

#### 3. 改進 IntersectionObserver

```javascript
onMounted(() => {
  // 預載入或高優先級：立即載入
  if (shouldPreload.value) {
    setImageSrc()
    return
  }

  // 否則使用 Observer
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          isVisible.value = entry.isIntersecting

          // 只設定一次
          if (entry.isIntersecting && !hasSetSrc) {
            setImageSrc()
          }
        })
      },
      {
        rootMargin: '200px', // 提前載入，避免閃現
        threshold: 0.01,
      }
    )

    observer.observe(imageRef.value)
  } else {
    setImageSrc()
  }
})
```

**改進**:
- `rootMargin: '200px'` - 提前載入，避免捲動時才載入
- `hasSetSrc` - 確保只設定一次
- 載入完成後 disconnect

#### 4. 事件處理

```javascript
const handleLoad = event => {
  isLoaded.value = true
  recordImageLoadComplete()

  // 載入完成，移除 observer
  if (observer) {
    observer.disconnect()
    observer = null
  }

  emit('load', event)
}

const handleError = event => {
  console.warn('圖片載入失敗:', props.src)
  recordImageLoadComplete()
  // 錯誤時不 disconnect，保留重試機會
  emit('error', event)
}
```

#### 5. CSS 優化

```css
.optimized-image {
  width: 100%;
  height: auto;
  transition: opacity 0.3s ease;
  /* 預設顯示，避免閃爍 */
  opacity: 1;
  min-height: 50px;
  background-color: var(--placeholder-color, #f0f0f0);
}

/* 載入中 */
.optimized-image.loading {
  opacity: 0.5;
}

/* 載入完成 */
.optimized-image.loaded {
  opacity: 1;
  background-color: transparent;
}
```

## 修改的檔案

### 1. [app/components/OptimizedImage.vue](../app/components/OptimizedImage.vue)

**主要變更**:
- ✅ 新增 `:src="imageSrc"` 綁定
- ✅ 使用 `imageSrc` ref 管理 src
- ✅ 新增 `TRANSPARENT_PLACEHOLDER`
- ✅ 移除對 `useLazyImage` 的依賴
- ✅ 所有邏輯整合到元件內
- ✅ 改進 CSS 透明度設定

### 2. [composables/useLazyImage.js](../composables/useLazyImage.js)

**狀態**: 保留但不再使用（可選擇性移除）

此 composable 的問題在於直接操作 DOM，不符合 Vue 的響應式原則。新的實作完全在 OptimizedImage.vue 內部處理。

## 技術原理總結

### 問題根源

```
直接操作 DOM → Vue 重新渲染 → 覆蓋 DOM 屬性 → 圖片失效
```

### 解決方案

```
響應式 ref → Vue 管理更新 → DOM 自動同步 → 圖片正常
```

### 關鍵差異

| 方式 | DOM 操作 | Vue 重新渲染時 | 結果 |
|------|---------|---------------|------|
| **錯誤** | `img.src = "..."` | 被覆蓋 | ❌ 失效 |
| **正確** | `:src="imageSrc"` | 保持正確 | ✅ 正常 |

## 測試驗證

### 建置測試
```bash
npm run build
```
✅ 建置成功

### 需要測試的場景

1. **基本捲動測試**
   - 在文章頁面中來回捲動
   - 確認圖片不會消失或顯示失效圖示

2. **快速捲動測試**
   - 快速捲動文章頁面
   - 確認圖片載入流暢

3. **向上捲動測試**
   - 捲動到文章底部後向上捲動
   - 確認圖片保持顯示

4. **生產環境測試**
   - 部署到 Cloudflare Pages
   - 實際環境驗證

## 預期效果

修正後應達到：

- ✅ 圖片在捲動時保持顯示
- ✅ 不顯示連結失效圖示
- ✅ 已載入的圖片不會重複載入
- ✅ 向上捲動時圖片正常顯示
- ✅ 生產環境和開發環境行為一致
- ✅ 圖片載入流暢，無閃爍

## 經驗教訓

### 核心教訓

**在 Vue 應用中，永遠不要直接操作 DOM 屬性，應該使用響應式狀態**。

### 最佳實踐

1. **使用 Vue 的響應式系統**
   - 使用 `ref` 管理動態屬性
   - 使用 `:attribute` 綁定而非直接操作 DOM

2. **理解框架行為**
   - Vue 會在重新渲染時同步虛擬 DOM 到真實 DOM
   - 未綁定的屬性可能被重置

3. **開發環境 ≠ 生產環境**
   - 始終在生產環境驗證
   - 開發環境的行為可能不代表實際情況

4. **IntersectionObserver 的限制**
   - 只能監聽可見性
   - 無法防止框架的 DOM 更新

## 相關文件

- [OptimizedImage 元件](../app/components/OptimizedImage.vue)
- [ArticleImg 元件](../app/components/article/ArticleImg.vue)
- [文章頁面](../app/pages/article/[id].vue)
- [第一版修正文檔](./IMAGE_LOADING_FIX.md) (已過時)

---

**修正日期**: 2025-11-01
**修正人員**: Claude Code
**問題嚴重程度**: 高（影響使用者體驗）
**修正版本**: V2（完全重構）
**修正狀態**: 已修正，待生產環境驗證
