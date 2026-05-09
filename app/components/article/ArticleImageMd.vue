<template>
  <div class="article-image-size article-image-md">
    <slot />
  </div>
</template>

<script setup></script>

<style scoped>
.article-image-md {
  width: 60%;
  margin: 40px auto;
}

.article-image-md :deep(.article-img) {
  width: 100%;
}

@media (max-width: 768px) {
  .article-image-md {
    width: 90%;
  }
}
</style>
