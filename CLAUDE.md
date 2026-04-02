# CLAUDE.md — hodes-nuxt 專案指引

> Homer Shie 的個人作品集網站，以 Nuxt 4 + TypeScript 建構，部署於 Cloudflare Pages。

---

## 專案概覽

| 項目 | 說明 |
|------|------|
| 網站 | https://homershie.com |
| 定位 | UI/UX 設計師個人作品集 + 設計風格部落格 |
| 框架 | Nuxt 4（`compatibilityDate: 2025-10-30`） |
| 部署 | Cloudflare Pages（SSG，`nuxt generate`） |
| 語言 | TypeScript + JavaScript（混用） |

---

## 技術棧

| 層級 | 技術 |
|------|------|
| 框架 | Nuxt 4 + Vue 3 |
| UI | @nuxt/ui v4（基於 Tailwind CSS v4） |
| 樣式 | SCSS（組件層）+ Tailwind utility（佈局） |
| 狀態 | Pinia |
| i18n | @nuxtjs/i18n v10（zh-TW / en） |
| 內容 | @nuxt/content v3（Markdown 部落格文章） |
| SEO | @nuxtjs/seo v3（sitemap、robots、hreflang） |
| 動畫 | GSAP |
| 表單 | vee-validate + yup + reCAPTCHA v3 |
| Email | Resend API |
| 圖片輪播 | Swiper |
| 測試 | Vitest + @nuxt/test-utils + jsdom |
| Lint | ESLint + Prettier |

---

## 專案結構

```
hodes-nuxt/
├── app/
│   ├── app.vue                    # 根組件
│   ├── layouts/default.vue        # 預設 layout（含 AppNavbar、AppFooter）
│   ├── pages/                     # 頁面（由 Nuxt 路由自動掃描）
│   │   ├── index.vue              # 首頁
│   │   ├── about.vue              # 關於我
│   │   ├── service.vue            # 服務
│   │   ├── contact.vue            # 聯絡表單
│   │   ├── portfolio/index.vue    # 作品集列表
│   │   ├── blog/index.vue         # 部落格（redirect 到第一頁）
│   │   ├── blog/page/[page].vue   # 部落格分頁
│   │   ├── article/[id].vue       # 文章詳情（@nuxt/content）
│   │   ├── project/[id].vue       # 作品詳情
│   │   └── 404.vue                # 404 頁面
│   ├── components/                # 全域組件（自動 import）
│   │   ├── AppNavbar.vue
│   │   ├── AppFooter.vue
│   │   ├── Pagination.vue
│   │   ├── BlogSidebar.vue
│   │   ├── RelatedWorks.vue
│   │   ├── Breadcrumb.vue
│   │   ├── PortfolioList.vue
│   │   └── article/               # Markdown 自定義組件（ArticleImg 等）
│   ├── middleware/
│   │   └── locale-redirect.global.ts  # 語系自動偵測導向
│   └── plugins/
│       └── canonical.client.ts    # Canonical URL 管理
├── composables/                   # 可組合函式
│   ├── useFormValidation.js       # 聯絡表單驗證（yup + vee-validate）
│   ├── useStructuredData.js       # Schema.org 結構化資料
│   ├── usePageTitle.js            # 頁面標題管理
│   ├── useI18nList.js             # tm() 陣列轉換輔助
│   ├── usePortfolio.js            # 作品集資料
│   ├── useCanonicalUrl.ts         # Canonical URL 計算
│   └── use*.js                    # 圖片、效能等工具
├── content/                       # Markdown 文章（@nuxt/content）
│   ├── zh-TW/articles/           # 繁中文章
│   └── en/articles/              # 英文文章
├── data/
│   ├── portfolioData.js           # 作品集靜態資料
│   └── articleData.js             # 文章輔助資料
├── i18n/locales/
│   ├── zh-TW.json                 # 繁體中文翻譯（預設語系）
│   └── en.json                    # 英文翻譯
├── server/
│   ├── api/
│   │   ├── send-email.post.ts     # 聯絡表單 Email 發送（Resend）
│   │   ├── proxy-image.get.ts     # 圖片代理
│   │   └── __sitemap__/urls.ts    # Sitemap 動態 URL 生成
│   ├── utils/
│   │   ├── recaptcha.ts           # reCAPTCHA v3 驗證
│   │   └── rate-limit.ts          # Rate limiting
│   └── plugins/
│       ├── prerender.ts           # 預渲染設定
│       └── routes.ts              # 路由設定
├── public/                        # 靜態資源
├── modules/
│   └── content-link-sanitize.ts   # 自定義 Nuxt module
├── docs/                          # 技術文件
├── scripts/                       # 輔助腳本
├── nuxt.config.ts                 # 主設定檔
├── app.config.ts                  # App 設定
└── eslint.config.mjs              # ESLint 設定
```

---

## i18n 架構

**策略：** `prefix`（兩種語系都有 URL 前綴）

