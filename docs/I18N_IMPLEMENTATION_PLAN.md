# i18n 國際化實作計畫

> 此文件為 i18n 實作的完整計畫與進度紀錄。每個階段完成後會更新狀態標記。

## Context

本網站目前為繁體中文單語系 Nuxt 4 個人作品集網站。為了拓展英文受眾，需加入 `@nuxtjs/i18n` 支援，讓 UI 文字可依語系切換。

**範圍限制（此次計畫）：**
- 只翻譯 UI 文字（頁面、元件、composables 內的硬編碼文字）
- 部落格文章（`content/articles/`）與作品集資料（`data/portfolioData.js`）**暫不翻譯**，後續另立計畫處理
- **無語言切換 UI**，改用瀏覽器語言（Accept-Language header）自動判定語系
- 手動切換方式：直接修改 URL 前綴（`/zh-TW/`、`/en/`）

**URL 策略：** `prefix`（兩種語言都有前綴，預設語言 `zh-TW`）
- 繁體中文：`/zh-TW/`、`/zh-TW/about`、...
- 英文：`/en/`、`/en/about`、...
- `/` → 依瀏覽器語言 302 導向

---

## 進度總覽

| 步驟 | 內容 | 狀態 |
|------|------|------|
| 1 | 存計畫至 docs/ | ✅ 完成 |
| 2 | 安裝 @nuxtjs/i18n（實際使用 v10） | ✅ 完成 |
| 3 | 建立翻譯檔案 zh-TW.json / en.json | ✅ 完成 |
| 4 | 修改 nuxt.config.ts | ✅ 完成 |
| 5 | 建立 locale-redirect.global.ts middleware | ✅ 完成 |
| 6 | 更新 Composables | ✅ 完成 |
| 7 | 更新 Components | ✅ 完成（見備註） |
| 8 | 更新 Pages | ✅ 完成 |
| 9 | 審查 canonical.client.ts | ✅ 完成 |
| 10 | 測試驗收 | ⏳ 待執行 |

---

## 第一步：執行前先存計畫

將此計畫另存至 `docs/I18N_IMPLEMENTATION_PLAN.md`（專案 docs 目錄）。

---

## 第二步：安裝套件

```bash
npm install @nuxtjs/i18n@^9
```

`@nuxtjs/i18n` v9 正式支援 Nuxt 4，會自動管理 `vue-i18n` peer dependency，不需另行安裝。

---

## 第三步：建立翻譯檔案

### 目錄結構

```
d:/git/hodes-nuxt/
  i18n/
    locales/
      zh-TW.json   ← 繁體中文（所有現有文字）
      en.json      ← 英文翻譯
```

### 命名空間設計（巢狀結構）

```json
{
  "nav": {},          // AppNavbar 導覽連結 + aria-labels
  "footer": {},       // AppFooter 文字
  "home": {},         // index.vue 所有文字（含旋轉文字陣列）
  "about": {},        // about.vue（含 capabilities/experiences 陣列）
  "service": {},      // service.vue（服務卡片、方案說明）
  "contact": {},      // contact.vue（表單標籤、成功/失敗訊息）
  "portfolio": {},    // portfolio/index.vue
  "blog": {},         // blog 相關頁面
  "sidebar": {},      // BlogSidebar.vue
  "pagination": {},   // Pagination.vue 上一頁/下一頁
  "breadcrumb": {},   // Breadcrumb.vue
  "related": {},      // RelatedWorks.vue
  "validation": {},   // useFormValidation.js 13 條驗證訊息
  "structured_data":{},// useStructuredData.js schema 描述
  "seo": {},          // 各頁 useSeoMeta 標題/描述
  "404": {}           // 404.vue
}
```

**注意：** `about.capabilities`（核心能力陣列）與 `about.experiences`（工作經歷陣列）移至翻譯檔，用 `tm()` 取得，避免在 `.vue` 中維護雙語資料。

---

## 第四步：修改 `nuxt.config.ts`

### 4-1. Module 順序（i18n 必須在 seo 之前）

```ts
modules: [
  '@nuxt/content',
  contentLinkSanitize,
  '@nuxt/eslint',
  '@nuxt/icon',
  '@nuxt/ui',
  'nuxt-gtag',
  '@vueuse/nuxt',
  '@pinia/nuxt',
  '@nuxtjs/i18n',   // ← 新增，順序在 seo 前
  '@nuxtjs/seo',
],
```

### 4-2. i18n 設定區塊

