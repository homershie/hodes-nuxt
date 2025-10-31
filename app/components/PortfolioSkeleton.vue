<template>
  <div class="skeleton-container">
    <div class="row">
      <div
        v-for="i in count"
        :key="i"
        class="col-lg-4 skeleton-item"
        :style="{ animationDelay: `${i * 0.1}s` }"
      >
        <div class="skeleton-image"></div>
        <div class="skeleton-title"></div>
        <div class="skeleton-category"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 3,
  },
})
</script>

<style scoped>
.skeleton-container {
  width: 100%;
}

.skeleton-item {
  animation: pulse 1.5s ease-in-out infinite;
  margin-bottom: 2rem;
}

.skeleton-image {
  width: 100%;
  height: 250px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.skeleton-title {
  width: 70%;
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.skeleton-category {
  width: 40%;
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 響應式：平板和手機顯示為單欄 */
@media (max-width: 991px) {
  .skeleton-item {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 768px) {
  .skeleton-item {
    margin-bottom: 1rem;
  }

  .skeleton-image {
    height: 200px;
  }
}
</style>
