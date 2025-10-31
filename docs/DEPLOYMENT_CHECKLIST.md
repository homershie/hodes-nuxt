# 部署檢查清單 (Deployment Checklist)

## 測試覆蓋率狀態 ✅

- **測試文件**: 31 個 (全部通過)
- **測試案例**: 260 個通過, 4 個跳過
- **覆蓋率**:
  - 總體語句覆蓋率: 32.96%
  - 分支覆蓋率: 84.38% ✅
  - 函數覆蓋率: 80.53% ✅
  - Server API: 95.65% ✅
  - Composables: 87.44% ✅

### 新增的關鍵測試
- ✅ 文章頁面測試 (24 tests) - `tests/pages/article-page.test.ts`
- ✅ 首頁測試 (23 tests) - `tests/pages/index-page.test.ts`
- ✅ 聯絡表單測試 (37 tests) - `tests/pages/contact-page.test.ts`

---

## 環境變數配置檢查

### 必要的環境變數

#### 1. reCAPTCHA v3 設定 🔑

```bash
# 前端 Site Key
NUXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here

# 後端 Secret Key (敏感資訊，不可暴露)
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

**獲取方式**:
- 訪問 https://www.google.com/recaptcha/admin
- 註冊 reCAPTCHA v3
- 複製 Site Key 和 Secret Key

**測試狀態**: ✅ 已有完整測試覆蓋 (`tests/unit/server/recaptcha.test.ts`)

---

#### 2. Resend Email API 設定 📧

```bash
# Resend API Key
RESEND_API_KEY=your_resend_api_key_here

# 收件人 Email
TO_EMAIL=your_email@example.com
```

**獲取方式**:
- 訪問 https://resend.com
- 註冊並建立 API Key
- 驗證寄件域名

**測試狀態**: ✅ 已有測試覆蓋 (`tests/unit/server/send-email.test.ts`)

---

#### 3. 驗證 .env 文件

```bash
# 檢查 .env 文件是否存在
ls -la .env

