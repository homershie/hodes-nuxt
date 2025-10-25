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
  urls: async () => {
    // 可以在這裡添加動態路由
    return []
  },
}
```

**功能**:
- 自動從頁面路由生成
- 自動更新 lastmod 時間戳
- 排除不需要的頁面
- 支援動態路由添加

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
- 圖片資源 (image:image)
- 動態文章路由

## 🔍 SEO 檢查清單

### ✅ 已完成
- [x] 安裝並配置 @nuxtjs/seo
- [x] 設定 site config
- [x] 配置 robots.txt 規則
- [x] 自動生成 sitemap.xml
- [x] Open Graph meta 標籤
- [x] Twitter Card meta 標籤
- [x] 結構化資料支援

### 📝 進階優化建議
- [ ] 針對每個頁面自訂 Open Graph 圖片
- [ ] 添加 Schema.org 結構化資料
- [ ] 設定頁面特定的 canonical URL
- [ ] 優化圖片 alt 文字
- [ ] 添加麵包屑導航
- [ ] 實作 JSON-LD 結構化資料

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

## 🎯 下一步

1. 為每個頁面配置獨特的 meta 標籤
2. 實作動態 OG Image 生成
3. 添加 Schema.org Article 標記到部落格文章
4. 優化頁面載入速度
5. 實作結構化資料麵包屑

---

**最後更新**: 2025-10-25
**維護者**: Homer Shie
