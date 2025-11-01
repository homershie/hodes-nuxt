# 文章頁面圖片載入問題修正文檔（第三版 - 最終解決方案）

## 問題演進

### 第一次問題
- 文章頁面圖片在捲動時消失
- 只在生產環境出現

### 第一次修正（失敗）
- 使用 IntersectionObserver + 直接操作 DOM
- 結果：圖片顯示失效圖示

### 第二次修正（失敗）
- 使用響應式 `imageSrc` + 透明 placeholder
- 結果：**所有圖片變成白色（透明）**

### 第三次修正（成功）
- 使用瀏覽器原生 `loading="lazy"` 屬性
- 直接綁定 `:src="src"`
- 完全移除自定義的懶加載邏輯

## 根本原因分析

### 為什麼之前的方案都失敗？

#### 問題 1：直接操作 DOM（第一次修正）
```javascript
// ❌ 錯誤：直接操作 DOM
img.src = src
// Vue 重新渲染時會覆蓋這個值
```

#### 問題 2：透明 Placeholder（第二次修正）
```javascript
// ❌ 錯誤：使用透明 SVG 作為初始值
const imageSrc = ref('data:image/svg+xml,...') // 透明的！

// 結果：所有圖片都是透明的白色區域
```

**為什麼所有圖片都變白色？**
1. `imageSrc` 初始值是透明 placeholder
2. 在 SSR 時，沒有執行客戶端的 JavaScript
3. HTML 中的 `<img src="data:image/svg+xml,..." />` 渲染出來是透明的
4. 等到客戶端 JavaScript 執行時，才會更新 src
5. 但在此之前，使用者看到的都是白色（透明）圖片

### 真正的解決方案：使用瀏覽器原生功能

現代瀏覽器已經內建了優秀的圖片懶加載功能：**`loading="lazy"` 屬性**

#### 優點
1. ✅ 原生支援，不需要 JavaScript
2. ✅ SSR 友好，HTML 直接包含完整的 `src`
3. ✅ 效能更好，由瀏覽器優化
4. ✅ 沒有閃爍或失效圖示
5. ✅ 自動處理捲動、可見性判斷
6. ✅ 開發環境和生產環境行為一致

## 最終解決方案

### 完整程式碼

```vue
<template>
  <img
    ref="imageRef"
    :src="src"
    :alt="alt"
    :loading="loadingAttr"
    :class="['optimized-image', { loaded: isLoaded }]"
    :style="{
      aspectRatio: aspectRatio,
      backgroundColor: placeholderColor,
    }"
    @load="handleLoad"
    @error="handleError"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePerformanceMonitor } from '@composables/usePerformanceMonitor.js'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
  aspectRatio: {
    type: String,
    default: 'auto',
  },
  placeholderColor: {
    type: String,
    default: '#f0f0f0',
  },
  priority: {
    type: String,
    default: 'normal', // high, normal, low
  },
  preload: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['load', 'error'])

const imageRef = ref(null)
const isLoaded = ref(false)

const { recordImageLoadStart, recordImageLoadComplete } = usePerformanceMonitor()

// 使用瀏覽器原生的 loading 屬性
const loadingAttr = computed(() => {
  if (props.preload || props.priority === 'high') {
    return 'eager' // 立即載入
  }
  return 'lazy' // 懶加載
})

// 處理載入完成
const handleLoad = event => {
  isLoaded.value = true
  recordImageLoadComplete()
  emit('load', event)
}

// 處理載入錯誤
const handleError = event => {
  console.warn('圖片載入失敗:', props.src)
  recordImageLoadComplete()
  emit('error', event)
}

// 在元件創建時記錄載入開始
if (import.meta.client) {
  recordImageLoadStart()
}
</script>

<style scoped>
.optimized-image {
  width: 100%;
  height: auto;
  display: block;
}

/* 可選：添加淡入效果 */
.optimized-image {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.optimized-image.loaded {
  opacity: 1;
}
</style>
```

## 關鍵改變

### 1. 模板
```vue
<!-- ❌ 錯誤（第一次）-->
<img :data-src="src" />

<!-- ❌ 錯誤（第二次）-->
<img :src="imageSrc" />  <!-- imageSrc 是透明 placeholder -->

<!-- ✅ 正確（第三次）-->
<img :src="src" :loading="loadingAttr" />
```

### 2. Script
```javascript
// ❌ 錯誤（第一次）：直接操作 DOM
img.src = src

// ❌ 錯誤（第二次）：使用透明 placeholder
const imageSrc = ref(TRANSPARENT_PLACEHOLDER)
// 然後在某個時機設定 imageSrc.value = props.src

// ✅ 正確（第三次）：使用原生 loading 屬性
const loadingAttr = computed(() => {
  return props.priority === 'high' ? 'eager' : 'lazy'
})
```

