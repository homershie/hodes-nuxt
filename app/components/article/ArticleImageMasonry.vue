<template>
  <div class="article-image-masonry">
    <slot />
  </div>
</template>

<script setup></script>

<style scoped>
.article-image-masonry {
  width: 95%;
  margin: 0 auto;
  margin-top: 40px;
  margin-bottom: 40px;
  column-count: 3;
  column-gap: 20px;
}

.article-image-masonry :slotted(.image) {
  display: inline-block;
  width: 100%;
  margin: 0 0 20px 0;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
}

.article-image-masonry :slotted(.image img) {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  border-radius: 5px;
}

.article-image-masonry :slotted(.image figcaption) {
  margin: 0;
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.3s,
    transform 0.3s;
  text-align: center;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 8px 0 4px 0;
  border-radius: 0 0 5px 5px;
  font-size: 0.95em;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.article-image-masonry :slotted(.image:hover figcaption),
.article-image-masonry :slotted(.image:focus-within figcaption) {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

@media screen and (max-width: 992px) {
  .article-image-masonry {
    column-count: 2;
  }
}

@media screen and (max-width: 768px) {
  .article-image-masonry {
    column-count: 1;
  }
}
</style>
