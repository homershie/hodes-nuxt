<template>
  <div class="sidebar">
    <!-- 搜尋框 -->
    <div class="search-box">
      <input
        :value="searchQuery"
        type="text"
        placeholder="搜尋文章"
        @input="$emit('update:search', $event.target.value)"
      />
      <span class="icon pe-7s-search"></span>
    </div>

    <!-- 分類 -->
    <div class="widget catogry">
      <h6 class="title-widget">分類</h6>
      <ul class="rest">
        <li>
          <span>
            <a href="#0" @click.prevent="$emit('update:category', 'all')">
              全部文章
            </a>
          </span>
          <span class="ml-auto">{{ allPosts.length }}</span>
        </li>
        <li>
          <span>
            <a href="#0" @click.prevent="$emit('update:category', 'GraphicStyle')">
              視覺風格大全
            </a>
          </span>
          <span class="ml-auto">{{ getCategoryCount('GraphicStyle') }}</span>
        </li>
        <li>
          <span>
            <a href="#0" @click.prevent="$emit('update:category', 'WorldVision')">
              世界視界
            </a>
          </span>
          <span class="ml-auto">{{ getCategoryCount('WorldVision') }}</span>
        </li>
      </ul>
    </div>

    <!-- 最新文章 -->
    <div class="widget last-post-thum">
      <h6 class="title-widget">最新文章</h6>
      <div v-for="post in latestPosts" :key="post.id" class="item">
        <div class="valign">
          <div class="img">
            <NuxtLink :to="`/article/${post.id}`">
              <img :src="post.thumbnail" :alt="post.title" loading="lazy" />
            </NuxtLink>
          </div>
        </div>
        <div class="cont">
          <h6>
            <NuxtLink :to="`/article/${post.id}`">
              {{ post.title }}
            </NuxtLink>
          </h6>
          <span>
            <NuxtLink :to="`/article/${post.id}`">
              {{ formatDate(post.date) }}
            </NuxtLink>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  searchQuery: String,
  selectedCategory: String,
  allPosts: Array,
  latestPosts: Array,
})

defineEmits(['update:search', 'update:category'])

function getCategoryCount(category) {
  return props.allPosts.filter(post => post.category === category).length
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
