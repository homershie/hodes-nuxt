<template>
  <div :class="['article-image-gallery', columnsClass]">
    <slot />
  </div>
  
</template>

<script setup>
const props = defineProps({
  columns: { type: Number, default: 2 },
})

const columnsClass = computed(() => {
  if (props.columns === 3) return 'cols-3'
  return 'cols-2'
})
</script>

<style scoped>
.article-image-gallery {
  width: 95%;
  margin: 0 auto;
  margin-top: 60px;
  margin-bottom: 60px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.article-image-gallery.cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.article-image-gallery :slotted(.artist) {
  grid-column: 1 / -1;
  justify-self: center;
  text-align: center;
  font-size: 0.9rem;
  margin: 0 auto;
}

.article-image-gallery :slotted(.image) {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  margin: 0;
  overflow: hidden;
}

.article-image-gallery :slotted(.image img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
  display: block;
}

.article-image-gallery :slotted(.image figcaption) {
  margin: 0;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s, transform 0.3s;
  text-align: center;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 16px 0 10px 0;
  border-radius: 0 0 5px 5px;
  font-size: 0.95em;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.article-image-gallery :slotted(.image:hover figcaption),
.article-image-gallery :slotted(.image:focus-within figcaption) {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

@media screen and (max-width: 992px) {
  .article-image-gallery.cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .article-image-gallery,
  .article-image-gallery.cols-3 {
    grid-template-columns: 1fr;
  }
}
</style>



