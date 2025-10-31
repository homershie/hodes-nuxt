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
- 建議 SEO 設定：
  ```typescript
  useSeoMeta({
    title: 'HOEDES｜荷馬桑 Homer Shie｜設計 ‧ 插畫 ‧ 動畫 ‧ 藝術 | 台北',
    description: 'HODES 是荷馬桑 Homer Shie 的個人網站，來自台灣的自由接案工作者，擅長平面設計、插畫以及動畫，有興趣可以隨意逛逛，歡迎和我連絡！',
  })

  useHead({
    link: [{ rel: 'canonical', href: 'https://homershie.com/' }],
    meta: [
      { property: 'og:title', content: 'HOEDES｜荷馬桑 Homer Shie｜設計 ‧ 插畫 ‧ 動畫 ‧ 藝術 | 台北' },
      { property: 'og:description', content: 'HODES 是荷馬桑 Homer Shie 的個人網站，來自台灣的自由接案工作者，擅長平面設計、插畫以及動畫，有興趣可以隨意逛逛，歡迎和我連絡！' },
      { property: 'og:image', content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/og-image.jpg' },
      { property: 'og:url', content: 'https://homershie.com/' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'HOEDES｜荷馬桑 Homer Shie｜設計 ‧ 插畫 ‧ 動畫 ‧ 藝術 | 台北' },
      { name: 'twitter:description', content: 'Hi！這裡是荷馬桑 Homer Shie，台灣的自由接案工作者，擅長平面設計、插畫以及動畫' },
      { name: 'twitter:image', content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/twitter-card.jpg' },
      { name: 'robots', content: 'index, follow' },
    ],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Homer Shie',
          alternateName: '荷馬桑',
          url: 'https://homershie.com',
          image: 'https://r2bucket.homershie.com/assets/imgs/header/profile.webp',
          jobTitle: '視覺設計師 / 動態設計師',
          worksFor: {
            '@type': 'Organization',
            name: 'HODES',
          },
          sameAs: [
            'https://www.instagram.com/homer_create',
            'https://github.com/homershie',
            'https://medium.com/homer-create',
          ],
        }),
      },
    ],
  })
  ```

##### 關於 `/about`（`app/pages/about.vue`）
- 現況：
  - `useSeoMeta({ description })`
  - 標題透過 `usePageTitle('關於我')`（推測全域合成）
  - 無 canonical、OG/Twitter、robots、schema
- 建議 SEO 設定：
  ```typescript
  const { setPageTitle } = usePageTitle()
  setPageTitle('關於我')

  useSeoMeta({
    description: '了解荷馬桑 Homer Shie 的背景、技能和經歷，以及各式各樣擅長的工具，展示專業的視覺設計師和動態設計師必備的技能。',
  })

  useHead({
    link: [{ rel: 'canonical', href: 'https://homershie.com/about' }],
    meta: [
      { property: 'og:title', content: '關於我 | HODES - 荷馬桑 Homer Shie' },
      { property: 'og:description', content: '了解荷馬桑 Homer Shie 的背景、技能和經歷，以及各式各樣擅長的工具，展示專業的視覺設計師和動態設計師必備的技能。' },
      { property: 'og:image', content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/og-image.jpg' },
      { property: 'og:url', content: 'https://homershie.com/about' },
      { property: 'og:type', content: 'profile' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: '關於我 | HODES - 荷馬桑 Homer Shie' },
      { name: 'twitter:description', content: '了解荷馬桑 Homer Shie 的背景、技能和經歷，展示專業的視覺設計師和動態設計師必備的技能。' },
      { name: 'twitter:image', content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/twitter-card.jpg' },
      { name: 'robots', content: 'index, follow' },
    ],
  })
  ```

