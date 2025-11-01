# SSG 部署 404 錯誤修復指南

> **更新日期**: 2025-11-01
> **問題**: Nuxt 部署到 Cloudflare Pages 後出現大量 404 錯誤

---

## 問題描述

部署後網站出現以下錯誤：

```
/_nuxt/BQl29E_C.js: 404 (Not Found)
/_nuxt/CtId8yZj.js: 404 (Not Found)
/_nuxt/D8NdcYTF.js: 404 (Not Found)
/_nuxt/builds/meta/61565cf1-4e3c-4bda-a8cc-ce6ed262981c.json: 404 (Not Found)
TypeError: Failed to fetch dynamically imported module
```

---

## ⭐ 最終解決方案（2025-11-01）

### 核心發現：build vs generate 的關鍵差異

經過完整的排查，發現根本問題是：**當專案包含 server API routes 時，必須使用 `npm run build` 而非 `npm run generate`**。

#### 為什麼？

本專案有 3 個 server API routes：
- `server/api/proxy-image.get.ts` - 圖片代理
- `server/api/send-email.post.ts` - 郵件發送
- `server/api/__sitemap__/urls.ts` - Sitemap 生成

這些 API routes 需要在 Cloudflare Workers 中運行，而不是預渲染為靜態文件。

#### 兩種建置模式的差異

| 特性 | `npm run generate` (純 SSG) | `npm run build` (SSR + Prerender) |
|------|---------------------------|----------------------------------|
| **輸出目錄** | `dist/` (扁平結構) | `dist/` (扁平結構，但包含 `_worker.js/`) |
| **靜態頁面** | ✅ 預渲染 | ✅ 預渲染 |
| **API Routes** | ❌ 無法正確打包 | ✅ 編譯為 Cloudflare Worker |
| **Worker Bundle** | ❌ 缺少 `index.js` | ✅ 生成完整的 `dist/_worker.js/index.js` |
| **適用場景** | 純靜態網站（無 server routes） | 混合網站（靜態頁面 + 動態 API） |

---

## 完整排查歷程

### 第一次嘗試：修復 App Manifest 問題

**問題**: Nuxt 4 預設啟用 app manifest，導致 `/_nuxt/builds/meta/*.json` 404 錯誤。

**解決**:
```typescript
// nuxt.config.ts
experimental: {
  appManifest: false,  // ⭐ 禁用 app manifest
}
```

**結果**: ✅ 修復了 builds/meta 404，但 JS/CSS 仍然 404

---

### 第二次嘗試：修復輸出目錄結構問題

**問題**: 自定義的 `output` 目錄導致路徑不匹配。

原始錯誤配置：
```typescript
// ❌ 錯誤配置
nitro: {
  preset: 'cloudflare-pages',
  output: {
    dir: 'output',
    serverDir: 'output/server',
    publicDir: 'output/public',  // 問題在這
  }
}
```

導致的問題：
- Nitro 生成 `output/server/wrangler.json`，指定部署目錄為 `output`
- 實際靜態資源在 `output/public/_nuxt/*.js`
- Cloudflare Pages 從 `output` 根目錄查找 `/_nuxt/*.js`
- **結果**: 路徑不匹配 → 404

**解決**: 移除自定義配置，使用 Nuxt 預設目錄
```typescript
// ✅ 簡化配置
nitro: {
  preset: 'cloudflare-pages',
  // 讓 Nitro 使用預設目錄結構
}
```

**結果**: ✅ Nuxt 使用 `dist` 作為預設輸出目錄（在 SSG 模式下）

---

### 第三次嘗試：使用 npm run generate

**配置**:
```json
// package.json
{
  "scripts": {
    "preview": "npx wrangler pages dev dist --compatibility-date=2025-10-30"
  }
}
```

**問題**: 執行 `npm run generate` 後，Cloudflare Pages 建置失敗：

```
✘ [ERROR] Could not resolve "/opt/buildhome/repo/dist/_worker.js/index.js"
```

**原因**:
- `generate` 模式只生成了 `dist/_worker.js/wrangler.json`
- 但沒有生成 `dist/_worker.js/index.js` (Worker 入口點)
- 檢查發現目錄內容：
  ```
  dist/_worker.js/
  └── wrangler.json  ← 只有配置，沒有程式碼
  ```

**結果**: ❌ Worker bundle 缺失，無法部署

---

### 第四次嘗試（最終解決）：切換到 npm run build

**認知轉變**:

經過查閱 Nuxt 和 Nitro 文檔，發現：
- `nuxt generate` = 純靜態站點生成（SSG），不支援 server routes
- `nuxt build` = 支援 SSR + 預渲染，可以同時生成靜態頁面和 Worker

**最終配置**:

