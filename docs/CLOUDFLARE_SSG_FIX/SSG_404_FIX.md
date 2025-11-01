# SSG 部署 404 錯誤修復指南

> **更新日期**: 2025-11-01
> **問題**: Nuxt SSG 部署到 Cloudflare Pages 後出現大量 404 錯誤

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

## 根本原因分析

經過深入調查 Cloudflare Pages 構建日誌，發現三個關鍵問題：

### 1. App Manifest 問題
Nuxt 4 預設啟用 app manifest 功能，HTML 會包含對 `/_nuxt/builds/meta/*.json` 的 preload 連結，但在 SSG 模式下這些文件不應該存在，導致 404 錯誤和警告。

### 2. ⭐ Nitro 輸出目錄配置錯誤（主要問題）

**這是導致所有 JS/CSS 404 的根本原因！**

錯誤配置：
```typescript
// ❌ 錯誤：自定義輸出目錄與 Cloudflare Pages preset 不兼容
nitro: {
  preset: 'cloudflare-pages',
  output: {
    dir: 'output',
    serverDir: 'output/server',
    publicDir: 'output/public',  // 靜態文件在這裡
  }
}
```

導致的問題：
1. Nitro 生成 `output/server/wrangler.json`，指定部署目錄為 `output`
2. 實際靜態資源在 `output/public/_nuxt/*.js`
3. Cloudflare Pages 從 `output` 根目錄查找 `/_nuxt/*.js`
4. **結果**: 路徑不匹配，所有 JS/CSS 文件返回 404！

Cloudflare 構建日誌證據：
```
[warn] [nitro] [cloudflare] Wrangler config `pages_build_output_dir` is overridden
pages_build_output_dir: output  ← Nitro 覆蓋為 output
```

但靜態文件實際在：
```
output/public/_nuxt/BQl29E_C.js  ← 實際位置
output/public/_nuxt/CtId8yZj.js
```

Cloudflare Pages 查找：
```
output/_nuxt/BQl29E_C.js  ← 找不到！404
output/_nuxt/CtId8yZj.js  ← 找不到！404
```

### 3. 字體模組網路錯誤
`@nuxtjs/google-fonts` 在構建時嘗試下載字體失敗（EHOSTUNREACH），已通過移除該模組解決。

---

## 解決方案

### 1. 使用 Nitro 預設輸出目錄

**最重要的修復**：使用 `.output` 作為構建目錄，讓 Nitro 的 Cloudflare Pages preset 正確處理目錄結構。

