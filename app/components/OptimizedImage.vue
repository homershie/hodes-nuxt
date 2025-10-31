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
import { onMounted, watch } from 'vue'
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
  if (props.preload || props.priority === 'high') {
    // 設定實際的 src 而不是 data-src
    if (imageRef.value) {
      imageRef.value.src = props.src
      // 移除 data-src，因為已經設定 src
      imageRef.value.removeAttribute('data-src')
      recordImageLoadStart()
      // 對於預載入的圖片，也需要檢查是否已經載入完成
      if (imageRef.value.complete) {
        isLoaded.value = true
      }
    }
  }
})
</script>

<style scoped>
.optimized-image {
  width: 100%;
  height: auto;
  transition: opacity 0.3s ease;
  opacity: 0;
  /* 確保圖片在載入過程中不會完全消失 */
  min-height: 50px;
  background-color: var(--placeholder-color, #f0f0f0);
}

/* 當圖片可見但未載入時，顯示低透明度避免完全消失 */
.optimized-image.loading {
  opacity: 0.3;
}

.optimized-image.loaded {
  opacity: 1;
}

.optimized-image.error {
  opacity: 0.3;
  filter: grayscale(100%);
}

/* 載入動畫 */
.optimized-image.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--maincolor);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
