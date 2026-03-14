<template>
  <div>
    <!-- ==================== Start Hero ==================== -->
    <section class="hero section-padding">
      <div class="container">
        <div class="row">
          <div class="col-lg-5">
            <div class="intro">
              <div class="lg-box">
                <div class="box1">
                  <div class="tow-items">
                    <div class="item1 box-shadwo">
                      <div class="circle-item d-flex align-items-center justify-content-center">
                        <h6>
                          <router-link :to="localePath('/about')">{{ t('nav.about') }}</router-link>
                        </h6>
                      </div>
                      <div class="text-center mt-30">
                        <a
                          href="https://r2bucket.homershie.com/assets/resume/Homer_Shie_Resume.pdf"
                          target="_blank"
                          :aria-label="t('home.download_aria')"
                        >
                          <svg
                            class="arrow-down"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            x="0px"
                            y="0px"
                            viewBox="0 0 34.2 32.3"
                            xml:space="preserve"
                            style="stroke-width: 2"
                            aria-hidden="true"
                          >
                            <line x1="0" y1="16" x2="33" y2="16"></line>
                            <line x1="17.3" y1="0.7" x2="33.2" y2="16.5"></line>
                            <line x1="17.3" y1="31.6" x2="33.5" y2="15.4"></line>
                          </svg>
                          <p class="fz-13 mt-15">{{ t('home.download_resume') }}</p>
                        </a>
                      </div>
                    </div>
                    <div class="item2">
                      <div
                        class="sub-item1 box-shadwo d-flex align-items-center justify-content-center"
                      >
                        <div class="text-center">
                          <h2 class="fw-700">{{ experienceYear }}</h2>
                          <p class="fz-13">
                            {{ t('home.years_label') }} <br />
                            {{ t('home.experience_label') }}
                          </p>
                        </div>
                      </div>
                      <div class="sub-item2 box-shadwo"></div>
                    </div>
                  </div>
                  <div class="item-down box-shadwo d-flex align-items-center">
                    <div>
                      <div class="circle-item d-flex align-items-center justify-content-center">
                        <router-link
                          :to="localePath('/service')"
                          :aria-label="t('home.service_aria')"
                        >
                          <svg
                            class="arrow-right"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            x="0px"
                            y="0px"
                            viewBox="0 0 34.2 32.3"
                            xml:space="preserve"
                            style="stroke-width: 2"
                            aria-hidden="true"
                          >
                            <line x1="0" y1="16" x2="33" y2="16"></line>
                            <line x1="17.3" y1="0.7" x2="33.2" y2="16.5"></line>
                            <line x1="17.3" y1="31.6" x2="33.5" y2="15.4"></line>
                          </svg>
                        </router-link>
                      </div>
                    </div>
                    <h6 class="ml-15">
                      <router-link :to="localePath('/service')">
                        {{ t('home.service_link') }}
                      </router-link>
                    </h6>
                  </div>
                </div>

                <div class="box2">
                  <div class="item3 box-shadwo"></div>
                  <div class="item4 box-shadwo d-flex align-items-center">
                    <h6>
                      <router-link :to="localePath('/portfolio')">
                        <br />{{ t('home.portfolio_link') }}
                      </router-link>
                    </h6>
                  </div>
                </div>
              </div>
              <div class="bottom-boxs">
                <div class="item5 box-shadwo d-flex align-items-center justify-content-center">
                  <a
                    href="https://www.instagram.com/homer_create"
                    class="icon"
                    rel="noopener noreferrer"
                    target="_blank"
                    :aria-label="t('home.instagram_aria')"
                  >
                    <i class="fab fa-instagram" aria-hidden="true"></i>
                  </a>
                </div>
                <div class="item6 box-shadwo d-flex align-items-center justify-content-center">
                  <a
                    href="https://github.com/homershie"
                    class="icon"
                    rel="noopener noreferrer"
                    target="_blank"
                    :aria-label="t('home.github_aria')"
                  >
                    <i class="fab fa-github" aria-hidden="true"></i>
                  </a>
                </div>
                <div class="item7 box-shadwo d-flex align-items-center justify-content-center">
                  <a
                    href="https://medium.com/homer-create"
                    class="icon"
                    rel="noopener noreferrer"
                    target="_blank"
                    :aria-label="t('home.medium_aria')"
                  >
                    <i class="fab fa-medium" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
            </div>
            <div class="author-profile">
              <div class="author-img">
                <div class="img">
                  <img
                    src="https://r2bucket.homershie.com/assets/imgs/header/profile.webp"
                    :alt="t('home.profile_alt')"
                    loading="lazy"
                  />
                </div>
              </div>
              <div class="author-info">
                <div class="text-center">
                  <span class="main-color sub-title mb-10">{{ t('home.subtitle') }}</span>
                  <h4 class="fw-500">{{ t('home.name') }}</h4>
                </div>
                <div class="social mt-20">
                  <a
                    href="https://www.instagram.com/homer_create"
                    class="icon"
                    rel="noopener noreferrer"
                    target="_blank"
                    :aria-label="t('home.instagram_aria')"
                  >
                    <i class="fab fa-instagram" aria-hidden="true"></i>
                  </a>
                  <a
                    href="https://www.pinterest.com/HomerShie/"
                    class="icon"
                    rel="noopener noreferrer"
                    target="_blank"
                    :aria-label="t('home.pinterest_aria')"
                  >
                    <i class="fab fa-pinterest" aria-hidden="true"></i>
                  </a>
                  <a
                    href="https://medium.com/homer-create"
                    class="icon"
                    rel="noopener noreferrer"
                    target="_blank"
                    :aria-label="t('home.medium_aria')"
                  >
                    <i class="fab fa-medium" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
              <div class="butns mt-30">
                <router-link :to="localePath('/contact') + '#contact-form'" class="inf-butn">
                  <span>{{ t('home.contact_cta') }}</span>
                </router-link>
                <a
                  href="https://r2bucket.homershie.com/assets/resume/Homer_Shie_Resume.pdf"
                  class="inf-butn"
                  target="_blank"
                  :aria-label="t('home.download_aria')"
                >
                  <span>{{ t('home.download_resume') }}</span>
                </a>
              </div>
            </div>
          </div>
          <div class="col-lg-7 valign">
            <div class="content">
              <h5 class="cd-headline slide">
                <span>{{ t('home.greeting') }}</span>
                <span class="cd-words-wrapper main-color">
                  <b
                    v-for="(word, idx) in headlineWords"
                    :key="word"
                    :class="{
                      'is-visible': idx === currentWordIndex,
                      'is-hidden': idx !== currentWordIndex,
                    }"
                    >{{ word }}</b
                  >
                </span>
              </h5>
              <h1>
                {{ t('home.h1_line1') }}<br />{{ t('home.h1_line2') }}<br />
                {{ t('home.h1_line3_before')
                }}<span class="bord">{{ t('home.h1_highlight') }}</span>
                {{ t('home.h1_line3_after') }}
              </h1>
              <p class="text line-height-9">
                {{ t('home.bio') }}
              </p>
              <div class="stauts mt-50 pt-50 bord-thin-top">
                <div class="d-flex align-items-center">
                  <div class="mr-40">
                    <div class="d-flex align-items-center">
                      <h2>{{ projectCount }}</h2>
                      <p>
                        {{ t('home.projects_count_label') }} <br />
                        {{ t('home.projects_sublabel') }}
                      </p>
                    </div>
                  </div>
                  <div class="mr-40">
                    <div class="d-flex align-items-center">
                      <h2>{{ t('home.software_count') }}</h2>
                      <p>
                        {{ t('home.software_label') }} <br />
                        {{ t('home.software_sublabel') }}
                      </p>
                    </div>
                  </div>
                  <div class="ml-auto">
                    <div class="butn-presv">
                      <router-link
                        :to="localePath('/contact') + '#contact-form'"
                        class="butn butn-md butn-bord radius-5 skew"
                      >
                        <span>{{ t('home.contact_cta2') }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- ==================== End Hero ==================== -->

    <!-- 載入進度顯示 -->
    <div v-if="isPreloading" class="loading-progress">
      <div class="progress-bar">
        <div class="progress" :style="{ width: `${loadingProgress}%` }"></div>
      </div>
      <div class="progress-text">{{ t('home.loading', { percent: loadingProgress }) }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { portfolio } from '@data/portfolioData.js'
import { useImagePreloader } from '@composables/useImagePreloader.js'
import { useI18nList } from '@composables/useI18nList.js'

const { t, tm } = useI18n()
const localePath = useLocalePath()
const { resolveMessageList } = useI18nList()

const { preloadImages, loadingProgress, isPreloading } = useImagePreloader()

// headline 輪播文字（tm() 回傳編譯物件，需轉成字串陣列）
const headlineWords = computed(() => resolveMessageList(tm('home.headline_words')))
const currentWordIndex = ref(0)
let headlineInterval = null

// 首頁完整 SEO 設定
useSeoMeta({
  title: computed(() => t('seo.home.title')),
  description: computed(() => t('seo.home.description')),
})

useHead({
  link: [{ rel: 'canonical', href: 'https://homershie.com/' }],
  meta: [
    { property: 'og:title', content: 'HODES - 荷馬桑 Homer Shie | Full Stack Designer' },
    {
      property: 'og:description',
      content:
        'HODES 是荷馬桑 Homer Shie 的個人網站。擁有 9 年視覺設計經驗的 Full Stack Designer，橫跨 UI/UX 設計、動態設計與前端開發，致力於將設計美感與工程邏輯深度整合。',
    },
    {
      property: 'og:image',
      content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/og-image.jpg',
    },
    { property: 'og:url', content: 'https://homershie.com/' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'HODES - 荷馬桑 Homer Shie | Full Stack Designer' },
    {
      name: 'twitter:description',
      content:
        '台灣的 Full Stack Designer，9 年視覺設計經驗，兼具 UI/UX 設計、動態設計與前端開發能力，歡迎和我連絡！',
    },
    {
      name: 'twitter:image',
      content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/twitter-card.jpg',
    },
    { name: 'robots', content: 'index, follow' },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Homer Shie',
        alternateName: '荷馬桑',
        url: 'https://homershie.com',
        image: 'https://r2bucket.homershie.com/assets/imgs/header/profile.webp',
        jobTitle: '視覺設計師 / 動態設計師',
        worksFor: {
          '@type': 'Organization',
          name: 'HODES',
        },
        sameAs: [
          'https://www.instagram.com/homer_create',
          'https://github.com/homershie',
          'https://medium.com/homer-create',
        ],
      }),
    },
  ],
})

