<template>
  <!-- 載入進度顯示 -->
  <div v-if="isPreloading" class="loading-progress">
    <div class="progress-bar">
      <div class="progress" :style="{ width: `${loadingProgress}%` }"></div>
    </div>
    <div class="progress-text">載入中... {{ loadingProgress }}%</div>
  </div>
  <div v-else>
    <slot />
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.loading-progress {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.progress-bar {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress {
  height: 100%;
  background: var(--maincolor);
  transition: width 0.3s ease;
}

.progress-text {
  color: #fff;
  font-size: 14px;
}
</style>
