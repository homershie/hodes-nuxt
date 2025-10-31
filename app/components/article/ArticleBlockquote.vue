<template>
  <blockquote class="article-blockquote">
    <slot />
  </blockquote>
</template>

<script setup></script>

<style scoped>
.article-blockquote {
  margin: 40px 0;
  padding-left: 20px;
  border-left: 4px solid var(--maincolor);
  font-style: italic;
  color: #555;
  font-size: 1.1rem;
  line-height: 1.6;
}
.article-blockquote em {
  font-weight: bold;
}
</style>
