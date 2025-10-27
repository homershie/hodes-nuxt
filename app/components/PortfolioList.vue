<template>
  <div class="portfolio">
    <!-- 載入進度顯示 -->
    <div v-if="isPreloading" class="loading-progress">
      <div class="progress-bar">
        <div class="progress" :style="{ width: `${loadingProgress}%` }"></div>
      </div>
      <div class="progress-text">載入中... {{ loadingProgress }}%</div>
    </div>

    <!-- 作品列表 -->
    <div class="gallery">
      <div class="row">
        <div
          v-for="(work, index) in displayedWorks"
          :key="work.id"
          class="col-lg-4 items masonry-item"
          :data-index="index"
        >
          <div class="item">
            <div class="img">
              <img :src="work.image" :alt="work.title" class="radius-5 w-100" />
              <a href="#0" class="link" @click.prevent="viewDetails(work)"></a>
            </div>
            <div class="cont d-flex align-items-center">
              <div class="content-area">
                <h6 class="work-title">{{ work.title }}</h6>
                <div class="tags-container">
                  <span
                    v-for="(tag, tagIndex) in work.category"
                    :key="tagIndex"
                    class="tag clickable-tag"
                    @click.stop="handleTagClick(tag)"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="ml-auto">
                <div class="arrow">
                  <a href="#0" @click.prevent="viewDetails(work)">
                    <svg
                      class="arrow-right"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 34.2 32.3"
                      style="stroke-width: 2"
                    >
                      <line x1="0" y1="16" x2="33" y2="16"></line>
                      <line x1="17.3" y1="0.7" x2="33.2" y2="16.5"></line>
                      <line x1="17.3" y1="31.6" x2="33.5" y2="15.4"></line>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading Skeleton (在瀑布流內部) -->
        <template v-if="isLoadingMore">
          <div
            v-for="i in itemsPerPage"
            :key="`skeleton-${i}`"
            class="col-lg-4 items skeleton-item"
            :class="{ 'skeleton-loading': isLoadingMore }"
          >
            <div class="skeleton-image"></div>
            <div class="skeleton-title"></div>
            <div class="skeleton-category"></div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useImagePreloader } from '@composables/useImagePreloader'
import { useEventListener, useIntersectionObserver, useTimeoutFn } from '@vueuse/core'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  works: {
    type: Array,
    required: true,
  },
  isLoadingMore: {
    type: Boolean,
    default: false,
  },
  itemsPerPage: {
    type: Number,
    default: 15,
  },
})

const emit = defineEmits(['view-details', 'tag-click'])

function viewDetails(work) {
  emit('view-details', work)
}

function handleTagClick(tag) {
  emit('tag-click', tag)
}

// 直接使用傳入的 works，父組件已經處理了排序
const displayedWorks = computed(() => props.works)

const { preloadImages, loadingProgress, isPreloading } = useImagePreloader()

let masonryInstance = null

// 初始化 Masonry
const initMasonry = async () => {
  // 只在客戶端執行
  if (!import.meta.client) return

  const container = document.querySelector('.gallery')
  if (!container) return

  if (masonryInstance) {
    masonryInstance.destroy()
  }

  // 動態載入 masonry-layout
  const { default: Masonry } = await import('masonry-layout')

  masonryInstance = new Masonry(container, {
    itemSelector: '.items',
    columnWidth: '.items',
    percentPosition: true,
    gutter: 0,
    transitionDuration: 0,
    stagger: 30,
    initLayout: true,
  })
}

// 等待短暫延遲，用於確保 DOM 更新
const waitForDomUpdate = () => {
  return new Promise(resolve => {
    useTimeoutFn(resolve, 50)
  })
}

// 等待所有圖片載入完成
const waitForImagesToLoad = () => {
  return new Promise(resolve => {
    const images = document.querySelectorAll('.gallery .img img')
    if (images.length === 0) {
      resolve()
      return
    }

    let loadedCount = 0
    const totalImages = images.length

    const checkComplete = () => {
      loadedCount++
      if (loadedCount === totalImages) {
        // 額外等待一小段時間確保布局穩定，並強制圖片重新渲染
        setTimeout(() => {
          // 觸發瀏覽器重新計算布局
          images.forEach(img => {
            if (img.naturalWidth === 0) {
              // 如果圖片未成功載入，設定一個最小高度
              img.style.minHeight = '200px'
            }
          })
          resolve()
        }, 100)
      }
    }

    images.forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        checkComplete()
      } else {
        img.addEventListener('load', checkComplete, { once: true })
        img.addEventListener('error', () => {
          // 圖片載入失敗時設定預設高度
          img.style.minHeight = '200px'
          checkComplete()
        })
      }
    })

    // 設定超時，避免無限等待
    setTimeout(() => {
      if (loadedCount < totalImages) {
        // 靜默處理超時情況
        resolve()
      }
    }, 5000)
  })
}

