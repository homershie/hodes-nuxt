<template>
  <img
    ref="imageRef"
    :data-src="src"
    :src="imageSrc"
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
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
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
const isVisible = ref(false)
// 使用透明的 1x1 像素 placeholder，避免顯示失效圖示
const TRANSPARENT_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'
const imageSrc = ref(TRANSPARENT_PLACEHOLDER) // 響應式的 src 屬性，一旦設定就不會清空
let observer = null
let hasSetSrc = false // 追蹤是否已經設定過 src

const { recordImageLoadStart, recordImageLoadComplete } = usePerformanceMonitor()

// 判斷是否應該立即載入（高優先級或預載入）
const shouldPreload = computed(() => props.preload || props.priority === 'high')

// 處理載入完成
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

// 處理載入錯誤
const handleError = event => {
  console.warn('圖片載入失敗:', props.src)
  recordImageLoadComplete()
  // 錯誤時不 disconnect，保留重試機會
  emit('error', event)
}

// 設定圖片 src（只會執行一次）
const setImageSrc = () => {
  if (hasSetSrc) return

  hasSetSrc = true
  imageSrc.value = props.src
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

// 監聽可見性變化
watch(isVisible, visible => {
  if (visible && !hasSetSrc && !shouldPreload.value) {
    setImageSrc()
  }
})

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

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
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
