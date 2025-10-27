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
                <NuxtLink :to="`/article/${post.id}`">
                  <div class="img">
                    <OptimizedImage :src="post.image" :alt="post.title" priority="normal" />
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
              v-if="totalPages > 1"
              :current-page="currentPage"
              :total-pages="totalPages"
              :base-url="'/blog/page'"
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
import { ref, computed } from 'vue'

// 取得路由參數
const route = useRoute()
const currentPage = computed(() => parseInt(route.params.page) || 1)

// 從 Nuxt Content 查詢所有文章
const { data: allArticles } = await useAsyncData('articles', () =>
  queryContent('articles').sort({ date: -1 }).find()
)

const allPosts = computed(() => allArticles.value || [])

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
    day: 'numeric',
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
    const categoryName = selectedCategory.value === 'GraphicStyle' ? '視覺風格大全' : '世界視界'
    return `${categoryName} 分類的部落格文章，第 ${currentPage.value} 頁`
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
  link: [{ rel: 'canonical', href: `https://homershie.com/blog/page/${currentPage.value}` }],
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
  display: block;
}
</style>
