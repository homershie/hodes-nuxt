<template>
  <div class="article-image-size article-image-sm">
    <slot />
  </div>
</template>

<script setup></script>

<style scoped>
.article-image-sm {
  width: 30%;
  margin: 40px auto;
}

.article-image-sm :deep(.article-img) {
  width: 100%;
}

@media (max-width: 768px) {
  .article-image-sm {
    width: 80%;
  }
}
</style>
