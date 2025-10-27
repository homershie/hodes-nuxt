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
          :is-loading-more="isLoading"
          :items-per-page="ITEMS_PER_PAGE"
          @view-details="handleViewDetails"
        />
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useScroll, useIntersectionObserver } from '@vueuse/core'
import PortfolioList from '@components/PortfolioList.vue'
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

// 篩選後的作品（按 id 從大到小排序）
const filteredWorks = computed(() => {
  let works = []
  if (selectedCategory.value === 'all') {
    works = portfolioData.value
  } else {
    works = portfolioData.value.filter(work =>
      Array.isArray(work.category)
        ? work.category.includes(selectedCategory.value)
        : work.category === selectedCategory.value
    )
  }
  // 按 id 從大到小排序，讓最新的作品排在前面
  return [...works].sort((a, b) => b.id - a.id)
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

  // 模擬載入延遲 (可選)
  await new Promise(resolve => setTimeout(resolve, 300))

  currentPage.value++

  // 更新 URL (不刷新頁面)
  const query = { ...route.query, page: currentPage.value }
  if (selectedCategory.value !== 'all') {
    query.category = selectedCategory.value
  }
  router.replace({ query })

  // 預載新一批圖片
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = currentPage.value * ITEMS_PER_PAGE
  const newWorks = filteredWorks.value.slice(start, end)
  const imageUrls = newWorks.map(work => work.image || work.mainImage).filter(Boolean)
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
    ? { page: 1 }
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
  // 從 URL 初始化狀態（只讀取 category，page 總是從 1 開始）
  const categoryQuery = route.query.category || 'all'

  currentPage.value = 1
  selectedCategory.value = categoryQuery

  // 清理 URL 中的 page 參數（如果存在）
  if (route.query.page) {
    router.replace({
      query: categoryQuery !== 'all' ? { category: categoryQuery } : {}
    })
  }

  // 設定 Intersection Observer
  if (loadMoreTrigger.value) {
    useIntersectionObserver(
      loadMoreTrigger,
      ([{ isIntersecting }]) => {
        if (isIntersecting && hasMore.value && !isLoading.value) {
          loadMore()
        }
      },
      {
        rootMargin: `0px 0px ${LOAD_MORE_THRESHOLD}px 0px` // 提前 500px 觸發
      }
    )
  }

  // 預載初始圖片
  const imageUrls = displayedWorks.value.map(work => work.image || work.mainImage).filter(Boolean)
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
  font-size: 0.95rem;
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

.text-muted {
  color: #999;
  font-size: 0.95rem;
}

.mt-50 {
  margin-top: 3rem;
}

@media (max-width: 768px) {
  .category-filter {
    gap: 0.5rem;
  }

  .filter-btn {
    padding: 0.4rem 1rem;
    font-size: 0.875rem;
  }
}
</style>
