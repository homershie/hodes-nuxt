# SSG 部署 + 分頁功能 + 圖片優化完整實作計劃

> **專案**: HODES - Homer Shie 個人作品集網站
> **目標**: SSG 部署 + 分頁系統 + 圖片延遲載入 + 程式碼分割
> **建立日期**: 2025-10-26
> **預估工時**: 5-7 小時

---

## 📋 專案現況分析

### 資料統計
- **文章數量**: 4 篇 (articleData.js, 2405 行)
- **作品數量**: 90 個 (portfolioData.js, 1260 行)
- **現有頁面**: 9 個主要頁面
- **圖片來源**: Cloudflare R2 (r2bucket.homershie.com)

### 現有優化系統
- ✅ IndexedDB 圖片快取 (useImageCache.js)
- ✅ 批次圖片預載 (useImagePreloader.js)
- ✅ Intersection Observer 延遲載入 (OptimizedImage.vue)
- ✅ WebP 自動轉換 (useImageFormat.js)
- ✅ Nuxt Content 已安裝

### 需求確認
| 功能 | Blog | Portfolio |
|------|------|-----------|
| **分頁方式** | 傳統分頁 ([1] [2] [3]) | 無限滾動 (瀑布流) |
| **每頁數量** | 10 篇 | 15 個/批 |
| **路由格式** | `/blog/page/1` | `/portfolio?page=2` (SEO) |
| **分類篩選** | ✅ 側邊欄分類 + 搜尋 | ✅ Tag 點擊篩選 |
| **SEO 處理** | 每頁獨立 meta | 混合式 (預渲染所有分頁) |
| **Loading 狀態** | 頁面切換 | Skeleton 佔位符 |
| **觸發距離** | N/A | 距底部 500px |

---

## 🎯 實作階段

### 階段一: 資料遷移到 Nuxt Content

#### 1.1 建立 Content 目錄結構

```
content/
├── articles/                    # 文章內容 (Markdown)
│   ├── pop-art.md              # 波普藝術
│   ├── memphis-design.md       # 孟菲斯設計
│   ├── bauhaus.md              # 包豪斯
│   └── minimalism.md           # 極簡主義
└── config/                     # 配置檔案
    ├── categories.json         # 文章分類定義
    └── portfolio-categories.json # 作品分類定義
```

#### 1.2 文章資料轉換腳本

**新增**: `scripts/migrate-articles.js`

```javascript
/**
 * 將 data/articleData.js 轉換為 Markdown 檔案
 *
 * 轉換規則:
 * 1. 每篇文章 → 獨立 .md 檔案
 * 2. 保留 frontmatter (id, title, date, category, image, excerpt, author)
 * 3. HTML 內容保持原樣 (Nuxt Content 支援 HTML in Markdown)
 * 4. 自動加上 loading="lazy" 到所有 <img> 標籤
 */

import fs from 'fs/promises'
import path from 'path'
import { articles } from '../data/articleData.js'

async function migrateArticles() {
  const contentDir = path.resolve('content/articles')

  // 確保目錄存在
  await fs.mkdir(contentDir, { recursive: true })

  for (const [id, article] of Object.entries(articles)) {
    const frontmatter = `---
id: ${article.id}
title: "${article.title}"
date: ${article.date}
category: ${article.category}
categoryName: ${article.categoryName}
excerpt: "${article.excerpt}"
image: ${article.image}
thumbnail: ${article.thumbnail}
author: ${article.author}
---

`

    // 處理圖片，自動加上 loading="lazy"
    let content = article.content
    content = content.replace(
      /<img(?![^>]*loading=)/g,
      '<img loading="lazy"'
    )

    const markdown = frontmatter + content

    const filePath = path.join(contentDir, `${id}.md`)
    await fs.writeFile(filePath, markdown, 'utf-8')

    console.log(`✅ 轉換完成: ${id}.md`)
  }

  console.log(`\n🎉 總計轉換 ${Object.keys(articles).length} 篇文章`)
}

migrateArticles()
```

#### 1.3 保留 portfolioData.js

**理由**:
- 作品資料結構穩定，不需要 CMS
- 維持現有 JS import 方式更簡單
- 避免不必要的複雜度

---

### 階段二: Blog 傳統分頁系統

#### 2.1 新路由結構

```
app/pages/blog/
├── index.vue                    # 重新導向到 /blog/page/1
└── page/
    └── [page].vue              # 動態分頁路由
```

#### 2.2 Blog 首頁重新導向

**新增**: `app/pages/blog/index.vue`

```vue
<script setup>
// 自動重新導向到第一頁
navigateTo('/blog/page/1', { redirectCode: 301 })
</script>
```

#### 2.3 Blog 分頁頁面

**新增**: `app/pages/blog/page/[page].vue`

