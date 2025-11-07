<template>
  <section class="project section-padding radius-15">
    <div class="container">
      <!-- 麵包屑導航 -->
      <Breadcrumb :items="breadcrumbItems" />

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

  <!-- 相關作品區塊 -->
  <RelatedWorks v-if="project" :current-work-id="projectId" :limit="6" />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePortfolio } from '@composables/usePortfolio.js'
import { useImagePreloader } from '@composables/useImagePreloader.js'
import Preloader from '@components/PreLoader.vue'
import RelatedWorks from '@components/RelatedWorks.vue'
import Breadcrumb from '@components/Breadcrumb.vue'
import { enableImageLightbox } from '@composables/useLightBox.js'

const route = useRoute()
const project = ref(null)
const { getWorkById } = usePortfolio()

// 麵包屑導航
const breadcrumbItems = computed(() => {
  const items = [
    { name: '首頁', path: '/' },
    { name: '作品集', path: '/portfolio' },
  ]

  if (project.value) {
    items.push({
      name: project.value.title,
      path: `/project/${route.params.id}`,
    })
  }

  return items
})
const { preloadImages, loadingProgress, isPreloading } = useImagePreloader()

// 獲取WebP格式的圖片路徑
const webpMainImage = computed(() => {
  return project.value?.mainImage ? project.value.mainImage.replace(/\.(jpg|png)$/, '.webp') : ''
})

// 獲取WebP格式的畫廊圖片
const webpGallery = computed(() => {
  if (!project.value?.gallery || !Array.isArray(project.value.gallery)) {
    return []
  }
  return project.value.gallery.map(img => (img ? img.replace(/\.(jpg|png)$/, '.webp') : null))
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

// SEO Meta 設定
const projectTitle = computed(() =>
  project.value?.title ? `${project.value.title} | HODES - 荷馬桑 Homer Shie` : '專案詳情 | HODES'
)

const projectDescription = computed(() => {
  if (!project.value?.description) return ''
  // 取描述的前 150 字作為 meta description
  return project.value.description.replace(/\n/g, ' ').substring(0, 150) + '...'
})

const projectImage = computed(() => {
  // 優先使用 mainImage，若無則使用 gallery 第一張
  if (project.value?.mainImage) return project.value.mainImage.replace(/\.(jpg|png)$/, '.webp')
  if (project.value?.gallery && project.value.gallery[0]) {
    return project.value.gallery[0].replace(/\.(jpg|png)$/, '.webp')
  }
  return 'https://r2bucket.homershie.com/assets/imgs/thumbnail/og-image.jpg'
})

useHead({
  title: projectTitle,
  meta: [
    { name: 'description', content: projectDescription },
    { property: 'og:title', content: projectTitle },
    { property: 'og:description', content: projectDescription },
    { property: 'og:image', content: projectImage },
    { property: 'og:url', content: () => `https://homershie.com/project/${route.params.id}` },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: projectTitle },
    { name: 'twitter:description', content: projectDescription },
    { name: 'twitter:image', content: projectImage },
    { name: 'robots', content: 'index, follow' },
  ],
  link: [{ rel: 'canonical', href: () => `https://homershie.com/project/${route.params.id}` }],
  script: [
    {
      type: 'application/ld+json',
      children: () =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.value?.title,
          description: projectDescription.value,
          image: projectImage.value,
          creator: {
            '@type': 'Person',
            name: 'Homer Shie',
          },
          datePublished: project.value?.date,
        }),
    },
  ],
})

// 監聽 project 變化，預載入圖片
watch(
  () => project.value,
  async newProject => {
    if (newProject && import.meta.client) {
      // 收集主圖與 gallery 圖片
      const images = []
      if (newProject.mainImage) {
        // 直接使用 WebP 格式，不執行 HEAD 請求以避免 CORS 錯誤
        images.push(newProject.mainImage.replace(/\.(jpg|png)$/i, '.webp'))
      }
      if (Array.isArray(newProject.gallery)) {
        // 過濾並轉換為 WebP 格式
        const galleryImages = newProject.gallery
          .filter(Boolean)
          .map(img => img.replace(/\.(jpg|png)$/i, '.webp'))
        images.push(...galleryImages)
      }

      if (images.length > 0) {
        // 預載入圖片
        await preloadImages(images)
        // 啟用 lightbox
        enableImageLightbox(images)
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

// 在服務端和客戶端都執行數據獲取
const projectId = computed(() => route.params.id)

// 使用 computed 而不是 onMounted，確保 SSG 時也能獲取數據
project.value = getWorkById(projectId.value)

if (project.value) {
  // 確保 gallery 是陣列
  if (!project.value.gallery || !Array.isArray(project.value.gallery)) {
    project.value.gallery = []
  }
} else if (import.meta.server) {
  // 在服務端如果找不到專案，拋出 404
  throw createError({
    statusCode: 404,
    message: '專案不存在',
  })
}

onMounted(() => {
  // 客戶端如果需要重新獲取數據（例如路由變化）
  if (!project.value) {
    project.value = getWorkById(projectId.value)
    if (project.value && (!project.value.gallery || !Array.isArray(project.value.gallery))) {
      project.value.gallery = []
    }
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
