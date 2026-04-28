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
import articleList from '@data/articleList.generated.json'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const paginationBaseUrl = computed(() => localePath('/blog/page'))

// 今日日期時間戳（null = server-side，不過濾；client 掛載後設定）
const today = ref(null)
onMounted(() => {
  today.value = Date.now()
})

// 取得路由參數
const route = useRoute()
const currentPage = computed(() => parseInt(route.params.page) || 1)

// 從 route 取得當前語系（prerender 時更可靠）
const currentLocale = computed(() => {
  const seg = route.path.split('/').filter(Boolean)
  return seg[0] === 'zh-TW' || seg[0] === 'en' ? seg[0] : locale.value
})

// 直接使用 build-time 產出的 articleList.generated.json，避免在 client 端
// 透過 useAsyncData/queryCollection 觸發 cold-start hydration race condition
// （參考 nuxt.config.ts 的 generateArticleList()）。
const allPosts = computed(() => {
  const loc = currentLocale.value
  return articleList
    .filter(item => item.lang === loc)
    .map(item => {
      const slug = item.slug || item.id
      const fallbackExcerpt = legacyArticles?.[slug]?.excerpt || ''
      return {
        id: slug,
        title: item.title,
        date: item.date,
        category: item.category,
        categoryName: item.categoryName,
        excerpt: item.excerpt || fallbackExcerpt,
        image: item.image || item.thumbnail,
        thumbnail: item.thumbnail || item.image,
        author: item.author || 'Homer Shie',
        path: item.path,
      }
    })
    .filter(
      post =>
        today.value === null || !post.date || new Date(String(post.date)).getTime() <= today.value
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
