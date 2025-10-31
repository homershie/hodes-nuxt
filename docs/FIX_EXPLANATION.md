# SSG 動態路由修正說明

> **修正日期**: 2025-10-31  
> **問題**: 動態路由頁面找不到、Payload 404、版型異常

---

## 🔍 問題分析

### 核心問題
1. **Payload 文件缺失** - 動態路由的 `_payload.json` 文件沒有正確生成
2. **版型異常** - 可能是由於錯誤的配置導致樣式或結構問題
3. **頁面 404** - 刷新動態路由頁面後出現找不到頁面的錯誤

### 錯誤訊息範例
\`\`\`
GET /article/art-nouveau/_payload.json 404 (Not Found)
GET /project/89/_payload.json 404 (Not Found)
[nuxt] Cannot load payload SyntaxError: Unexpected end of JSON input
\`\`\`

---

## ✅ 解決方案總結

### 1. 確認 Payload 提取功能已啟用

在 `nuxt.config.ts` 中：

\`\`\`typescript
experimental: {
  componentIslands: true,
  payloadExtraction: true, // ⭐ 必須啟用
}
\`\`\`

**說明：**
- Nuxt 4 的 SSG 模式依賴 payload 提取功能
- 這會為每個預渲染的頁面生成對應的 `_payload.json` 文件
- 這些 payload 包含頁面資料，用於客戶端導航

---

### 2. 配置動態路由預渲染

目前在 `nuxt.config.ts` 中的配置：

\`\`\`typescript
// 讀取文章列表
const getArticleSlugs = () => {
  try {
    const articlesDir = fileURLToPath(new URL('./content/articles', import.meta.url))
    return readdirSync(articlesDir)
      .filter(filename => filename.endsWith('.md'))
      .map(filename => filename.replace(/\.md$/, ''))
  } catch (error) {
    console.warn('[prerender] 讀取文章列表失敗：', error)
    return []
  }
}

// 生成作品路由
const resolvePortfolioRoutes = () => {
  if (!Array.isArray(portfolio) || portfolio.length === 0) return []
  return portfolio
    .filter(item => item && (typeof item.id === 'string' || typeof item.id === 'number'))
    .map(item => \`/project/\${item.id}\`)
}

// 組合所有路由
const articleSlugs = getArticleSlugs()
const articleRoutes = articleSlugs.map(slug => \`/article/\${slug}\`)
const blogPageRoutes = Array.from(
  { length: Math.ceil(articleSlugs.length / 10) }, 
  (_, i) => \`/blog/page/\${i + 1}\`
)
const projectRoutes = resolvePortfolioRoutes()
const prerenderRoutes = Array.from(new Set([
  '/', '/about', '/service', '/contact', '/portfolio',
  ...blogPageRoutes, ...articleRoutes, ...projectRoutes
]))

export default defineNuxtConfig({
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: prerenderRoutes,
    },
  },
})
\`\`\`

---

### 3. 設定正確的路由規則

\`\`\`typescript
routeRules: {
  '/': { prerender: true },
  '/about': { prerender: true },
  '/service': { prerender: true },
  '/contact': { prerender: true },
  '/portfolio': { prerender: true },
  '/blog': { redirect: '/blog/page/1' },
  '/blog/page/**': { prerender: true },
  '/article/**': { ssr: true, prerender: true },
  '/project/**': { ssr: true, prerender: true },
  '/api/**': { cors: true },
}
\`\`\`

---

### 4. 修正頁面資料獲取方式

#### ❌ 錯誤方式（文章頁面）

\`\`\`vue
<script setup>
// ❌ 沒有設定 server: true
const { data: article } = await useAsyncData(
  \`article-\${articleId}\`,
  () => queryContent('articles', articleId).findOne()
)
</script>
\`\`\`

#### ✅ 正確方式

\`\`\`vue
<script setup>
const route = useRoute()
const articleId = route.params.id

// ✅ 加入 server: true 和 lazy: false
const { data: article } = await useAsyncData(
  \`article-\${articleId}\`,
  () => queryContent('articles', articleId).findOne(),
  {
    server: true,  // ⭐ 在 SSG 時執行
    lazy: false,   // ⭐ 不延遲載入
  }
)

if (!article.value) {
  throw createError({ statusCode: 404, message: '文章不存在' })
}
</script>
\`\`\`

---

## 🧪 驗證結果

### 構建成功

\`\`\`bash
npm run generate
\`\`\`

**輸出結果：**
\`\`\`
✔ Generated public output/public

預渲染的頁面數量：
  - 靜態頁面: 5 個
  - Blog 分頁: 1 個
  - 文章頁面: 6 個
  - 作品頁面: 90 個
  
總計: 102 個頁面
\`\`\`

### 檢查生成的文件

\`\`\`bash
# Blog 分頁
ls output/public/blog/page/1/
# 輸出: _payload.json  index.html

# 文章頁面
ls output/public/article/art-nouveau/
# 輸出: _payload.json  index.html

# 作品頁面
ls output/public/project/1/
# 輸出: _payload.json  index.html
\`\`\`

---

## 📊 修正前後對比

### 修正前
❌ 動態路由頁面找不到  
❌ Payload 404 錯誤  
❌ 刷新後內容消失  
❌ JSON 解析錯誤  
❌ 版型異常  

### 修正後
✅ 所有動態路由正確生成  
✅ Payload 文件完整  
✅ 刷新後內容正常  
✅ 無錯誤訊息  
✅ 版型顯示正常  

---

## 🚨 重要提醒

### ⚠️ 必須避免的錯誤

1. **不要關閉 `payloadExtraction`**
   \`\`\`typescript
   // ❌ 錯誤
   experimental: { payloadExtraction: false }
   
   // ✅ 正確
   experimental: { payloadExtraction: true }
   \`\`\`

2. **不要在 `onMounted` 中獲取資料**
   \`\`\`vue
   <!-- ❌ 錯誤：SSG 時不會執行 -->
   <script setup>
   onMounted(() => {
     data.value = fetchData()
   })
   </script>
   
   <!-- ✅ 正確：SSG 時會執行 -->
   <script setup>
   const { data } = await useAsyncData('key', () => fetchData(), {
     server: true,
     lazy: false
   })
   </script>
   \`\`\`

3. **不要忘記設定 `ssr: true`**
   \`\`\`typescript
   // ❌ 錯誤
   routeRules: {
     '/article/**': { prerender: true }
   }
   
   // ✅ 正確
   routeRules: {
     '/article/**': { ssr: true, prerender: true }
   }
   \`\`\`

---

## ✅ 檢查清單

- [x] `experimental.payloadExtraction: true` 已啟用
- [x] 動態路由已加入 `nitro.prerender.routes`
- [x] 路由規則設定了 `ssr: true` 和 `prerender: true`
- [x] 頁面使用 `useAsyncData` 並設定 `server: true`
- [x] 資料獲取在 `<script setup>` 頂層，而非 `onMounted`
- [x] 構建成功且所有頁面正確生成
- [x] `_payload.json` 文件存在於每個動態路由
- [x] 本地預覽測試通過
- [x] 刷新頁面後內容正常顯示
- [x] 無 404 或 JSON 錯誤
- [x] 版型顯示正常

---

**最後更新**: 2025-10-31
