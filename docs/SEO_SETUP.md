# SEO 優化設定指南

本文件說明專案中 SEO 優化的實作細節。

## 📦 已安裝套件

### @nuxtjs/seo (主模組)
整合以下六大核心 SEO 子模組：

1. **@nuxtjs/robots** (v5.5.6) - 管理 robots.txt
2. **@nuxtjs/sitemap** (v7.4.7) - 生成 XML sitemap
3. **nuxt-og-image** (v5.1.12) - 動態生成 Open Graph 圖片
4. **nuxt-schema-org** (v5.0.9) - 結構化資料
5. **nuxt-link-checker** (v4.3.6) - 連結檢查
6. **nuxt-seo-utils** (v7.0.18) - SEO 工具函式

## ⚙️ 配置說明

### nuxt.config.ts 設定

#### 1. Site Config (網站基本資訊)
```typescript
site: {
  url: 'https://homershie.com',
  name: 'HODES | Homer Shie',
  description: 'HODES 是荷馬桑 Homer Shie 的個人網站，來自台灣的自由接案工作者，擅長平面設計、插畫以及動畫，有興趣可以隨意逛逛，歡迎和我連絡！',
  defaultLocale: 'zh-Hant-TW',
}
```

#### 2. Robots 配置
```typescript
robots: {
  allow: '/',
  sitemap: 'https://homershie.com/sitemap.xml',
  disallow: process.env.NODE_ENV !== 'production' ? '/' : [],
}
```

**功能**:
- 生產環境允許所有爬蟲索引
- 開發環境禁止索引（保護測試環境）
- 自動指向 sitemap

#### 3. Sitemap 配置
```typescript
sitemap: {
  autoLastmod: true,
  exclude: ['/admin/**', '/api/**'],
}
```

**功能**:
- 自動從頁面路由生成
- 自動更新 lastmod 時間戳
- 排除不需要的頁面
- 支援動態路由添加

**動態路由設定** (`server/api/__sitemap__/urls.ts`):
```typescript
export default defineSitemapEventHandler(async () => {
  const sortedPortfolio = [...portfolio].sort((a, b) => {
    const dateA = new Date(a.date || '2000-01-01')
    const dateB = new Date(b.date || '2000-01-01')
    return dateB.getTime() - dateA.getTime()
  })

  const projectUrls = sortedPortfolio.map((work, index) => {
    // 動態計算優先級
    let priority = 0.7
    if (index < 10) priority = 0.9
    else if (index < 20) priority = 0.85
    else if (index < 40) priority = 0.8

    // 動態計算更新頻率
    const yearsOld = new Date().getFullYear() - new Date(work.date).getFullYear()
    let changefreq = yearsOld === 0 ? 'weekly' : yearsOld === 1 ? 'monthly' : 'yearly'

    return asSitemapUrl({
      loc: `/project/${work.id}`,
      lastmod: work.date || new Date().toISOString(),
      priority,
      changefreq,
    })
  })

  return [...projectUrls, ...blogPageUrls]
})
```

**優化重點**:
- ✅ 按日期排序，最新作品優先
- ✅ 動態優先級分配（0.7 - 0.9）
- ✅ 智能更新頻率（weekly/monthly/yearly）
- ✅ 告訴 Google 優先爬取重要頁面

## 📄 生成的檔案

### 1. robots.txt
位置: `/robots.txt` 或 `/dist/robots.txt`

範例內容:
```
# START nuxt-robots (indexable)
User-agent: *
Allow: /
Disallow:

Sitemap: https://homershie.com/sitemap.xml
# END nuxt-robots
```

### 2. sitemap.xml
位置: `/sitemap.xml` 或 `/dist/sitemap.xml`

自動包含:
- 所有頁面路由
- 最後修改時間 (lastmod)
- **優先級標籤 (priority)** - 0.7 到 0.95
- **更新頻率 (changefreq)** - weekly/monthly/yearly
- 圖片資源 (image:image)
- 動態文章路由

範例 URL 條目:
```xml
<url>
  <loc>https://homershie.com/project/1</loc>
  <lastmod>2024-11-07T15:19:59Z</lastmod>
  <priority>0.9</priority>
  <changefreq>weekly</changefreq>
  <image:image>
    <image:loc>https://r2bucket.homershie.com/assets/imgs/works/work_0001.webp</image:loc>
  </image:image>
</url>
```