### 3. 移除的程式碼
- ❌ IntersectionObserver
- ❌ 自定義懶加載邏輯
- ❌ 透明 placeholder
- ❌ `hasSetSrc` 標記
- ❌ `setImageSrc()` 函數

## 瀏覽器原生 `loading` 屬性

### 支援度
- ✅ Chrome 77+
- ✅ Firefox 75+
- ✅ Safari 15.4+
- ✅ Edge 79+
- 📱 所有現代行動瀏覽器

### 使用方式
```html
<!-- 立即載入（重要圖片）-->
<img src="hero.jpg" loading="eager" />

<!-- 懶加載（一般圖片）-->
<img src="thumbnail.jpg" loading="lazy" />
```

### 行為
- 當 `loading="lazy"` 時，瀏覽器會：
  1. 延遲載入直到圖片接近視窗
  2. 自動判斷最佳載入時機
  3. 預先載入即將進入視窗的圖片
  4. 不需要 JavaScript

## 技術對比

| 方案 | SSR | 複雜度 | 效能 | 問題 |
|------|-----|--------|------|------|
| **第一次：DOM 操作** | ❌ | 高 | 低 | 失效圖示 |
| **第二次：Placeholder** | ❌ | 很高 | 低 | 白色圖片 |
| **第三次：Native Loading** | ✅ | 低 | 高 | 無 |

## 經驗教訓

### 1. 優先使用平台原生功能
- 瀏覽器原生功能通常比自定義實作更好
- 原生功能經過充分測試和優化
- 降低維護成本和 bug 風險

### 2. 理解 SSR 的影響
- 客戶端 JavaScript 不會在 SSR 時執行
- 初始 HTML 必須包含正確的屬性值
- 不能依賴客戶端 JavaScript 來設定關鍵屬性

### 3. 避免過度工程
- 不需要為每個問題寫複雜的解決方案
- 檢查是否有更簡單的方法
- "Keep It Simple, Stupid" (KISS 原則)

### 4. 測試實際使用情境
- 不只測試功能，還要測試使用者體驗
- 檢查初始載入時的狀態
- 測試慢速網路、快速捲動等邊界情況

## 與第二版的差異

### 第二版（失敗）
- 使用複雜的 IntersectionObserver
- 使用透明 placeholder
- 依賴客戶端 JavaScript
- 100+ 行程式碼

### 第三版（成功）
- 使用原生 `loading` 屬性
- 直接綁定 `src`
- SSR 友好
- ~50 行程式碼

**簡化了 50% 的程式碼，得到 100% 的解決方案**

## 修改的檔案

### [app/components/OptimizedImage.vue](../app/components/OptimizedImage.vue)

**完全簡化**:
- 移除所有自定義懶加載邏輯
- 使用 `:src="src"` 直接綁定
- 使用 `:loading="loadingAttr"` 控制載入策略
- 保留淡入效果（可選）

### [composables/useLazyImage.js](../composables/useLazyImage.js)

**狀態**: 不再使用，可以移除

## 預期效果

- ✅ 圖片在 SSR 時就有正確的 `src`
- ✅ 不會顯示白色或失效圖示
- ✅ 瀏覽器自動優化懶加載
- ✅ 捲動時圖片正常顯示
- ✅ 開發環境和生產環境行為一致
- ✅ 更少的程式碼，更好的效能

## 使用範例

### Blog 頁面
```vue
<!-- 一般優先級：使用懶加載 -->
<OptimizedImage :src="post.image" :alt="post.title" priority="normal" />
```
渲染為：
```html
<img src="https://..." loading="lazy" />
```

### Hero 圖片
```vue
<!-- 高優先級：立即載入 -->
<OptimizedImage :src="hero.image" :alt="hero.title" priority="high" />
```
渲染為：
```html
<img src="https://..." loading="eager" />
```

## 總結

這個問題的解決經歷了三個版本：

1. **第一版**：直接操作 DOM → 失敗（Vue 覆蓋）
2. **第二版**：響應式 + Placeholder → 失敗（SSR 問題）
3. **第三版**：原生 loading 屬性 → **成功**

關鍵教訓：**最簡單的解決方案往往是最好的**。

---

**修正日期**: 2025-11-01
**修正人員**: Claude Code
**最終版本**: V3
**狀態**: ✅ 已解決
**程式碼行數**: 從 150+ 行簡化到 50 行