##### 服務 `/service`（`app/pages/service.vue`）
- 現況：無 SEO 宣告
- 建議 SEO 設定：
  ```typescript
  useSeoMeta({
    title: '我的服務 | HODES - 荷馬桑 Homer Shie',
    description: '提供平面設計、動態設計、插畫創作、3D 動畫、品牌設計、網頁前端設計等專業服務。超過 90+ 件專案成功合作經驗，與 Garmin 等知名品牌合作。',
  })

  useHead({
    link: [{ rel: 'canonical', href: 'https://homershie.com/service' }],
    meta: [
      { property: 'og:title', content: '我的服務 | HODES - 荷馬桑 Homer Shie' },
      { property: 'og:description', content: '提供平面設計、動態設計、插畫創作、3D 動畫、品牌設計、網頁前端設計等專業服務。' },
      { property: 'og:image', content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/og-image.jpg' },
      { property: 'og:url', content: 'https://homershie.com/service' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: '我的服務 | HODES - 荷馬桑 Homer Shie' },
      { name: 'twitter:description', content: '提供平面設計、動態設計、插畫創作、3D 動畫、品牌設計、網頁前端設計等專業服務。' },
      { name: 'twitter:image', content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/twitter-card.jpg' },
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
            ],
          },
        }),
      },
    ],
  })
  ```

##### 聯絡 `/contact`（`app/pages/contact.vue`）
- 現況：無 SEO 宣告
- 建議 SEO 設定：
  ```typescript
  useSeoMeta({
    title: '聯絡我 | HODES - 荷馬桑 Homer Shie',
    description: '有任何設計需求或合作機會嗎？歡迎透過表單、電子郵件 homerxworkshop@gmail.com 與我聯繫。位於新北市板橋區，提供平面設計、動態設計、插畫等專業服務。',
  })

  useHead({
    link: [{ rel: 'canonical', href: 'https://homershie.com/contact' }],
    meta: [
      { property: 'og:title', content: '聯絡我 | HODES - 荷馬桑 Homer Shie' },
      { property: 'og:description', content: '有任何設計需求或合作機會嗎？歡迎透過表單、電子郵件與我聯繫。' },
      { property: 'og:image', content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/og-image.jpg' },
      { property: 'og:url', content: 'https://homershie.com/contact' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: '聯絡我 | HODES - 荷馬桑 Homer Shie' },
      { name: 'twitter:description', content: '有任何設計需求或合作機會嗎？歡迎透過表單、電子郵件與我聯繫。' },
      { name: 'twitter:image', content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/twitter-card.jpg' },
      { name: 'robots', content: 'index, follow' },
    ],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          mainEntity: {
            '@type': 'Person',
            name: 'Homer Shie',
            email: 'homerxworkshop@gmail.com',
            address: {
              '@type': 'PostalAddress',
              addressLocality: '板橋區',
              addressRegion: '新北市',
              addressCountry: '台灣',
            },
          },
        }),
      },
    ],
  })
  ```

##### 作品集列表 `/portfolio`（`app/pages/portfolio/index.vue`）
- 現況：
  - `useHead({ title, meta: description/og:title/og:description/og:url, link: canonical })`
  - 無 `og:image`、無 Twitter
- 建議補充設定：
  ```typescript
  // 在現有的 useHead 中補充以下 meta
  useHead({
    title: pageTitle,
    meta: [
      { name: 'description', content: pageDescription },
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: pageDescription },
      { property: 'og:url', content: 'https://homershie.com/portfolio' },
      // 新增 og:image
      { property: 'og:image', content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/og-image.jpg' },
      { property: 'og:type', content: 'website' },
      // 新增 Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: pageTitle },
      { name: 'twitter:description', content: pageDescription },
      { name: 'twitter:image', content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/twitter-card.jpg' },
      { name: 'robots', content: 'index, follow' },
    ],
    link: [{ rel: 'canonical', href: 'https://homershie.com/portfolio' }],
  })
  ```

##### 部落格列表 `/blog/page/:page`（`app/pages/blog/page/[page].vue`）
- 現況：
  - `useHead({ title, meta: description/og:title/og:description/og:url, link: canonical })`
  - 無 `og:image`、無 Twitter