修改 [`nuxt.config.ts`](../../nuxt.config.ts#L122-L127)：

```typescript
// ✅ 正確配置
nitro: {
  preset: 'cloudflare-pages',
  // 使用預設的 .output 目錄
  output: {
    dir: '.output',
  },
}
```

這樣 Nitro 會生成正確的目錄結構：
```
.output/
├── public/           ← 靜態資源（Cloudflare Pages 部署這裡）
│   ├── _nuxt/       ← JS/CSS 文件
│   ├── index.html
│   └── ...
└── server/          ← Workers functions
    └── ...
```

### 2. 禁用 App Manifest

在 [`nuxt.config.ts`](../../nuxt.config.ts#L108-L113) 中設置：

```typescript
experimental: {
  componentIslands: true,
  payloadExtraction: true,
  appManifest: false,  // ⭐ 禁用 app manifest
}
```

### 3. 移除不需要的 Hooks

Nitro 已經自動為 Cloudflare Pages 生成 `_routes.json`，不需要手動生成：

```typescript
// Nuxt Hooks
hooks: {
  // Nitro 會自動為 Cloudflare Pages 生成 _routes.json
  // 不需要手動生成
},
```

### 4. 移除 @nuxtjs/google-fonts

已從 `package.json` 移除 `@nuxtjs/google-fonts`，改用 CDN 載入字體（在 `app.head.link` 中配置）。

### 5. 簡化 wrangler.toml

移除所有自定義配置，讓 Nitro 自動處理：

```toml
name = "hodes-nuxt"
compatibility_date = "2025-10-30"
# Nitro 會自動生成 wrangler.json 並覆蓋此設定
```

### 6. 更新 package.json 預覽腳本

```json
{
  "scripts": {
    "preview": "npx wrangler pages dev .output/public --compatibility-date=2025-10-30",
    "preview:wrangler": "npx wrangler pages dev .output/public --compatibility-date=2025-10-30 --ip 0.0.0.0 --port 8788"
  }
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

**重要**:
- ✅ 使用 `npm run generate` 進行 SSG 構建
- ❌ 不要使用 `npm run build`（這是 SSR 模式）

### 本地預覽
```bash
npm run preview
# 或
npm run preview:wrangler
```

---

## 驗證步驟

### 1. 檢查構建輸出

```powershell
# 確認使用 .output 目錄
Test-Path .output\public  # 應該返回 True

# 確認靜態文件存在
Get-ChildItem .output\public\_nuxt\*.js | Select-Object -First 5

# 確認 _routes.json 已生成
Test-Path .output\_routes.json  # 應該返回 True

# 確認 builds/meta 目錄不存在
Test-Path .output\public\_nuxt\builds  # 應該返回 False
```

### 2. 本地測試

```bash
npm run generate
npm run preview
```

訪問 http://localhost:8788 並檢查：
- ✅ 網站正常載入
- ✅ 瀏覽器控制台沒有 404 錯誤
- ✅ 沒有 "Failed to fetch dynamically imported module" 錯誤
- ✅ 沒有 builds/meta 相關警告
- ✅ 導航正常運作

### 3. Cloudflare Pages 部署

Cloudflare Pages 設定：
- **構建命令**: `npm run generate`
- **輸出目錄**: Nitro 會自動配置（不需要手動設定）

部署後檢查：
- ✅ 所有頁面正常載入
- ✅ JS/CSS 文件正常載入（沒有 404）
- ✅ 字體和圖片正常顯示

---

## 關鍵文件更改

### 修改的文件

1. **[nuxt.config.ts](../../nuxt.config.ts)**
   - 設定 `experimental.appManifest: false`
   - 簡化 `nitro.output` 為 `{ dir: '.output' }`
   - 移除手動生成 `_routes.json` 的 hook

2. **[wrangler.toml](../../wrangler.toml)**
   - 移除 `pages_build_output_dir` 配置
   - 讓 Nitro 自動處理

3. **[package.json](../../package.json)**
   - 更新 preview 腳本使用 `.output/public`
   - 移除 `@nuxtjs/google-fonts` 依賴

4. **可刪除的文件**
   - `server/plugins/routes.ts` - 不再需要

---

## 技術細節

### Nitro Cloudflare Pages Preset 工作原理

當使用 `preset: 'cloudflare-pages'` 時，Nitro 會：

1. **生成雙層輸出結構**：
   ```
   .output/
   ├── public/         ← Cloudflare Pages 靜態資源
   ├── server/         ← Workers Functions
   ├── _routes.json    ← 自動生成路由配置
   ├── _headers        ← 自動生成 HTTP headers
   └── _redirects      ← 自動生成重定向規則
   ```

2. **自動生成 wrangler.json**：
   - 位於 `.output/server/wrangler.json`
   - 覆蓋用戶的 `wrangler.toml` 設定
   - 正確配置 Cloudflare Pages 部署

3. **處理靜態資源和 Functions**：
   - 靜態文件放在 `public/`
   - API 路由編譯為 Workers Functions
   - 自動生成 `_routes.json` 來分離兩者

### 為什麼自定義 output 會失敗？

如果覆蓋預設的輸出目錄結構：
```typescript
output: {
  dir: 'output',
  serverDir: 'output/server',
  publicDir: 'output/public',  // ❌ 問題在這
}
```

會導致：
- 部署目錄：`output` （Nitro 自動設定）
- 靜態文件：`output/public/_nuxt/` （實際位置）
- 請求路徑：`/_nuxt/` （相對於部署根目錄 `output`）
- **結果**: `output/_nuxt/` 不存在 → 404

使用預設配置：
```typescript
output: {
  dir: '.output',  // ✅ 讓 Nitro 處理內部結構
}
```

Nitro 會正確配置：
- 部署目錄：`.output/public` （由 wrangler.json 設定）
- 靜態文件：`.output/public/_nuxt/` （實際位置）
- 請求路徑：`/_nuxt/` （相對於 `.output/public`）
- **結果**: `.output/public/_nuxt/` 存在 → 200 OK

---

## 故障排除

### 問題: 構建成功但部署後全是 404

**診斷**:
```bash
# 檢查 Nitro 生成的配置
cat .output/server/wrangler.json
cat .output/_routes.json
```

**解決**:
確認 `nitro.output.dir` 設為 `.output` 而不是自定義路徑。

### 問題: 本地預覽正常，部署後 404

**原因**: 本地 `serve` 工具可能會自動處理路徑，但 Cloudflare Pages 嚴格遵循配置。

**解決**: 使用 Wrangler 本地測試：
```bash
npm run preview:wrangler
```

這會模擬真實的 Cloudflare Pages 環境。

### 問題: TypeScript 類型錯誤

```bash
# 清理並重新生成
rm -rf .nuxt node_modules/.cache
npm run postinstall
```

---

## 總結

### 關鍵修復

1. ⭐ **使用 `.output` 目錄** - 不要自定義 Nitro 輸出結構
2. ⭐ **禁用 app manifest** - 設定 `experimental.appManifest: false`
3. **移除手動生成 `_routes.json`** - Nitro 自動處理
4. **移除 @nuxtjs/google-fonts** - 使用 CDN 替代

### 核心原則

使用 Nuxt/Nitro 的 Cloudflare Pages preset 時：
- ✅ 信任 Nitro 的預設行為
- ✅ 使用標準的 `.output` 目錄
- ❌ 不要覆蓋內部目錄結構
- ❌ 不要手動生成 Cloudflare 配置文件

---

## 相關資源

- [Nitro Cloudflare Pages Deployment](https://nitro.unjs.io/deploy/providers/cloudflare)
- [Cloudflare Pages Functions Routing](https://developers.cloudflare.com/pages/platform/functions/routing/)
- [Nuxt 4 Migration Guide](https://nuxt.com/docs/getting-started/upgrade)

---

最後更新: 2025-11-01
