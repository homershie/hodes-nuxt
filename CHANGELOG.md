# Changelog

## [未發布]

### 新增
- 新增部落格文章 vol.03〜06（繁中 + 英文，共 8 篇）：
  - vol.03「從『理想投射』到『清醒幻滅』」（2026-01-28）
  - vol.04「當『優化』讓愛窒息—INTJ的盲點」（2026-02-04）
  - vol.05「下一段關係的更新補丁—F 與 T 的系統相容性」（2026-02-11）
  - vol.06「在經濟殘骸中升起的英雄主義」（2026-02-18）

---

## [2026-04-02]

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
