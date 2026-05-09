<template>
  <div class="article-image-size article-image-lg">
    <slot />
  </div>
</template>

<script setup></script>

<style scoped>
.article-image-lg {
  width: 100%;
  margin: 40px auto;
}

.article-image-lg :deep(.article-img) {
  width: 100%;
}
</style>
