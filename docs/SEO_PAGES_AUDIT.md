### 專案頁面 SEO 稽核（app/pages）

> 來源版本：Nuxt 4 專案現況掃描；以 `useSeoMeta`、`useHead`、`definePageMeta`、`<head>` 等設定為準。

#### 總覽表

| 路由 | 檔案 | 標題 | 描述 | Canonical | Open Graph | Twitter | 其他 | 備註 |
|---|---|---|---|---|---|---|---|---|
| `/` | `app/pages/index.vue` | useSeoMeta.title（覆蓋全域） | 無（用全域） | 無 | 無 | 無 | 無 | 僅設定標題；其他依全域設定 |
| `/about` | `app/pages/about.vue` | 透過 `usePageTitle` 設定文件標題（組合） | useSeoMeta.description | 無 | 無 | 無 | 無 | 有描述，無 canonical 與 OG/Twitter |
| `/service` | `app/pages/service.vue` | 無 | 無 | 無 | 無 | 無 | 無 | 無任何 SEO 宣告 |
| `/contact` | `app/pages/contact.vue` | 無 | 無 | 無 | 無 | 無 | 無 | 無任何 SEO 宣告 |
| `/portfolio` | `app/pages/portfolio/index.vue` | useHead.title（computed） | meta description（computed） | link rel=canonical | og:title / og:description / og:url | 無 | 無 | SEO 設定完整但無 Twitter、OG image |
| `/blog` → 301 | `app/pages/blog/index.vue` | 301 導到 `/blog/page/1` | — | — | — | — | — | 僅重導無 SEO |
| `/blog/page/:page` | `app/pages/blog/page/[page].vue` | useHead.title（computed） | meta description（computed） | link rel=canonical | og:title / og:description / og:url | 無 | 無 | 同作品列表頁，無 Twitter、OG image |
| `/article/:id` | `app/pages/article/[id].vue` | useHead.title | meta description | link rel=canonical | og:title / og:description / og:image / og:url | 無 | article:published_time / article:author | 文章頁最完整；仍缺 Twitter/robots/schema |
| `/project/:id` | `app/pages/project/[id].vue` | 以 document.title 動態組字串 | 無 | 無 | 無 | 無 | 無 | 建議改用 `useHead/useSeoMeta` 並補足 OG/Twitter/Canonical |
| `/*` | `app/pages/404.vue` | 無 | 無 | 無 | 無 | 無 | 無 | 自訂 404 頁；可加 noindex |

#### 逐頁面細節

##### 首頁 `/`（`app/pages/index.vue`）
- 現況：
  - `useSeoMeta({ title })`
  - 未設定 description、canonical、OG/Twitter、robots、schema
- 建議：
  - 補 `description`（120–160 字）、`link[rel=canonical]`、`og:title/og:description/og:image/og:url`、`twitter:card/summary_large_image`、`robots`（index,follow）與組織/網站 `JSON-LD`

##### 關於 `/about`（`app/pages/about.vue`）
- 現況：
  - `useSeoMeta({ description })`
  - 標題透過 `usePageTitle('關於我')`（推測全域合成）
  - 無 canonical、OG/Twitter、robots、schema
- 建議：
  - 同首頁補齊；`og:url` 指向 `https://homershie.com/about`

##### 服務 `/service`（`app/pages/service.vue`）
- 現況：無 SEO 宣告
- 建議：
  - `useHead` 或 `useSeoMeta` 補 `title/description/canonical/OG/Twitter/robots`

##### 聯絡 `/contact`（`app/pages/contact.vue`）
- 現況：無 SEO 宣告
- 建議：
  - 補 `title/description`（含聯繫方式關鍵字）、`canonical`、`OG/Twitter/robots`

##### 作品集列表 `/portfolio`（`app/pages/portfolio/index.vue`）
- 現況：
  - `useHead({ title, meta: description/og:title/og:description/og:url, link: canonical })`
  - 無 `og:image`、無 Twitter
- 建議：
  - 以代表性作品或頁面靜態分享圖補 `og:image`，並加 `twitter:card` 與 `twitter:image`

##### 部落格列表 `/blog/page/:page`（`app/pages/blog/page/[page].vue`）
- 現況：
  - `useHead({ title, meta: description/og:title/og:description/og:url, link: canonical })`
  - 無 `og:image`、無 Twitter
- 建議：
  - 若有共用分享圖可加 `og:image`，並補 Twitter 標籤

##### 文章內頁 `/article/:id`（`app/pages/article/[id].vue`）
- 現況：
  - `useHead({ title, meta: description/og:title/og:description/og:image/og:url/article:published_time/article:author, link: canonical })`
  - 缺 `twitter:*`、`robots`、`JSON-LD`（Article 或 BlogPosting）
- 建議：
  - 補 `twitter:card=summary_large_image`、`twitter:title`、`twitter:description`、`twitter:image`
  - 加入 `BlogPosting`/`Article` schema（title/description/datePublished/author/image/url）

##### 專案內頁 `/project/:id`（`app/pages/project/[id].vue`）
- 現況：
  - 僅以 `document.title` 動態設定，無 `useHead/useSeoMeta`
  - 無 description/canonical/OG/Twitter
- 建議：
  - 改為 `useHead`：注入 `title/description/canonical/OG/Twitter`（mainImage/gallery 第一張作 `og:image`）

##### 404 `/404`（`app/pages/404.vue`）
- 現況：無 SEO 宣告
- 建議：
  - 補 `useHead` 設定：`title='404 Not Found | HODES'`、`meta name=robots content='noindex, nofollow'`

#### 統一建議（Nuxt 4 慣例）
- 優先使用 `useSeoMeta` 設置標準欄位；遇動態 title/description 可搭配 computed。
- OG/Twitter 可透過 `useHead` 的 `meta` 陣列補足自訂屬性（`property` 與 `name`）。
- 全站建議在 `app/app.vue` 或全域插件設置：
  - 預設 `titleTemplate`、`default description`、`og:site_name`、`twitter:site`。
  - 全站 `link[rel=canonical]` 的 fallback（或各頁明確指定）。
  - sitemap、robots.txt 同步維護（專案已有部署規劃時可對照）。

#### 待辦與缺漏清單
- 首頁、關於、服務、聯絡、專案、404：補齊 Twitter 標籤、canonical、robots 與 `og:image`（視情況）。
- 文章頁：新增 Twitter 標籤與 JSON-LD（BlogPosting/Article）。
- 作品集列表、部落格列表：評估是否加入共用 `og:image` 與 Twitter 標籤。
- 專案頁改造為 `useHead/useSeoMeta`，以主圖作 `og:image`。

#### 參考欄位範例（片段）

```ts
useSeoMeta({
  title: '頁面標題 | HODES',
  description: '120–160 字中文描述...',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://homershie.com/path' }],
  meta: [
    { property: 'og:title', content: '頁面標題 | HODES' },
    { property: 'og:description', content: '描述...' },
    { property: 'og:image', content: 'https://.../share.webp' },
    { property: 'og:url', content: 'https://homershie.com/path' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: '頁面標題 | HODES' },
    { name: 'twitter:description', content: '描述...' },
    { name: 'twitter:image', content: 'https://.../share.webp' },
  ],
})
```

—
最後更新：自動稽核於當前提交狀態生成；後續若頁面改動請同步更新本文件。


