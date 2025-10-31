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
                        <h6><router-link to="/about">關於我</router-link></h6>
                      </div>
                      <div class="text-center mt-30">
                        <a
                          href="https://r2bucket.homershie.com/assets/resume/Homer_Shie_Resume.pdf"
                          target="_blank"
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
                          >
                            <line x1="0" y1="16" x2="33" y2="16"></line>
                            <line x1="17.3" y1="0.7" x2="33.2" y2="16.5"></line>
                            <line x1="17.3" y1="31.6" x2="33.5" y2="15.4"></line>
                          </svg>
                          <p class="fz-13 mt-15">下載履歷</p>
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
                            年 <br />
                            工作經驗
                          </p>
                        </div>
                      </div>
                      <div class="sub-item2 box-shadwo"></div>
                    </div>
                  </div>
                  <div class="item-down box-shadwo d-flex align-items-center">
                    <div>
                      <div class="circle-item d-flex align-items-center justify-content-center">
                        <router-link to="/service">
                          <svg
                            class="arrow-right"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            x="0px"
                            y="0px"
                            viewBox="0 0 34.2 32.3"
                            xml:space="preserve"
                            style="stroke-width: 2"
                          >
                            <line x1="0" y1="16" x2="33" y2="16"></line>
                            <line x1="17.3" y1="0.7" x2="33.2" y2="16.5"></line>
                            <line x1="17.3" y1="31.6" x2="33.5" y2="15.4"></line>
                          </svg>
                        </router-link>
                      </div>
                    </div>
                    <h6 class="ml-15">
                      <router-link to="/service">我的服務</router-link>
                    </h6>
                  </div>
                </div>

                <div class="box2">
                  <div class="item3 box-shadwo"></div>
                  <div class="item4 box-shadwo d-flex align-items-center">
                    <h6>
                      <router-link to="/portfolio"><br />我的作品集 </router-link>
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
                  >
                    <i class="fab fa-instagram"></i>
                  </a>
                </div>
                <div class="item6 box-shadwo d-flex align-items-center justify-content-center">
                  <a
                    href="https://github.com/homershie"
                    class="icon"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i class="fab fa-github"></i>
                  </a>
                </div>
                <div class="item7 box-shadwo d-flex align-items-center justify-content-center">
                  <a
                    href="https://medium.com/homer-create"
                    class="icon"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i class="fab fa-medium"></i>
                  </a>
                </div>
              </div>
            </div>
            <div class="author-profile">
              <div class="author-img">
                <div class="img">
                  <img
                    src="https://r2bucket.homershie.com/assets/imgs/header/profile.webp"
                    alt="荷馬桑 Homer Shie 個人照片"
                    loading="lazy"
                  />
                </div>
              </div>
              <div class="author-info">
                <div class="text-center">
                  <span class="main-color sub-title mb-10">視覺設計師 / 動態設計師</span>
                  <h4 class="fw-500">Hi, 我是荷馬桑 Homer Shie</h4>
                </div>
                <div class="social mt-20">
                  <a
                    href="https://www.instagram.com/homer_create"
                    class="icon"
                    rel="noopener noreferrer"
                    target="_blank"
                    aria-label="前往 Instagram"
                  >
                    <i class="fab fa-instagram" aria-hidden="true"></i>
                  </a>
                  <a
                    href="https://www.pinterest.com/HomerShie/"
                    class="icon"
                    rel="noopener noreferrer"
                    target="_blank"
                    aria-label="前往 Pinterest"
                  >
                    <i class="fab fa-pinterest" aria-hidden="true"></i>
                  </a>
                  <a
                    href="https://medium.com/homer-create"
                    class="icon"
                    rel="noopener noreferrer"
                    target="_blank"
                    aria-label="前往 Medium"
                  >
                    <i class="fab fa-medium" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
              <div class="butns mt-30">
                <router-link to="/contact#contact-form" class="inf-butn">
                  <span>聯絡我</span>
                </router-link>
                <a href="/assets/resume/Homer_Shie_Resume.pdf" class="inf-butn" target="_blank">
                  <span>下載履歷</span>
                </a>
              </div>
            </div>
          </div>
          <div class="col-lg-7 valign">
            <div class="content">
              <h5 class="cd-headline slide">
                <span>哈囉, 我是</span>
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
                在台灣擔任動態設計師和
                <span class="bord">視覺設計師</span> 兼職接案中。
              </h1>
              <p class="text">
                作為一位專業的視覺師，除了擅長平面設計和插畫，也熟悉動畫、3D軟體和網頁語法。我曾經遠端為Garmin等客戶提供設計服務，並成功完成了許多B2B和B2C的創作。其中最值得一提的是，我曾與Garmin合作，將木曜四超玩主題的錶面動畫化。此外，我在大學期間參加了皮克斯的動畫營，並獲得了當時的皮克斯動畫師的肯定。我致力於創造出獨特且具有視覺吸引力的設計，期待能為您的業務帶來價值。
              </p>
              <div class="stauts mt-50 pt-50 bord-thin-top">
                <div class="d-flex align-items-center">
                  <div class="mr-40">
                    <div class="d-flex align-items-center">
                      <h2>{{ projectCount }}</h2>
                      <p>
                        件 <br />
                        已完成專案
                      </p>
                    </div>
                  </div>
                  <div class="mr-40">
                    <div class="d-flex align-items-center">
                      <h2>10</h2>
                      <p>
                        個 <br />
                        擅長軟體
                      </p>
                    </div>
                  </div>
                  <div class="ml-auto">
                    <div class="butn-presv">
                      <router-link
                        to="/contact#contact-form"
                        class="butn butn-md butn-bord radius-5 skew"
                      >
                        <span>跟我聯繫！</span>
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
      <div class="progress-text">載入中... {{ loadingProgress }}%</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { portfolio } from '@data/portfolioData.js'
