<template>
  <!-- ==================== Start About ==================== -->
  <div>
    <!-- 載入進度顯示 -->
    <div v-if="isPreloading" class="loading-progress">
      <div class="progress-bar">
        <div class="progress" :style="{ width: `${loadingProgress}%` }"></div>
      </div>
      <div class="progress-text">載入中... {{ loadingProgress }}%</div>
    </div>

    <section class="about section-padding">
      <div class="container with-pad">
        <div class="row lg-marg">
          <div class="col-lg-5 valign">
            <div class="profile-img">
              <div class="img">
                <img
                  src="https://r2bucket.homershie.com/assets/imgs/header/profile.webp"
                  :alt="t('about.profile_alt')"
                />
              </div>
              <span class="icon">
                <img src="https://r2bucket.homershie.com/assets/imgs/header/icon1.webp" alt="" />
              </span>
              <span class="icon">
                <img src="https://r2bucket.homershie.com/assets/imgs/header/icon2.webp" alt="" />
              </span>
              <span class="icon">
                <img src="https://r2bucket.homershie.com/assets/imgs/header/icon3.webp" alt="" />
              </span>
              <span class="icon">
                <img src="https://r2bucket.homershie.com/assets/imgs/header/icon4.webp" alt="" />
              </span>
            </div>
          </div>
          <div class="col-lg-7 valign">
            <div class="cont">
              <div class="sub-title-icon d-flex align-items-center">
                <span class="icon fas fa-lightbulb"></span>
                <h6>{{ t('about.section_label') }}</h6>
              </div>
              <div class="text">
                <h5 class="mb-20 text-secondary fst-italic">
                  {{ t('about.subtitle') }}
                </h5>
                <h3 class="mb-30">
                  {{ t('about.h3_line1') }}<br />
                  {{ t('about.h3_mid') }}
                  <span class="main-color">{{ t('about.h3_highlight') }}</span>
                </h3>

                <p>
                  {{ t('about.bio_p1') }}
                  <br /><br />
                  {{ t('about.bio_p2') }}
                  <br /><br />
                  {{ t('about.bio_p3') }}
                </p>

                <div class="feat mt-30">
                  <div class="row">
                    <div class="col-sm-6">
                      <div class="item mb-15">
                        <h6 class="sub-title ls1">
                          <span class="fz-13 mr-10 main-color">
                            <i class="fas fa-check"></i>
                          </span>
                          {{ t('about.feat_uiux') }}
                        </h6>
                      </div>
                      <div class="item sm-mb15">
                        <h6 class="sub-title ls1">
                          <span class="fz-13 mr-10 main-color">
                            <i class="fas fa-check"></i>
                          </span>
                          {{ t('about.feat_motion') }}
                        </h6>
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="item mb-15">
                        <h6 class="sub-title ls1">
                          <span class="fz-13 mr-10 main-color">
                            <i class="fas fa-check"></i>
                          </span>
                          {{ t('about.feat_fullstack') }}
                        </h6>
                      </div>
                      <div class="item">
                        <h6 class="sub-title ls1">
                          <span class="fz-13 mr-10 main-color">
                            <i class="fas fa-check"></i>
                          </span>
                          {{ t('about.feat_3d') }}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="info mt-50">
                  <div class="row">
                    <div class="col-sm-6">
                      <div class="item d-flex align-items-center sm-mb30">
                        <div class="mr-15">
                          <Icon name="mdi:email-outline" class="icon main-color" />
                        </div>
                        <div>
                          <span class="opacity-7 mb-5">{{ t('about.email_label') }}</span>
                          <h6>homerxworkshop@gmail.com</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== End About ==================== -->
    <!-- ==================== Start Skills ==================== -->
    <section class="skills section-padding pt-0">
      <div class="container with-pad">
        <div class="sec-head mb-60">
          <div class="row justify-content-center">
            <div class="col-lg-6 text-center">
              <div class="sub-title-icon d-flex align-items-center mx-auto">
                <Icon name="mdi:dumbbell" class="icon" />
                <h6>{{ t('about.skills_section_label') }}</h6>
              </div>
              <h3>{{ t('about.skills_heading') }}</h3>
            </div>
          </div>
        </div>
        <div class="skill-groups">
          <!-- 設計與動態鏈 -->
          <div class="skill-group mb-40">
            <h5 class="skill-category-title mb-30">
              <Icon name="mdi:palette-outline" class="me-2" />
              {{ t('about.design_category') }}
            </h5>
            <div class="skill-grid">
              <div
                v-for="skill in designSkills"
                :key="skill.id"
                class="skill-item d-flex align-items-center"
              >
                <div class="skill-icon">
                  <img
                    v-if="!skill.noIcon"
                    :src="getSkillIconUrl(skill)"
                    :alt="skill.name"
                    loading="lazy"
                  />
                </div>
                <span class="skill-name fz-16">{{ skill.name }}</span>
              </div>
            </div>
          </div>

          <div class="skill-divider"></div>

          <!-- 開發技術鏈 -->
          <div class="skill-group">
            <h5 class="skill-category-title mb-30">
              <Icon name="mdi:code-tags" class="me-2" />
              {{ t('about.dev_category') }}
            </h5>
            <div class="skill-grid">
              <div
                v-for="skill in devSkills"
                :key="skill.id"
                class="skill-item d-flex align-items-center"
              >
                <div class="skill-icon">
                  <img
                    v-if="!skill.noIcon"
                    :src="getSkillIconUrl(skill)"
                    :alt="skill.name"
                    loading="lazy"
                  />
                </div>
                <span class="skill-name fz-16">{{ skill.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== Start Capabilities ==================== -->
    <section class="capabilities section-padding pt-0">
      <div class="container with-pad">
        <div class="sec-head mb-60">
          <div class="row justify-content-center">
            <div class="col-lg-6 text-center">
              <div class="sub-title-icon d-flex align-items-center mx-auto">
                <Icon name="mdi:lightbulb-outline" class="icon" />
                <h6>{{ t('about.capabilities_section_label') }}</h6>
              </div>
              <h3>{{ t('about.capabilities_heading') }}</h3>
            </div>
          </div>
        </div>
        <div class="row lg-marg">
          <div v-for="cap in capabilities" :key="cap.id" class="col-lg-4 col-md-6 mb-30">
            <div class="capability-card">
              <div class="cap-icon">
                <Icon :name="getCapabilityIconName(cap)" />
              </div>
              <h5 class="mb-15">{{ cap.title }}</h5>
              <p class="fz-14 mb-30 opacity-8">{{ cap.summary }}</p>
              <div class="cap-divider"></div>
              <ul class="cap-list">
                <li v-for="item in cap.items" :key="item.label">
                  <span class="cap-item-label fz-14 fw-500">{{ item.label }}</span>
                  <p class="fz-13 opacity-7 mt-5">{{ item.desc }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- ==================== End Capabilities ==================== -->

    <!-- ==================== Start Resume ==================== -->
    <section class="resume section-padding pt-0">
      <div class="container with-pad">
        <div class="sec-head mb-60">
          <div class="row justify-content-center">
            <div class="col-lg-6 text-center">
              <div class="d-inline-block">
                <div class="sub-title-icon d-flex align-items-center">
                  <Icon name="mdi:file-document-outline" class="icon" />
                  <h6>{{ t('about.resume_section_label') }}</h6>
                </div>
              </div>
              <h3>{{ t('about.resume_heading') }}</h3>
            </div>
          </div>
        </div>
      </div>
      <AppSwiper variant="resume-swiper" :space-between="0" :speed="1000">
        <div v-for="experience in experiences" :key="experience.id" class="swiper-slide">
          <div class="item text-center px-5 mx-3">
            <h6 class="main-color date fz-15 mb-60">
              {{ experience.period }}
            </h6>
            <h5>{{ experience.title }}</h5>
            <span class="opacity-8 fw-500 mt-10">[ {{ experience.company }} ]</span>
            <p class="fz-13 mt-15">{{ experience.description }}</p>
          </div>
        </div>
      </AppSwiper>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useImagePreloader } from '@composables/useImagePreloader.js'
import { usePageTitle } from '@composables/usePageTitle.js'
import { useI18nList } from '@composables/useI18nList.js'

const { t, tm } = useI18n()
const { resolveNestedMessages } = useI18nList()

// 設定頁面標題範例
const { setPageTitle } = usePageTitle()
setPageTitle(t('about.section_label'))

// SEO 設定
useSeoMeta({
  title: computed(() => t('seo.about.title')),
  description: computed(() => t('seo.about.description')),
})

useHead({
  link: [{ rel: 'canonical', href: 'https://homershie.com/about' }],
  meta: [
    { property: 'og:title', content: '關於 | HODES - 荷馬桑 Homer Shie' },
    {
      property: 'og:description',
      content:
        '了解荷馬桑 Homer Shie 的設計歷程與開發能力。擁有 9 年視覺設計經驗，具備 UI/UX 設計、動態設計與全端開發實力，以 Full Stack Designer 定位橋接設計與工程。',
    },
    {
      property: 'og:image',
      content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/og-image.jpg',
    },
    { property: 'og:url', content: 'https://homershie.com/about' },
    { property: 'og:type', content: 'profile' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: '關於 | HODES - 荷馬桑 Homer Shie' },
    {
      name: 'twitter:description',
      content:
        '9 年視覺設計經驗 × 全端開發能力，荷馬桑 Homer Shie 的設計歷程、核心能力與技術棧完整介紹。',
    },
    {
      name: 'twitter:image',
      content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/twitter-card.jpg',
    },
    { name: 'robots', content: 'index, follow' },
  ],
})

const { preloadImages, loadingProgress, isPreloading } = useImagePreloader()

// Adobe 工具 icon 由 r2bucket 提供，依檔名組出路徑
const ADOBE_ICON_BASE = 'https://r2bucket.homershie.com/assets/imgs/resume/adobe'

/** 取得技能 icon URL：支援 iconUrl、slug（可選 color 給 Simple Icons） */
function getSkillIconUrl(skill) {
  if (skill.iconUrl) return skill.iconUrl
  const base = `https://cdn.simpleicons.org/${skill.slug}`
  return skill.color ? `${base}/${skill.color}` : base
}

/**
 * tm() 回傳的 capability 可能為編譯後物件，icon 未必是字串。
 * 確保傳給 NuxtIcon 的 name 一律為字串，避免 name.startsWith is not a function。
 */
function getCapabilityIconName(cap) {
  const icon = cap?.icon
  if (typeof icon === 'string') return icon
  if (icon && typeof icon === 'object') {
    if (typeof icon.body?.static === 'string') return icon.body.static
    if (typeof icon.loc?.source === 'string') return icon.loc.source
  }
  return 'mdi:help-circle'
}

// 設計與動態鏈（具體工具）
const designSkills = ref([
  { id: 1, name: 'Figma', slug: 'figma' },
  {
    id: 2,
    name: 'Adobe Photoshop',
    iconUrl: `${ADOBE_ICON_BASE}/photoshop.webp`,
  },
  {
    id: 3,
    name: 'Adobe Illustrator',
    iconUrl: `${ADOBE_ICON_BASE}/illustrator.webp`,
  },
  {
    id: 4,
    name: 'Adobe After Effects',
    iconUrl: `${ADOBE_ICON_BASE}/after-effects.webp`,
  },
  {
    id: 5,
    name: 'Adobe Premiere Pro',
    iconUrl: `${ADOBE_ICON_BASE}/premiere-pro.webp`,
  },
  {
    id: 6,
    name: 'Adobe Animate',
    iconUrl: `${ADOBE_ICON_BASE}/animate.webp`,
  },
  {
    id: 7,
    name: 'Adobe InDesign',
    iconUrl: `${ADOBE_ICON_BASE}/indesign.webp`,
  },
  { id: 8, name: 'Blender', slug: 'blender' },
  { id: 9, name: '3ds Max', slug: 'autodesk', color: 'fff' },
  {
    id: 10,
    name: 'Procreate',
    iconUrl: 'https://r2bucket.homershie.com/assets/imgs/resume/Procreate-AppIcon.webp',
  },
])

// 開發技術鏈（具體工具，凸顯跨領域能力）
// color: 'fff' 表示 icon 以白色顯示（深色背景友善）
const devSkills = ref([
  // 前端框架
  { id: 1, name: 'Vue 3', slug: 'vuedotjs' },
  { id: 2, name: 'Nuxt', slug: 'nuxt' },
  { id: 3, name: 'React', slug: 'react' },
  { id: 4, name: 'Next.js', slug: 'nextdotjs', color: 'fff' },
  // 樣式與動畫
  { id: 5, name: 'Tailwind CSS', slug: 'tailwindcss' },
  { id: 6, name: 'Bootstrap', slug: 'bootstrap' },
  { id: 7, name: 'SCSS', slug: 'sass' },
  { id: 8, name: 'GSAP', slug: 'greensock' },
  { id: 9, name: 'Three.js', slug: 'threedotjs', color: 'fff' },
  { id: 10, name: 'React Query', slug: 'tanstack', color: 'fff' },
  // UI 元件庫
  { id: 11, name: 'Vuetify', slug: 'vuetify' },
  { id: 12, name: 'PrimeVue', slug: 'primevue' },
  { id: 13, name: 'shadcn/ui', slug: 'shadcnui' },
  // 狀態與語言
  { id: 14, name: 'Pinia', slug: 'pinia' },
  { id: 15, name: 'Zustand', noIcon: true },
  { id: 16, name: 'TypeScript', slug: 'typescript' },
  { id: 17, name: 'JavaScript', slug: 'javascript' },
  // 後端
  { id: 18, name: 'Node.js', slug: 'nodedotjs' },
  { id: 19, name: 'Express', slug: 'express', color: 'fff' },
  { id: 20, name: 'Supabase', slug: 'supabase' },
  { id: 21, name: 'MongoDB', slug: 'mongodb' },
  { id: 22, name: 'Redis', slug: 'redis' },
  // 部署
  {
    id: 23,
    name: 'AWS',
    iconUrl: 'https://r2bucket.homershie.com/assets/imgs/resume/aws-color.webp',
  },
  { id: 24, name: 'Cloudflare', slug: 'cloudflare' },
  { id: 25, name: 'Vercel', slug: 'vercel', color: 'fff' },
  { id: 26, name: 'Render', slug: 'render', color: 'fff' },
])

// 核心能力資料（tm 回傳編譯後 message 物件，需轉成純字串）
const capabilities = computed(() => resolveNestedMessages(tm('about.capabilities')) ?? [])

// 工作經驗資料（同上）
const experiences = computed(() => resolveNestedMessages(tm('about.experiences')) ?? [])

onMounted(async () => {
  // 收集所有圖片URL（已改用 WebP 格式）
  const imageUrls = [
    // 個人照片
    'https://r2bucket.homershie.com/assets/imgs/header/profile.webp',
    // 圖示
    'https://r2bucket.homershie.com/assets/imgs/header/icon1.webp',
    'https://r2bucket.homershie.com/assets/imgs/header/icon2.webp',
    'https://r2bucket.homershie.com/assets/imgs/header/icon3.webp',
    'https://r2bucket.homershie.com/assets/imgs/header/icon4.webp',
  ].filter(Boolean)

  // 預載入圖片
  await preloadImages(imageUrls)
})
</script>

<style lang="scss" scoped>
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

/* 技能區塊：左右並排、icon + 名稱 */
.skill-category-title {
  font-size: 1.125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem 1.5rem;
}

.skill-item {
  gap: 0.75rem;
}

.skill-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.skill-name {
  font-weight: 500;
}

@media (max-width: 991px) {
  .skill-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}

/* 核心能力卡片 */
.capability-card {
  height: 100%;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  text-align: center;
  transition:
    border-color 0.3s ease,
    background 0.3s ease;

  &:hover {
    border-color: rgba(var(--maincolor-rgb, 255, 255, 255), 0.3);
    background: rgba(255, 255, 255, 0.05);
  }

  .cap-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--maincolor);
    font-size: 1.5rem;
  }
}

.cap-divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 20px 0;
}

.cap-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  text-align: left;
  flex-direction: column;
  gap: 1rem;

  li {
    padding-left: 1rem;
    margin: 0.75rem 0;
    border-left: 2px solid var(--maincolor);
  }
}

.cap-item-label {
  display: block;
}

@media (max-width: 767px) {
  .capability-card {
    padding: 1.5rem;
  }
}
</style>
