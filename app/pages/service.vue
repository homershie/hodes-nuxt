<template>
  <div>
    <!-- ==================== Start Services ==================== -->
    <section class="services section-padding">
      <div class="container with-pad">
        <div class="sec-head mb-80">
          <div class="row justify-content-center">
            <div class="col-lg-8 text-center">
              <div class="d-inline-block">
                <div class="sub-title-icon d-flex align-items-center">
                  <Icon name="mdi:bell" class="icon" />
                  <h6>我的服務</h6>
                </div>
              </div>
              <h3>我有哪些方式讓您眼前一亮？</h3>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-4 col-md-6">
            <div class="item mb-30">
              <div class="cont">
                <div class="d-flex align-items-center mb-30">
                  <div>
                    <span class="icon-img-50 mr-40">
                      <img
                        :src="
                          getWebpImage('https://r2bucket.homershie.com/assets/imgs/serv-img/1.png')
                        "
                        alt="平面設計"
                      />
                    </span>
                  </div>
                  <div>
                    <span class="opacity-7 fz-13 mb-5"
                      >{{ getProjectCount('平面設計') }}+ 專案</span
                    >
                    <h5 class="fz-20">平面設計</h5>
                  </div>
                </div>
                <p>
                  擅長品牌識別、行銷視覺與主視覺設計，從色彩計畫到版面構成，每個決策都以傳遞品牌價值為核心目標，協助你的視覺在競爭中一眼入魂。
                </p>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="item mb-30">
              <div class="cont">
                <div class="d-flex align-items-center mb-30">
                  <div>
                    <span class="icon-img-50 mr-40">
                      <img
                        :src="
                          getWebpImage('https://r2bucket.homershie.com/assets/imgs/serv-img/2.png')
                        "
                        alt="動態設計"
                      />
                    </span>
                  </div>
                  <div>
                    <span class="opacity-7 fz-13 mb-5">{{ getProjectCount('動畫') }}+ 專案</span>
                    <h5 class="fz-20">動態設計</h5>
                  </div>
                </div>
                <p>
                  以 After Effects 打造具敘事性的動態圖形，曾為 Garmin ×
                  木曜四超玩聯名錶面製作完整動畫。靜態畫面注入靈魂，讓品牌在每次播放中留下印記。
                </p>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="item mb-30">
              <div class="cont">
                <div class="d-flex align-items-center mb-30">
                  <div>
                    <span class="icon-img-50 mr-40">
                      <img
                        :src="
                          getWebpImage('https://r2bucket.homershie.com/assets/imgs/serv-img/3.png')
                        "
                        alt="插畫創作"
                      />
                    </span>
                  </div>
                  <div>
                    <span class="opacity-7 fz-13 mb-5">{{ getProjectCount('插畫') }}+ 專案</span>
                    <h5 class="fz-20">插畫創作</h5>
                  </div>
                </div>
                <p>
                  具備手繪與電繪能力，風格 橫跨
                  ACG、極簡、奇幻與品牌角色設計。每一筆插畫不只是圖像，而是能和觀者精準對話的視覺語言。
                </p>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="item md-mb30">
              <div class="cont">
                <div class="d-flex align-items-center mb-30">
                  <div>
                    <span class="icon-img-50 mr-40">
                      <img
                        :src="
                          getWebpImage('https://r2bucket.homershie.com/assets/imgs/serv-img/5.png')
                        "
                        alt="UI/UX設計"
                      />
                    </span>
                  </div>
                  <div>
                    <span class="opacity-7 fz-13 mb-5">{{ getProjectCount('UI/UX') }}+ 專案</span>
                    <h5 class="fz-20">UI/UX 設計</h5>
                  </div>
                </div>
                <p>
                  長期與 Garmin 合作穿戴式裝置介面設計，擅長在有限螢幕空間進行資訊架構重組。結合
                  Design System 思維，讓設計語言從元件到頁面保持一致。
                </p>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="item sm-mb30">
              <div class="cont">
                <div class="d-flex align-items-center mb-30">
                  <div>
                    <span class="icon-img-50 mr-40">
                      <img
                        :src="
                          getWebpImage('https://r2bucket.homershie.com/assets/imgs/serv-img/4.png')
                        "
                        alt="3D"
                      />
                    </span>
                  </div>
                  <div>
                    <span class="opacity-7 fz-13 mb-5">{{ getProjectCount('3D') }}+ 專案</span>
                    <h5 class="fz-20">3D</h5>
                  </div>
                </div>
                <p>
                  以 Blender 與 3ds Max 建構立體場景與角色，讓概念化為可觸摸的視覺實體。
                  為品牌與行銷帶來突破平面的想像維度。
                </p>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="item">
              <div class="cont">
                <div class="d-flex align-items-center mb-30">
                  <div>
                    <span class="icon-img-50 mr-40">
                      <img
                        :src="
                          getWebpImage('https://r2bucket.homershie.com/assets/imgs/serv-img/6.png')
                        "
                        alt="UI設計"
                      />
                    </span>
                  </div>
                  <div>
                    <span class="opacity-7 fz-13 mb-5"
                      >{{ getProjectCount('網頁設計') }}+ 專案</span
                    >
                    <h5 class="fz-20">網頁前端設計</h5>
                  </div>
                </div>
                <p>
                  以React / Next 或 Vue / Nuxt 實作，結合 GSAP 微互動與 ScrollTrigger，打造視覺張力
                  與操作流暢並存的網站體驗。設計與工程一人完成，確保 pixel-perfect 落地。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== End Services ==================== -->
    <!-- ==================== Start Pricing ==================== -->

    <section class="price section-padding pt-0">
      <div class="container with-pad">
        <div class="sec-head mb-80">
          <div class="row justify-content-center">
            <div class="col-lg-8 text-center">
              <div class="d-inline-block">
                <div class="sub-title-icon d-flex align-items-center">
                  <Icon name="mdi:note-text" class="icon" />
                  <h6>合作方案</h6>
                </div>
              </div>
              <h3>讓好的設計成為值得的投資</h3>
              <p class="mt-15">
                我重視與每一位客戶的深入溝通，致力於理解需求、解決設計挑戰，並透過專業的視覺語言為專案創造實質價值。
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6">
            <div class="item md-mb50">
              <h6 class="type">平面設計方案</h6>
              <div class="content d-flex align-items-center">
                <div class="amount mr-40">
                  <h2 class="main-color">議價</h2>
                  <button
                    type="button"
                    class="butn butn-md butn-bord radius-30 text-u text-center mt-30"
                    @click="scrollToContact"
                  >
                    <span>聯絡我</span>
                  </button>
                </div>
                <div class="feat">
                  <ul class="rest">
                    <li>
                      <i class="fas fa-check"></i>
                      <span>平面設計服務</span>
                    </li>
                    <li>
                      <i class="fas fa-check"></i>
                      <span>品牌識別設計</span>
                    </li>
                    <li>
                      <i class="fas fa-check"></i>
                      <span>插畫創作</span>
                    </li>
                    <li>
                      <i class="fas fa-check"></i>
                      <span>主視覺設計</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="item">
              <h6 class="type">動態設計方案</h6>
              <div class="content d-flex align-items-center">
                <div class="amount mr-40">
                  <h2 class="main-color">議價</h2>
                  <button
                    type="button"
                    class="butn butn-md butn-bord radius-30 text-u text-center mt-30"
                    @click="scrollToContact"
                  >
                    <span>聯絡我</span>
                  </button>
                </div>
                <div class="feat">
                  <ul class="rest">
                    <li>
                      <i class="fas fa-check"></i>
                      <span>動態設計與動畫</span>
                    </li>
                    <li>
                      <i class="fas fa-check"></i>
                      <span>3D視覺效果</span>
                    </li>
                    <li>
                      <i class="fas fa-check"></i>
                      <span>影片特效與剪輯</span>
                    </li>
                    <li>
                      <i class="fas fa-check"></i>
                      <span>UI/UX 介面設計</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== End Pricing ==================== -->
    <!-- ==================== Start Brands ==================== -->

    <section class="brands section-padding pt-0">
      <div class="container with-pad">
        <div class="text-center">
          <h6>
            超過
            <span class="main-color">{{ totalProjectCount }}+ 專案</span>
            的成功合作經驗
          </h6>
        </div>
        <div class="row">
          <div class="col">
            <div class="item">
              <div class="img w-25">
                <img
                  :src="
                    getWebpImage('https://r2bucket.homershie.com/assets/imgs/brands/garmin.png')
                  "
                  style="filter: brightness(0.5)"
                  alt="garmin-logo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== End Brands ==================== -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { portfolio } from '@data/portfolioData.js'

