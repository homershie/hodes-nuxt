// https://nuxt.com/docs/api/configuration/nuxt-config
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import contentLinkSanitize from './modules/content-link-sanitize'
import { portfolio } from './data/portfolioData.js'

const getArticleSlugs = () => {
  try {
    const contentDir = fileURLToPath(new URL('./content', import.meta.url))
    const slugs = new Set<string>()
    for (const locale of ['zh-TW', 'en']) {
      const articlesDir = `${contentDir}/${locale}/articles`
      try {
        const files = readdirSync(articlesDir)
        files
          .filter(filename => filename.endsWith('.md'))
          .forEach(filename => slugs.add(filename.replace(/\.md$/, '')))
      } catch {
        // 某語系目錄可能不存在
      }
    }
    return Array.from(slugs)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[prerender] 讀取文章列表失敗：', error instanceof Error ? error.message : error)
    return []
  }
}

const resolvePortfolioRoutes = () => {
  if (!Array.isArray(portfolio) || portfolio.length === 0) {
    return []
  }
  return portfolio
    .filter(item => item && (typeof item.id === 'string' || typeof item.id === 'number'))
    .map(item => `/project/${item.id}`)
}

const articleSlugs = getArticleSlugs()
const articleRoutes = articleSlugs.map(slug => `/article/${slug}`)

const POSTS_PER_PAGE = 10
const blogPageTotal = Math.max(1, Math.ceil(articleSlugs.length / POSTS_PER_PAGE))
const blogPageRoutes = Array.from(
  { length: blogPageTotal },
  (_, index) => `/blog/page/${index + 1}`
)

const projectRoutes = resolvePortfolioRoutes()

const locales = ['zh-TW', 'en']

const baseStaticRoutes = ['/', '/about', '/service', '/contact', '/portfolio']
const localizedStaticRoutes = locales.flatMap(locale =>
  baseStaticRoutes.map(p => (p === '/' ? `/${locale}/` : `/${locale}${p}`))
)
const localizedBlogPageRoutes = locales.flatMap(locale => blogPageRoutes.map(r => `/${locale}${r}`))
const localizedArticleRoutes = locales.flatMap(locale => articleRoutes.map(r => `/${locale}${r}`))
const localizedProjectRoutes = locales.flatMap(locale => projectRoutes.map(r => `/${locale}${r}`))

const prerenderRoutes = Array.from(
  new Set([
    ...localizedStaticRoutes,
    ...localizedBlogPageRoutes,
    ...localizedArticleRoutes,
    ...localizedProjectRoutes,
  ])
)

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
      'HODES 是荷馬桑 Homer Shie 的個人網站。擁有 9 年視覺設計經驗的 Full Stack Designer，橫跨 UI/UX 設計、動態設計與前端開發，致力於將設計美感與工程邏輯深度整合。',
    defaultLocale: 'zh-TW',
    // 忽略追蹤參數，避免產生重複的 canonical URL
    trailingSlash: false,
    // 在生成 canonical URL 時忽略這些查詢參數
    indexable: true,
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
      appVersion: process.env.NUXT_PUBLIC_APP_VERSION || 'v2.0.1',
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
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
  ],

  i18n: {
    strategy: 'prefix',
    locales: [
      { code: 'zh-TW', language: 'zh-Hant-TW', name: '繁體中文', file: 'zh-TW.json' },
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'zh-TW',
    langDir: 'locales/',
    detectBrowserLanguage: false,
    compilation: {
      strictMessage: false, // allow | in SEO title strings (not plural syntax)
      escapeHtml: false,
    },
  },

  // Icon 配置 - SSG 模式使用 iconify CDN 或打包到客戶端
  icon: {
    // 使用預設的 iconify provider，避免 SSG 模式下的 API 404 錯誤
    // provider: 'iconify', // 可以省略，預設就是 iconify
    clientBundle: {
      // 自動掃描所有組件並包含使用的 icon
      scan: true,
      // 減少打包大小，只包含實際使用的 icons
      sizeLimitKb: 256,
    },
  },

  // 實驗性功能
  experimental: {
    componentIslands: true, // 元件孤島
    payloadExtraction: true, // 啟用 Payload 提取（SSG 必需）
    appManifest: false, // 禁用 app manifest 以避免 SSG 404 錯誤
  },

  // Nuxt Hooks
  hooks: {
    // Nitro 會自動為 Cloudflare Pages 生成 _routes.json
    // 不需要手動生成
  },

  // Nitro 設定 - Cloudflare Pages with SSR + Prerender
  nitro: {
    preset: 'cloudflare-pages',
    // 使用 npm run build (不是 generate) 來支援 server API routes
    // 輸出到 .output/public (靜態檔案) + .output/server (Workers)
    experimental: {
      wasm: false,
    },
    prerender: {
      crawlLinks: true,
      // 依據內容與資料集動態計算靜態化路由
      routes: prerenderRoutes,
      autoSubfolderIndex: true, // 修改為 true，確保生成子目錄結構和 index.html
      // 確保在預渲染時正確處理錯誤
      failOnError: false,
      // 增加並發數以加快預渲染
      concurrency: 10,
    },
    // Cloudflare Pages 相容性設定
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
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
    // 根路徑 - 由 middleware 依瀏覽器語言 302 導向
    '/': { redirect: '/zh-TW/' },

    // 繁體中文靜態頁面
    '/zh-TW/': { prerender: true },
    '/zh-TW/about': { prerender: true },
    '/zh-TW/service': { prerender: true },
    '/zh-TW/contact': { prerender: true },
    '/zh-TW/portfolio': { prerender: true },

    // 英文靜態頁面
    '/en/': { prerender: true },
    '/en/about': { prerender: true },
    '/en/service': { prerender: true },
    '/en/contact': { prerender: true },
    '/en/portfolio': { prerender: true },

    // Blog 分頁
    '/zh-TW/blog': { redirect: '/zh-TW/blog/page/1' },
    '/en/blog': { redirect: '/en/blog/page/1' },
    '/zh-TW/blog/page/**': { prerender: true },
    '/en/blog/page/**': { prerender: true },

    // 文章詳情 - 靜態生成（SSR + Prerender）
    '/zh-TW/article/**': { ssr: true, prerender: true },
    '/en/article/**': { ssr: true, prerender: true },

    // 作品詳情 - 靜態生成（SSR + Prerender）
    '/zh-TW/project/**': { ssr: true, prerender: true },
    '/en/project/**': { ssr: true, prerender: true },

    // API 路由 - 編譯為 Cloudflare Workers Functions
    '/api/**': {
      cors: true,
      ssr: true,
      prerender: false,
    },
  },

  // Google Analytics 配置
  gtag: {
    // GA4 追蹤 ID（可透過環境變數 NUXT_PUBLIC_GTAG_ID 覆蓋）
    id: process.env.NUXT_PUBLIC_GTAG_ID || 'G-8YSG21XKMM',
    // SSG 模式下確保只在生產環境啟用（開發時不會載入 GA 腳本）
    enabled: process.env.NODE_ENV === 'production',
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
    // 確保 sitemap 中的 URL 不包含查詢參數
    strictNuxtContentPaths: true,
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
            'vue-i18n': ['vue-i18n'],
          },
        },
      },
    },
  },

  // 全域基礎設定（SEO meta 已移至各頁面個別設定）
  app: {
    buildAssetsDir: '/_nuxt/',
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'keywords', content: '設計,動畫,插畫,藝術,homer shie,作品集' },
        { name: 'author', content: 'Homer Shie' },
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
      ],
    },
  },
})