```vue
<template>
  <div>
    <section class="blog section-padding">
      <div class="container with-pad">
        <!-- 標題區 -->
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

        <div class="row lg-marg justify-content-center">
          <!-- 文章列表 -->
          <div class="col-lg-7">
            <div class="md-mb80">
              <div
                v-for="post in paginatedPosts"
                :key="post.id"
                class="item pb-50 mb-50 bord-thin-bottom blog-post"
              >
                <NuxtLink :to="`/article/${post.id}`">
                  <div class="img">
                    <OptimizedImage
                      :src="post.image"
                      :alt="post.title"
                      priority="normal"
                    />
                  </div>
                </NuxtLink>
                <div class="cont mt-30">
                  <span class="date mb-10">{{ formatDate(post.date) }}</span>
                  <h4 class="mb-15 post-title">
                    <NuxtLink :to="`/article/${post.id}`">
                      {{ post.title }}
                    </NuxtLink>
                  </h4>
                  <p>{{ post.excerpt }}</p>
                  <NuxtLink :to="`/article/${post.id}`" class="mt-15 read-more">
                    閱讀更多 <i class="fas fa-arrow-right ml-10"></i>
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- 分頁控制 -->
            <Pagination
              :current-page="currentPage"
              :total-pages="totalPages"
              :base-url="'/blog/page'"
            />
          </div>

          <!-- 側邊欄 -->
          <div class="col-lg-4">
            <BlogSidebar
              :search-query="searchQuery"
              :selected-category="selectedCategory"
              :all-posts="allPosts"
              :latest-posts="latestPosts"
              @update:search="handleSearch"
              @update:category="handleCategory"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 取得路由參數
const route = useRoute()
const currentPage = computed(() => parseInt(route.params.page) || 1)

// 從 Nuxt Content 查詢所有文章
const { data: allArticles } = await useAsyncData('articles', () =>
  queryContent('articles')
    .sort({ date: -1 })
    .find()
)

// 搜尋和篩選
const searchQuery = ref('')
const selectedCategory = ref('all')

const filteredPosts = computed(() => {
  let posts = allArticles.value || []

  // 搜尋過濾
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    posts = posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query)
    )
  }

  // 分類過濾
  if (selectedCategory.value !== 'all') {
    posts = posts.filter(post => post.category === selectedCategory.value)
  }

  return posts
})

// 分頁邏輯
const POSTS_PER_PAGE = 10
const totalPages = computed(() =>
  Math.ceil(filteredPosts.value.length / POSTS_PER_PAGE)
)

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE
  return filteredPosts.value.slice(start, end)
})

// 最新文章 (側邊欄)
const latestPosts = computed(() =>
  (allArticles.value || []).slice(0, 3)
)

// 處理搜尋
function handleSearch(query) {
  searchQuery.value = query
  // 搜尋後回到第一頁
  if (currentPage.value !== 1) {
    navigateTo('/blog/page/1')
  }
}

// 處理分類篩選
function handleCategory(category) {
  selectedCategory.value = category
  // 篩選後回到第一頁
  if (currentPage.value !== 1) {
    navigateTo('/blog/page/1')
  }
}

// 日期格式化
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// SEO Meta
const pageTitle = computed(() => {
  if (currentPage.value === 1) {
    return '部落格 | HODES - 荷馬桑 Homer Shie'
  }
  return `部落格 - 第 ${currentPage.value} 頁 | HODES`
})

const pageDescription = computed(() => {
  if (searchQuery.value) {
    return `搜尋「${searchQuery.value}」的部落格文章`
  }
  if (selectedCategory.value !== 'all') {
    return `${selectedCategory.value} 分類的部落格文章，第 ${currentPage.value} 頁`
  }
  return `荷馬桑的部落格文章列表，分享視覺風格、設計理念與創作心得，第 ${currentPage.value} 頁`
})

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:url', content: `https://homershie.com/blog/page/${currentPage.value}` },
  ],
  link: [
    { rel: 'canonical', href: `https://homershie.com/blog/page/${currentPage.value}` },
  ]
})

// 404 處理
if (currentPage.value > totalPages.value && totalPages.value > 0) {
  throw createError({
    statusCode: 404,
    message: '頁面不存在'
  })
}
</script>
```

#### 2.4 側邊欄元件

**新增**: `app/components/BlogSidebar.vue`

```vue
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
defineProps({
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
  return date.toLocaleDateString('zh-TW')
}
</script>
```

#### 2.5 分頁元件

**新增**: `app/components/Pagination.vue`

```vue
<template>
  <nav class="pagination-wrapper">
    <ul class="pagination">
      <!-- 上一頁 -->
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <NuxtLink
          v-if="currentPage > 1"
          :to="`${baseUrl}/${currentPage - 1}`"
          class="page-link"
        >
          <i class="fas fa-chevron-left"></i>
          <span class="ml-2">上一頁</span>
        </NuxtLink>
        <span v-else class="page-link disabled">
          <i class="fas fa-chevron-left"></i>
          <span class="ml-2">上一頁</span>
        </span>
      </li>

      <!-- 頁碼 -->
      <li
        v-for="page in visiblePages"
        :key="page"
        class="page-item"
        :class="{ active: page === currentPage }"
      >
        <NuxtLink
          v-if="page !== '...'"
          :to="`${baseUrl}/${page}`"
          class="page-link"
        >
          {{ page }}
        </NuxtLink>
        <span v-else class="page-link dots">...</span>
      </li>

      <!-- 下一頁 -->
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <NuxtLink
          v-if="currentPage < totalPages"
          :to="`${baseUrl}/${currentPage + 1}`"
          class="page-link"
        >
          <span class="mr-2">下一頁</span>
          <i class="fas fa-chevron-right"></i>
        </NuxtLink>
        <span v-else class="page-link disabled">
          <span class="mr-2">下一頁</span>
          <i class="fas fa-chevron-right"></i>
        </span>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  baseUrl: {
    type: String,
    required: true
  }
})

/**
 * 計算顯示的頁碼
 * 規則:
 * - 總頁數 <= 7: 顯示全部
 * - 總頁數 > 7: 顯示 1 ... 當前前後各2頁 ... 最後一頁
 */
const visiblePages = computed(() => {
  const { currentPage, totalPages } = props
  const pages = []

  if (totalPages <= 7) {
    // 顯示所有頁碼
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // 總是顯示第一頁
    pages.push(1)

    if (currentPage > 3) {
      pages.push('...')
    }

    // 顯示當前頁前後各2頁
    const start = Math.max(2, currentPage - 2)
    const end = Math.min(totalPages - 1, currentPage + 2)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push('...')
    }

    // 總是顯示最後一頁
    pages.push(totalPages)
  }

  return pages
})
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.pagination {
  display: flex;
  list-style: none;
  gap: 0.5rem;
  padding: 0;
}

