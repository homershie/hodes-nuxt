# HODES | The website of Homer Shie (Nuxt.js Version)

使用 Nuxt.js 建置的現代化個人網站，主要展示設計、動畫和開發專案，有時候會在部落格新增內容。

## 🚀 特色功能

- **現代化技術架構**: Nuxt 3 + Vue 3 + TypeScript
- **響應式設計**: 支援各種裝置和螢幕尺寸
- **作品展示**: 互動式作品集與燈箱效果
- **部落格系統**: 文章展示和分類功能
- **聯絡表單**: 整合後端 API 的聯絡功能
- **動畫效果**: GSAP 動畫增強使用者體驗
- **SEO 優化**: 良好的搜尋引擎優化
- **內容管理**: Nuxt Content 模組支援

## 🛠 技術棧

- **框架**: Nuxt 3
- **前端**: Vue 3 + TypeScript
- **樣式**: SCSS + Nuxt UI
- **圖片優化**: Nuxt Image
- **內容管理**: Nuxt Content
- **程式碼品質**: ESLint
- **分析工具**: Google Analytics (gtag)

## 📋 系統需求

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🔧 專案設定

### 安裝依賴

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### 開發環境運行

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

開發伺服器將在 `http://localhost:3000` 啟動

### 生產環境建置

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

### 預覽建置結果

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

### 靜態網站生成

```bash
# npm
npm run generate

# pnpm
pnpm generate

# yarn
yarn generate

# bun
bun run generate
```

## 📁 專案結構

```
app/
├── assets/          # 靜態資源
│   ├── scss/        # SCSS 樣式檔案
│   └── scripts.js   # 公用腳本
├── components/      # Vue 元件
├── layouts/         # 佈局檔案
│   └── default.vue  # 預設佈局
├── pages/           # 頁面元件
│   ├── index.vue    # 首頁
│   ├── about.vue    # 關於頁面
│   ├── portfolio.vue # 作品集
│   ├── blog.vue     # 部落格
│   ├── contact.vue  # 聯絡頁面
│   └── ...
└── app.vue          # 根元件

composables/         # Vue 組合式函數
├── useCustomCursor.js
├── useFormValidation.js
├── useHoverAnimation.js
├── useImageCache.js
├── useImageFormat.js
├── useImagePreloader.js
├── useLightBox.js
├── usePageTitle.js
├── usePortfolio.js
└── useTextFade.js

data/               # 資料檔案
├── articleData.js
└── portfolioData.js

public/             # 公開靜態檔案
├── images/         # 圖片資源
├── resume/         # 履歷檔案
├── _headers        # 部署標頭
├── _redirects      # 重導向規則
└── robots.txt      # 搜尋引擎規則
```

## 🔄 待辦事項

### 高優先級

- [ ] **設定 default layout**: 建立完整的預設佈局檔案，包含導航列、頁尾等共用元件
- [ ] **更新各個頁面符合 Nuxt.js 格式**: 將現有頁面從 Vue Router 格式轉換為 Nuxt.js 的檔案路由格式
- [ ] **引入後端 API**: 整合 `portfolio_backend/index.js` 的聯絡表單功能到 Nuxt.js 專案中

### 中優先級

- [ ] **SEO 優化**: 完善各頁面的 meta 標籤和結構化資料
- [ ] **效能優化**: 實作圖片延遲載入和程式碼分割
- [ ] **PWA 支援**: 加入離線使用和安裝功能
- [ ] **測試覆蓋**: 建立單元測試和整合測試

### 低優先級

- [ ] **多語言支援**: 實作國際化功能
- [ ] **深色模式**: 加入主題切換功能
- [ ] **動畫優化**: 使用 Nuxt 3 的動畫 API 重構現有動畫

## 📝 開發規範

- 使用 2 空格縮排
- 使用單引號
- 不使用分號
- 使用尾隨逗號
- Vue 元件採用組合式 API
- SCSS 採用 BEM 命名規範
- 圖片使用 WebP 格式
- 元件名稱使用 PascalCase
- 檔案名稱使用 kebab-case

## 🌐 瀏覽器支援

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88
- iOS >= 14
- Android >= 87

## 🔒 安全性

- 環境變數保護
- API 請求頻率限制
- CSP 安全標頭
- 依賴項安全掃描

## 📄 授權

Private - 個人作品集專案

## 📞 聯絡資訊

如有任何問題或建議，請透過以下方式聯絡：

- 網站聯絡表單
- GitHub Issues
- Email: [homerxworkshop@gmail.com]

## 📚 相關資源

- [Nuxt 3 官方文件](https://nuxt.com/docs/getting-started/introduction)
- [Vue 3 官方文件](https://vuejs.org/guide/)
- [Nuxt UI 文件](https://ui.nuxt.com/)
- [Nuxt Content 文件](https://content.nuxt.com/)
