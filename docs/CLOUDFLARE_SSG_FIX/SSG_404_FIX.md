# SSG 部署 404 錯誤修復指南

> **更新日期**: 2025-11-01
> **問題**: Nuxt SSG 部署到 Cloudflare Pages 後出現大量 404 錯誤

---

## 問題描述

部署後網站出現以下錯誤：

```
/_nuxt/ByOeACuJ.js: 404 (Not Found)
/_nuxt/DrOXS99v.js: 404 (Not Found)
/_nuxt/builds/meta/77b23401-a58a-4f2b-938f-d1536d039542.json: 404 (Not Found)
TypeError: Failed to fetch dynamically imported module
```

---

## 根本原因

1. **App Manifest 問題**: Nuxt 4 預設啟用 app manifest 功能，會在 `/_nuxt/builds/meta/` 目錄下生成 manifest JSON 文件。這在 SSG 模式下會導致 404 錯誤，因為客戶端會嘗試載入不存在的 manifest 文件。

2. **缺少 `_routes.json`**: Cloudflare Pages 需要 `_routes.json` 文件來正確路由靜態資源和動態請求。

---

## 解決方案

### 1. 禁用 App Manifest

在 [`nuxt.config.ts`](../nuxt.config.ts:114-143) 中添加 Nuxt hooks：

```typescript
// Nuxt Hooks
hooks: {
  // 禁用 app manifest 以修復 SSG 部署的 404 錯誤
  'build:manifest': (manifest) => {
    // 在 SSG 模式下禁用 app manifest
    // 這可以防止 /_nuxt/builds/meta/*.json 的 404 錯誤
    for (const key in manifest) {
      if (key.includes('builds/meta')) {
        delete manifest[key]
      }
    }
  },
  // 生成 Cloudflare Pages _routes.json
  'nitro:build:public-assets': async (nitro) => {
    const fs = await import('node:fs/promises')
    const path = await import('node:path')

    const routes = {
      version: 1,
      include: ['/*'],
      exclude: ['/_nuxt/*'],
    }

    const publicDir = path.join(nitro.options.output.publicDir)
    const routesPath = path.join(publicDir, '_routes.json')

    await fs.writeFile(routesPath, JSON.stringify(routes, null, 2), 'utf-8')
    console.log('✅ Generated _routes.json for Cloudflare Pages')
  },
},
```

### 2. 確認 Cloudflare 配置

確保 `nitro.cloudflare` 配置正確：

```typescript
nitro: {
  preset: 'cloudflare-pages',
  cloudflare: {
    deployConfig: true,
    nodeCompat: true,
  },
}
```

---

## 建置命令

### 開發環境
```bash
npm run dev
```

### 生產建置（SSG）
```bash
npm run generate
```

**注意**: 對於 Cloudflare Pages 部署，請使用 `npm run generate` 而不是 `npm run build`。

- `npm run build`: 生成 SSR 模式的構建
- `npm run generate`: 生成 SSG 靜態站點（適用於 Cloudflare Pages）

### 本地預覽
```bash
npm run preview
```

或使用 Wrangler 模擬 Cloudflare Pages 環境：
```bash
npm run preview:wrangler
```

---

## 驗證步驟

### 1. 檢查構建輸出

```powershell
# 確認 _routes.json 已生成
Test-Path output\public\_routes.json  # 應該返回 True

# 確認 builds/meta 目錄不存在
Test-Path output\public\_nuxt\builds  # 應該返回 False

# 檢查生成的靜態文件
Get-ChildItem output\public\_nuxt\*.js | Select-Object -First 5
```

### 2. 本地測試

```bash
npm run preview
```

打開 http://localhost:8788 並檢查：
- ✅ 網站正常載入
- ✅ 瀏覽器控制台沒有 404 錯誤
- ✅ 沒有 "Failed to fetch dynamically imported module" 錯誤
- ✅ 導航到不同頁面正常運作

### 3. Cloudflare Pages 部署

1. 提交更改到 Git
2. 推送到 GitHub
3. Cloudflare Pages 自動部署
4. 檢查部署的網站是否正常

---

## 關鍵文件

- [`nuxt.config.ts`](../nuxt.config.ts) - 主配置文件，包含所有修復
- `output/public/_routes.json` - Cloudflare Pages 路由配置（自動生成）
- [`wrangler.toml`](../wrangler.toml) - Cloudflare Pages 部署配置

---

## 技術細節

### App Manifest 是什麼？

App Manifest 是 Nuxt 4 的一個功能，用於：
- 追蹤客戶端路由時的構建版本
- 檢測是否有新的部署版本
- 提示用戶重新載入頁面

在 SSR 模式下很有用，但在 SSG 模式下會導致問題，因為：
- SSG 是完全靜態的，沒有版本檢測需求
- 客戶端會嘗試載入不存在的 manifest 文件
- 導致大量 404 錯誤和模組載入失敗

### `_routes.json` 的作用

Cloudflare Pages 使用 `_routes.json` 來決定：
- 哪些路徑應該由 Cloudflare Functions 處理
- 哪些路徑應該作為靜態資源直接提供

配置示例：
```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/_nuxt/*"]
}
```

這表示：
- 所有路徑 (`/*`) 默認由 Functions 處理
- `/_nuxt/*` 下的資源直接作為靜態文件提供

---

## 故障排除

### 問題: 本地預覽正常，但部署後仍有 404

**解決方案**:
1. 確認 `_routes.json` 已提交到 Git
2. 確認 Cloudflare Pages 的構建命令是 `npm run generate`
3. 確認輸出目錄設置為 `output/public`

### 問題: TypeScript 錯誤

如果出現 TypeScript 相關錯誤：
```bash
# 清理並重新生成類型
rm -rf node_modules/.cache
npm run postinstall
```

### 問題: 字體或圖片 404

確保 `_routes.json` 的 `exclude` 包含這些資源：
```json
{
  "exclude": [
    "/_nuxt/*",
    "/fonts/*",
    "/images/*",
    "/*.woff",
    "/*.woff2",
    "/*.ttf"
  ]
}
```

---

## 相關文檔

- [Nuxt Content v3 Documentation](https://content.nuxt.com/)
- [Cloudflare Pages Functions Routing](https://developers.cloudflare.com/pages/platform/functions/routing/)
- [Nuxt 4 Migration Guide](https://nuxt.com/docs/getting-started/upgrade)

---

最後更新: 2025-11-01