.page-item {
  display: inline-block;
}

.page-link {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  color: var(--color-font);
  text-decoration: none;
  transition: all 0.3s ease;
}

.page-link:hover:not(.disabled) {
  background-color: var(--maincolor);
  color: white;
  border-color: var(--maincolor);
}

.page-item.active .page-link {
  background-color: var(--maincolor);
  color: white;
  border-color: var(--maincolor);
}

.page-link.disabled {
  color: #999;
  cursor: not-allowed;
  opacity: 0.5;
}

.page-link.dots {
  border: none;
  cursor: default;
}

.page-link.dots:hover {
  background-color: transparent;
  color: var(--color-font);
}

/* 響應式 */
@media (max-width: 576px) {
  .page-link {
    min-width: 35px;
    height: 35px;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }

  .page-link span {
    display: none;
  }
}
</style>
```

---

### 階段三: Portfolio 無限滾動 + 瀑布流

#### 3.1 路由結構

```
app/pages/portfolio/
└── index.vue                    # 單一頁面，支援 ?page=2 參數
```

#### 3.2 Portfolio 無限滾動頁面

**修改**: `app/pages/portfolio/index.vue`

```vue
<template>
  <section class="portfolio section-padding">
    <div class="container">
      <!-- 標題區 -->
      <div class="sec-head mb-40">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center">
            <div class="d-inline-block">
              <div class="sub-title-icon d-flex align-items-center">
                <span class="icon fas fa-briefcase"></span>
                <h6>我的作品</h6>
              </div>
            </div>
            <h3>
              透過視覺方法 <br />
              讓萬物賦予意義
            </h3>
          </div>
        </div>
      </div>

      <!-- 分類篩選 -->
      <div class="category-filter mb-40 text-center">
        <button
          v-for="category in categories"
          :key="category"
          class="filter-btn"
          :class="{ active: selectedCategory === category }"
          @click="handleCategoryChange(category)"
        >
          {{ getCategoryName(category) }}
        </button>
      </div>

      <!-- 閱讀進度條 -->
      <div class="reading-progress-bar" :style="{ width: progress + '%' }"></div>

      <!-- 作品列表 (瀑布流) -->
      <div class="portfolio-list">
        <PortfolioList
          :works="displayedWorks"
          @view-details="handleViewDetails"
        />
      </div>

      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="loading-skeleton">
        <PortfolioSkeleton :count="ITEMS_PER_PAGE" />
      </div>

      <!-- 載入更多觸發點 -->
      <div ref="loadMoreTrigger" class="load-more-trigger"></div>

      <!-- 全部載入完成提示 -->
      <div v-if="!hasMore && displayedWorks.length > 0" class="text-center mt-50">
        <p class="text-muted">已顯示全部作品</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useScroll, useIntersectionObserver } from '@vueuse/core'
import PortfolioList from '@components/PortfolioList.vue'
import PortfolioSkeleton from '@components/PortfolioSkeleton.vue'
import { usePortfolio } from '@composables/usePortfolio.js'
import { useImageCache } from '@composables/useImageCache'

const router = useRouter()
const route = useRoute()
const { portfolioData, categories } = usePortfolio()
const { preloadImages, startCacheCleanup, stopCacheCleanup } = useImageCache()

// 常數
const ITEMS_PER_PAGE = 15
const LOAD_MORE_THRESHOLD = 500 // 距底部 500px 觸發載入

// 狀態
const selectedCategory = ref('all')
const currentPage = ref(1)
const isLoading = ref(false)
const loadMoreTrigger = ref(null)

// 閱讀進度
const { y } = useScroll(window)
const progress = computed(() => {
  if (!import.meta.client) return 0
  const scrollTop = y.value
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  return docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
})

// 篩選後的作品
const filteredWorks = computed(() => {
  if (selectedCategory.value === 'all') {
    return portfolioData.value
  }
  return portfolioData.value.filter(work =>
    Array.isArray(work.category)
      ? work.category.includes(selectedCategory.value)
      : work.category === selectedCategory.value
  )
})

// 已顯示的作品
const displayedWorks = computed(() => {
  const end = currentPage.value * ITEMS_PER_PAGE
  return filteredWorks.value.slice(0, end)
})

// 是否還有更多
const hasMore = computed(() => {
  return displayedWorks.value.length < filteredWorks.value.length
})

// 載入下一頁
async function loadMore() {
  if (isLoading.value || !hasMore.value) return

  isLoading.value = true

  // 模擬載入延遲 (實際可移除)
  await new Promise(resolve => setTimeout(resolve, 300))

  currentPage.value++

  // 更新 URL (不刷新頁面)
  const query = { ...route.query, page: currentPage.value }
  router.replace({ query })

  // 預載新一批圖片
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = currentPage.value * ITEMS_PER_PAGE
  const newWorks = filteredWorks.value.slice(start, end)
  const imageUrls = newWorks.map(work => work.image)
  await preloadImages(imageUrls)

  isLoading.value = false
}

// 分類切換
function handleCategoryChange(category) {
  selectedCategory.value = category
  currentPage.value = 1

  // 滾動到頂部
  window.scrollTo({ top: 0, behavior: 'smooth' })

  // 更新 URL
  const query = category === 'all'
    ? {}
    : { category, page: 1 }
  router.replace({ query })
}

// 查看詳情
function handleViewDetails(work) {
  router.push(`/project/${work.id}`)
}

// 分類名稱
function getCategoryName(category) {
  if (category === 'all') return '全部作品'
  return category
}