import { useImagePreloader } from '@composables/useImagePreloader.js'

const { preloadImages, loadingProgress, isPreloading } = useImagePreloader()

// headline 輪播文字
const headlineWords = [
  '荷馬桑',
  'Homer Shie',
  '視覺設計師',
  '動態設計師',
  '遊戲玩家',
  '動漫宅宅',
  '前端工程學生',
]
const currentWordIndex = ref(0)
let headlineInterval = null

// 首頁完整 SEO 設定
useSeoMeta({
  title: 'HODES - 荷馬桑 Homer Shie | 視覺設計 ‧ 動態設計 ‧ 插畫',
  description: 'HODES 是荷馬桑 Homer Shie 的個人網站，來自台灣的自由接案工作者，擅長平面設計、插畫、動畫以及網頁設計，有興趣可以隨意逛逛，歡迎和我連絡！',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://homershie.com/' }],
  meta: [
    { property: 'og:title', content: 'HODES - 荷馬桑 Homer Shie | 視覺設計 ‧ 動態設計 ‧ 插畫' },
    { property: 'og:description', content: 'HODES 是荷馬桑 Homer Shie 的個人網站，來自台灣的自由接案工作者，擅長平面設計、插畫、動畫以及網頁設計，有興趣可以隨意逛逛，歡迎和我連絡！' },
    { property: 'og:image', content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/og-image.jpg' },
    { property: 'og:url', content: 'https://homershie.com/' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'HODES - 荷馬桑 Homer Shie | 視覺設計 ‧ 動態設計 ‧ 插畫' },
    { name: 'twitter:description', content: 'Hi！這裡是荷馬桑 Homer Shie，台灣的自由接案工作者，擅長平面設計、插畫、動畫以及網頁設計' },
    { name: 'twitter:image', content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/twitter-card.jpg' },
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
  // headline 輪播
  headlineInterval = setInterval(() => {
    currentWordIndex.value = (currentWordIndex.value + 1) % headlineWords.length
  }, 2000)

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
  const startYear = 2020
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
</style>
