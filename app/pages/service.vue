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
                  <h6>{{ t('service.section_label') }}</h6>
                </div>
              </div>
              <h3>{{ t('service.heading') }}</h3>
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
                        :alt="t('service.services.graphic_design.name')"
                      />
                    </span>
                  </div>
                  <div>
                    <span class="opacity-7 fz-13 mb-5"
                      >{{ getProjectCount('平面設計') }}+ {{ t('service.projects_suffix') }}</span
                    >
                    <h5 class="fz-20">{{ t('service.services.graphic_design.name') }}</h5>
                  </div>
                </div>
                <p>{{ t('service.services.graphic_design.description') }}</p>
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
                        :alt="t('service.services.motion_design.name')"
                      />
                    </span>
                  </div>
                  <div>
                    <span class="opacity-7 fz-13 mb-5">
                      {{ getProjectCount('動畫') }}+ {{ t('service.projects_suffix') }}
                    </span>
                    <h5 class="fz-20">{{ t('service.services.motion_design.name') }}</h5>
                  </div>
                </div>
                <p>{{ t('service.services.motion_design.description') }}</p>
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
                        :alt="t('service.services.illustration.name')"
                      />
                    </span>
                  </div>
                  <div>
                    <span class="opacity-7 fz-13 mb-5">
                      {{ getProjectCount('插畫') }}+ {{ t('service.projects_suffix') }}
                    </span>
                    <h5 class="fz-20">{{ t('service.services.illustration.name') }}</h5>
                  </div>
                </div>
                <p>{{ t('service.services.illustration.description') }}</p>
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
                        :alt="t('service.services.uiux.name')"
                      />
                    </span>
                  </div>
                  <div>
                    <span class="opacity-7 fz-13 mb-5">
                      {{ getProjectCount('UI/UX') }}+ {{ t('service.projects_suffix') }}
                    </span>
                    <h5 class="fz-20">{{ t('service.services.uiux.name') }}</h5>
                  </div>
                </div>
                <p>{{ t('service.services.uiux.description') }}</p>
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
                        :alt="t('service.services.3d.name')"
                      />
                    </span>
                  </div>
                  <div>
                    <span class="opacity-7 fz-13 mb-5">
                      {{ getProjectCount('3D') }}+ {{ t('service.projects_suffix') }}
                    </span>
                    <h5 class="fz-20">{{ t('service.services.3d.name') }}</h5>
                  </div>
                </div>
                <p>{{ t('service.services.3d.description') }}</p>
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
                        :alt="t('service.services.web_frontend.name')"
                      />
                    </span>
                  </div>
                  <div>
                    <span class="opacity-7 fz-13 mb-5"
                      >{{ getProjectCount('網頁設計') }}+ {{ t('service.projects_suffix') }}</span
                    >
                    <h5 class="fz-20">{{ t('service.services.web_frontend.name') }}</h5>
                  </div>
                </div>
                <p>{{ t('service.services.web_frontend.description') }}</p>
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
                  <h6>{{ t('service.pricing_label') }}</h6>
                </div>
              </div>
              <h3>{{ t('service.pricing_heading') }}</h3>
              <p class="mt-15">{{ t('service.pricing_desc') }}</p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6">
            <div class="item md-mb50">
              <h6 class="type">{{ t('service.plans.graphic.title') }}</h6>
              <div class="content d-flex align-items-center">
                <div class="amount mr-40">
                  <h2 class="main-color">{{ t('service.price_negotiable') }}</h2>
                  <button
                    type="button"
                    class="butn butn-md butn-bord radius-30 text-u text-center mt-30"
                    @click="scrollToContact"
                  >
                    <span>{{ t('service.contact_btn') }}</span>
                  </button>
                </div>
                <div class="feat">
                  <ul class="rest">
                    <li v-for="feature in graphicPlanFeatures" :key="feature">
                      <i class="fas fa-check"></i>
                      <span>{{ feature }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="item">
              <h6 class="type">{{ t('service.plans.motion.title') }}</h6>
              <div class="content d-flex align-items-center">
                <div class="amount mr-40">
                  <h2 class="main-color">{{ t('service.price_negotiable') }}</h2>
                  <button
                    type="button"
                    class="butn butn-md butn-bord radius-30 text-u text-center mt-30"
                    @click="scrollToContact"
                  >
                    <span>{{ t('service.contact_btn') }}</span>
                  </button>
                </div>
                <div class="feat">
                  <ul class="rest">
                    <li v-for="feature in motionPlanFeatures" :key="feature">
                      <i class="fas fa-check"></i>
                      <span>{{ feature }}</span>
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
            {{ t('service.brand_text', { count: totalProjectCount }) }}
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
import { useI18nList } from '@composables/useI18nList.js'

const { t, tm } = useI18n()
const localePath = useLocalePath()
const { resolveMessageList } = useI18nList()

// tm() 回傳編譯物件陣列，需轉成字串陣列才能正確顯示
const graphicPlanFeatures = computed(() => resolveMessageList(tm('service.plans.graphic.features')))
const motionPlanFeatures = computed(() => resolveMessageList(tm('service.plans.motion.features')))

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
  router.push(localePath('/contact') + '#contact-form')
}

// SEO 設定
useSeoMeta({
  title: computed(() => t('seo.service.title')),
  description: computed(() => t('seo.service.description')),
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
