# Nuxt SSG 動態路由設定指南

> **專案**: HODES - Homer Shie 個人作品集網站  
> **更新日期**: 2025-10-31  
> **Nuxt 版本**: 4.1.2  
> **目標**: 修正 SSG 動態路由生成，確保所有頁面正確預渲染

---

## 📋 問題說明

### 遇到的問題
- 動態路由頁面（`/article/*`、`/project/*`、`/blog/page/*`）找不到 `_payload.json` 文件，導致 404 錯誤
- 刷新頁面後內容消失或出現 JSON 解析錯誤
- API 路由（`/api/proxy-image`）在 Cloudflare Pages 上無法正常運作

### 根本原因
1. Nuxt 4 的 SSG 模式需要明確配置 `payloadExtraction: true`
2. 動態路由需要在構建時明確告知 Nuxt 要預渲染哪些路徑
3. Cloudflare Pages 的路由配置需要正確設定，避免 API 路由被當作靜態資源

---

## ✅ 解決方案

### 1. 啟用 Payload 提取功能

在 `nuxt.config.ts` 中啟用實驗性功能：

\`\`\`typescript
experimental: {
  componentIslands: true,  // 元件孤島
  payloadExtraction: true, // ⭐ 必須啟用，用於 SSG
}
\`\`\`

**為什麼需要？**
- Nuxt 4 的 SSG 需要 `payloadExtraction` 來生成 `_payload.json` 文件
- 這些 payload 文件包含頁面的資料，讓客戶端導航時無需重新請求

---

### 2. 配置動態路由預渲染

#### 在 `nuxt.config.ts` 中直接配置（✅ 目前使用）

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

// 生成所有需要預渲染的路由
const articleSlugs = getArticleSlugs()
const articleRoutes = articleSlugs.map(slug => \`/article/\${slug}\`)
const blogPageTotal = Math.max(1, Math.ceil(articleSlugs.length / 10))
const blogPageRoutes = Array.from({ length: blogPageTotal }, (_, i) => \`/blog/page/\${i + 1}\`)
const projectRoutes = resolvePortfolioRoutes()
const baseStaticRoutes = ['/', '/about', '/service', '/contact', '/portfolio']
const prerenderRoutes = Array.from(new Set([...baseStaticRoutes, ...blogPageRoutes, ...articleRoutes, ...projectRoutes]))

export default defineNuxtConfig({
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: prerenderRoutes,
      autoSubfolderIndex: false,
      failOnError: false,
      concurrency: 10,
    },
  },
})
\`\`\`

---

### 3. 設定路由規則

在 `nuxt.config.ts` 中配置路由規則：

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

**重點說明：**
- `ssr: true` 確保資料在構建時被正確提取
- `prerender: true` 告訴 Nuxt 要生成靜態 HTML 和 payload
- API 路由不需要預渲染，保持為 Nitro Functions

---

### 4. 修正頁面資料獲取方式

#### 文章頁面 (`app/pages/article/[id].vue`)

\`\`\`vue
<script setup>
const route = useRoute()
const articleId = route.params.id

// ⭐ 關鍵：使用 useAsyncData 並設定 server: true
const { data: article } = await useAsyncData(
  \`article-\${articleId}\`,
  () => queryContent('articles', articleId).findOne(),
  {
    server: true,  // ⭐ 確保在 SSG 時執行
    lazy: false,   // ⭐ 不延遲載入
  }
)

if (!article.value) {
  throw createError({ statusCode: 404, message: '文章不存在' })
}
</script>
\`\`\`

#### 作品頁面 (`app/pages/project/[id].vue`)

\`\`\`vue
<script setup>
const route = useRoute()
const projectId = computed(() => route.params.id)
const { getWorkById } = usePortfolio()
const project = ref(getWorkById(projectId.value))

if (!project.value && import.meta.server) {
  throw createError({ statusCode: 404, message: '作品不存在' })
}
</script>
\`\`\`

---

## 🧪 驗證步驟

### 1. 執行 SSG 構建

\`\`\`bash
npm run generate
\`\`\`

### 2. 檢查輸出檔案

\`\`\`bash
# 檢查 Blog 分頁
ls -la output/public/blog/page/

# 檢查文章頁面
ls -la output/public/article/

# 檢查作品頁面
ls -la output/public/project/

# 檢查 Payload 文件
find output/public -name "_payload.json" | wc -l
\`\`\`

### 3. 本地預覽

\`\`\`bash
npm run preview
\`\`\`

訪問測試：
- http://localhost:3000/blog/page/1
- http://localhost:3000/article/art-nouveau
- http://localhost:3000/project/1

**確認事項：**
- ✅ 頁面正確顯示內容
- ✅ 刷新頁面（F5）後內容仍在
- ✅ Network 面板中看到 `_payload.json` 回傳 200
- ✅ 沒有出現 404 或 JSON 解析錯誤

---

## 🔧 故障排除

### 問題 1: Payload 404 錯誤

**症狀：** `GET /article/xxx/_payload.json 404 (Not Found)`

**解決：**
1. 檢查 `experimental.payloadExtraction` 是否為 `true`
2. 確認路由有加入到 `nitro.prerender.routes` 中
3. 檢查頁面的 `useAsyncData` 是否設定 `server: true`
4. 重新執行 `npm run generate`

### 問題 2: 刷新後內容消失

**解決：**
1. 檢查資料獲取是否在 `onMounted` 中（應該要在 `<script setup>` 頂層）
2. 確認有使用 `useAsyncData`，而非直接呼叫 API
3. 檢查路由規則中是否設定 `ssr: true`

### 問題 3: API 路由 404

**解決：**
1. 檢查 `nitro.cloudflare.routes.exclude` 中沒有 `/api/*`
2. 確認 API 路由文件存在於 `server/api/` 目錄

---

## ✅ 檢查清單

- [ ] `experimental.payloadExtraction` 已啟用
- [ ] 所有動態路由都加入到 `nitro.prerender.routes`
- [ ] 頁面使用 `useAsyncData` 並設定 `server: true`
- [ ] 路由規則設定了 `ssr: true` 和 `prerender: true`
- [ ] 執行 `npm run generate` 成功
- [ ] 本地預覽測試通過
- [ ] 所有頁面刷新後內容正常顯示

---

**最後更新**: 2025-10-31
