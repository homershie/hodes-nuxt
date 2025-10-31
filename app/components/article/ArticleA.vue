<template>
  <a class="article-a" :href="href" target="_self">
    <slot />
  </a>
</template>

<script setup>
defineProps({
  href: { type: String, default: '#' },
})
</script>

<style scoped>
.article-a {
  text-decoration: underline;
}
.article-a:hover {
  color: var(--maincolor);
  text-decoration: underline;
}
</style>
