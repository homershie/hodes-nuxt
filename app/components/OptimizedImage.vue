<template>
  <img
    ref="imageRef"
    :data-src="src"
    :alt="alt"
    :class="['optimized-image', { loaded: isLoaded, loading: isVisible && !isLoaded }]"
    :style="{
      aspectRatio: aspectRatio,
      backgroundColor: placeholderColor,
    }"
    @load="handleLoad"
    @error="handleError"
  />
</template>

<script setup>
import { onMounted, watch, computed } from 'vue'
import { useLazyImage } from '@composables/useLazyImage.js'
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

const { imageRef, isLoaded, isVisible } = useLazyImage()
const { recordImageLoadStart, recordImageLoadComplete } = usePerformanceMonitor()

// 判斷是否應該立即載入（高優先級或預載入）
const shouldPreload = computed(() => props.preload || props.priority === 'high')

// 處理載入完成
const handleLoad = event => {
  isLoaded.value = true
  recordImageLoadComplete()
  emit('load', event)
}

// 處理載入錯誤
const handleError = event => {
  recordImageLoadComplete()
  emit('error', event)
}

// 監聽可見性變化（但 useLazyImage 已經處理載入邏輯，這裡只記錄效能）
watch(isVisible, visible => {
  if (visible && !isLoaded.value) {
    recordImageLoadStart()
  }
})

// 如果設定為預載入或高優先級，立即載入
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
</script>

<style scoped>
.optimized-image {
  width: 100%;
  height: auto;
  transition: opacity 0.3s ease;
  /* 修正：預設顯示圖片，避免捲動時閃爍 */
  opacity: 1;
  /* 確保圖片在載入過程中不會完全消失 */
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

.optimized-image.error {
  opacity: 0.3;
  filter: grayscale(100%);
}

/* 載入動畫 - 移除，避免干擾捲動體驗 */
/* 如果需要載入指示器，可以在外層容器添加 */
</style>
