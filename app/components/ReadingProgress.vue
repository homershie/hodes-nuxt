<template>
  <div v-if="shouldShowProgress" class="reading-progress">
    <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useScroll } from '@vueuse/core'

const { y } = useScroll(window)
const shouldShowProgress = ref(false)

const progress = computed(() => {
  const scrollTop = y.value
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  return docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
})

// 檢查頁面是否足夠長以及滾動位置
const checkProgressVisibility = () => {
  const docHeight = document.documentElement.scrollHeight
  const windowHeight = window.innerHeight
  const scrollTop = y.value

  // 只有當頁面高度超過視窗高度的 1.5 倍且滾動超過 100px 時才顯示進度條
  const isPageLongEnough = docHeight > windowHeight * 1.5
  const hasScrolledEnough = scrollTop > 100

  shouldShowProgress.value = isPageLongEnough && hasScrolledEnough
}

// 監聽滾動位置變化
watch(y, checkProgressVisibility)

// 組件掛載時檢查一次
onMounted(() => {
  checkProgressVisibility()
})
</script>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 9999;
}

.progress-bar {
  height: 100%;
  background: var(--maincolor);
  transition: width 0.2s ease;
}
</style>
