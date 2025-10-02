<template>
  <!-- ==================== Start Blogs ==================== -->
  <section class="blog section-padding">
    <div class="container with-pad">
      <div class="sec-head mb-80">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center">
            <div class="d-inline-block">
              <div class="sub-title-icon d-flex align-items-center">
                <span class="icon fas fa-sticky-note"></span>
                <h6>部落格</h6>
              </div>
            </div>
            <h3>開啟你的視界</h3>
          </div>
        </div>
      </div>

      <!-- 小螢幕設備上顯示在頂部的側邊欄內容 -->
      <div class="row mb-50 d-lg-none">
        <div class="col-12">
          <div class="sidebar">
            <div class="search-box">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜尋文章"
                @input="filterPosts"
              />
              <span class="icon pe-7s-search"></span>
            </div>
            <div class="widget catogry">
              <h6 class="title-widget">分類</h6>
              <ul class="rest">
                <li>
                  <span>
                    <a href="#0" @click.prevent="filterByCategory('all')"> 全部文章 </a>
                  </span>
                  <span class="ml-auto">{{ allPosts.length }}</span>
                </li>
                <li>
                  <span>
                    <a href="#0" @click.prevent="filterByCategory('GraphicStyle')">
                      視覺風格大全
                    </a>
                  </span>
                  <span class="ml-auto">{{ getPostCountByCategory('GraphicStyle') }}</span>
                </li>
                <li>
                  <span>
                    <a href="#0" @click.prevent="filterByCategory('WorldVision')"> 世界視界 </a>
                  </span>
                  <span class="ml-auto">{{ getPostCountByCategory('WorldVision') }}</span>
                </li>
              </ul>
            </div>
            <div class="widget last-post-thum">
              <h6 class="title-widget">最新文章</h6>
              <div v-for="post in latestPosts" :key="post.id" class="item">
                <div class="valign">
                  <div class="img">
                    <router-link :to="`/article/${post.id}`">
                      <img :src="toWebP(post.thumbnail)" :alt="post.title" />
                    </router-link>
                  </div>
                </div>
                <div class="cont">
                  <h6>
                    <router-link :to="`/article/${post.id}`">
                      {{ post.title }}
                    </router-link>
                  </h6>
                  <span>
                    <router-link :to="`/article/${post.id}`">
                      {{ toLocalString(post.date) }}
                    </router-link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row lg-marg justify-content-center">
        <div class="col-lg-7">
          <div class="md-mb80">
            <div
              v-for="post in filteredPosts"
              :key="post.id"
              class="item pb-50 mb-50 bord-thin-bottom blog-post"
              :data-category="post.category"
            >
              <router-link :to="`/article/${post.id}`">
                <div class="img">
                  <img :src="cachedImageUrl[post.image] || post.image" :alt="post.title" />
                </div>
              </router-link>
              <div class="cont mt-30">
                <span class="date mb-10">{{ toLocalString(post.date) }}</span>
                <h4 class="mb-15 post-title">
                  <router-link :to="`/article/${post.id}`">
                    {{ post.title }}
                  </router-link>
                </h4>
                <p>{{ post.excerpt }}</p>
                <router-link :to="`/article/${post.id}`" class="mt-15 read-more">
                  閱讀更多 <i class="fas fa-arrow-right ml-10"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4 d-none d-lg-block">
          <div class="sidebar">
            <div class="search-box">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜尋文章"
                @input="filterPosts"
              />
              <span class="icon pe-7s-search"></span>
            </div>
            <div class="widget catogry">
              <h6 class="title-widget">分類</h6>
              <ul class="rest">
                <li>
                  <span>
                    <a href="#0" @click.prevent="filterByCategory('all')"> 全部文章 </a>
                  </span>
                  <span class="ml-auto">{{ allPosts.length }}</span>
                </li>
                <li>
                  <span>
                    <a href="#0" @click.prevent="filterByCategory('GraphicStyle')">
                      視覺風格大全
                    </a>
                  </span>
                  <span class="ml-auto">{{ getPostCountByCategory('GraphicStyle') }}</span>
                </li>
                <li>
                  <span>
                    <a href="#0" @click.prevent="filterByCategory('WorldVision')"> 世界視界 </a>
                  </span>
                  <span class="ml-auto">{{ getPostCountByCategory('WorldVision') }}</span>
                </li>
              </ul>
            </div>
            <div class="widget last-post-thum">
              <h6 class="title-widget">最新文章</h6>
              <div v-for="post in latestPosts" :key="post.id" class="item">
                <div class="valign">
                  <div class="img">
                    <router-link :to="`/article/${post.id}`">
                      <img :src="toWebP(post.thumbnail)" :alt="post.title" />
                    </router-link>
                  </div>
                </div>
                <div class="cont">
                  <h6>
                    <router-link :to="`/article/${post.id}`">
                      {{ post.title }}
                    </router-link>
                  </h6>
                  <span>
                    <router-link :to="`/article/${post.id}`">
                      {{ toLocalString(post.date) }}
                    </router-link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- ==================== End Blogs ==================== -->

  <!-- 載入進度顯示 -->
  <div v-if="isPreloading" class="loading-progress">
    <div class="progress-bar">
      <div class="progress" :style="{ width: `${loadingProgress}%` }"></div>
    </div>
    <div class="progress-text">載入中... {{ loadingProgress }}%</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { articles } from '@/data/articleData.js'
