# 文章頁面圖片載入問題修正文檔（第二版）

## 問題描述

### 症狀（第一次修正後）
- 圖片在捲動時不會完全消失，但會顯示**連結失效圖示**
- 只有捲動停止時才會顯示正確圖片
- 根本問題：`<img>` 的 `src` 屬性沒有被正確管理
- **重要**: 問題只在生產環境（build 後）出現，開發環境（dev）正常

### 影響範圍
- 文章頁面 ([pages/article/[id].vue](../app/pages/article/[id].vue))
- 所有使用 OptimizedImage 元件的圖片
- 使用 ArticleImg 元件的文章內容圖片

## 問題根源分析（深層原因）

### 根本問題：直接操作 DOM 而非使用響應式狀態

**原始架構的問題**:
```vue
<template>
  <img ref="imageRef" :data-src="src" :alt="alt" />
  <!-- 注意：沒有 :src 屬性！ -->
</template>

<script>
// 在 JavaScript 中直接操作 DOM
img.src = src  // ❌ 這會被 Vue 的重新渲染覆蓋
</script>
```

### 1. `<img>` 標籤沒有 `src` 屬性的問題

當 `<img>` 標籤沒有 `src` 屬性時：
```html
<img data-src="image.jpg" alt="..." />
```

瀏覽器會自動設定一個**空的 `src=""`**，這會：
- 嘗試載入當前頁面作為圖片
- 顯示**連結失效圖示**（❌）
- 即使後來用 JavaScript 設定 `img.src`，在 Vue 重新渲染時也會被重置

### 2. 直接操作 DOM vs Vue 響應式系統衝突

**問題流程**:
1. JavaScript 設定 `img.src = "image.jpg"` ✅ 圖片開始載入
2. 使用者捲動，觸發 Vue 重新渲染
3. Vue 重新渲染時，發現模板中沒有 `:src` 綁定
4. DOM 被重置，`src` 屬性消失或變成空字串
5. 圖片顯示失效圖示 ❌

### 3. IntersectionObserver 的時機問題

即使使用 IntersectionObserver，在生產環境中：
- Vue 的元件優化會頻繁重新渲染
- 直接設定的 `img.src` 會在重新渲染時丟失
- Observer 無法防止 Vue 的 DOM 更新

### 4. 生產環境 vs 開發環境的差異

**為什麼開發環境正常？**
- 開發環境：Vue 的 Hot Module Replacement (HMR) 會保持 DOM 狀態
- 元件更新較溫和，較少完全重新渲染

**為什麼生產環境有問題？**
- 生產環境：Vue 做了更積極的優化和 Virtual DOM diff
- 頻繁的重新渲染會重置未綁定的 DOM 屬性
- 直接操作的 `img.src` 會被覆蓋

## 修正方案（第二版 - 完全重構）

### 核心概念：使用 Vue 響應式狀態管理 src

**關鍵改變**:
```vue
<template>
  <!-- ✅ 使用響應式的 imageSrc -->
  <img ref="imageRef" :src="imageSrc" :alt="alt" />
</template>

<script>
const imageSrc = ref(TRANSPARENT_PLACEHOLDER) // 響應式 ref

// 當需要載入圖片時，更新 ref
const setImageSrc = () => {
  imageSrc.value = props.src  // ✅ Vue 會自動同步到 DOM
}
</script>
```

### 1. 完全重構 OptimizedImage.vue

**移除對 useLazyImage 的依賴**，直接在元件內管理所有邏輯：

#### a) 使用透明 placeholder 避免失效圖示

```javascript
// 使用透明的 1x1 像素 SVG，避免顯示失效圖示
const TRANSPARENT_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'
const imageSrc = ref(TRANSPARENT_PLACEHOLDER)
```

**為什麼使用 placeholder**:
- 避免瀏覽器顯示失效圖示
- 提供有效的 `src` 值
- 不會產生額外的網路請求

#### b) 響應式 src 管理

```javascript
const imageRef = ref(null)
const isLoaded = ref(false)
const isVisible = ref(false)
const imageSrc = ref(TRANSPARENT_PLACEHOLDER) // 關鍵：響應式 ref
let observer = null
let hasSetSrc = false // 追蹤是否已設定 src

// 設定圖片 src（只會執行一次）
const setImageSrc = () => {
  if (hasSetSrc) return

  hasSetSrc = true
  imageSrc.value = props.src  // ✅ Vue 會同步到 DOM
  recordImageLoadStart()

  // 檢查圖片是否已經從快取載入完成
  if (imageRef.value?.complete && imageRef.value?.naturalWidth > 0) {
    isLoaded.value = true
    recordImageLoadComplete()
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }
}
```

#### c) 改進 IntersectionObserver 邏輯

```javascript
onMounted(() => {
  // 如果是預載入或高優先級，立即設定 src
  if (shouldPreload.value) {
    setImageSrc()
    return
  }

  // 否則使用 IntersectionObserver
  if (!imageRef.value) return

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          isVisible.value = entry.isIntersecting

          // 當圖片進入視窗時，設定 src（只會執行一次）
          if (entry.isIntersecting && !hasSetSrc) {
            setImageSrc()
          }
        })
      },
      {
        rootMargin: '200px', // 提前 200px 開始載入，避免捲動時才載入
        threshold: 0.01,
      }
    )

    observer.observe(imageRef.value)
  } else {
    // Fallback: 立即載入
    setImageSrc()
  }
})
```

**關鍵改進**:
- `rootMargin: '200px'` - 提前 200px 開始載入，避免捲動時閃現
- 使用 `hasSetSrc` 確保只設定一次
- 載入完成後才 disconnect observer

#### d) 改進 handleLoad 事件處理

```javascript
const handleLoad = event => {
  isLoaded.value = true
  recordImageLoadComplete()

  // 載入完成後立即 disconnect observer，避免重複觸發
  if (observer) {
    observer.disconnect()
    observer = null
  }

  emit('load', event)
}

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