// 為新項目設置動畫
const setupAnimationsForNewItems = (specificItems = null) => {
  // 選擇要設置動畫的項目
  const items = specificItems || document.querySelectorAll('.items')
  const itemsToAnimate = Array.isArray(items) ? items : Array.from(items)

  // 僅為未動畫的項目設定初始狀態（跳過 skeleton）
  itemsToAnimate.forEach(item => {
    if (!item.classList.contains('animated') && !item.classList.contains('skeleton-item')) {
      // 如果項目已經隱藏，保持隱藏狀態
      const isHidden = item.style.visibility === 'hidden'
      if (!isHidden) {
        gsap.set(item, { opacity: 0, y: 50 })
      }
    }
  })

  // 使用 VueUse 的 useIntersectionObserver（跳過 skeleton）
  itemsToAnimate.forEach(item => {
    if (!item.classList.contains('animated') && !item.classList.contains('skeleton-item')) {
      const { stop } = useIntersectionObserver(
        item,
        ([{ isIntersecting, target }]) => {
          if (isIntersecting && !target.classList.contains('animated')) {
            target.classList.add('animated')

            // 確保項目可見
            target.style.visibility = 'visible'

            gsap.to(target, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              onComplete: () => {
                // 動畫完成後重新布局 Masonry
                if (masonryInstance) {
                  masonryInstance.layout()
                }
              },
            })

            stop()
          }
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -10% 0px',
        }
      )
    }
  })
}

// 監聽 works 變化，更新 Masonry 布局
watch(
  () => props.works,
  async (newWorks, oldWorks) => {
    // 有新作品加入或分類切換
    if (newWorks.length !== (oldWorks?.length || 0) || newWorks.length === 0) {
      await nextTick()

      // 先隱藏所有項目，避免閃爍
      const allItems = document.querySelectorAll('.items')

      // 如果有舊作品，先隱藏它們
      if (oldWorks && oldWorks.length > 0) {
        const oldItems = Array.from(allItems).slice(0, oldWorks.length)
        oldItems.forEach(item => {
          if (!item.classList.contains('skeleton-item')) {
            item.style.opacity = '0'
            item.style.visibility = 'hidden'
          }
        })
      }

      // 如果是分類切換（數量不同或清空），需要重新初始化
      if (newWorks.length === 0 || (oldWorks && oldWorks.length !== newWorks.length)) {
        // 等待圖片載入完成
        await waitForImagesToLoad()

        // 等待內容渲染完成
        await new Promise(resolve => setTimeout(resolve, 100))

        if (masonryInstance) {
          masonryInstance.reloadItems()
          masonryInstance.layout()
        }

        // 顯示所有項目
        const newItems = Array.from(allItems).filter(
          item => !item.classList.contains('skeleton-item')
        )

        newItems.forEach(item => {
          item.style.visibility = 'visible'
          item.style.opacity = '1'
        })

        // 再次等待布局穩定後重新計算
        await new Promise(resolve => setTimeout(resolve, 50))

        if (masonryInstance) {
          masonryInstance.layout()
        }

        // 為所有項目重新設置動畫
        setupAnimationsForNewItems()
        return
      }

      // 有新作品加入
      if (newWorks.length > (oldWorks?.length || 0)) {
        const newItems = Array.from(allItems).slice(oldWorks?.length || 0)

        // 為新項目添加 CSS 類別來控制顯示
        newItems.forEach(item => {
          // 跳過 skeleton 項目
          if (!item.classList.contains('skeleton-item')) {
            item.classList.add('new-item')
            item.style.opacity = '0'
            item.style.visibility = 'hidden'
          }
        })

        // 等待圖片載入完成
        await waitForImagesToLoad()

        if (masonryInstance) {
          // 重新載入所有項目
          masonryInstance.reloadItems()
          masonryInstance.layout()
        }

        // 延遲顯示新項目，確保布局完成
        await new Promise(resolve => setTimeout(resolve, 100))

        // 顯示新項目並設置動畫（跳過 skeleton）
        newItems.forEach(item => {
          if (!item.classList.contains('skeleton-item')) {
            item.classList.remove('new-item')
            item.classList.add('ready')
            item.style.visibility = 'visible'
            item.style.opacity = '1'
          }
        })

        // 為新項目設置動畫（跳過 skeleton）
        const nonSkeletonItems = newItems.filter(item => !item.classList.contains('skeleton-item'))
        setupAnimationsForNewItems(nonSkeletonItems)
      }
    }
  },
  { deep: false }
)

