分析目前的 git 變更，產生符合本專案規範的 conventional commit，然後執行 commit。

## 步驟

1. 執行 `git status` 確認有哪些變更的檔案
2. 執行 `git diff --staged` 確認已 staged 的內容；若沒有 staged 內容，執行 `git diff HEAD` 查看全部變更
3. 若沒有 staged 檔案，根據變更內容選擇適合的檔案執行 `git add`（不要盲目 `git add .`）
4. 根據變更內容選擇 commit type：
   - `feat:` — 新功能、新頁面、新 API endpoint
   - `fix:` — bug 修復
   - `refactor:` — 重構，不改變行為
   - `style:` — UI/CSS 調整，不影響邏輯
   - `perf:` — 效能優化（bundle size、圖片載入、預渲染）
   - `docs:` — 文件更新（docs/、CLAUDE.md）
   - `chore:` — 設定、套件安裝/移除、環境設定
   - `test:` — 測試新增或修改
   - `i18n:` — 翻譯檔新增或修改（i18n/locales/）
   - `content:` — 部落格文章新增或修改（content/）
5. commit message 格式：`<type>(<scope>): <一行說明（中文或英文皆可）>`
   - scope 可選，填受影響的功能區域，例如 `blog`、`portfolio`、`contact`、`seo`、`i18n`、`email`
   - 第一行 < 72 字元
   - 說明要具體，例如 `feat(blog): 新增分頁支援`，而非模糊的 `update blog`
6. 若變更跨越多個不同關注點（例如同時有 UI 調整和翻譯修改），考慮分成多個 commit
7. 執行 `git commit -m "<message>"`

## 本專案的特殊規範

完成功能後，確認是否需要一併更新並 commit：

| 完成的工作 | 應檢查的文件 |
|-----------|------------|
| 任何功能完成或修復 | `CHANGELOG.md`（在「未發布」區塊新增一行） |
| 新增 API 路由 | `docs/SERVER_API.md` |
| 修改 Email / reCAPTCHA 流程 | `docs/SETUP_EMAIL.md` |
| 修改 SEO 相關設定 | `docs/SEO_SETUP.md` |
| 新增/修改 i18n key | `i18n/locales/zh-TW.json` 和 `i18n/locales/en.json` 必須同步更新 |
| 新增頁面或修改路由 | `nuxt.config.ts` 的 `prerenderRoutes` 也需要新增對應的雙語系路由 |
| 新增部落格文章 | `content/zh-TW/articles/` 和 `content/en/articles/` 最好都有對應檔案 |
| 修改 Cloudflare 部署設定 | `docs/DEPLOYMENT_CHECKLIST.md` |

若發現這些文件尚未更新，請先提醒使用者。