```ts
i18n: {
  strategy: 'prefix',
  locales: [
    { code: 'zh-TW', language: 'zh-Hant-TW', name: '繁體中文', file: 'zh-TW.json' },
    { code: 'en',    language: 'en',          name: 'English',  file: 'en.json' },
  ],
  defaultLocale: 'zh-TW',
  langDir: './i18n/locales/',
  lazy: true,
  detectBrowserLanguage: false, // 改用自定義 middleware 處理（SSR 相容）
},
```

### 4-3. 移除 `app.head` 中的硬編碼語系設定

```ts
// 移除：
htmlAttrs: { lang: 'zh-Hant-TW' }     // i18n 自動管理
{ property: 'og:locale', content: 'zh_TW' }  // 改在頁面層設定
```

### 4-4. 更新 `site` 設定

```ts
site: {
  defaultLocale: 'zh-TW',  // 從 'zh-Hant-TW' 改為對應 i18n code
}
```

### 4-5. 更新 `routeRules`

所有靜態路由須包含兩種語系前綴：

```ts
'/zh-TW/': { prerender: true },
'/en/':    { prerender: true },
'/zh-TW/about': { prerender: true },
'/en/about':    { prerender: true },
// ... 其餘靜態頁面同理

'/zh-TW/blog': { redirect: '/zh-TW/blog/page/1' },
'/en/blog':    { redirect: '/en/blog/page/1' },

'/zh-TW/article/**': { ssr: true, prerender: true },
'/en/article/**':    { ssr: true, prerender: true },
'/zh-TW/project/**': { ssr: true, prerender: true },
'/en/project/**':    { ssr: true, prerender: true },

'/': { redirect: '/zh-TW/' },  // fallback，實際導向由 middleware 處理
```

### 4-6. 更新 `prerenderRoutes`（雙倍路由）

```ts
const locales = ['zh-TW', 'en']

// 靜態頁面
const localizedStaticRoutes = locales.flatMap(locale =>
  ['', '/about', '/service', '/contact', '/portfolio'].map(p => `/${locale}${p || '/'}`)
)

// 文章、專案、分頁路由也都需要雙倍
const localizedArticleRoutes = locales.flatMap(locale =>
  articleRoutes.map(r => `/${locale}${r}`)
)
// ... 同理 blog / project
```

---

## 第五步：建立語言偵測 Middleware

**檔案：** `app/middleware/locale-redirect.global.ts`

`.global` 後綴讓它在每次路由變換時自動執行。

```ts
export default defineNuxtRouteMiddleware((to) => {
  // 只在根路徑 / 時觸發導向
  if (to.path !== '/') return

  // Server-side：讀 Accept-Language header
  if (import.meta.server) {
    const event = useRequestEvent()
    const acceptLang = event?.headers.get('accept-language') || ''
    const target = parseAcceptLanguage(acceptLang)
    return navigateTo(`/${target}/`, { redirectCode: 302 })
  }

  // Client-side：讀 navigator.language
  if (import.meta.client) {
    const lang = (navigator.language || navigator.languages?.[0] || '').toLowerCase()
    const target = lang.startsWith('zh') ? 'zh-TW' : 'en'
    return navigateTo(`/${target}/`, { replace: true })
  }
})

function parseAcceptLanguage(header: string): string {
  const parts = header.split(',').map(p => {
    const [lang, q] = p.trim().split(';q=')
    return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1.0 }
  }).sort((a, b) => b.q - a.q)

  for (const { lang } of parts) {
    if (lang.startsWith('zh')) return 'zh-TW'
  }
  return 'en'  // 所有非中文語系（含無法辨識）一律英文
}
```

**關鍵設計：** 使用 302（暫時導向）不用 301，讓瀏覽器下次仍重新偵測語言。

**語言判定邏輯：**
- 瀏覽器語言（`Accept-Language` / `navigator.language`）以 `zh` 開頭（含 `zh-TW`、`zh-CN`、`zh-HK`、`zh-SG`、`zh-MO` 等所有中文變體）→ 導向 `/zh-TW/`
- 其他所有語言 → 導向 `/en/`
- 預設 fallback（header 為空或無法解析）→ `/en/`（而非繁中）

---

## 第六步：更新 Composables

### `composables/usePageTitle.js`

```js
export const usePageTitle = () => {
  const { t } = useI18n()
  const getPageTitle = (name) => name ? `${name}${t('seo.page_title_suffix')}` : t('seo.page_title_base')
  const setPageTitle = (name) => useSeoMeta({ title: computed(() => getPageTitle(name)) })
  return { getPageTitle, setPageTitle }
}
```

呼叫端（如 `about.vue`）須改為：`setPageTitle(t('about.section_label'))` 而非傳入硬編碼中文。

### `composables/useFormValidation.js`

**問題：** Yup schema 為靜態物件，驗證訊息無法響應語系切換。

