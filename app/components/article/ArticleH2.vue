<template>
  <h2 class="article-h2">
    <slot />
  </h2>
  
</template>

<script setup>
</script>

<style scoped>
.article-h2 {
  font-size: 2rem;
  margin: 40px 0 20px 0;
  color: var(--maincolor);
}

@media (max-width: 768px) {
  .article-h2 {
    font-size: 1.8rem;
  }
}
</style>

