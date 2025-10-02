<template>
  <section class="portfolio section-padding">
    <div class="container">
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

      <!-- 閱讀進度條 -->
      <div class="reading-progress-bar" :style="{ width: progress + '%' }"></div>

      <!-- 作品列表 -->
      <div class="portfolio-list">
        <PortfolioList :works="portfolioData" @view-details="handleViewDetails" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import PortfolioList from '@/components/PortfolioList.vue'
import { useImageCache } from '@/composables/useImageCache'
import { usePortfolio } from '@/composables/usePortfolio.js'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useScroll, useIntersectionObserver } from '@vueuse/core'

const { preloadImages, startCacheCleanup, stopCacheCleanup } = useImageCache()
const { portfolioData } = usePortfolio()
const router = useRouter()

const { y } = useScroll(window)
const progress = computed(() => {
  const scrollTop = y.value
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  return docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
})

function handleViewDetails(work) {
  router.push(`/project/${work.id}`)
}

const workRefs = ref([])
const visibleWorks = ref([])

onMounted(() => {
  workRefs.value.forEach((el, idx) => {
    useIntersectionObserver(
      el,
      ([{ isIntersecting }]) => {
        if (isIntersecting) visibleWorks.value[idx] = true
      },
      { threshold: 0.1 }
    )
  })
})

// 預載入多張圖片
const preloadGalleryImages = async () => {
  const imageUrls = portfolioData.value.map(work => work.image)
  await preloadImages(imageUrls)
}

// 在元件掛載時預載入圖片
onMounted(async () => {
  await preloadGalleryImages()
  // 初始化快取清理
  startCacheCleanup()
})

onUnmounted(() => {
  stopCacheCleanup()
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

.portfolio-item {
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}
.portfolio-item.fade-in {
  opacity: 1;
  transform: translateY(0);
}
</style>
