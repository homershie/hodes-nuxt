<template>
  <section class="project section-padding radius-15">
    <div class="container">
      <!-- 載入進度顯示 -->
      <div v-if="isPreloading" class="loading-progress">
        <div class="progress-bar">
          <div class="progress" :style="{ width: `${loadingProgress}%` }"></div>
        </div>
        <div class="progress-text">{{ Math.round(loadingProgress) }}%</div>
      </div>

      <div v-if="project" class="row justify-content-center">
        <div class="col-lg-12">
          <div class="img mb-80 text-center">
            <template v-if="project.type === 'video'">
              <iframe
                :src="project.video"
                class="radius-5 w-75 h-auto"
                style="aspect-ratio: 16/9"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </template>
            <template v-else>
              <img :src="webpMainImage" :alt="project.title" class="radius-5 project-image" />
            </template>
          </div>
          <div class="row justify-content-center">
            <div class="col-lg-7">
              <div class="cont md-mb50">
                <h3 class="mb-15 fw-500">{{ project.title }}</h3>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <p v-html="formattedDescription"></p>

                <!-- 圖片畫廊 -->
                <div
                  v-if="project.gallery && project.gallery.some(image => image)"
                  class="imgs mt-80"
                >
                  <div class="row md-marg">
                    <div v-for="(image, index) in project.gallery" :key="index" class="col-md-6">
                      <div class="img sm-mb30">
                        <img
                          v-if="image"
                          :src="webpGallery[index]"
                          :alt="`${project.title} ${index + 1}`"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="info">
                <ul>
                  <li class="mb-30">
                    <span class="sub-title">
                      <i class="far fa-calendar-alt mr-10"></i> 日期 :
                    </span>
                    <p>{{ formatDate(project.date) }}</p>
                  </li>
                  <li class="mb-30">
                    <span class="sub-title"> <i class="fas fa-list-ul mr-10"></i> 類別 : </span>
                    <p>{{ formatCategory(project.category) }}</p>
                  </li>
                  <li v-if="project.client" class="mb-30">
                    <span class="sub-title"> <i class="far fa-user mr-10"></i> 客戶 : </span>
                    <p>{{ project.client }}</p>
                  </li>
                  <li v-if="project.website">
                    <span class="sub-title"> <i class="fas fa-globe mr-10"></i> 連結 : </span>
                    <p>
                      <a :href="project.website" target="_blank" class="break-link">{{
                        project.website
                      }}</a>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Preloader v-else />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePortfolio } from '@/composables/usePortfolio.js'
import { useImageFormat } from '@/composables/useImageFormat.js'
import { useImagePreloader } from '@/composables/useImagePreloader.js'
import Preloader from '@/components/PreLoader.vue'
import { enableImageLightbox } from '@/composables/useLightBox.js'
import { BASE_TITLE } from '@/router/index.js'

const route = useRoute()
const project = ref(null)
const { getWorkById } = usePortfolio()
const { toWebP, getBestImagePath } = useImageFormat()
const { preloadImages, loadingProgress, isPreloading } = useImagePreloader()

// 獲取WebP格式的圖片路徑
const webpMainImage = computed(() => {
  return project.value?.mainImage ? toWebP(project.value.mainImage) : ''
})

// 獲取WebP格式的畫廊圖片
const webpGallery = computed(() => {
  if (!project.value?.gallery || !Array.isArray(project.value.gallery)) {
    return []
  }
  return project.value.gallery.map(img => (img ? toWebP(img) : null))
})

// 格式化描述文字，將 \n 轉換為 <br>
const formattedDescription = computed(() => {
  if (!project.value?.description) return ''
  return project.value.description.replace(/\n/g, '<br>')
})

// 格式化日期
const formatDate = dateString => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 更新頁面標題的函數
const updatePageTitle = () => {
  if (project.value && project.value.title) {
    document.title = `${project.value.title}|${BASE_TITLE}`
  } else {
    document.title = `專案詳情|${BASE_TITLE}`
  }
}

// 監聽 project 變化，更新標題和預載入圖片
watch(
  () => project.value,
  async newProject => {
    // 更新頁面標題
    updatePageTitle()

    if (newProject) {
      // 收集主圖與 gallery 圖片
      const images = []
      if (newProject.mainImage) images.push(newProject.mainImage)
      if (Array.isArray(newProject.gallery)) {
        images.push(...newProject.gallery.filter(Boolean))
      }

      if (images.length > 0) {
        // 先檢查並獲取最佳圖片路徑
        const processedImages = await Promise.all(
          images.map(async img => {
            if (!img) return null
            return await getBestImagePath(img)
          })
        )

        // 過濾掉無效的圖片
        const validImages = processedImages.filter(Boolean)

        if (validImages.length) {
          // 預載入圖片
          await preloadImages(validImages)
          // 啟用 lightbox
          enableImageLightbox(validImages)
        }
      }
    }
  },
  { immediate: true }
)

// 格式化類別陣列
const formatCategory = categories => {
  if (!categories) return ''
  if (Array.isArray(categories)) {
    return categories.join(', ')
  }
  return categories
}

onMounted(() => {
  const projectId = route.params.id
  project.value = getWorkById(projectId)

  // 確保 gallery 是陣列
  if (!project.value.gallery || !Array.isArray(project.value.gallery)) {
    project.value.gallery = []
  }
})
</script>

<style scoped>
.loading-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  text-align: center;
}

.progress-bar {
  height: 4px;
  background: #eee;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress {
  height: 100%;
  background: var(--maincolor);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
}

a {
  transition: all 0.3s;
}
a:hover {
  color: var(--maincolor);
}
.break-link {
  word-break: break-all;
  overflow-wrap: anywhere;
}
.project-image {
  width: 100%;
}
@media (min-width: 992px) {
  .project-image {
    width: 50% !important;
  }
}
</style>