1. **[nuxt.config.ts](../../nuxt.config.ts#L121-L128)**:
```typescript
// Nitro 設定 - Cloudflare Pages with SSR + Prerender
nitro: {
  preset: 'cloudflare-pages',
  // 使用 npm run build (不是 generate) 來支援 server API routes
  // 輸出到 dist/ (靜態檔案) + dist/_worker.js/ (Workers)
  prerender: {
    crawlLinks: true,
    routes: prerenderRoutes,  // 預渲染的靜態路由
    autoSubfolderIndex: true,
    failOnError: false,
    concurrency: 10,
  },
}
```

2. **[package.json](../../package.json#L26-L33)**:
```json
{
  "scripts": {
    "build": "nuxt build",
    "preview": "npx wrangler pages dev dist --compatibility-date=2025-10-30",
    "rebuild": "npm run clean && npm run build"
  }
}
```

3. **[nuxt.config.ts](../../nuxt.config.ts#L182-L187)** - API 路由配置:
```typescript
routeRules: {
  // API 路由 - 編譯為 Cloudflare Workers Functions
  '/api/**': {
    cors: true,
    ssr: true,
    prerender: false, // ⭐ 不預渲染，編譯成 Worker
  },
}
```

**建置輸出**:

執行 `npm run build` 後：
```
dist/
├── _worker.js/
│   ├── chunks/          ← Worker 程式碼模組
│   ├── wasm/            ← WebAssembly 檔案
│   ├── index.js         ← ✅ Worker 入口點 (163KB)
│   ├── index.js.map     ← Source map
│   ├── timing.js        ← 效能追蹤
│   └── wrangler.json    ← Cloudflare 配置
├── _routes.json         ← 路由規則 (靜態 vs 動態)
├── _nuxt/               ← 前端 JS/CSS bundles
├── index.html           ← 預渲染的首頁
├── about/index.html     ← 預渲染的靜態頁面
└── ...                  ← 其他預渲染內容
```

**本地測試**:
```bash
npm run build
npm run preview
```

訪問 http://127.0.0.1:8788 驗證：
- ✅ 所有靜態頁面正常載入
- ✅ JS/CSS 正常載入（無 404）
- ✅ API routes 正常運作（由 Worker 處理）
- ✅ Wrangler 正確載入 Worker modules

**結果**: ✅ **完全成功！**

---

## 技術細節

### Nuxt 4 的 Build vs Generate

#### `nuxt generate` (純 SSG)
- **目的**: 生成純靜態網站
- **輸出**: 所有頁面預渲染為 HTML，無 server 功能
- **限制**:
  - ❌ 無法使用 server API routes
  - ❌ 無法使用 server middleware
  - ❌ Worker bundle 不完整
- **適用**: 純展示型網站（部落格、文檔站）

#### `nuxt build` (SSR + Prerender)
- **目的**: 支援混合模式（靜態 + 動態）
- **輸出**:
  - 靜態頁面預渲染為 HTML
  - Server routes 編譯為 Cloudflare Worker
  - 生成完整的 `_worker.js/index.js`
- **優勢**:
  - ✅ 靜態頁面速度快（預渲染）
  - ✅ API routes 動態處理（Worker）
  - ✅ 最佳化的 code splitting
- **適用**: 需要 API 功能的網站（聯絡表單、代理、認證等）

### Cloudflare Pages 路由機制

`_routes.json` 決定哪些請求走靜態文件，哪些走 Worker：

```json
{
  "version": 1,
  "include": ["/*"],      // 所有路由先進 Worker
  "exclude": [
    "/_nuxt/*",           // 前端資源 → 靜態
    "/",                  // 首頁 → 靜態 HTML
    "/about",             // 關於頁 → 靜態 HTML
    "/images/*",          // 圖片 → 靜態
    // ... 其他預渲染頁面
  ]
}
```

**運作流程**:
1. 請求 `/` → 匹配 exclude → 返回靜態 `index.html`
2. 請求 `/_nuxt/app.js` → 匹配 exclude → 返回靜態 JS
3. 請求 `/api/send-email` → 不在 exclude → 進入 Worker 處理

---

## 建置與部署

### 本地開發
```bash
npm run dev
```

### 生產建置
```bash
# ✅ 正確：使用 build 模式
npm run build

# ❌ 錯誤：generate 無法正確打包 API routes
npm run generate
```

### 本地預覽
```bash
npm run preview
# 或
npm run preview:wrangler
```

### Cloudflare Pages 設定

**構建配置**:
- **Build command**: `npm run build`
- **Build output directory**: 留空（Nitro 自動配置）
- **Root directory**: `/`

**環境變數**:
設定以下環境變數（如需要）：
- `RECAPTCHA_SECRET_KEY`
- `RESEND_API_KEY`
- `TO_EMAIL`
- `NUXT_PUBLIC_RECAPTCHA_SITE_KEY`

---

## 驗證清單

### 1. 本地建置檢查

```powershell
# 執行建置
npm run build

# 確認 Worker bundle 存在
Test-Path dist\_worker.js\index.js  # 應返回 True

# 確認 Worker 檔案大小合理
Get-ChildItem dist\_worker.js\index.js | Select-Object Name, Length
# 預期: index.js 約 160KB+

# 確認路由配置存在
Test-Path dist\_routes.json  # 應返回 True

# 確認前端資源存在
Get-ChildItem dist\_nuxt\*.js | Measure-Object | Select-Object Count
# 預期: 大量 JS 檔案
```

### 2. 本地預覽測試

```bash
npm run preview
```

開啟瀏覽器訪問 http://127.0.0.1:8788：

- ✅ 網站正常載入
- ✅ 開發者工具無 404 錯誤
- ✅ 無 "Failed to fetch dynamically imported module" 錯誤
- ✅ 無 builds/meta 相關警告
- ✅ 頁面導航正常
- ✅ API 功能正常（如聯絡表單）

### 3. Cloudflare Pages 部署驗證

部署後檢查：
- ✅ 所有頁面可訪問
- ✅ JS/CSS 正常載入
- ✅ 圖片和字體正常顯示
- ✅ API routes 正常運作
- ✅ Lighthouse 分數良好

---

## 關鍵文件變更總結

### 修改的文件

1. **[nuxt.config.ts](../../nuxt.config.ts)**
   - ✅ 設定 `experimental.appManifest: false`
   - ✅ 移除自定義 `nitro.output` 配置
   - ✅ 保留 `prerender.routes` 用於靜態頁面
   - ✅ 設定 `/api/**` 為 `prerender: false`

2. **[package.json](../../package.json)**
   - ✅ 保留 `build` 和 `generate` 兩種模式
   - ✅ 更新 `preview` 使用 `dist` 目錄
   - ✅ 更新 `rebuild` 使用 `build` 命令

3. **[wrangler.toml](../../wrangler.toml)**
   - ✅ 簡化為基本配置
   - ✅ 移除 `pages_build_output_dir`（由 Nitro 自動設定）

### 不需要的文件

- `server/plugins/routes.ts` - Nitro 自動生成 `_routes.json`，不需要手動生成

---

## 故障排除

### 問題 1: 建置後 Worker index.js 缺失

**症狀**:
```
dist/_worker.js/
├── wrangler.json  ← 存在
└── index.js       ← 缺失
```

**原因**: 使用了 `npm run generate` 而非 `npm run build`

**解決**:
```bash
npm run build  # 使用 build 而非 generate
```

---

### 問題 2: 本地預覽正常，部署後 404

**診斷**:
```bash
# 檢查建置輸出
ls -la dist/_worker.js/

# 確認 Worker 配置
cat dist/_worker.js/wrangler.json

# 確認路由配置
cat dist/_routes.json
```

**解決**: 確保使用 Wrangler 本地測試，而非簡單的 HTTP server

---

### 問題 3: API routes 返回 404

**檢查**:
```bash
# 確認 API routes 文件存在
ls -la server/api/

# 確認 routeRules 配置正確
grep -A 5 "'/api/\*\*'" nuxt.config.ts
```

**解決**: 確保 `routeRules` 中 `/api/**` 設定為 `prerender: false`

---

## 總結

### 最終方案

| 項目 | 設定 |
|------|------|
| **建置命令** | `npm run build` |
| **輸出目錄** | `dist/` (Nuxt 預設) |
| **Worker Bundle** | `dist/_worker.js/index.js` (自動生成) |
| **靜態頁面** | 自動預渲染到 `dist/` |
| **API Routes** | 編譯為 Cloudflare Worker |

### 核心原則

✅ **Do**:
- 使用 `npm run build` 當專案有 server API routes
- 信任 Nitro 的預設輸出結構
- 使用 `prerender.routes` 指定要預渲染的頁面
- 設定 `/api/**` 為 `prerender: false`

❌ **Don't**:
- 不要使用 `npm run generate` 當你有 API routes
- 不要自定義 `nitro.output` 目錄結構
- 不要手動生成 `_routes.json` 或 `wrangler.json`
- 不要在 Cloudflare Pages 設定輸出目錄

### 效能優勢

使用 `build` + `prerender` 模式的優點：
- 🚀 靜態頁面直接從 CDN 提供（極快）
- ⚡ API routes 在 Worker 中執行（低延遲）
- 💰 減少 Worker 執行次數（節省成本）
- 🎯 最佳化的 code splitting
- 📦 更小的 bundle 尺寸

---

## 相關資源

- [Nitro Cloudflare Pages Deployment](https://nitro.build/deploy/providers/cloudflare)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [Nuxt 4 Migration Guide](https://nuxt.com/docs/getting-started/upgrade)
- [Cloudflare Pages Routing](https://developers.cloudflare.com/pages/platform/functions/routing/)

---

**最後更新**: 2025-11-01
**狀態**: ✅ 問題已完全解決