import { useImageFormat } from '@/composables/useImageFormat.js'
import { useImageCache } from '@/composables/useImageCache'

const searchQuery = ref('')
const selectedCategory = ref('all')
const { toWebP } = useImageFormat()
const { preloadImages, loadImage, startCacheCleanup, stopCacheCleanup } = useImageCache()
const cachedImageUrl = ref({})

// 將 articles 轉換為陣列格式
const allPosts = ref(Object.values(articles).sort((a, b) => new Date(b.date) - new Date(a.date)))

// 計算過濾後的文章列表
const filteredPosts = computed(() => {
  let posts = allPosts.value

  // 根據搜尋關鍵字過濾
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    posts = posts.filter(
      post => post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query)
    )
  }

  // 根據分類過濾
  if (selectedCategory.value !== 'all') {
    posts = posts.filter(post => post.category === selectedCategory.value)
  }

  return posts
})

// 計算最新文章列表
const latestPosts = computed(() => {
  return [...allPosts.value].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
})

// 根據分類獲取文章數量
const getPostCountByCategory = category => {
  return allPosts.value.filter(post => post.category === category).length
}

// 過濾文章
const filterPosts = () => {
  // 搜尋功能已通過 computed 屬性實現
}

// 根據分類過濾
const filterByCategory = category => {
  selectedCategory.value = category
}

// 格式化日期
const toLocalString = date => {
  return new Date(date).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 載入圖片並使用快取
const loadCachedImage = async url => {
  try {
    const cachedUrl = await loadImage(url)
    cachedImageUrl.value[url] = cachedUrl
    return cachedUrl
  } catch {
    // 如果快取載入失敗，使用 WebP 格式
    const webpUrl = toWebP(url)
    cachedImageUrl.value[url] = webpUrl
    return webpUrl
  }
}

onMounted(async () => {
  // 收集所有文章圖片URL
  const imageUrls = allPosts.value
    .map(post => [post.image, post.thumbnail])
    .flat()
    .filter(Boolean)

  // 預載入圖片
  await preloadImages(imageUrls)

  // 初始化快取清理
  startCacheCleanup()

  // 預載入所有圖片到快取
  for (const url of imageUrls) {
    await loadCachedImage(url)
  }
})

onUnmounted(() => {
  stopCacheCleanup()
})
</script>

<style scoped>
.blog a:hover {
  text-decoration: underline;
}
.read-more {
  color: var(--maincolor);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.read-more:hover ::after {
  content: '';
  display: block;
  width: 88px;
  height: 2px;
  background-color: var(--maincolor);
  transition: width 0.3s ease;
  position: relative;
  left: -70px;
}

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

.blog-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow-y: auto;
}

.blog-modal-content {
  position: relative;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  margin: 20px;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blog-post-detail {
  max-height: 90vh;
  overflow-y: auto;
}

.featured-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.post-content {
  padding: 40px;
}

.post-content .date {
  color: #999;
  font-size: 14px;
}

.post-content h2 {
  margin: 10px 0 20px 0;
  line-height: 1.3;
}

.category-tag {
  display: inline-block;
  background-color: var(--maincolor);
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 12px;
  margin-bottom: 20px;
}

.post-content .content {
  line-height: 1.6;
  margin-bottom: 30px;
}

.post-footer {
  padding-top: 20px;
  border-top: 1px solid #eee;
  text-align: center;
}

.medium-link {
  display: inline-block;
  background-color: #000;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  text-decoration: none;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.medium-link:hover {
  background-color: var(--maincolor);
}

@media (max-width: 768px) {
  .blog-modal-content {
    width: 95%;
    margin: 10px;
  }

  .post-content {
    padding: 20px;
  }

  /* 手機版側邊欄樣式優化 */
  .d-lg-none .sidebar {
    margin-bottom: 30px;
  }

  .d-lg-none .search-box {
    margin-bottom: 25px;
  }

  .d-lg-none .last-post-thum .item {
    margin-bottom: 15px;
    padding-bottom: 15px;
  }

  .d-lg-none .title-widget {
    font-size: 16px;
    margin-bottom: 15px;
    padding-bottom: 8px;
  }

  .d-lg-none .catogry ul li {
    padding: 8px 0;
  }
}

.loading-progress {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.progress-bar {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress {
  height: 100%;
  background: var(--maincolor);
  transition: width 0.3s ease;
}

.progress-text {
  color: #fff;
  font-size: 14px;
}
</style>