onMounted(() => {
  // headline 輪播（僅在有字詞時啟動）
  const words = headlineWords.value
  if (words.length > 0) {
    headlineInterval = setInterval(() => {
      currentWordIndex.value = (currentWordIndex.value + 1) % headlineWords.value.length
    }, 2000)
  }

  // 收集首頁所有圖片URL（已改用 WebP 格式）
  const imageUrls = [
    // 主視覺圖片
    'https://r2bucket.homershie.com/assets/imgs/hero/1.webp',
    // 個人照片
    'https://r2bucket.homershie.com/assets/imgs/header/profile.webp',
    // 作品集縮圖
    ...portfolio.slice(0, 6).map(work => work.image.replace(/\.(jpg|png)$/, '.webp')),
    // 其他首頁圖片
    'https://r2bucket.homershie.com/assets/imgs/about/1.webp',
    'https://r2bucket.homershie.com/assets/imgs/about/2.webp',
    'https://r2bucket.homershie.com/assets/imgs/about/3.webp',
  ].filter(Boolean)

  // 預載入圖片
  preloadImages(imageUrls)
})

onUnmounted(() => {
  if (headlineInterval) clearInterval(headlineInterval)
})

// 計算工作年資
const experienceYear = computed(() => {
  const startYear = 2017
  const currentYear = new Date().getFullYear()
  return currentYear - startYear
})

// 計算專案數量
const projectCount = computed(() => {
  return portfolio.length
})
</script>

<style scoped>
/* 主要樣式會從全局 CSS 載入 */

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

.cd-words-wrapper {
  margin-left: 10px;
}
</style>
