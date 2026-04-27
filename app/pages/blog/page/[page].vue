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
                  <h6>{{ t('blog.section_label') }}</h6>
                </div>
              </div>
              <h3>{{ t('blog.heading') }}</h3>
            </div>
          </div>
        </div>

        <!-- 小螢幕設備上顯示在頂部的側邊欄內容 -->
        <div class="row mb-50 d-lg-none">
          <div class="col-12">
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

        <div class="row lg-marg justify-content-center">
          <!-- 文章列表 -->
          <div class="col-lg-7">
            <div class="md-mb80">
              <div
                v-for="post in paginatedPosts"
                :key="post.id"
                class="item pb-50 mb-50 bord-thin-bottom blog-post"
              >
                <NuxtLink :to="localePath(`/article/${post.id}`)">
                  <div class="img">
                    <OptimizedImage :src="post.image" :alt="post.title" priority="normal" />
                  </div>
                </NuxtLink>
                <div class="cont mt-30">
                  <span class="date mb-10">{{ formatDate(post.date) }}</span>
                  <h4 class="mb-15 post-title">
                    <NuxtLink :to="localePath(`/article/${post.id}`)">
                      {{ post.title }}
                    </NuxtLink>
                  </h4>
                  <p>{{ post.excerpt }}</p>
                  <NuxtLink :to="localePath(`/article/${post.id}`)" class="mt-15 read-more">
                    {{ t('blog.read_more') }} <i class="fas fa-arrow-right ml-10"></i>
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- 分頁控制 -->
            <Pagination
              v-if="totalPages > 1"
              :current-page="currentPage"
              :total-pages="totalPages"
              :base-url="paginationBaseUrl"
            />
          </div>

          <!-- 側邊欄（大螢幕） -->
          <div class="col-lg-4 d-none d-lg-block">
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
import { ref, computed, onMounted } from 'vue'
import { articles as legacyArticles } from '@data/articleData.js'
import categories from '../../../../content/config/categories.json'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const paginationBaseUrl = computed(() => localePath('/blog/page'))
// 不再自動從 body 擷取，僅使用 frontmatter 與舊資料作為回退

// 今日日期時間戳（null = server-side，不過濾；client 掛載後設定）
const today = ref(null)
onMounted(() => {
  today.value = Date.now()
})

// 取得路由參數
const route = useRoute()
const currentPage = computed(() => parseInt(route.params.page) || 1)

// 從 path/stem 提取文章 slug（支援 zh-TW/articles/xxx、en/articles/xxx、articles/xxx）
function getArticleSlug(item) {
  const p = item.stem || item.path || item._path || ''
  const match = p.match(/\/?([^/]+)\/articles\/([^/]+)$/) || p.match(/articles\/([^/]+)/)
  return match ? (match[2] || match[1]) : (item.id || '')
}

// 判斷文章是否屬於當前語系（依 path/stem 或 frontmatter lang）
function isArticleForLocale(item, loc) {
  const meta = typeof item.meta === 'string' ? (() => { try { return JSON.parse(item.meta) } catch { return {} } })() : item.meta || {}
  const lang = meta?.lang || item.lang
  if (lang) return lang === loc || lang.replace('_', '-') === loc
  const p = (item.path || item.stem || item._path || '').toString()
  return p.includes(`/${loc}/`) || p.startsWith(`${loc}/`)
}

// 從 Nuxt Content 查詢所有文章 (使用 v3 API)
// 注意：v3 中只有一個 'content' collection
// getCachedData：Nuxt 4 預設在 client 端導覽時會重新 fetch，
// 加此選項讓 client 優先使用 SSR payload 的資料，避免打 /__nuxt_content API
// 注意：不設 server: true，確保 getCachedData 回傳 undefined 時（_payload.json 尚未載入）
// client 端能執行 fallback fetch，避免從外部連結冷啟動時文章消失
const { data: allArticles, error } = await useAsyncData(
  'all-articles',
  () => queryCollection('content').all(),
  {
    lazy: false,
    getCachedData(key, nuxtApp) {
      return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
    },
  }
)

// 調試用：檢查是否有錯誤
if (error.value) {
  // eslint-disable-next-line no-console
  console.error('Error loading articles:', error.value)
}

// 調試用：檢查文章數量和資料結構
if (import.meta.client) {
  // eslint-disable-next-line no-console
  console.log('Articles loaded:', allArticles.value?.length || 0)
  // eslint-disable-next-line no-console
  console.log('First article data:', allArticles.value?.[0])
}

