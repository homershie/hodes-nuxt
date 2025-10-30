<template>
  <div class="article-img">
    <OptimizedImage :src="src" :alt="alt" />
  </div>
  
</template>

<script setup>
import OptimizedImage from '@components/OptimizedImage.vue'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
})
</script>

<style scoped>
.article-img {
  width: 50%;
  margin: 0 auto;
}
.article-img :deep(img) {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 5px;
}

@media (max-width: 768px) {
  .article-img {
    width: 100%;
  }
}
</style>