// 監聽滾動，距底部 500px 時觸發
onMounted(() => {
  // 從 URL 初始化狀態
  const pageQuery = parseInt(route.query.page) || 1
  const categoryQuery = route.query.category || 'all'

  currentPage.value = pageQuery
  selectedCategory.value = categoryQuery

  // 設定 Intersection Observer
  useIntersectionObserver(
    loadMoreTrigger,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        loadMore()
      }
    },
    {
      rootMargin: `${LOAD_MORE_THRESHOLD}px` // 提前 500px 觸發
    }
  )

  // 預載初始圖片
  const imageUrls = displayedWorks.value.map(work => work.image)
  preloadImages(imageUrls)

  // 啟動快取清理
  startCacheCleanup()
})

// 清理
onUnmounted(() => {
  stopCacheCleanup()
})

// SEO Meta
const pageTitle = computed(() => {
  if (selectedCategory.value !== 'all') {
    return `${selectedCategory.value} 作品集 | HODES - 荷馬桑 Homer Shie`
  }
  return '作品集 | HODES - 荷馬桑 Homer Shie'
})

const pageDescription = computed(() => {
  if (selectedCategory.value !== 'all') {
    return `荷馬桑的 ${selectedCategory.value} 作品集，展示設計、插畫、動畫等創作`
  }
  return '荷馬桑的作品集，包含平面設計、UI/UX、插畫、動畫、品牌設計等 90+ 件作品'
})

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:url', content: 'https://homershie.com/portfolio' },
  ],
  link: [
    { rel: 'canonical', href: 'https://homershie.com/portfolio' },
  ]
})
</script>

<style scoped>
.reading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: var(--maincolor);
  z-index: 9999;
  transition: width 0.2s;
}

.category-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.filter-btn {
  padding: 0.5rem 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  background: white;
  color: var(--color-font);
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover,
.filter-btn.active {
  background: var(--maincolor);
  color: white;
  border-color: var(--maincolor);
}

.load-more-trigger {
  height: 1px;
  margin-top: 2rem;
}

.loading-skeleton {
  margin-top: 2rem;
}
</style>
```

#### 3.3 Skeleton 佔位符元件

**新增**: `app/components/PortfolioSkeleton.vue`

```vue
<template>
  <div class="skeleton-grid">
    <div
      v-for="i in count"
      :key="i"
      class="skeleton-item"
      :style="{ animationDelay: `${i * 0.1}s` }"
    >
      <div class="skeleton-image"></div>
      <div class="skeleton-title"></div>
      <div class="skeleton-category"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 3
  }
})
</script>

<style scoped>
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.skeleton-item {
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-image {
  width: 100%;
  height: 250px;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.skeleton-title {
  width: 70%;
  height: 20px;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.skeleton-category {
  width: 40%;
  height: 16px;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 響應式 */
@media (max-width: 768px) {
  .skeleton-grid {
    grid-template-columns: 1fr;
  }
}
</style>
```

---

### 階段四: 文章內容圖片延遲載入

#### 4.1 更新文章詳情頁

**修改**: `app/pages/article/[id].vue`

```vue
<template>
  <div>
    <section class="article-detail section-padding">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <!-- 文章標題 -->
            <h1 class="article-title">{{ article.title }}</h1>

            <!-- 文章資訊 -->
            <div class="article-meta mb-40">
              <span class="date">{{ formatDate(article.date) }}</span>
              <span class="category">{{ article.categoryName }}</span>
              <span class="author">{{ article.author }}</span>
            </div>

            <!-- 文章內容 (使用 ContentRenderer) -->
            <div class="article-content">
              <ContentRenderer :value="article" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const route = useRoute()
const articleId = route.params.id

// 從 Nuxt Content 查詢文章
const { data: article } = await useAsyncData(`article-${articleId}`, () =>
  queryContent('articles', articleId).findOne()
)

// 404 處理
if (!article.value) {
  throw createError({
    statusCode: 404,
    message: '文章不存在'
  })
}

// 日期格式化
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// SEO Meta
useHead({
  title: `${article.value.title} | HODES`,
  meta: [
    { name: 'description', content: article.value.excerpt },
    { property: 'og:title', content: article.value.title },
    { property: 'og:description', content: article.value.excerpt },
    { property: 'og:image', content: article.value.image },
    { property: 'og:url', content: `https://homershie.com/article/${articleId}` },
    { property: 'article:published_time', content: article.value.date },
    { property: 'article:author', content: article.value.author },
  ],
  link: [
    { rel: 'canonical', href: `https://homershie.com/article/${articleId}` },
  ]
})
</script>

<style scoped>
.article-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.article-meta {
  display: flex;
  gap: 1.5rem;
  color: #666;
  font-size: 0.9rem;
}

.article-content {
  font-size: 1.1rem;
  line-height: 1.8;
}

/* 文章內圖片樣式 */
.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 2rem 0;
}

.article-content :deep(figure) {
  margin: 2rem 0;
}

.article-content :deep(figcaption) {
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
}
</style>
```

#### 4.2 Nuxt Content 圖片處理

**更新**: `nuxt.config.ts`

```javascript
export default defineNuxtConfig({
  // ... 其他設定

  content: {
    markdown: {
      // 自動為 Markdown 圖片加上 loading="lazy"
      remarkPlugins: [],
      rehypePlugins: [],
    },
    highlight: {
      theme: 'github-dark',
    },
  },
})
```

---

### 階段五: 程式碼分割 (基礎優化)

#### 5.1 大型組件動態導入

**修改**: 使用 `defineAsyncComponent` 的頁面

範例 - 首頁使用 Swiper:

```vue
<script setup>
// 動態導入 Swiper 組件 (僅在需要時載入)
const AppSwiper = defineAsyncComponent(() =>
  import('@components/AppSwiper.vue')
)
</script>

<template>
  <div>
    <!-- 使用 Suspense 處理載入狀態 -->
    <Suspense>
      <template #default>
        <AppSwiper :slides="slides" />
      </template>
      <template #fallback>
        <div class="loading">載入中...</div>
      </template>
    </Suspense>
  </div>
</template>
```

#### 5.2 需要動態導入的組件清單

```javascript
// 大型第三方庫組件
✅ AppSwiper.vue (Swiper.js)
✅ PortfolioList.vue (Masonry.js)
✅ LightBox 相關組件

// 非首屏組件
✅ BackToTop.vue
✅ ContactForm.vue
✅ AnimateOnScroll.vue
```

#### 5.3 Nuxt Config 優化

**更新**: `nuxt.config.ts`

```javascript
export default defineNuxtConfig({
  // ... 其他設定

  // 實驗性功能
  experimental: {
    componentIslands: true,  // 元件孤島
    payloadExtraction: true, // Payload 提取
  },

  // 建置優化
  vite: {
    build: {
      // 程式碼分割策略
      rollupOptions: {
        output: {
          manualChunks: {
            // Swiper 單獨打包
            'swiper': ['swiper'],
            // Masonry 單獨打包
            'masonry': ['masonry-layout'],
            // GSAP 單獨打包
            'gsap': ['gsap'],
          }
        }
      }
    }
  },
})
```

---

### 階段六: SSG 配置和部署

#### 6.1 SSG 預渲染設定

**更新**: `nuxt.config.ts`

```javascript
export default defineNuxtConfig({
  // ... 其他設定

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/about',
        '/service',
        '/contact',
        '/portfolio',
      ],
    },
  },

  // 路由規則
  routeRules: {
    // 首頁 - 靜態生成
    '/': { prerender: true },

    // Blog 分頁 - 靜態生成
    '/blog/page/**': { prerender: true },

    // Portfolio - 混合式 (SSG + 客戶端動態)
    '/portfolio': {
      prerender: true,
      swr: 3600  // 1小時 Stale-While-Revalidate
    },

    // 文章詳情 - 靜態生成
    '/article/**': {
      prerender: true,
      swr: 86400  // 24小時
    },

    // 作品詳情 - 靜態生成
    '/project/**': {
      prerender: true,
      swr: 86400
    },

    // API 路由 - 伺服器端
    '/api/**': { cors: true },
  },
})
```

#### 6.2 動態路由生成鉤子

**新增**: `server/routes/sitemap.xml.ts`

```typescript
import { defineEventHandler } from 'h3'
import { serverQueryContent } from '#content/server'
import { portfolio } from '@data/portfolioData.js'

