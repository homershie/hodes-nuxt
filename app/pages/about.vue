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
                  alt="荷馬桑個人照片"
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
                <h6>關於</h6>
              </div>
              <div class="text">
                <h5 class="mb-20 text-secondary fst-italic">
                  擁有 9 年視覺經驗，用程式實踐設計想像。<br />我專注於將複雜邏輯，轉化為具備動態感且直覺的數位體驗。
                </h5>
                <h3 class="mb-30">
                  我是Homer<br />
                  在美學中植入邏輯的<span class="main-color">「全端設計師」</span>
                </h3>

                <p>
                  在過去 9 年的視覺設計生涯中，我以接案形式深度參與了多樣化的商業專案。曾長期與
                  Garmin
                  合作，負責將複雜的穿戴裝置介面轉化為具吸引力的視覺體驗，其中「木曜四超玩」合作案更練就了我對動態節奏的精準掌控。長期與不同領域的品牌合作，讓我深刻理解與不同專業合作的能力。
                  <br /><br />
                  為了打破設計與工程間的溝通壁壘，我投身全端開發領域，並以此完成全端專案－迷因典
                  MemeDam。這不僅是一次技術的訓練題目，更是對產品架構的完整實踐操演——從資料庫 ERD
                  設計、Redis
                  快取優化到前端互動動畫，我享受利用程式碼將靜態設計轉化為「可運作邏輯」的過程。
                  <br /><br />
                  身為
                  INTJ人格，我習慣在感性的藝術創作中尋找理性的系統化路徑。無論是進行體組成管理、彈奏搖滾吉他，還是沉浸於
                  ACG
                  文化，這些興趣最終都回流成我的設計養分。我不僅是視覺的建造者，更是邏輯的編織者，致力於讓美感不再只是表象，而是具備技術支撐的深度解決方案。
                </p>

                <div class="feat mt-30">
                  <div class="row">
                    <div class="col-sm-6">
                      <div class="item mb-15">
                        <h6 class="sub-title ls1">
                          <span class="fz-13 mr-10 main-color">
                            <i class="fas fa-check"></i>
                          </span>
                          UI/UX 設計
                        </h6>
                      </div>
                      <div class="item sm-mb15">
                        <h6 class="sub-title ls1">
                          <span class="fz-13 mr-10 main-color">
                            <i class="fas fa-check"></i>
                          </span>
                          動態視覺
                        </h6>
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="item mb-15">
                        <h6 class="sub-title ls1">
                          <span class="fz-13 mr-10 main-color">
                            <i class="fas fa-check"></i>
                          </span>
                          全端開發
                        </h6>
                      </div>
                      <div class="item">
                        <h6 class="sub-title ls1">
                          <span class="fz-13 mr-10 main-color">
                            <i class="fas fa-check"></i>
                          </span>
                          3D 動畫
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
                          <span class="opacity-7 mb-5">電子信箱</span>
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
        <div class="sec-head mb-80">
          <div class="row justify-content-center">
            <div class="col-lg-6 text-center">
              <div class="sub-title-icon d-flex align-items-center mx-auto">
                <Icon name="mdi:dumbbell" class="icon" />
                <h6>我的技能</h6>
              </div>
              <h3>核心工具</h3>
            </div>
          </div>
        </div>
        <div class="skill-groups">
          <!-- 設計與動態鏈 -->
          <div class="skill-group mb-40">
            <h5 class="skill-category-title mb-30">
              <Icon name="mdi:palette-outline" class="me-2" />
              設計與動態
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
              開發技術
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

    <!-- ==================== Start Resume ==================== -->
    <section class="resume section-padding pt-0">
      <div class="container with-pad">
        <div class="sec-head mb-80">
          <div class="row justify-content-center">
            <div class="col-lg-6 text-center">
              <div class="d-inline-block">
                <div class="sub-title-icon d-flex align-items-center">
                  <Icon name="mdi:file-document-outline" class="icon" />
                  <h6>我的簡歷</h6>
                </div>
              </div>
              <h3>學歷和工作經驗</h3>
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
import { onMounted, ref } from 'vue'
import { useImagePreloader } from '@composables/useImagePreloader.js'
import { usePageTitle } from '@composables/usePageTitle.js'

// 設定頁面標題範例
const { setPageTitle } = usePageTitle()
setPageTitle('關於')

// SEO 設定
useSeoMeta({
  description:
    '了解荷馬桑 Homer Shie 的背景、技能和經歷，以及各式各樣擅長的工具，展示專業的視覺、動態技術的必備技能。',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://homershie.com/about' }],
  meta: [
    { property: 'og:title', content: '關於 | HODES - 荷馬桑 Homer Shie' },
    {
      property: 'og:description',
      content:
        '了解荷馬桑 Homer Shie 的背景、技能和經歷，以及各式各樣擅長的工具，展示專業的視覺、動態技術的必備技能。',
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
      content: '了解荷馬桑 Homer Shie 的背景、技能和經歷，展示專業的視覺、動態技術的必備技能。',
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

// 工作經驗資料
const experiences = ref([
  {
    id: 1,
    period: '2025 - 現在',
    title: '前端工程開發與產品實踐',
    company: '獨立開發者',
    description:
      '專注於 React/Next.js 與 Vue/Nuxt3 雙框架開發，目前主導《AniDaze》動漫行事曆平台的持續迭代。具備全端實作能力，曾於《MemeDam》專案中親自設計 ERD 資料架構、RESTful API 並導入 Redis 快取優化效能。致力於將九年的設計底蘊轉化為高品質的程式邏輯，實現設計與開發的深度整合。',
  },
  {
    id: 2,
    period: '2019 - 現在',
    title: '資深視覺與動態設計師',
    company: '自由接案',
    description:
      '長期與 Garmin 等國際品牌合作，負責智慧手錶錶面（Watch Face）的視覺整合與動態特效。作品涵蓋「木曜四超玩」等大型合作案，擅長在極限效能下創造流暢的動畫體驗。具備從品牌識別到 3D 建模、UI/UX 設計的完整視覺解決方案能力。',
  },
  {
    id: 3,
    period: '2023 - 2025',
    title: '資深美術編輯',
    company: '問禮有限公司',
    description:
      '為穩定收入轉任兼職設計職，參與兒童英文教材出版專案。負責插圖繪製、教材排版、包裝設計與品牌視覺整合。兼顧專案品質與時效，並於此期間積極準備轉職前端工程師，朝設計與開發整合的方向前進。',
  },
  {
    id: 4,
    period: '2018 - 2019',
    title: '視覺設計師',
    company: '臺灣娜珂黛肌有限公司',
    description:
      '我負責薑類保健品的產品視覺與網站素材設計，專注於品牌定位與行銷轉換。協助行銷團隊優化網站視覺與用戶體驗，提升品牌識別與商品曝光。該經驗讓我深入理解設計與商業目標之間的整合策略。',
  },
  {
    id: 5,
    period: '2013 - 2017',
    title: '應用美術學系',
    company: '天主教輔仁大學',
    description:
      '主修視覺設計與美術應用，專注於概念發想、圖像溝通與使用者導向設計。課堂外積極參與接案與工作，提前累積業界經驗，奠定視覺創作與創新思維的堅實基礎，為日後的職涯發展鋪路。',
  },
])

// 新增經驗的方法
const addExperience = newExperience => {
  experiences.value.unshift({
    id: experiences.value.length + 1,
    ...newExperience,
  })
}

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
// 導出方法供其他組件使用
defineExpose({
  addExperience,
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
</style>
