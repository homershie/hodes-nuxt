# 文章頁面圖片載入問題修正文檔

## 問題描述

### 症狀
- 文章頁面的圖片在捲動時會消失
- 只有捲動停止時才會顯示正確圖片
- 往上捲動時，已經載入過的圖片會重新讀取
- **重要**: 問題只在生產環境（build 後）出現，開發環境（dev）正常

### 影響範圍
- 文章頁面 ([pages/article/[id].vue](../app/pages/article/[id].vue))
- 所有使用 OptimizedImage 元件的圖片
- 使用 ArticleImg 元件的文章內容圖片

## 問題根源分析

### 1. IntersectionObserver 過早 disconnect

**位置**: [composables/useLazyImage.js:52-54](../composables/useLazyImage.js#L52-L54)

**原始問題**:
```javascript
if (entry.isIntersecting && !isLoaded.value) {
  isVisible.value = true
  loadImage()
  // 問題：立即 disconnect，導致捲動時無法正確追蹤
  if (observer) {
    observer.disconnect()
  }
}
```

當圖片進入視窗時，Observer 會立即 `disconnect()`。在生產環境中，Vue 的元件優化可能導致：
- 元件重新渲染時，Observer 已經被移除
- 捲動時圖片重新進入視窗，但沒有 Observer 監聽
- 已載入的圖片失去追蹤，導致重複載入

### 2. 缺少載入狀態追蹤

**問題**: 沒有專門的變數追蹤圖片是否「已開始載入」，只依賴 `isLoaded` 和 `isVisible`，導致：
- 圖片載入中時可能被重複觸發
- 無法區分「未載入」和「載入中」狀態

### 3. CSS 透明度設定不當

**位置**: [app/components/OptimizedImage.vue:96](../app/components/OptimizedImage.vue#L96)

**原始問題**:
```css
.optimized-image {
  opacity: 0;  /* 預設完全透明 */
}
```

預設 `opacity: 0` 導致圖片在載入過程中完全不可見，加劇閃爍問題。

### 4. 生產環境 vs 開發環境的差異

**為什麼開發環境正常？**
- 開發環境：Vue 的 Hot Module Replacement (HMR) 會保持元件狀態
- 生產環境：Vue 做了更積極的優化和元件重用，可能重新建立元件實例

**為什麼生產環境有問題？**
- 元件重新建立時，Observable 的 disconnect 導致失去追蹤
- 圖片的 `src` 屬性可能在重新渲染時被重置
- 沒有持久化的載入狀態追蹤機制

## 修正方案

### 1. 改進 useLazyImage.js

**修正內容**:

#### a) 新增 `hasStartedLoading` 狀態
```javascript
let hasStartedLoading = false // 追蹤是否已開始載入
```

#### b) 改進 loadImage 函數
```javascript
const loadImage = () => {
  if (!imageRef.value || hasStartedLoading) return

  const img = imageRef.value
  const src = img.dataset.src || img.getAttribute('data-src')

  if (src) {
    // 檢查圖片是否已經有 src（避免重複設定）
    const currentSrc = img.getAttribute('src')
    if (currentSrc && currentSrc === src) {
      // 圖片已經開始載入，只需要檢查是否已完成
      if (img.complete) {
        isLoaded.value = true
        hasStartedLoading = true
        if (observer) {
          observer.disconnect()
          observer = null
        }
      }
      return
    }

    // 標記已開始載入，避免重複觸發
    hasStartedLoading = true

    img.src = src
    img.onload = () => {
      isLoaded.value = true
      img.removeAttribute('data-src')
      if (observer) {
        observer.disconnect()
        observer = null
      }
    }
    img.onerror = () => {
      // 載入失敗時重置狀態，允許重試
      hasStartedLoading = false
      console.warn('圖片載入失敗:', src)
    }
  }
}
```

#### c) 改進 Observer 邏輯
```javascript
observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      // 持續追蹤可見性
      isVisible.value = entry.isIntersecting

      // 只有在圖片進入視窗且尚未開始載入時才觸發
      if (entry.isIntersecting && !hasStartedLoading) {
        loadImage()
      }
    })
  },
  {
    rootMargin: '50px',
    threshold: 0.01,
  }
)
```

**關鍵改進**:
- 只在圖片完全載入後才 disconnect observer
- 使用 `hasStartedLoading` 避免重複載入
- 持續追蹤 `isVisible` 狀態

#### d) 檢查快取圖片
```javascript
onMounted(() => {
  if (!imageRef.value) return

  // 檢查圖片是否已經載入完成（例如從快取載入）
  const img = imageRef.value
  if (img.complete && img.src && img.src !== '') {
    isLoaded.value = true
    hasStartedLoading = true
    return
  }
  // ...
})
```

### 2. 改進 OptimizedImage.vue

**修正內容**:

#### a) 改進 CSS 透明度
```css
.optimized-image {
  /* 修正：預設顯示圖片，避免捲動時閃爍 */
  opacity: 1;
  transition: opacity 0.3s ease;
  min-height: 50px;
  background-color: var(--placeholder-color, #f0f0f0);
}

/* 當圖片可見但未載入時，顯示低透明度 */
.optimized-image.loading {
  opacity: 0.5;
}

/* 圖片載入完成時，確保完全顯示 */
.optimized-image.loaded {
  opacity: 1;
  background-color: transparent;
}
```

**關鍵改進**:
- 預設 `opacity: 1`，避免圖片完全消失
- 載入中顯示 `opacity: 0.5`，提供視覺反饋
- 移除載入動畫，避免干擾捲動體驗

#### b) 改進預載入邏輯
```javascript
onMounted(() => {
  if (shouldPreload.value && imageRef.value) {
    const img = imageRef.value

    // 檢查是否已經有 src，避免重複設定
    if (!img.src || img.src === '') {
      img.src = props.src
      img.removeAttribute('data-src')
      recordImageLoadStart()

      // 檢查圖片是否已經從快取載入完成
      if (img.complete && img.naturalWidth > 0) {
        isLoaded.value = true
        recordImageLoadComplete()
      }
    } else if (img.complete && img.naturalWidth > 0) {
      // 圖片已經載入完成（例如從快取）
      isLoaded.value = true
    }
  }
})
```

## 測試驗證

### 建置測試
```bash
npm run build
```

建置成功，沒有錯誤。

### 需要測試的場景

1. **基本捲動測試**
   - 在文章頁面中來回捲動
   - 確認圖片不會消失
   - 確認已載入的圖片不會重複載入

2. **快速捲動測試**
   - 快速捲動文章頁面
   - 確認圖片載入流暢，沒有閃爍

3. **向上捲動測試**
   - 捲動到文章底部
   - 向上捲動回到頂部
   - 確認圖片保持顯示，不重新載入

4. **生產環境測試**
   - 部署到 Cloudflare Pages
   - 在實際生產環境測試所有場景

## 修正文件摘要

### 修改的檔案
1. [composables/useLazyImage.js](../composables/useLazyImage.js)
   - 新增 `hasStartedLoading` 狀態追蹤
   - 改進 `loadImage()` 函數，避免重複載入
   - 改進 IntersectionObserver 邏輯
   - 新增快取圖片檢查

2. [app/components/OptimizedImage.vue](../app/components/OptimizedImage.vue)
   - 修正 CSS 透明度設定
   - 改進預載入邏輯
   - 新增快取圖片檢查

### 核心概念

**關鍵技術點**:
1. **狀態持久化**: 使用 `hasStartedLoading` 追蹤載入狀態，避免重複載入
2. **Observer 管理**: 只在圖片完全載入後才 disconnect，確保狀態追蹤
3. **視覺優化**: 預設顯示圖片（opacity: 1），避免閃爍
4. **快取處理**: 檢查圖片是否已從快取載入，避免重複請求

## 預期效果

修正後應達到以下效果：

1. ✅ 圖片在捲動時保持顯示，不會消失
2. ✅ 已載入的圖片不會重複載入
3. ✅ 向上捲動時圖片正常顯示
4. ✅ 生產環境和開發環境行為一致
5. ✅ 圖片載入流暢，沒有閃爍

## 後續建議

1. **監控效能**: 使用 Performance Monitor 追蹤圖片載入時間
2. **快取策略**: 考慮使用 Service Worker 進行圖片快取
3. **預載入優化**: 對首屏圖片使用 `preload` 或 `priority="high"`
4. **響應式圖片**: 考慮使用 `srcset` 和 `sizes` 屬性提供不同尺寸圖片

## 相關文件

- [OptimizedImage 元件](../app/components/OptimizedImage.vue)
- [useLazyImage Composable](../composables/useLazyImage.js)
- [ArticleImg 元件](../app/components/article/ArticleImg.vue)
- [文章頁面](../app/pages/article/[id].vue)

---

**修正日期**: 2025-11-01
**修正人員**: Claude Code
**問題嚴重程度**: 高（影響使用者體驗）
**修正狀態**: 已修正，待生產環境驗證