const router = useRouter()
const portfolioData = ref(portfolio)

// 將圖片路徑轉換為WebP格式
const getWebpImage = imagePath => {
  return imagePath.replace(/\.(jpg|png)$/, '.webp')
}

// 計算總專案數量
const totalProjectCount = computed(() => portfolioData.value.length)

// 根據類別計算專案數量
const getProjectCount = targetCategory => {
  if (!portfolioData.value.length) return 0
  return portfolioData.value.filter(project => {
    if (Array.isArray(project.category)) {
      return project.category.includes(targetCategory)
    }
    return project.category === targetCategory
  }).length
}

function scrollToContact() {
  // 導航到聯絡頁面並滾動到表單區域
  router.push('/contact#contact-form')
}

// SEO 設定
useSeoMeta({
  title: '服務 | HODES - 荷馬桑 Homer Shie',
  description:
    '提供平面設計、動態設計、插畫創作、UI/UX 設計、3D、網頁前端設計等專業服務。長期與 Garmin 合作，累積超過 90+ 件專案成功經驗。',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://homershie.com/service' }],
  meta: [
    { property: 'og:title', content: '服務 | HODES - 荷馬桑 Homer Shie' },
    {
      property: 'og:description',
      content:
        '提供平面設計、動態設計、插畫創作、UI/UX 設計、3D、網頁前端設計等專業服務。長期與 Garmin 合作。',
    },
    {
      property: 'og:image',
      content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/og-image.jpg',
    },
    { property: 'og:url', content: 'https://homershie.com/service' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: '服務 | HODES - 荷馬桑 Homer Shie' },
    {
      name: 'twitter:description',
      content:
        '提供平面設計、動態設計、插畫創作、UI/UX 設計、3D、網頁前端設計等專業服務。長期與 Garmin 合作。',
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
        '@type': 'Service',
        serviceType: '設計服務',
        provider: {
          '@type': 'Person',
          name: 'Homer Shie',
        },
        areaServed: {
          '@type': 'Country',
          name: '台灣',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: '設計服務項目',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: '平面設計',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: '動態設計',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: '插畫創作',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'UI/UX 設計',
              },
            },
          ],
        },
      }),
    },
  ],
})
</script>