## 🔍 SEO 檢查清單

### ✅ 已完成 (2025-11-08 更新)
- [x] 安裝並配置 @nuxtjs/seo
- [x] 設定 site config
- [x] 配置 robots.txt 規則
- [x] 自動生成 sitemap.xml
- [x] Open Graph meta 標籤
- [x] Twitter Card meta 標籤
- [x] 結構化資料支援
- [x] **Sitemap 優化** - 添加 priority 和 changefreq 標籤
- [x] **內部連結優化** - 相關作品推薦系統
- [x] **麵包屑導航** - 包含 Schema.org BreadcrumbList
- [x] **動態優先級** - 基於作品日期的智能優先級分配

### 📝 進階優化建議
- [ ] 針對每個頁面自訂 Open Graph 圖片
- [ ] 增加作品描述的文字內容（至少 150-200 字）
- [ ] 優化圖片 alt 文字（加入關鍵字）
- [ ] 建立 XML Sitemap Index（拆分為多個 sitemap）
- [ ] 增加外部連結（Backlinks）
- [ ] 改善網站載入速度
- [ ] 定期更新內容策略

## 🚀 使用方式

### 開發環境
```bash
npm run dev
```
- 訪問 `http://localhost:3000/robots.txt` 查看 robots
- 訪問 `http://localhost:3000/sitemap.xml` 查看 sitemap

### 生產環境建置
```bash
npm run generate
```
生成的檔案位於 `dist/` 目錄

### 預覽建置結果
```bash
npm run preview
```

## 📚 相關資源