| 語系 | URL 前綴 | 翻譯檔 |
|------|---------|--------|
| 繁體中文（預設） | `/zh-TW/` | `i18n/locales/zh-TW.json` |
| 英文 | `/en/` | `i18n/locales/en.json` |

**導向規則：** `GET /` → middleware 依 `Accept-Language` header 自動 302 至對應語系

**關鍵規範：**
- 所有 `<NuxtLink to>` 必須包 `localePath()`，漏掉會導致跨語系 404
- 翻譯鍵命名：`{namespace}.{section}.{element}`（最多 3 層）
- `tm()` 用於取得翻譯檔中的陣列（如旋轉文字、工作經歷）
- `useI18nList.js` 將 `tm()` 回傳的 Message 物件轉為純陣列

**翻譯命名空間：**
`nav`, `footer`, `home`, `about`, `service`, `contact`, `portfolio`, `blog`, `sidebar`, `pagination`, `breadcrumb`, `related`, `validation`, `structured_data`, `seo`, `404`

---

## 內容管理（部落格文章）

- 文章存放於 `content/{locale}/articles/{slug}.md`
- 使用 `@nuxt/content` 的 `queryCollection()` API 查詢
- 文章 slug 需在兩種語系目錄都有對應檔案（可內容相同）
- 每頁 10 篇，分頁路由：`/{locale}/blog/page/{page}`
- 詳情頁：`/{locale}/article/{slug}`

---

## 部署流程

```bash
npm run generate        # 產生靜態檔案到 dist/
npm run preview         # 本地 Wrangler 預覽（Cloudflare Pages 環境）
npm run preview:wrangler  # 對外 IP 預覽（0.0.0.0:8788）
```

- 部署目標：Cloudflare Pages
- 所有靜態路由在 `nuxt.config.ts` 的 `prerenderRoutes` 中明確定義（含雙語系版本）
- 預渲染路由包含：靜態頁面、blog 分頁、所有文章、所有作品

---

## 常用指令

```bash
npm run dev             # 開發伺服器
npm run build           # 建置（Cloudflare Workers 模式）
npm run generate        # SSG 靜態產出
npm run lint            # ESLint 修復
npm run format          # Prettier 格式化
npm run test:run        # 執行測試（單次）
npm run ci              # lint + format check + test（CI 用）
```

---

## Server API

| 路由 | 方法 | 說明 |
|------|------|------|
| `/api/send-email` | POST | 聯絡表單發信（Resend + reCAPTCHA） |
| `/api/proxy-image` | GET | 圖片代理（避免 CORS） |
| `/api/__sitemap__/urls` | GET | Sitemap 動態 URL（含雙語系） |

---

## 環境變數

開發時需要 `.env` 設定以下變數（參考 `docs/SETUP_EMAIL.md`）：

```
RESEND_API_KEY=          # Resend Email API key
RECAPTCHA_SECRET_KEY=    # Google reCAPTCHA v3 secret
NUXT_PUBLIC_RECAPTCHA_SITE_KEY=  # reCAPTCHA site key（前端）
NUXT_PUBLIC_GTAG_ID=     # Google Analytics ID
```

---

## 測試

使用 Vitest + @nuxt/test-utils：

```bash
npm run test:run     # 執行所有測試
npm run test:watch   # watch 模式
npm run test:ui      # Vitest UI
npm run test:coverage  # 涵蓋率報告
```

---

## 關鍵設計決策

1. **SSG 優先**：所有頁面預渲染，不使用 SSR（除非特殊需求）
2. **無語言切換 UI**：依瀏覽器語言自動判定，手動切換靠 URL 前綴
3. **AppFooter 硬編碼**：`Proudly powered by` 等文字尚未移至翻譯檔（低優先度）
4. **手動維護 types**：無 Supabase，無 codegen
5. **patch-package**：`postinstall` 執行修補，注意升級套件時檢查 patches/

---

## 文件索引

| 文件 | 說明 |
|------|------|
| [docs/README.md](docs/README.md) | 文件總索引 |
| [docs/SETUP_EMAIL.md](docs/SETUP_EMAIL.md) | Email 功能設定 |
| [docs/SEO_SETUP.md](docs/SEO_SETUP.md) | SEO 配置指南 |
| [docs/SERVER_API.md](docs/SERVER_API.md) | API 技術文件 |
| [docs/I18N_IMPLEMENTATION_PLAN.md](docs/I18N_IMPLEMENTATION_PLAN.md) | i18n 完整實作紀錄 |
| [docs/I18N_IMPLEMENTATION_BUGS.md](docs/I18N_IMPLEMENTATION_BUGS.md) | i18n 已知問題與解法 |
| [docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md) | 部署檢查清單 |
| [docs/SSG_OPTIMIZATION_PLAN.md](docs/SSG_OPTIMIZATION_PLAN.md) | SSG 優化計畫 |