// 從 route 取得當前語系（prerender 時更可靠）
const currentLocale = computed(() => {
  const seg = route.path.split('/').filter(Boolean)
  return seg[0] === 'zh-TW' || seg[0] === 'en' ? seg[0] : locale.value
})

const allPosts = computed(() => {
  const loc = currentLocale.value
  // 將資料庫返回的資料轉換為文章格式（依 locale 過濾）
  const articles = (allArticles.value || [])
    .filter(item => {
      const p = item.path || item.stem || item._path || ''
      return (p.includes('/articles/') || p.includes('articles/')) && isArticleForLocale(item, loc)
    })
    .map(item => {
      // 解析 meta JSON 欄位獲取 frontmatter 資料；若無 meta，嘗試直接使用項目本身（Nuxt Content 會將 frontmatter 提升為頂層欄位）
      const meta = typeof item.meta === 'string' ? JSON.parse(item.meta) : item.meta || item || {}
      // 從 path/stem 提取文章 ID
      const articleId = getArticleSlug(item) || meta.id || item.stem
      // 僅使用 frontmatter 與舊資料的 excerpt，不自動擷取
      const legacyExcerpt = legacyArticles?.[articleId]?.excerpt || ''
      const computedExcerpt = meta.excerpt || item.excerpt || legacyExcerpt
      if (import.meta.client) {
        // 調試：僅記錄前幾筆，避免噪音
        if (Math.random() < 0.05) {
          // eslint-disable-next-line no-console
          console.log('Excerpt debug:', {
            id: articleId,
            hasMetaExcerpt: Boolean(meta.excerpt),
            hasItemExcerpt: Boolean(item.excerpt),
            computedExcerptSample: (computedExcerpt || '').slice(0, 60),
          })
        }
      }
      return {
        id: articleId,
        title: item.title,
        date: meta.date,
        category: meta.category,
        categoryName: meta.categoryName,
        // 優先使用 meta.excerpt，否則回退到 item.excerpt（frontmatter 直出），最後從 body 取前 120 字
        excerpt: computedExcerpt,
        image: meta.image || meta.thumbnail || item.image || item.thumbnail,
        thumbnail: meta.thumbnail || meta.image || item.thumbnail || item.image,
        author: meta.author || item.author || 'Homer Shie',
        path: item.path,
      }
    })
    .filter(post => today.value === null || !post.date || new Date(String(post.date)).getTime() <= today.value)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

  // eslint-disable-next-line no-console
  console.log('All posts:', articles.length)
  return articles
})

// 搜尋和篩選
const searchQuery = ref('')
const selectedCategory = ref('all')

const filteredPosts = computed(() => {
  let posts = allPosts.value

  // 搜尋過濾
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    posts = posts.filter(
      post => post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query)
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
const totalPages = computed(() => Math.ceil(filteredPosts.value.length / POSTS_PER_PAGE))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE
  return filteredPosts.value.slice(start, end)
})

// 最新文章 (側邊欄)
const latestPosts = computed(() => allPosts.value.slice(0, 3))

// 處理搜尋
function handleSearch(query) {
  searchQuery.value = query
  // 搜尋後回到第一頁
  if (currentPage.value !== 1) {
    navigateTo(localePath('/blog/page/1'))
  }
}

// 處理分類篩選
function handleCategory(category) {
  selectedCategory.value = category
  // 篩選後回到第一頁
  if (currentPage.value !== 1) {
    navigateTo(localePath('/blog/page/1'))
  }
}

// 日期格式化
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// SEO Meta
useSeoMeta({
  title: computed(() =>
    currentPage.value === 1
      ? t('seo.blog.title')
      : t('seo.blog.title_paged', { page: currentPage.value })
  ),
  description: computed(() =>
    currentPage.value === 1
      ? t('seo.blog.description')
      : t('seo.blog.description_paged', { page: currentPage.value })
  ),
})

// 404 處理
if (currentPage.value > totalPages.value && totalPages.value > 0) {
  throw createError({
    statusCode: 404,
    message: '頁面不存在',
  })
}
</script>

<style scoped>
.blog-post {
  transition: transform 0.3s ease;
}

.blog-post:hover {
  transform: translateY(-5px);
}

.post-title a {
  color: var(--color-font);
  transition: color 0.3s ease;
}

.post-title a:hover {
  color: var(--maincolor);
}

.read-more {
  display: inline-flex;
  align-items: center;
  color: var(--maincolor);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.read-more:hover {
  gap: 10px;
}

.read-more i {
  transition: transform 0.3s ease;
}

.read-more:hover i {
  transform: translateX(5px);
}

.date {
  color: #999;
  font-size: 0.9rem;
  display: inline-block;
}
</style>
