# 快速修復總結

## 🎯 核心問題
**禁用 payload extraction 會導致內容消失！** 

正確做法：保持啟用，但確保數據在 SSG 時正確獲取。

## ✅ 3 個關鍵修改

### 1. nuxt.config.ts
```typescript
experimental: {
  payloadExtraction: true, // ✅ 必須啟用
}

routeRules: {
  '/article/**': { ssr: true, prerender: true },
  '/project/**': { ssr: true, prerender: true },
}
```

### 2. article/[id].vue 和 blog/page/[page].vue
```typescript
const { data } = await useAsyncData(
  'unique-key',
  () => queryCollection('content').all(),
  {
    server: true,  // ✅ SSG 時執行
    lazy: false,   // ✅ 不延遲
  }
)
```

### 3. project/[id].vue
```typescript
// ✅ 在 <script setup> 頂層執行，不是 onMounted
project.value = getWorkById(projectId.value)
```

## 🧪 測試步驟
```bash
./test-build.sh
npm run preview
```

測試這些頁面：
- /article/art-nouveau
- /project/89  
- /blog/page/1

確認：✓ 內容顯示 ✓ F5 重整正常 ✓ 無 404

## 📦 提交
```bash
git add .
git commit -m "fix: resolve SSG payload issues for dynamic routes"
git push
```
