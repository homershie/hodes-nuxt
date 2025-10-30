<template>
  <ol class="article-ol">
    <slot />
  </ol>
</template>

<script setup></script>

<style scoped>
.article-ol {
  counter-reset: li;
  padding-left: 20px;
  margin: 40px 0;
}
.article-ol :slotted(li) {
  margin-bottom: 10px;
  font-size: 1.1rem;
  font-weight: normal;
  line-height: 1.6;
  position: relative;
  list-style: none;
  padding-left: 22px;
}
.article-ol :slotted(li)::before {
  counter-increment: li;
  content: counter(li) '.';
  position: absolute;
  left: 0;
  color: var(--maincolor);
}
</style>
