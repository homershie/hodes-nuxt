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
  opacity: 1;
  transition: opacity 0.3s ease;
}

.optimized-image.loaded {
  opacity: 1;
}
</style>
