# 📚 HODES Nuxt 專案文件

這裡包含了 HODES Nuxt 專案的所有技術文件和設定指南。

## 📖 文件索引

### 📋 專案總覽

- **[../CLAUDE.md](../CLAUDE.md)** - AI 快速認識專案的總覽文件
  - 技術棧、專案結構、i18n 架構
  - 部署流程、常用指令、關鍵設計決策

- **[../CHANGELOG.md](../CHANGELOG.md)** - 版本變更紀錄
  - 功能新增、修復、重構的歷史紀錄
  - 按日期倒序排列

### 🚀 設定指南

- **[SETUP_EMAIL.md](./SETUP_EMAIL.md)** - Email 聯絡表單完整設定指南
  - Google reCAPTCHA v3 設定
  - Resend Email API 設定
  - 環境變數配置
  - 部署說明
  - 常見問題解答

- **[SEO_SETUP.md](./SEO_SETUP.md)** - SEO 優化設定指南
  - @nuxtjs/seo 套件配置
  - Robots.txt 設定
  - Sitemap.xml 自動生成
  - Open Graph 和 Schema.org 設定
  - SEO 最佳實踐

### 🔧 技術文件

- **[SERVER_API.md](./SERVER_API.md)** - Server API 技術文件
  - API 端點說明
  - Rate limiting 機制
  - reCAPTCHA 驗證流程
  - 檔案結構說明

## 🗂️ 文件結構

```
/（根目錄）
├── CLAUDE.md                      # AI 專案總覽（技術棧、架構、規範）
├── CHANGELOG.md                   # 版本變更紀錄
docs/
├── README.md                      # 本檔案 - 文件索引
├── SETUP_EMAIL.md                 # Email 功能設定指南
├── SEO_SETUP.md                   # SEO 優化設定指南
├── SERVER_API.md                  # Server API 技術文件
├── I18N_IMPLEMENTATION_PLAN.md    # i18n 完整實作計畫與紀錄
└── DEPLOYMENT_CHECKLIST.md        # Cloudflare Pages 部署清單
```

## 🔗 快速連結

### 外部資源

- [Nuxt 3 官方文件](https://nuxt.com/docs)
- [Resend 文件](https://resend.com/docs)
- [Google reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3)
- [vee-validate 文件](https://vee-validate.logaretm.com/v4/)
- [Nuxt SEO 官方文件](https://nuxtseo.com/)

### 相關文件

- [專案主要 README](../README.md)
- [開發指南](../DEVELOPMENT.md) (如果存在)

## 💡 如何使用這些文件

### 新手開發者

1. 先閱讀 [SETUP_EMAIL.md](./SETUP_EMAIL.md) 了解如何設定 Email 功能
2. 閱讀 [SEO_SETUP.md](./SEO_SETUP.md) 了解 SEO 優化配置
3. 參考 [SERVER_API.md](./SERVER_API.md) 了解 API 的技術細節

### 維護者

- 當新增功能時，請在這裡新增對應的文件
- 保持文件與程式碼同步更新
- 使用清晰的標題和範例

## 📝 貢獻文件

如果你想新增或修改文件，請遵循以下格式：

1. **標題清晰** - 使用有意義的標題和 emoji
2. **範例豐富** - 提供實際的程式碼範例
3. **步驟明確** - 使用編號列表說明步驟
4. **更新索引** - 在本檔案中新增連結

## 📞 需要協助？

如果文件中有任何不清楚的地方，或你需要更多說明：

- 📧 Email: homerxworkshop@gmail.com
- 🐛 提交 Issue (如果有 GitHub repository)

---

**最後更新**: 2026-04-02