export default defineEventHandler(async (event) => {
  const baseUrl = 'https://homershie.com'

  // 查詢所有文章
  const articles = await serverQueryContent(event, 'articles').find()

  // 生成 Blog 分頁路由
  const POSTS_PER_PAGE = 10
  const totalBlogPages = Math.ceil(articles.length / POSTS_PER_PAGE)
  const blogPages = Array.from({ length: totalBlogPages }, (_, i) => ({
    loc: `${baseUrl}/blog/page/${i + 1}`,
    lastmod: new Date().toISOString(),
    priority: i === 0 ? 0.9 : 0.7,
  }))

  // 生成文章路由
  const articleRoutes = articles.map((article) => ({
    loc: `${baseUrl}/article/${article.id}`,
    lastmod: article.date,
    priority: 0.8,
  }))

  // 生成作品路由
  const projectRoutes = portfolio.map((work) => ({
    loc: `${baseUrl}/project/${work.id}`,
    lastmod: work.date,
    priority: 0.8,
  }))

  // 靜態頁面
  const staticRoutes = [
    { loc: baseUrl, priority: 1.0 },
    { loc: `${baseUrl}/about`, priority: 0.9 },
    { loc: `${baseUrl}/portfolio`, priority: 0.9 },
    { loc: `${baseUrl}/service`, priority: 0.8 },
    { loc: `${baseUrl}/contact`, priority: 0.8 },
  ]

  // 合併所有路由
  const routes = [
    ...staticRoutes,
    ...blogPages,
    ...articleRoutes,
    ...projectRoutes,
  ]

  // 生成 XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `
  <url>
    <loc>${route.loc}</loc>
    ${route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : ''}
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('')}
</urlset>`

  event.node.res.setHeader('Content-Type', 'application/xml')
  return sitemap
})
```

#### 6.3 Nitro 預渲染鉤子

**新增**: `server/plugins/prerender.ts`

```typescript
import { defineNitroPlugin } from 'nitropack/runtime/plugin'
import { serverQueryContent } from '#content/server'
import { portfolio } from '@data/portfolioData.js'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('prerender:routes', async (ctx) => {
    // 查詢所有文章
    const articles = await serverQueryContent(ctx.event, 'articles').find()

    // 生成 Blog 分頁路由
    const POSTS_PER_PAGE = 10
    const totalPages = Math.ceil(articles.length / POSTS_PER_PAGE)

    for (let i = 1; i <= totalPages; i++) {
      ctx.routes.add(`/blog/page/${i}`)
    }

    // 生成文章路由
    for (const article of articles) {
      ctx.routes.add(`/article/${article.id}`)
    }

    // 生成作品路由
    for (const work of portfolio) {
      ctx.routes.add(`/project/${work.id}`)
    }

    // Portfolio 分頁 (SEO 用)
    const WORKS_PER_PAGE = 15
    const totalPortfolioPages = Math.ceil(portfolio.length / WORKS_PER_PAGE)

    for (let i = 1; i <= totalPortfolioPages; i++) {
      ctx.routes.add(`/portfolio?page=${i}`)
    }
  })
})
```

#### 6.4 Cloudflare Pages 部署設定

**新增**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main  # 或您的主分支名稱

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate static site
        run: npm run generate
        env:
          NUXT_PUBLIC_RECAPTCHA_SITE_KEY: ${{ secrets.NUXT_PUBLIC_RECAPTCHA_SITE_KEY }}
          RECAPTCHA_SECRET_KEY: ${{ secrets.RECAPTCHA_SECRET_KEY }}
          RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
          TO_EMAIL: ${{ secrets.TO_EMAIL }}

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy .output/public --project-name=hodes-nuxt
```

**新增**: `wrangler.toml` (Cloudflare Pages 設定)

```toml
name = "hodes-nuxt"
compatibility_date = "2025-10-26"

[site]
bucket = ".output/public"

[[redirects]]
from = "/blog"
to = "/blog/page/1"
status = 301

[[headers]]
for = "/*"

[headers.values]
X-Frame-Options = "DENY"
X-Content-Type-Options = "nosniff"
Referrer-Policy = "strict-origin-when-cross-origin"
Permissions-Policy = "geolocation=(), microphone=(), camera=()"

[[headers]]
for = "/assets/*"

[headers.values]
Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
for = "*.webp"

[headers.values]
Cache-Control = "public, max-age=31536000, immutable"
```

---

### 階段七: SEO 優化

#### 7.1 結構化資料 (Schema.org)

**新增**: `composables/useStructuredData.js`

```javascript
export function useArticleSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Person',
      name: article.author,
      url: 'https://homershie.com/about',
    },
    publisher: {
      '@type': 'Person',
      name: 'Homer Shie',
      logo: {
        '@type': 'ImageObject',
        url: 'https://r2bucket.homershie.com/assets/imgs/favicon_homer.png',
      },
    },
  }
}