- 建議補充設定：
  ```typescript
  // 在現有的 useHead 中補充以下 meta
  useHead({
    title: pageTitle,
    meta: [
      { name: 'description', content: pageDescription },
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: pageDescription },
      { property: 'og:url', content: `https://homershie.com/blog/page/${currentPage.value}` },
      // 新增 og:image
      { property: 'og:image', content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/og-image.jpg' },
      { property: 'og:type', content: 'website' },
      // 新增 Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: pageTitle },
      { name: 'twitter:description', content: pageDescription },
      { name: 'twitter:image', content: 'https://r2bucket.homershie.com/assets/imgs/thumbnail/twitter-card.jpg' },
      { name: 'robots', content: 'index, follow' },
    ],
    link: [{ rel: 'canonical', href: `https://homershie.com/blog/page/${currentPage.value}` }],
  })
  ```

##### 文章內頁 `/article/:id`（`app/pages/article/[id].vue`）
- 現況：
  - `useHead({ title, meta: description/og:title/og:description/og:image/og:url/article:published_time/article:author, link: canonical })`
  - 缺 `twitter:*`、`robots`、`JSON-LD`（Article 或 BlogPosting）
- 建議補充設定：
  ```typescript
  // 在現有的 useHead 中補充以下內容
  useHead({
    title: `${article.value.title} | HODES`,
    meta: [
      { name: 'description', content: article.value.excerpt },
      { property: 'og:title', content: article.value.title },
      { property: 'og:description', content: article.value.excerpt },
      { property: 'og:image', content: article.value.image },
      { property: 'og:url', content: `https://homershie.com/article/${articleId}` },
      { property: 'og:type', content: 'article' },
      { property: 'article:published_time', content: article.value.date },
      { property: 'article:author', content: article.value.author },
      // 新增 Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: article.value.title },
      { name: 'twitter:description', content: article.value.excerpt },
      { name: 'twitter:image', content: article.value.image },
      // 新增 robots
      { name: 'robots', content: 'index, follow' },
    ],
    link: [{ rel: 'canonical', href: `https://homershie.com/article/${articleId}` }],
    // 新增 BlogPosting Schema
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.value.title,
          description: article.value.excerpt,
          image: article.value.image,
          datePublished: article.value.date,
          author: {
            '@type': 'Person',
            name: article.value.author || 'Homer Shie',
          },
          publisher: {
            '@type': 'Organization',
            name: 'HODES',
            logo: {
              '@type': 'ImageObject',
              url: 'https://r2bucket.homershie.com/assets/imgs/favicon_homer.png',
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://homershie.com/article/${articleId}`,
          },
        }),
      },
    ],
  })
  ```

##### 專案內頁 `/project/:id`（`app/pages/project/[id].vue`）
- 現況：
  - 僅以 `document.title` 動態設定，無 `useHead/useSeoMeta`
  - 無 description/canonical/OG/Twitter
- 建議完整 SEO 設定：
  ```typescript
  // 移除原有的 document.title 設定，改用以下方式
  const projectTitle = computed(() =>
    project.value?.title ? `${project.value.title} | HODES - 荷馬桑 Homer Shie` : '專案詳情 | HODES'
  )

  const projectDescription = computed(() => {
    if (!project.value?.description) return ''
    // 取描述的前 150 字作為 meta description
    return project.value.description.replace(/\n/g, ' ').substring(0, 150) + '...'
  })

  const projectImage = computed(() => {
    // 優先使用 mainImage，若無則使用 gallery 第一張
    if (project.value?.mainImage) return project.value.mainImage.replace(/\.(jpg|png)$/, '.webp')
    if (project.value?.gallery && project.value.gallery[0]) {
      return project.value.gallery[0].replace(/\.(jpg|png)$/, '.webp')
    }
    return 'https://r2bucket.homershie.com/assets/imgs/thumbnail/og-image.jpg'
  })

  useHead({
    title: projectTitle,
    meta: [
      { name: 'description', content: projectDescription },
      { property: 'og:title', content: projectTitle },
      { property: 'og:description', content: projectDescription },
      { property: 'og:image', content: projectImage },
      { property: 'og:url', content: `https://homershie.com/project/${route.params.id}` },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: projectTitle },
      { name: 'twitter:description', content: projectDescription },
      { name: 'twitter:image', content: projectImage },
      { name: 'robots', content: 'index, follow' },
    ],
    link: [{ rel: 'canonical', href: `https://homershie.com/project/${route.params.id}` }],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.value?.title,
          description: projectDescription.value,
          image: projectImage.value,
          creator: {
            '@type': 'Person',
            name: 'Homer Shie',
          },
          datePublished: project.value?.date,
        }),
      },
    ],
  })
  ```

##### 404 `/404`（`app/pages/404.vue`）
- 現況：無 SEO 宣告
- 建議 SEO 設定：
  ```typescript
  useHead({
    title: '404 - 頁面未找到 | HODES',
    meta: [
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  })
  ```

#### 統一建議（Nuxt 4 慣例）
- 優先使用 `useSeoMeta` 設置標準欄位；遇動態 title/description 可搭配 computed。
- OG/Twitter 可透過 `useHead` 的 `meta` 陣列補足自訂屬性（`property` 與 `name`）。
- 全站建議在 `app/app.vue` 或全域插件設置：
  - 預設 `titleTemplate`、`default description`、`og:site_name`、`twitter:site`。
  - 全站 `link[rel=canonical]` 的 fallback（或各頁明確指定）。
  - sitemap、robots.txt 同步維護（專案已有部署規劃時可對照）。

#### 實作優先順序建議

##### 🔴 高優先級（核心頁面 SEO）
1. **首頁 `/`** - 網站門面，必須完整設定所有 SEO 元素
2. **專案內頁 `/project/:id`** - 目前只有 document.title，需全面改造
3. **404 頁面** - 加入 noindex 防止被索引

##### 🟡 中優先級（內容頁面優化）
4. **文章內頁 `/article/:id`** - 補充 Twitter Card 和 BlogPosting Schema
5. **服務頁 `/service`** - 完全缺少 SEO，需補齊
6. **聯絡頁 `/contact`** - 完全缺少 SEO，需補齊

##### 🟢 低優先級（列表頁面補強）
7. **關於頁 `/about`** - 已有 description，補充 OG/Twitter
8. **作品集列表 `/portfolio`** - 已有基礎 SEO，補充 Twitter 和 og:image
9. **部落格列表 `/blog/page/:page`** - 已有基礎 SEO，補充 Twitter 和 og:image

#### 待辦與缺漏清單
- ✅ 首頁：補齊 Twitter 標籤、canonical、robots 與 Person Schema
- ✅ 關於：補齊 Twitter 標籤、canonical、robots 與 og:image
- ✅ 服務：完整新增 SEO 設定與 Service Schema
- ✅ 聯絡：完整新增 SEO 設定與 ContactPage Schema
- ✅ 作品集列表：補 og:image 與 Twitter 標籤
- ✅ 部落格列表：補 og:image 與 Twitter 標籤
- ✅ 文章頁：新增 Twitter 標籤與 BlogPosting Schema
- ✅ 專案頁：改造為 useHead/useSeoMeta，補齊完整 SEO 與 CreativeWork Schema
- ✅ 404 頁：加入 noindex/nofollow

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

#### 實作注意事項

1. **圖片路徑處理**
   - 所有 og:image 和 twitter:image 必須使用完整的絕對路徑（含 https://）
   - 優先使用 WebP 格式，但 og:image 可保留 JPG 以確保相容性
   - 確保所有分享圖片尺寸符合規範：
     - Open Graph: 1200x630px（推薦）
     - Twitter Card: 1200x600px（推薦）

2. **Computed 屬性使用**
   - 動態頁面（如 `/article/:id`、`/project/:id`）的 SEO 資料應使用 computed
   - 確保 computed 有適當的 null/undefined 檢查

3. **Schema.org 結構化資料**
   - 使用 `type: 'application/ld+json'` 格式
   - 透過 `JSON.stringify()` 序列化
   - 確保必填欄位完整（如 BlogPosting 需要 headline, image, datePublished, author）

4. **Canonical URL**
   - 所有頁面都應有明確的 canonical URL
   - 列表頁面的分頁應指向自己，不要都指向第一頁
   - 確保 URL 結尾一致（統一有/或無/）

5. **Robots Meta**
   - 一般內容頁：`index, follow`
   - 404/錯誤頁：`noindex, nofollow`
   - 測試/暫存頁：`noindex, nofollow`

6. **測試驗證工具**
   - Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
   - Twitter Card Validator: https://cards-dev.twitter.com/validator
   - Google Rich Results Test: https://search.google.com/test/rich-results
   - Schema Markup Validator: https://validator.schema.org/

---
**文件版本：** v2.0
**最後更新：** 2025-10-31
**更新內容：** 補充完整 SEO 設定規劃、實作優先順序與注意事項
**稽核基準：** Nuxt 4 專案現況掃描；以 `useSeoMeta`、`useHead`、`definePageMeta` 等設定為準


