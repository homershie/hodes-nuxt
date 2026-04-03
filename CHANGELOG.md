# Changelog

## [2026-04-03]

### 修復
- 修正「日期排程」機制導致所有文章消失的 bug（兩層修正）：
  1. **Vue Proxy 問題**：`today.value = new Date()` 將 Date 存入 Vue ref 時，Vue 3 以 Proxy 包裝物件，導致 `Date.prototype.getTime` 因無法存取 `[[DateValue]]` 內部 slot 而拋出 TypeError；改以 `Date.now()` 儲存毫秒時間戳（primitive）
  2. **Cloudflare Pages 500 錯誤**：Nuxt 4 的 `useAsyncData` 在 client 端導覽時預設會重新呼叫 fetcher，觸發 POST `/__nuxt_content/content/query`，但 Cloudflare Pages Worker 因 `wrangler.json` 設定問題回傳 500，導致 `allArticles.value` 變 null；修正方式：key 改為穩定的 `'all-articles'`，並加 `getCachedData` 讓 client 優先使用 SSR payload，完全不打 API

---

## [2026-04-02]

### 新增
- 新增部落格文章 vol.03〜06（繁中 + 英文，共 8 篇）：
  - vol.03「從『理想投射』到『清醒幻滅』」（2026-04-02）
  - vol.04「當『優化』讓愛窒息—INTJ的盲點」（2026-04-03）
  - vol.05「下一段關係的更新補丁—F 與 T 的系統相容性」（2026-04-04）
  - vol.06「在經濟殘骸中升起的英雄主義」（2026-04-05）
- 部落格新增「日期排程」機制：未來日期的文章在 client 端掛載後才過濾顯示，無需重新部署即可依日期自動上線（`app/pages/blog/page/[page].vue`）

### 修復
- 修正 vol.03〜06 文章 frontmatter 日期錯誤（原為 2026-01〜02 月，修正為 2026-04-02〜05）

---

## [2026-04-02] — CLAUDE.md 與文件建置

### 新增
- 建立 `CLAUDE.md` — 專案總覽，協助 AI 快速認識專案架構與規範
- 改寫 `.claude/commands/commit.md`、`i18n.md`、`update-docs.md`，移除舊專案痕跡，對齊本專案實際技術棧

---

## [2026-03-14] — i18n 雙語系全面上線

### 新增
- `@nuxtjs/i18n` v10 雙語系支援（zh-TW / en），URL prefix 策略
- `i18n/locales/zh-TW.json`、`i18n/locales/en.json` 翻譯檔，涵蓋所有 UI 文字
- `app/middleware/locale-redirect.global.ts` — 依 Accept-Language header 自動 302 導向
- `composables/useI18nList.js` — 將 `tm()` 回傳的 Message 物件轉為純陣列
- Sitemap 支援雙語系 URL 及 xhtml:link alternates（`_i18nTransform: true`）
- 英文版 6 篇設計風格文章（content/en/articles/）

### 變更
- 所有頁面（index、about、service、contact、portfolio、blog、article、project、404）導入 `useI18n()` 與 `localePath()`
- `useFormValidation.js` — yup schema 改為 `computed()` 確保語系切換後驗證訊息更新
- `useStructuredData.js`、`usePageTitle.js` — 改用 `t()` 取得翻譯文字
- `nuxt.config.ts` — prerenderRoutes 擴展為雙語系版本

---

## [2026-02 ~ 2026-03] — SEO 優化

### 新增
- `@nuxtjs/seo` v3 全面導入（sitemap、robots、hreflang、Open Graph、Schema.org）
- 部落格文章 SEO meta 支援（title、description、og:image 等）
- 自定義 `server/api/__sitemap__/urls.ts` 動態產生 sitemap URL

### 修復
- 修正 Cloudflare Pages SSG 部署 404 問題（多次迭代修正）
- 修正圖片在滾動時消失的 CSS opacity 問題

---

## [2025-10 ~ 2025-11] — 專案基礎建設

### 新增
- Nuxt 4 + Cloudflare Pages SSG 部署架構
- Email 聯絡表單（Resend API + Google reCAPTCHA v3）
- `@nuxt/content` v3 部落格系統
- GSAP 動畫、Swiper 輪播、Masonry 排版
- Pinia 狀態管理、vee-validate + yup 表單驗證
- 圖片代理 API（server/api/proxy-image.get.ts）
- Vitest 測試環境

### 變更
- 從 Nuxt build（Workers）模式改回 generate（SSG）模式
- 移除 @nuxtjs/google-fonts，改用本地字體
- `preview` 腳本改用 Wrangler Pages 預覽
