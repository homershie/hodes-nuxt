<template>
  <ul class="article-ul">
    <slot />
  </ul>
  
</template>

<script setup>
</script>

<style scoped>
.article-ul {
  padding-left: 20px;
  margin: 40px 0;
}
.article-ul :slotted(li) {
  margin-bottom: 10px;
  font-size: 1.1rem;
  font-weight: normal;
  line-height: 1.6;
  position: relative;
  list-style: none;
  padding-left: 18px;
}
.article-ul :slotted(li)::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--maincolor);
}
</style>


