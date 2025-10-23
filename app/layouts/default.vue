<template>
  <div id="app">
    <!-- 全局 Loading -->
    <PreLoader @loaded="showLoader = false" />

    <!-- 全域閱讀進度條 -->
    <ReadingProgress />

    <!-- Navigation -->
    <AppNavbar />

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <AppFooter />

    <!-- 全域回到頂部按鈕 -->
    <BackToTop />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCustomCursor } from '@composables/useCustomCursor'
import { useHoverAnimation } from '@composables/useHoverAnimation'
import { useImageCache } from '@composables/useImageCache'

const showLoader = ref(true)
const { handleCursorHover } = useCustomCursor()
const { handleHoverAnimation } = useHoverAnimation()
const { startCacheCleanup, stopCacheCleanup } = useImageCache()

onMounted(() => {
  // 初始化游標懸停效果
  const cursorElements = document.querySelectorAll('a, .cursor-pointer')
  handleCursorHover(cursorElements)

  // 初始化滑鼠移動動畫效果
  const hoverElements = document.querySelectorAll('.hover-this')
  handleHoverAnimation(hoverElements)

  // 初始化快取清理
  startCacheCleanup()
})

onUnmounted(() => {
  stopCacheCleanup()
})
</script>

<style lang="scss" scoped>
/* Global styles will be imported from main.js */
#app {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

/* 確保 body 沒有預設的 margin/padding 影響 navbar */
:global(body) {
  margin: 0;
  padding: 0;
  /* 移除 padding-top，讓 navbar 完全固定在最上方 */
}
</style>