**解法：** 將 schema 改為 `computed()`，讓它在 locale 改變時重建：

```js
export function useFormValidation() {
  const { t } = useI18n()

  const formSchema = computed(() => yup.object({
    name: yup.string()
      .required(t('validation.name_required'))
      .min(2, t('validation.name_min'))
      .max(50, t('validation.name_max'))
      .matches(/^[\u4e00-\u9fa5a-zA-Z\s]+$/, t('validation.name_format')),
    email: yup.string()
      .required(t('validation.email_required'))
      .email(t('validation.email_format')),
    subject: yup.string().max(100, t('validation.subject_max')),
    message: yup.string()
      .required(t('validation.message_required'))
      .min(10, t('validation.message_min'))
      .max(1000, t('validation.message_max'))
      .test('no-spam', t('validation.message_spam'), value =>
        !['賭博', '博彩', '賭場', '賭錢'].some(kw => value?.includes(kw))
      ),
  }))

  return { formSchema, ... }
}
```

在 `contact.vue` 的 `useForm` 傳入 `computed(() => formSchema.value)`。

### `composables/useStructuredData.js`

在 composable 內呼叫 `useI18n()`，將 `description`、`jobTitle` 等 Schema.org 欄位改為 `t('structured_data.xxx')`。

---

## 第七步：更新元件（Components）

所有元件的核心模式：

```vue
<script setup>
const { t } = useI18n()
const localePath = useLocalePath()
</script>
```

| 檔案 | 需要處理的內容 |
|------|---------------|
| `AppNavbar.vue` | 導覽連結文字 + aria-labels；所有 `<NuxtLink to>` → `localePath()` |
| `AppFooter.vue` | `Proudly powered by` 等文字 |
| `Pagination.vue` | 上一頁/下一頁；parent 傳入 locale-aware `baseUrl` |
| `BlogSidebar.vue` | 搜尋 placeholder、分類標題；`formatDate` locale 改為 `locale.value` |
| `RelatedWorks.vue` | 標題、副標題、CTA 按鈕；`localePath('/portfolio')` |
| `Breadcrumb.vue` | `aria-label`；breadcrumb data 改用 `t()` 鍵值 |
| `PortfolioList.vue` | 載入中文字（含 `{percent}` 插值）；aria-labels |

---

## 第八步：更新頁面（Pages）

所有頁面共同規則：
- `useSeoMeta()` 的 title/description 改為 `computed(() => t('seo.xxx.title'))` 形式
- 所有 `<NuxtLink :to>` 改為 `localePath()`
- 所有 `router.push()` 改為 `router.push(localePath(...))`

| 頁面 | 特別注意 |
|------|---------|
| `index.vue` | 旋轉文字陣列改用 `tm('home.headline_words')` |
| `about.vue` | `capabilities` / `experiences` 陣列移至翻譯檔，用 `tm()` 取得 |
| `service.vue` | 服務卡片描述放翻譯檔；`scrollToContact` 用 `localePath()` |
| `contact.vue` | 表單標籤、送出按鈕、成功/失敗訊息 |
| `portfolio/index.vue` | `getCategoryName('all')` 改用 `t('portfolio.all_works')` |
| `blog/index.vue` | `navigateTo` 改用 `localePath()` |
| `blog/page/[page].vue` | 閱讀更多；傳 locale-aware `baseUrl` 給 Pagination；`formatDate` locale-aware |
| `article/[id].vue` | **移除** `htmlAttrs.lang`（由 i18n 管理）；上/下一篇；`formatDate` |
| `project/[id].vue` | breadcrumb 資料改用 `t()`；`formatDate` |
| `404.vue` | 頁面未找到等訊息 |

---

## 第九步：SEO 考量

### hreflang（自動）
`@nuxtjs/seo` + `@nuxtjs/i18n` 同時啟用時，會自動產生 `hreflang` 標籤，無需手動設定。

### Canonical URL
`app/plugins/canonical.client.ts` 目前手動管理 canonical。與 `@nuxtjs/seo` 可能衝突，需審查後擇一來源保留。

### og:locale
移除 `nuxt.config.ts` 的全域 `og:locale`，改在頁面層：
```js
const ogLocale = computed(() => locale.value.replace('-', '_'))
useSeoMeta({ ogLocale })
```

### 部落格文章 hreflang
`/zh-TW/article/slug` 和 `/en/article/slug` 都 prerender，SEO 模組自動產生互指的 `hreflang`。兩個 URL 渲染相同的中文內容是 acceptable 的做法（符合需求規格）。

---

## 第十步：Cloudflare Pages 部署注意事項