# 確認所有必要變數都已設定
cat .env
```

**注意事項**:
- ⚠️ `.env` 文件已加入 `.gitignore`，不會被提交到 Git
- ✅ `.env.example` 提供了範本
- 🔒 絕不要將敏感資訊提交到版本控制

---

## R2 Bucket (Cloudflare) 設定

### 當前使用的 R2 域名
```
https://r2bucket.homershie.com/
```

### 需要檢查的項目

#### 1. CORS 設定 ✅
確保 R2 bucket 允許來自你的網站的請求：

```json
[
  {
    "AllowedOrigins": [
      "https://homershie.com",
      "https://www.homershie.com",
      "http://localhost:3000"
    ],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

#### 2. Proxy Image API ✅
- 文件位置: `server/api/proxy-image.get.ts`
- 功能: 代理 R2 圖片請求，避免 CORS 問題
- 允許的域名: `r2bucket.homershie.com`
- 測試狀態: ✅ 完整測試覆蓋 (5 tests)

#### 3. 圖片格式
- ✅ 已優化為 WebP 格式
- ✅ 首頁預載入前 6 張作品圖片
- ✅ 使用 `OptimizedImage` 組件自動處理格式

---

## SEO 配置檢查

### Site Config (`nuxt.config.ts`)

```typescript
site: {
  url: 'https://homershie.com',
  name: 'HODES | 荷馬桑 Homer Shie 的個人網站',
  description: 'HODES 是荷馬桑 Homer Shie 的個人網站，來自台灣的自由接案工作者...',
  defaultLocale: 'zh-Hant-TW',
}
```

### 需要檢查的項目

#### 1. Meta Tags ✅
- ✅ 全域 SEO meta 已配置
- ✅ 首頁有自訂標題
- ✅ 文章頁面動態生成 meta

#### 2. Sitemap
- 📦 已安裝 `@nuxtjs/seo` 模組
- ⚠️ 需要確認 sitemap 是否正確生成

```bash
# 建置後檢查 sitemap
npm run generate
cat .output/public/sitemap.xml
```

#### 3. Open Graph / Twitter Cards
檢查是否有正確的社交媒體預覽：
- OG Image
- OG Description
- Twitter Card Type

---

## 效能優化檢查

### 1. 靜態生成路由 (SSG)

```typescript
nitro: {
  prerender: {
    crawlLinks: true,
    routes: ['/', '/about', '/service', '/contact', '/portfolio'],
  },
}
```

### 2. 快取策略

```typescript
routeRules: {
  '/': { prerender: true },
  '/article/**': { prerender: true, swr: 86400 }, // 24小時
  '/project/**': { prerender: true, swr: 86400 },
}
```

### 3. 圖片優化
- ✅ WebP 格式
- ✅ 圖片預載入 (`useImagePreloader`)
- ✅ 圖片快取 (`useImageCache`)
- ✅ Lazy Loading

---

## 安全性檢查

### 1. Rate Limiting ✅
- 文件: `server/utils/rate-limit.ts`
- 功能: 防止聯絡表單被濫用
- 限制: 同一 IP 每小時最多 5 次請求
- 測試狀態: ✅ 完整測試 (12 tests)

### 2. 垃圾訊息防護 ✅
- reCAPTCHA v3 驗證
- 蜜罐欄位 (Honeypot)
- 表單提交時間檢測
- 垃圾關鍵字檢測
- 測試狀態: ✅ 完整測試 (`useFormValidation.test.ts`)

### 3. 敏感資訊保護
- ⚠️ 確認 `.env` 不在版本控制中
- ✅ Secret keys 只在 server-side 使用
- ✅ API keys 使用環境變數

---

## 建置與部署

### 1. 執行完整測試

```bash
npm run test:coverage
```

**預期結果**: 260+ tests 全部通過

### 2. 建置生產版本

```bash
# 生成靜態網站
npm run generate

# 或建置 SSR 版本
npm run build
```

### 3. 本地預覽

```bash
npm run preview
```

### 4. 檢查建置輸出

```bash
# 檢查靜態文件
ls -la .output/public

# 檢查預渲染路由
find .output/public -name "index.html"

# 檢查 bundle 大小
du -sh .output/public/_nuxt/*
```

---

## 上線後檢查

### 1. 功能測試
- [ ] 首頁正常載入
- [ ] 導航連結正常工作
- [ ] 文章頁面可以開啟
- [ ] 作品集頁面正常顯示
- [ ] 聯絡表單可以提交
- [ ] 收到測試 email

### 2. 效能測試
- [ ] Google PageSpeed Insights 檢測
- [ ] Lighthouse 測試 (Performance, SEO, Accessibility)
- [ ] 圖片載入速度
- [ ] 首次內容繪製 (FCP)
- [ ] 最大內容繪製 (LCP)

### 3. SEO 檢查
- [ ] Google Search Console 驗證
- [ ] Sitemap 提交
- [ ] robots.txt 檢查
- [ ] 結構化數據驗證

### 4. 安全性檢查
- [ ] HTTPS 正常運作
- [ ] 安全標頭 (Security Headers)
- [ ] reCAPTCHA 正常工作
- [ ] Rate limiting 生效

---

## 監控與維護

### 建議設置

1. **錯誤監控**
   - Sentry.io (錯誤追蹤)
   - Cloudflare Analytics

2. **效能監控**
   - Google Analytics
   - Cloudflare Web Analytics

3. **Uptime 監控**
   - UptimeRobot
   - Pingdom

---

## 環境變數快速檢查腳本

建立 `scripts/check-env.js`:

```javascript
const requiredEnvVars = [
  'NUXT_PUBLIC_RECAPTCHA_SITE_KEY',
  'RECAPTCHA_SECRET_KEY',
  'RESEND_API_KEY',
  'TO_EMAIL',
]

console.log('🔍 檢查環境變數...\n')

let allSet = true
requiredEnvVars.forEach(varName => {
  const value = process.env[varName]
  if (!value || value === 'your_*_here') {
    console.log(`❌ ${varName}: 未設定或使用預設值`)
    allSet = false
  } else {
    console.log(`✅ ${varName}: 已設定`)
  }
})

if (allSet) {
  console.log('\n✅ 所有環境變數已正確設定！')
  process.exit(0)
} else {
  console.log('\n⚠️  請設定缺少的環境變數')
  process.exit(1)
}
```

執行:
```bash
node scripts/check-env.js
```

---

## 總結

### ✅ 已完成
- 核心測試覆蓋 (260 tests)
- 關鍵頁面測試 (首頁、文章、聯絡)
- API 測試 (send-email, proxy-image, recaptcha)
- 安全機制測試 (rate limiting, spam detection)
- 配置文件範本 (.env.example)

### ⚠️ 需要配置
1. 設定 reCAPTCHA keys
2. 設定 Resend API key
3. 設定收件人 email
4. 驗證 R2 CORS 設定
5. 檢查 sitemap 生成

### 🚀 準備部署
一旦完成以上配置檢查，即可部署到生產環境！

建議部署平台:
- **Cloudflare Pages** (推薦，與 R2 整合良好)
- Vercel
- Netlify