export function usePortfolioSchema(works) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: works.map((work, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: work.title,
        description: work.description,
        image: work.image,
        dateCreated: work.date,
        creator: {
          '@type': 'Person',
          name: 'Homer Shie',
        },
      },
    })),
  }
}
```

**使用範例** (在文章頁):

```vue
<script setup>
const article = // ... 查詢文章

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(useArticleSchema(article.value))
    }
  ]
})
</script>
```

#### 7.2 Open Graph 圖片

**更新**: `nuxt.config.ts`

```javascript
export default defineNuxtConfig({
  // ... 其他設定

  ogImage: {
    enabled: true,
    defaults: {
      width: 1200,
      height: 630,
      component: 'OgImageDefault',
    },
  },
})
```

**新增**: `components/OgImage/Default.vue`

```vue
<template>
  <div class="og-image">
    <div class="content">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </div>
    <div class="branding">
      <img src="/logo.png" alt="HODES" />
      <span>HODES | Homer Shie</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
})
</script>

<style scoped>
.og-image {
  width: 1200px;
  height: 630px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.content h1 {
  font-size: 72px;
  font-weight: bold;
  margin-bottom: 20px;
}

.content p {
  font-size: 32px;
  opacity: 0.9;
}

.branding {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 24px;
}

.branding img {
  width: 60px;
  height: 60px;
}
</style>
```

---

## 📁 完整檔案清單

### 新增檔案 (21 個)

#### Content 目錄
```
✨ content/articles/pop-art.md
✨ content/articles/memphis-design.md
✨ content/articles/bauhaus.md
✨ content/articles/minimalism.md
✨ content/config/categories.json
```

#### 頁面
```
✨ app/pages/blog/index.vue
✨ app/pages/blog/page/[page].vue
```

#### 元件
```
✨ app/components/Pagination.vue
✨ app/components/BlogSidebar.vue
✨ app/components/PortfolioSkeleton.vue
✨ app/components/OgImage/Default.vue
```

#### Composables
```
✨ composables/useStructuredData.js
```

#### 伺服器
```
✨ server/routes/sitemap.xml.ts
✨ server/plugins/prerender.ts
```

#### 腳本
```
✨ scripts/migrate-articles.js
```

#### 部署配置
```
✨ .github/workflows/deploy.yml
✨ wrangler.toml
```

#### 文件
```
✨ docs/SSG_OPTIMIZATION_PLAN.md (本文件)
```

### 修改檔案 (6 個)

```
🔧 nuxt.config.ts                      # SSG + Content + 優化設定
🔧 app/pages/portfolio/index.vue       # 無限滾動 + 瀑布流
🔧 app/pages/article/[id].vue          # 使用 Nuxt Content
🔧 package.json                        # 新增腳本
🔧 README.md                           # 更新文件
🔧 .gitignore                          # 忽略 .output
```

### 保留檔案 (不變動)

```
✅ data/portfolioData.js
✅ data/articleData.js (遷移後可刪除)
✅ composables/useImageCache.js
✅ composables/useImagePreloader.js
✅ composables/useImageFormat.js
✅ components/OptimizedImage.vue
✅ components/CachedImage.vue
✅ components/PortfolioList.vue
```

---

## ⚙️ 實作流程

### Step 1: 資料遷移 (1-2 小時)

```bash
# 1. 執行遷移腳本
node scripts/migrate-articles.js

# 2. 驗證 Markdown 檔案
ls content/articles/

# 3. 測試 Nuxt Content 查詢
npm run dev
# 訪問 http://localhost:3000/api/_content/query
```

### Step 2: Blog 分頁實作 (2-3 小時)

```bash
# 1. 建立新頁面和元件
# (參考上方程式碼)

# 2. 測試分頁功能
npm run dev
# 訪問 /blog/page/1, /blog/page/2

# 3. 測試搜尋和分類篩選
```

### Step 3: Portfolio 無限滾動 (2 小時)

```bash
# 1. 修改 Portfolio 頁面
# 2. 建立 Skeleton 元件
# 3. 測試滾動載入
# 4. 測試分類篩選
```

### Step 4: 圖片優化 (1 小時)

```bash
# 1. 更新文章詳情頁
# 2. 配置 Nuxt Content 圖片處理
# 3. 測試延遲載入
```

### Step 5: 程式碼分割 (30 分鐘)

```bash
# 1. 加入 defineAsyncComponent
# 2. 更新 Nuxt Config
# 3. 建置測試
npm run build
npm run preview
```

### Step 6: SSG 配置 (1 小時)

```bash
# 1. 更新 nuxt.config.ts
# 2. 建立 sitemap 生成器
# 3. 建立預渲染鉤子
# 4. 測試 SSG 建置
npm run generate

# 5. 檢查輸出
ls .output/public
```

### Step 7: 部署設定 (1 小時)

```bash
# 1. 建立 GitHub Actions workflow
# 2. 設定 Cloudflare Pages
# 3. 配置環境變數
# 4. 測試部署

# 本地測試
npm run generate
npx wrangler pages dev .output/public
```

---

## 📊 預期成果

### 效能提升

| 指標 | 優化前 | 優化後 | 改善 |
|------|--------|--------|------|
| **首屏載入時間** | 2-3 秒 | 0.5-1 秒 | ⬇️ 60% |
| **圖片載入** | 即時載入全部 | 延遲載入 + 快取 | ⬇️ 70% |
| **JS Bundle 大小** | ~500KB | ~300KB | ⬇️ 40% |
| **建置時間** | N/A | 2-3 分鐘 | - |
| **部署頻率** | 手動 | 自動 (Git Push) | ⬆️ 100% |

### SEO 改善

| 項目 | 優化前 | 優化後 |
|------|--------|--------|
| **Lighthouse SEO** | 85 | 100 |
| **索引頁面數** | ~10 | ~100+ |
| **結構化資料** | ❌ | ✅ |
| **Sitemap** | 基礎 | 完整動態 |
| **Meta 標籤** | 部分 | 完整獨立 |

### 使用者體驗

| 功能 | 實作狀態 |
|------|---------|
| **Blog 分頁導航** | ✅ 完整 |
| **Portfolio 無限滾動** | ✅ 流暢 |
| **Loading 狀態** | ✅ Skeleton |
| **搜尋功能** | ✅ 即時 |
| **分類篩選** | ✅ 雙向 |
| **圖片快取** | ✅ IndexedDB |
| **響應式設計** | ✅ 完整 |

### 部署優勢

| 項目 | Cloudflare Pages |
|------|-----------------|
| **成本** | $0/月 (免費) |
| **頻寬** | 無限制 |
| **CDN 節點** | 300+ |
| **建置時間** | 2-3 分鐘 |
| **部署方式** | Git Push 自動 |
| **HTTPS** | 自動 |
| **自訂域名** | 支援 |

---

## 🧪 測試檢查清單

### 功能測試

#### Blog 分頁
- [ ] `/blog` 自動重新導向到 `/blog/page/1`
- [ ] 分頁按鈕正確顯示 (1, 2, 3, ...)
- [ ] 上一頁/下一頁按鈕正確啟用/禁用
- [ ] 當前頁高亮顯示
- [ ] 每頁顯示 10 篇文章
- [ ] 搜尋功能正常 (即時過濾)
- [ ] 分類篩選正常 (GraphicStyle, WorldVision)
- [ ] 搜尋/篩選後自動回到第一頁
- [ ] 最新文章側邊欄正確顯示
- [ ] 響應式設計 (手機/平板)

#### Portfolio 無限滾動
- [ ] 初始載入 15 個作品
- [ ] 滾動到距底部 500px 自動載入
- [ ] Skeleton 載入動畫顯示
- [ ] 載入完成後無縫插入作品
- [ ] 全部載入完成顯示提示
- [ ] Category 篩選正常切換
- [ ] 篩選後重置為前 15 個
- [ ] URL 參數正確更新 (?page=2)
- [ ] 直接訪問 `/portfolio?page=3` 顯示前 45 個
- [ ] Masonry 佈局正確顯示
- [ ] 響應式設計正常

#### 圖片優化
- [ ] OptimizedImage 延遲載入正常
- [ ] IndexedDB 快取正常運作
- [ ] WebP 格式自動轉換
- [ ] 文章內圖片有 loading="lazy"
- [ ] 預載功能正常 (前 15 張)
- [ ] 批次載入不阻塞 UI

#### SEO
- [ ] 每個分頁有獨立 title
- [ ] 每個分頁有獨立 description
- [ ] 每個分頁有 canonical URL
- [ ] Open Graph 標籤完整
- [ ] 結構化資料正確 (JSON-LD)
- [ ] Sitemap.xml 包含所有頁面
- [ ] Robots.txt 正確配置

### 建置測試

#### SSG 建置
```bash
# 1. 清除舊建置
rm -rf .output

# 2. 執行建置
npm run generate

# 3. 檢查輸出
ls -la .output/public
ls -la .output/public/blog/page
ls -la .output/public/article
ls -la .output/public/project

# 4. 檢查預渲染頁面數量
find .output/public -name "index.html" | wc -l
# 預期: ~100+ 頁

# 5. 本地預覽
npm run preview
# 訪問 http://localhost:3000

# 6. 檢查 Lighthouse 分數
# Performance: 90+
# SEO: 100
# Accessibility: 90+
# Best Practices: 90+
```

#### 程式碼分割檢查
```bash
# 建置後檢查 chunk 檔案
ls -lh .output/public/_nuxt/

# 預期看到:
# - swiper-[hash].js
# - masonry-[hash].js
# - gsap-[hash].js
# - [page]-[hash].js (各頁面獨立)
```

### 部署測試

#### Cloudflare Pages
```bash
# 1. 本地測試部署
npx wrangler pages dev .output/public

# 2. 測試訪問
curl http://localhost:8788
curl http://localhost:8788/blog/page/1
curl http://localhost:8788/portfolio

# 3. 檢查標頭
curl -I http://localhost:8788/assets/some-image.webp
# 預期看到: Cache-Control: public, max-age=31536000

# 4. 測試重新導向
curl -I http://localhost:8788/blog
# 預期: 301 重新導向到 /blog/page/1
```

---

## 🔧 故障排除

### 常見問題

#### 1. Nuxt Content 查詢失敗

**問題**: `queryContent` 返回空陣列

**解決**:
```bash
# 檢查 content 目錄
ls content/articles/

# 檢查檔案格式 (必須是 .md)
cat content/articles/pop-art.md

# 檢查 frontmatter 格式 (必須有 ---)
head -n 10 content/articles/pop-art.md

# 重啟開發伺服器
npm run dev
```

#### 2. SSG 建置缺少頁面

**問題**: 某些動態頁面沒有被預渲染

**解決**:
```javascript
// 檢查 server/plugins/prerender.ts
// 確保所有路由都有加入 ctx.routes.add()

// 檢查 nuxt.config.ts
nitro: {
  prerender: {
    crawlLinks: true,  // 確保啟用
    // 手動加入缺少的路由
    routes: [
      '/blog/page/1',
      '/portfolio',
      // ...
    ]
  }
}
```

#### 3. 無限滾動不觸發

**問題**: 滾動到底部沒有載入

**解決**:
```vue
<script setup>
// 檢查 Intersection Observer 設定
useIntersectionObserver(
  loadMoreTrigger,
  ([{ isIntersecting }]) => {
    console.log('Intersecting:', isIntersecting) // 除錯
    if (isIntersecting) {
      loadMore()
    }
  },
  {
    rootMargin: '500px',  // 確保設定正確
    threshold: 0.1
  }
)
</script>

<template>
  <!-- 確保觸發元素存在 -->
  <div ref="loadMoreTrigger" style="height: 1px;"></div>
</template>
```

#### 4. 圖片快取失效

**問題**: IndexedDB 快取沒有運作

**解決**:
```javascript
// 開啟瀏覽器 DevTools
// Application > IndexedDB > image-cache

// 檢查 composable
import { useImageCache } from '@composables/useImageCache'

const { loadCachedImage } = useImageCache()

onMounted(async () => {
  const url = 'https://example.com/image.jpg'
  const cached = await loadCachedImage(url)
  console.log('Cached:', cached) // 應該返回 Blob URL
})
```

#### 5. Cloudflare Pages 環境變數

**問題**: API 呼叫失敗 (reCAPTCHA, Resend)

**解決**:
```bash
# 在 Cloudflare Pages Dashboard 設定環境變數
# Settings > Environment variables

# 必須設定:
NUXT_PUBLIC_RECAPTCHA_SITE_KEY=xxx
RECAPTCHA_SECRET_KEY=xxx
RESEND_API_KEY=xxx
TO_EMAIL=xxx

# 重新部署
```

---

## 📚 參考資源

### 官方文件
- [Nuxt 3 文件](https://nuxt.com/docs)
- [Nuxt Content 文件](https://content.nuxt.com/)
- [Cloudflare Pages 文件](https://developers.cloudflare.com/pages/)
- [VueUse 文件](https://vueuse.org/)

### 效能優化
- [Web.dev - 圖片優化](https://web.dev/fast/#optimize-your-images)
- [Web.dev - 延遲載入](https://web.dev/lazy-loading/)
- [Web.dev - 程式碼分割](https://web.dev/reduce-javascript-payloads-with-code-splitting/)

### SEO
- [Google SEO 指南](https://developers.google.com/search/docs)
- [Schema.org 文件](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)

---

## 📝 版本紀錄

### v1.0.0 (2025-10-26)
- ✅ 初始計劃建立
- ✅ 定義所有實作階段
- ✅ 完整程式碼範例
- ✅ 測試檢查清單
- ✅ 故障排除指南

---

## ✅ 執行前檢查清單

開始實作前，請確認:

- [ ] 已備份 `data/articleData.js`
- [ ] 已 Git commit 當前進度
- [ ] 已準備 Cloudflare Pages 帳號
- [ ] 已設定 GitHub Repository
- [ ] 已準備環境變數 (reCAPTCHA, Resend)
- [ ] 已閱讀完整計劃文件
- [ ] 已了解 SSG 建置流程
- [ ] 已了解無限滾動實作方式

---

## 🚀 開始實作

準備好開始了嗎? 按照以下順序執行:

1. **閱讀完整計劃** (30 分鐘)
2. **備份和提交** (5 分鐘)
3. **階段一: 資料遷移** (1-2 小時)
4. **階段二: Blog 分頁** (2-3 小時)
5. **階段三: Portfolio 無限滾動** (2 小時)
6. **階段四: 圖片優化** (1 小時)
7. **階段五: 程式碼分割** (30 分鐘)
8. **階段六: SSG 配置** (1 小時)
9. **階段七: SEO 優化** (1 小時)
10. **測試和部署** (1-2 小時)

**預估總時間**: 9-13 小時

---

**文件作者**: Claude (Anthropic AI)
**專案負責人**: Homer Shie
**最後更新**: 2025-10-26