- `lazy: true` 讓翻譯檔按需載入，避免 Workers bundle size 過大
- `vite.build.rollupOptions.manualChunks` 可加入 `'vue-i18n': ['vue-i18n']` 避免影響 Worker 函式大小上限
- `autoSubfolderIndex: true` 保持不變（Cloudflare Pages 目錄路由需要）
- Wrangler 本地預覽測試：`npm run preview`

---

## 文件維護規則

**每個階段執行完畢後，必須同步更新此文件：**
- 在進度總覽表格更新狀態（✅ 完成 / 🚧 進行中 / ⏳ 待執行）
- 補充實際執行時遇到的差異、特殊處理、決策記錄
- 若發現計畫有誤或需調整，同步修正文件

---

## 測試驗收清單

- [X] `curl -I -H "Accept-Language: en" http://localhost:3000/` → 302 到 `/en/`
- [X] `curl -I -H "Accept-Language: zh-TW" http://localhost:3000/` → 302 到 `/zh-TW/`
- [X] `/zh-TW/` 顯示繁體中文 UI
- [X] `/en/` 顯示英文 UI
- [X] `/en/blog/page/1` 顯示英文 UI，文章內容仍為中文（符合需求）
- [X] `/en/contact` 表單驗證訊息為英文
- [X] Build 後 `hreflang` 標籤存在於兩種語系的頁面 HTML
- [X] `.output/public/zh-TW/` 和 `.output/public/en/` 都有對應靜態檔
- [ ] `npm run preview` Wrangler 本地測試通過

---

## 關鍵注意事項

1. **每個 `<NuxtLink to>` 都必須包 `localePath()`**，漏掉會導致路由 404
2. **`about.vue` 呼叫 `setPageTitle` 時須傳翻譯後的值**，不能傳硬編碼中文字串
3. **`article/[id].vue` 的 `htmlAttrs.lang` 必須移除**，否則覆蓋 i18n 的 `<html lang>` 管理
4. **`blog/index.vue` 的 `navigateTo` 須用 `localePath()`**
5. **Yup formSchema 須用 `computed()` 包裝**，否則語系切換後驗證訊息不更新

---

## 需修改的關鍵檔案

- `nuxt.config.ts`
- `i18n/locales/zh-TW.json`（新建）
- `i18n/locales/en.json`（新建）
- `app/middleware/locale-redirect.global.ts`（新建）
- `composables/usePageTitle.js`
- `composables/useFormValidation.js`
- `composables/useStructuredData.js`
- `app/plugins/canonical.client.ts`（審查）
- `app/components/AppNavbar.vue`
- `app/components/AppFooter.vue`
- `app/components/Pagination.vue`
- `app/components/BlogSidebar.vue`
- `app/components/RelatedWorks.vue`
- `app/components/Breadcrumb.vue`
- `app/components/PortfolioList.vue`
- `app/pages/index.vue`
- `app/pages/about.vue`
- `app/pages/service.vue`
- `app/pages/contact.vue`
- `app/pages/portfolio/index.vue`
- `app/pages/blog/index.vue`
- `app/pages/blog/page/[page].vue`
- `app/pages/article/[id].vue`
- `app/pages/project/[id].vue`
- `app/pages/404.vue`

---

## 實作紀錄

### 步驟 1：存計畫至 docs/ ✅ 完成
- 日期：2026-03-14
- 此檔案即為計畫文件，與 `.claude/plans/` 內容同步

### 步驟 2～9：i18n 導入完成 ✅
- 日期：2026-03-14
- **套件**：實際安裝 `@nuxtjs/i18n@^10.2.3`（計畫原列 v9，v10 同樣支援 Nuxt 4）
- **翻譯檔**：`i18n/locales/zh-TW.json`、`i18n/locales/en.json` 已建立，涵蓋 nav、home、about、service、contact、portfolio、blog、sidebar、pagination、breadcrumb、related、validation、structured_data、seo、404 等命名空間
- **Composables**：`usePageTitle`、`useFormValidation`、`useStructuredData` 已改用 `t()`；另新增 `useI18nList.js` 處理 `tm()` 回傳的 message 物件（詳見 [I18N_IMPLEMENTATION_BUGS.md](./I18N_IMPLEMENTATION_BUGS.md)）
- **Components**：AppNavbar、Pagination、BlogSidebar、RelatedWorks、Breadcrumb、PortfolioList 均已導入 `useI18n()` / `localePath()`
- **Pages**：index、about、service、contact、portfolio、blog、article、project、404 均已導入 i18n
- **canonical.client.ts**：已審查，`route.path` 已含語系前綴，與 i18n 相容
- **備註**：`AppFooter.vue` 內「Proudly powered by」等文字尚未移至翻譯檔，目前仍為硬編碼，可於後續優化時處理

