// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import contentLinkSanitize from './modules/content-link-sanitize'

export default defineNuxtConfig({
  compatibilityDate: '2025-10-30',
  devtools: { enabled: true },

  // Nuxt Content 配置
  content: {
    // markdown 配置已移除，使用預設值
  },

  // Site Config for SEO
  site: {
    url: 'https://homershie.com',
    name: 'HODES | 荷馬桑 Homer Shie 的個人網站',
    description:
      'HODES 是荷馬桑 Homer Shie 的個人網站，來自台灣的自由接案工作者，擅長平面設計、插畫以及動畫，有興趣可以隨意逛逛，歡迎和我連絡！',
    defaultLocale: 'zh-Hant-TW',
  },

  // Runtime Config
  runtimeConfig: {
    // Private keys (只在 server-side 可用)
    recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
    resendApiKey: process.env.RESEND_API_KEY,
    toEmail: process.env.TO_EMAIL,

    // Public keys (可在 client-side 使用)
    public: {
      recaptchaSiteKey: process.env.NUXT_PUBLIC_RECAPTCHA_SITE_KEY,
    },
  },

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
  css: ['@/assets/scss/style.scss'],

  modules: [
    '@nuxt/content',
    contentLinkSanitize, // 清理 Markdown 中的問題連結
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/ui',
    'nuxt-gtag',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/seo',
  ],

  // Icon 配置 - 確保生產構建時正確打包所有 icon
  icon: {
    // 設置 provider 為 'server' 以啟用本地 API 端點
    provider: 'server',
    // 配置 serverBundle 確保 SSR 時能正確載入 icon
    serverBundle: {
      collections: ['mdi'], // 明確指定要包含的 icon 集合
    },
    clientBundle: {
      // 自動掃描所有組件並包含使用的 icon
      scan: true,
      // 明確指定要包含的 icon（作為備用）
      icons: [
        'mdi:bell',
        'mdi:note-text',
        'mdi:email-outline',
        'mdi:dumbbell',
        'mdi:file-document-outline',
        'mdi:map-marker-outline',
      ],
      // 包含自訂集合
      includeCustomCollections: true,
    },
  },

  // 實驗性功能
  experimental: {
    componentIslands: true, // 元件孤島
    payloadExtraction: true, // Payload 提取
  },

  // Nitro 預渲染設定
  nitro: {
    preset: 'cloudflare-pages',
    // 使用非隱藏目錄，避免 Cloudflare Pages 無法識別的問題
    output: {
      dir: 'output',
      serverDir: 'output/server',
      publicDir: 'output/public',
    },
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/about',
        '/service',
        '/contact',
        '/portfolio',
        '/blog/page/1',
        '/article/art-nouveau',
        '/article/mbe',
        '/article/modern-design-intro',
        '/article/pixel-art',
        '/article/pop-art',
        '/article/vaporwave',
      ],
      autoSubfolderIndex: false,
      // 確保在預渲染時正確處理錯誤
      failOnError: false,
    },
    // Cloudflare Pages 相容性設定
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      routes: {
        include: ['/*'],
        exclude: ['/api/*', '/_nuxt/*', '/fonts/*', '/images/*'],
      },
    },
    alias: {
      '@react-email/render': 'unenv/runtime/mock/empty',
    },
    unenv: {
      external: ['@react-email/render'],
    },
  },

  // 路由規則
  routeRules: {
    // 首頁 - 靜態生成
    '/': { prerender: true },

    // Blog 分頁 - 靜態生成
    '/blog/page/**': { prerender: true },

    // Portfolio - 靜態生成
    '/portfolio': {
      prerender: true,
    },

    // 文章詳情 - 靜態生成
    '/article/**': {
      prerender: true,
    },

    // 作品詳情 - 靜態生成
    '/project/**': {
      prerender: true,
    },

    // API 路由 - 對於 Cloudflare Pages，不需要特殊的 routeRule
    // API 會自動轉換為 Cloudflare Functions
  },

  gtag: {
    id: 'G-8YSG21XKMM',
  },

  // Robots 配置
  robots: {
    // 生產環境允許所有爬蟲索引
    allow: '/',
    // 指向 sitemap
    sitemap: 'https://homershie.com/sitemap.xml',
    // 開發環境禁止索引
    disallow: process.env.NODE_ENV !== 'production' ? '/' : [],
  },

  // Sitemap 配置
  sitemap: {
    // 自動從頁面路由生成
    autoLastmod: true,
    // 排除不需要的頁面
    exclude: ['/admin/**', '/api/**'],
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
    build: {
      // 程式碼分割策略
      rollupOptions: {
        output: {
          manualChunks: {
            // 將大型第三方庫單獨打包
            masonry: ['masonry-layout'],
          },
        },
      },
    },
  },

  // 全域基礎設定（SEO meta 已移至各頁面個別設定）
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-Hant-TW',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'keywords', content: '設計,動畫,插畫,藝術,homer shie,作品集' },
        { name: 'author', content: 'Homer Shie' },
        { property: 'og:locale', content: 'zh_TW' },
      ],
      link: [
        {
          rel: 'icon',
          href: 'https://r2bucket.homershie.com/assets/imgs/favicon_homer.png',
        },
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
        // Noto Sans TC 備用字體
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap',
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