// 監聽 skeleton 載入狀態
watch(
  () => props.isLoadingMore,
  async isLoading => {
    if (isLoading) {
      // 開始載入時，先等待 DOM 更新
      await nextTick()

      // 保持 skeleton 的初始隱藏狀態
      const skeletonItems = document.querySelectorAll('.skeleton-item')
      skeletonItems.forEach(item => {
        // 保持隱藏狀態，但留出空間
        item.classList.add('skeleton-visible')
        item.style.opacity = '0'
        item.style.visibility = 'visible'
        item.style.height = '0'
      })

      // 等待 DOM 更新
      await waitForDomUpdate()

      if (masonryInstance) {
        masonryInstance.reloadItems()
        masonryInstance.layout()
      }

      // 漸進式顯示 skeleton
      await new Promise(resolve => setTimeout(resolve, 50))

      skeletonItems.forEach(item => {
        item.style.opacity = '1'
        item.style.height = '' // 恢復高度
      })
    } else {
      // 載入完成時，移除所有 skeleton 項目
      const skeletonItems = document.querySelectorAll('.skeleton-item')
      skeletonItems.forEach(item => {
        item.classList.remove('skeleton-visible', 'skeleton-hidden')
        item.style.opacity = '0'
        item.style.visibility = 'hidden'
        item.style.height = '0'
      })

      // 等待一小段時間後重新布局
      await new Promise(resolve => setTimeout(resolve, 50))

      if (masonryInstance) {
        masonryInstance.reloadItems()
        masonryInstance.layout()
      }
    }
  }
)

onMounted(async () => {
  // 只在客戶端執行
  if (!import.meta.client) return

  // 等待 DOM 更新
  await waitForDomUpdate()

  // 等待圖片載入完成
  await waitForImagesToLoad()

  // 再次等待 DOM 更新
  await waitForDomUpdate()

  // 初始化 Masonry 和動畫
  await initMasonry()
  setupAnimationsForNewItems()

  // 只收集主要圖片 URL（不包含 gallery），減少載入時間
  const imageUrls = displayedWorks.value.map(work => work.image || work.mainImage).filter(Boolean)

  // 在背景預載入圖片（不阻塞界面）
  preloadImages(imageUrls).catch(() => {
    // 靜默處理錯誤
  })

  // 使用 VueUse 的 useEventListener 監聽窗口大小改變
  useEventListener(window, 'resize', () => {
    if (masonryInstance) {
      // 使用 setTimeout 進行防抖處理
      setTimeout(() => {
        masonryInstance.layout()
      }, 100)
    }
  })
})

onUnmounted(() => {
  if (masonryInstance) {
    masonryInstance.destroy()
  }
  // useEventListener 會自動清理事件監聽器，不需要手動移除
})
</script>

<style scoped>
.img {
  position: relative;
  overflow: hidden;
  min-height: 200px;
  background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
  background-size: 200% 100%;
}

.img img {
  width: 100%;
  height: auto;
  min-height: 200px;
  object-fit: cover;
  transition: opacity 0.6s ease;
  display: block;
  background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
  background-size: 200% 100%;
}

.img img[src=''] {
  display: none;
}

/* 禁用所有元素的動畫，避免初始加載時的閃爍 */
.items {
  will-change: transform, opacity;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

/* 作品卡片容器 */
.item {
  min-height: 300px; /* 確保卡片有最小高度 */
  display: flex;
  flex-direction: column;
}

/* 內容區域 */
.cont {
  flex: 1;
  min-height: 80px; /* 確保內容區域有最小高度 */
}

/* 內容區域 */
.content-area {
  flex: 1;
  min-height: 60px; /* 確保內容區域有最小高度 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* 標題區域 */
.work-title {
  margin-bottom: 0.5rem;
  min-height: 1.5rem; /* 確保標題有最小高度 */
}

/* 標籤容器 */
.tags-container {
  min-height: 2rem; /* 確保標籤區域有最小高度 */
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.25rem;
}

/* 新載入的項目初始狀態 */
.items.new-item {
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
}

/* 確保項目在正確位置後才顯示 */
.items.ready {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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

/* Skeleton 樣式 */
.skeleton-item {
  animation: pulse 1.5s ease-in-out infinite;
  margin-bottom: 2rem;
  position: relative;
  z-index: 0;
  opacity: 0;
  visibility: hidden;
  height: 0;
  overflow: hidden;
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease,
    height 0.3s ease;
}

/* 確保 skeleton 在載入時正確定位 */
.skeleton-item.skeleton-loading {
  opacity: 1;
  visibility: visible;
  height: auto;
  transform: none;
}

/* Skeleton 隱藏狀態 */
.skeleton-item.skeleton-hidden {
  opacity: 0 !important;
  visibility: hidden !important;
  height: 0 !important;
  transform: translateY(20px);
}

/* Skeleton 顯示狀態 */
.skeleton-item.skeleton-visible {
  opacity: 1 !important;
  visibility: visible !important;
  height: auto !important;
  transform: translateY(0);
}

.skeleton-image {
  width: 100%;
  min-height: 200px;
  background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.skeleton-title {
  width: 70%;
  height: 20px;
  background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.skeleton-category {
  width: 40%;
  height: 16px;
  background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
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
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Tag 點擊樣式 */
.tag {
  display: inline-block;
  white-space: nowrap;
  flex-shrink: 0;
}

.clickable-tag {
  cursor: pointer;
  user-select: none;
}

.clickable-tag:hover {
  transform: translateY(-1px);
}

.clickable-tag:active {
  transform: translateY(0);
}
</style>
