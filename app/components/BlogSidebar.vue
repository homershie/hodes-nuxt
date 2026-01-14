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
            <a href="#0" @click.prevent="$emit('update:category', 'all')"> 全部文章 </a>
          </span>
          <span class="ml-auto">{{ allPosts.length }}</span>
        </li>
        <li v-for="(category, key) in categories" :key="key">
          <span>
            <a href="#0" @click.prevent="$emit('update:category', key)">
              {{ category.name }}
            </a>
          </span>
          <span class="ml-auto">{{ getCategoryCount(key) }}</span>
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
import categories from '../../content/config/categories.json'

const props = defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
  selectedCategory: {
    type: String,
    default: '',
  },
  allPosts: {
    type: Array,
    default: () => [],
  },
  latestPosts: {
    type: Array,
    default: () => [],
  },
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
    day: 'numeric',
  })
}
</script>

<style scoped>
.search-box {
  position: relative;
  margin-bottom: 40px;
}

.search-box input {
  width: 100%;
  padding: 15px 50px 15px 20px;
  border: 1px solid #ddd;
  border-radius: 25px;
  outline: none;
}

.search-box .icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.sidebar .widget {
  margin-bottom: 50px;
}

.title-widget {
  font-size: 18px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--maincolor);
}

.catogry ul li {
  padding: 10px 0;
  border-bottom: 1px solid #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.catogry ul li a {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s ease;
}

.catogry ul li a:hover {
  color: var(--maincolor);
}

.last-post-thum .item {
  display: flex;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.last-post-thum .item:last-child {
  border-bottom: none;
}

.last-post-thum .img {
  width: 80px;
  height: 60px;
  margin-right: 15px;
  overflow: hidden;
  border-radius: 5px;
}

.last-post-thum .img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.last-post-thum .cont h6 {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 5px;
}

.last-post-thum .cont a:hover {
  text-decoration: underline;
}

.last-post-thum .cont h6 a {
  color: #ccc;
  text-decoration: none;
}

.last-post-thum .cont span a {
  color: #999;
  font-size: 12px;
  text-decoration: none;
}
</style>