- [Nuxt SEO 官方文件](https://nuxtseo.com/)
- [@nuxtjs/seo 文件](https://nuxtseo.com/docs/nuxt-seo/getting-started/introduction)
- [Nuxt Robots 文件](https://nuxtseo.com/docs/robots/getting-started/installation)
- [Nuxt Sitemap 文件](https://nuxtseo.com/docs/sitemap/getting-started/installation)
- [Google Search Console](https://search.google.com/search-console)

## 🔧 疑難排解

### Sitemap 沒有包含某些頁面
確認該頁面沒有被 `sitemap.exclude` 排除，並且路由是有效的。

### 開發環境看不到正確的 robots.txt
這是正常的，開發環境預設會禁止索引。可以設定 `NODE_ENV=production` 來測試。

### 需要添加動態路由到 sitemap
在 `nuxt.config.ts` 的 `sitemap.urls` 函數中添加動態路由。

## 📊 監控與驗證

1. **Google Search Console**: 提交 sitemap
   - URL: `https://homershie.com/sitemap.xml`

2. **檢查工具**:
   - [Google Rich Results Test](https://search.google.com/test/rich-results)
   - [Schema Markup Validator](https://validator.schema.org/)
   - [Open Graph Debugger](https://www.opengraph.xyz/)

3. **效能監控**:
   - Google PageSpeed Insights
   - Lighthouse SEO 審計

## 🎯 下一步行動計劃

### 立即執行（高優先級）

#### 1. 重新部署網站
```bash
npm run build
```
上傳到 Cloudflare Pages，確保新的 sitemap 生效。

#### 2. 重新提交 Sitemap 到 Google Search Console
- 前往 [Google Search Console](https://search.google.com/search-console)
- 進入「索引 > Sitemap」
- 刪除舊的 sitemap
- 重新提交：`https://homershie.com/sitemap.xml`
- 點擊「要求建立索引」

#### 3. 手動請求索引重要頁面
在 Google Search Console 中，手動為以下頁面請求索引：
- 首頁
- 作品集頁面
- 最新 10 個 project 頁面
- 所有 article 頁面

---

### 短期執行（1-2 週內）

#### 4. 增加作品描述的文字內容
目前許多 project 頁面的描述較短，建議：
- 每個作品至少 150-200 字的描述
- 包含創作背景、設計理念、使用工具等
- 自然地包含相關關鍵字

**範例結構**:
```
這件作品創作於[年份]，是為[客戶/目的]設計的[類型]作品。
設計靈感來自[靈感來源]，採用了[設計風格]的表現手法。
主要使用[工具/軟體]完成，特別注重[設計重點]。
[作品特色或獲得的成果]
```

#### 5. 添加 ALT 文字到所有圖片
確保所有圖片都有描述性的 alt 屬性：
```vue
<img :src="work.image" :alt="`${work.title} - ${work.category.join(', ')} 作品`" />
```

---

### 中期執行（1 個月內）

#### 6. 創建 XML Sitemap Index
由於有 91 個 project 頁面，建議將 sitemap 拆分：
- `sitemap-projects.xml` - 所有 project 頁面
- `sitemap-articles.xml` - 所有 article 頁面
- `sitemap-pages.xml` - 靜態頁面
- `sitemap-index.xml` - 主索引文件

#### 7. 增加外部連結（Backlinks）
- 在社交媒體分享作品（Instagram, Behance, Dribbble）
- 參與設計社群討論
- 投稿到設計媒體平台
- 與其他設計師交換連結

#### 8. 改善網站載入速度
- 使用 Cloudflare 的圖片優化功能
- 啟用 HTTP/3 和 QUIC
- 考慮使用 CDN 加速字體載入

---

### 長期執行（持續優化）

#### 9. 定期更新內容
- 每月至少新增 1-2 個作品
- 定期更新文章內容
- 保持 Blog 活躍度

#### 10. 監控和調整
在 Google Search Console 中追蹤：
- 索引涵蓋率變化
- 點擊率 (CTR)
- 平均排名位置
- 核心網頁指標 (Core Web Vitals)

#### 11. 建立內容策略
- 撰寫設計教學文章
- 分享創作過程
- 製作作品集展示影片
- 增加多媒體內容

---

## 📈 SEO 新功能說明 (2025-11-08)

### 1. 相關作品推薦系統
**檔案**: `app/components/RelatedWorks.vue`

**功能**:
- 智能推薦算法（基於類別和日期相似度）
- 在每個作品頁面底部顯示 6 個相關作品
- 增加 91 個 project 頁面之間的內部連結（從 0 到 546 個內部連結）

**SEO 效果**:
- 大幅增加內部連結密度
- 幫助 Google 爬蟲發現和索引更多頁面
- 降低頁面深度，提升爬取效率

**使用方式**:
```vue
<RelatedWorks :current-work-id="projectId" :limit="6" />
```

### 2. 麵包屑導航
**檔案**: `app/components/Breadcrumb.vue`

**功能**:
- 顯示頁面層級：首頁 > 作品集 > 作品標題
- 包含完整的 Schema.org BreadcrumbList 結構化數據
- 改善用戶體驗和 SEO

**SEO 效果**:
- Google 能更好理解網站架構
- 搜尋結果中可能顯示麵包屑
- 增加首頁和作品集頁面的內部連結

**使用方式**:
```vue
<Breadcrumb :items="breadcrumbItems" />
```

### 3. 動態 Sitemap 優化
**檔案**: `server/api/__sitemap__/urls.ts`

**改進內容**:
- ✅ 按作品日期排序，最新作品優先級更高
- ✅ 動態計算優先級（0.7 - 0.9）
- ✅ 根據作品年份設定更新頻率（weekly/monthly/yearly）
- ✅ Blog 分頁優先級提升至 0.95

**SEO 效果**:
- 告訴 Google 哪些頁面更重要，應該優先爬取和索引
- 改善爬取預算分配
- 加快重要頁面的索引速度

---

## 📊 預期效果

根據實施的修改，預期效果：

| 優化項目 | 預期改善 | 時間範圍 |
|---------|---------|---------|
| 最新 20 個作品頁面 | 1-2 週內開始索引 | 短期 |
| 其他高優先級作品 | 2-4 週內索引 | 中期 |
| 全部作品頁面 | 4-8 週內完全索引 | 長期 |
| 內部連結價值 | 提升頁面權重 | 持續改善 |

---

## 🔧 新增 Composables

### usePortfolio.js - getRelatedWorks()
**檔案**: `composables/usePortfolio.js`

**功能**: 取得相關作品（基於類別和日期）

**參數**:
- `currentWorkId` - 當前作品 ID
- `limit` - 返回數量（預設 6）

**算法**:
1. 相同類別加分（每個共同類別 +10 分）
2. 日期相近加分（同年 +5 分，相差 1 年 +3 分，相差 2 年 +1 分）
3. 按分數排序，返回前 N 個

**使用範例**:
```javascript
const { getRelatedWorks } = usePortfolio()
const relatedWorks = getRelatedWorks(currentWorkId, 6)
```

---

**最後更新**: 2025-11-08
**維護者**: Homer Shie
**SEO 優化版本**: v2.0
