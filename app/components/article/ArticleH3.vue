<template>
  <h3 class="article-h3">
    <slot />
  </h3>
  
</template>

<script setup>
</script>

<style scoped>
.article-h3 {
  font-size: 1.5rem;
  margin: 40px 0 20px 0;
  text-decoration: underline;
  text-decoration-color: var(--maincolor);
  text-decoration-thickness: 2px;
  text-underline-offset: 10px;
}

@media (max-width: 768px) {
  .article-h3 {
    font-size: 1.4rem;
  }
}
</style>


