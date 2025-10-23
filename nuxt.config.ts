// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // 路徑別名設定
  alias: {
    '@data': fileURLToPath(new URL('./data', import.meta.url)),
    '@composables': fileURLToPath(new URL('./composables', import.meta.url)),
    '@components': fileURLToPath(new URL('./app/components', import.meta.url)),
    '@assets': fileURLToPath(new URL('./app/assets', import.meta.url)),
    '@pages': fileURLToPath(new URL('./app/pages', import.meta.url)),
    '@layouts': fileURLToPath(new URL('./app/layouts', import.meta.url)),
  },

  // 全局 CSS 設定
  css: ['@/assets/style.css', '@/assets/scss/style.scss'],

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/ui',
    'nuxt-gtag',
    '@vueuse/nuxt',
    '@pinia/nuxt',
  ],

  gtag: {
    id: 'G-8YSG21XKMM',
  },

  // Vite 配置
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // 抑制 @import 棄用警告
          silenceDeprecations: ['import'],
        },
      },
    },
  },

  // 全域 SEO 設定
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-Hant-TW',
      },
      title: 'HOEDES｜荷馬桑 Homer Shie｜設計 ‧ 插畫 ‧ 動畫 ‧ 藝術 | 台北',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'HODES 是荷馬桑 Homer Shie 的個人網站，來自台灣的自由接案工作者，擅長平面設計、插畫以及動畫，有興趣可以隨意逛逛，歡迎和我連絡！',
        },
        { name: 'keywords', content: '設計,動畫,插畫,藝術,homer shie,作品集' },
        { name: 'author', content: 'Homer Shie' },
        { name: 'robots', content: 'index, follow' },

        // Open Graph
        {
          property: 'og:title',
          content: 'HOEDES｜荷馬桑 Homer Shie｜設計 ‧ 插畫 ‧ 動畫 ‧ 藝術 | 台北',
        },
        {
          property: 'og:description',
          content:
            'HODES 是荷馬桑 Homer Shie 的個人網站，來自台灣的自由接案工作者，擅長平面設計、插畫以及動畫，有興趣可以隨意逛逛，歡迎和我連絡！',
        },
        {
          property: 'og:image',
          content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/og-image.jpg',
        },
        { property: 'og:url', content: 'https://homershie.com' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'zh_TW' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:title',
          content: '荷馬桑 Homer Shie｜設計 ‧ 插畫 ‧ 動畫 ‧ 藝術 | 台北',
        },
        {
          name: 'twitter:description',
          content: 'Hi！這裡是荷馬桑 Homer Shie，台灣的自由接案工作者，擅長平面設計、插畫以及動畫',
        },
        {
          name: 'twitter:image',
          content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/twitter-card.jpg',
        },
      ],
      link: [
        {
          rel: 'icon',
          href: 'https://r2bucket.homershie.com/assets/imgs/favicon_homer.png',
        },
        { rel: 'canonical', href: 'https://homershie.com' },
        // Bootstrap CSS
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
        },
        // Font Awesome
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        },
        // PE Icon 7 Stroke
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/pe-icon-7-stroke@1.2.0/css/pe-icon-7-stroke.min.css',
        },
        // Swiper
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css',
        },
      ],
      script: [
        // GSAP
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
          defer: true,
        },
        // Popper.js
        {
          src: 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js',
          defer: true,
        },
        // Bootstrap JS
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js',
          defer: true,
        },
        // Swiper JS
        {
          src: 'https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js',
          defer: true,
        },
      ],
    },
  },
})
