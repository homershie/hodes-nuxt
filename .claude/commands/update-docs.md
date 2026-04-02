根據最近的變更，更新 docs/ 下的對應文件。

## 使用方式

直接執行 `/update-docs`，Claude 會自動判斷哪些文件需要更新。

也可以帶參數指定範圍：
- `/update-docs email` — 只更新 SETUP_EMAIL.md
- `/update-docs seo` — 只更新 SEO_SETUP.md
- `/update-docs api` — 只更新 SERVER_API.md
- `/update-docs i18n` — 只更新 I18N_IMPLEMENTATION_PLAN.md
- `/update-docs deploy` — 只更新 DEPLOYMENT_CHECKLIST.md
- `/update-docs all` — 強制檢查所有文件

---

## 執行步驟

1. 執行 `git diff HEAD --name-only` 取得最近變更的檔案清單
2. 執行 `git log --oneline -10` 了解最近的 commit 內容
3. 根據下方觸發規則判斷需要更新哪些文件
4. 讀取需要更新的文件，確認目前內容後進行更新
5. 顯示所有更新的摘要

---

## 文件觸發規則

| 變更類型 | 需更新的文件 |
|---------|------------|
| 任何 feat、fix、perf、refactor 類型的 commit | `CHANGELOG.md` |
| 修改 `server/api/send-email.post.ts` 或 reCAPTCHA 相關 | `docs/SETUP_EMAIL.md` |
| 修改 `server/api/` 下的路由 | `docs/SERVER_API.md` |
| 修改 SEO 設定（nuxt.config.ts site、sitemap、robots） | `docs/SEO_SETUP.md` |
| 修改 `i18n/locales/` 或 i18n 相關邏輯 | `docs/I18N_IMPLEMENTATION_PLAN.md` |
| 修改 `nuxt.config.ts` 的 routeRules 或 prerenderRoutes | `docs/DEPLOYMENT_CHECKLIST.md` |
| 修改 `server/api/__sitemap__/urls.ts` | `docs/SEO_SETUP.md` |

---

## 各文件說明與格式

### docs/SETUP_EMAIL.md

說明 Email 聯絡表單完整設定，包含 reCAPTCHA v3、Resend API、環境變數配置。

**何時更新：** 修改 `server/api/send-email.post.ts`、`server/utils/recaptcha.ts`、`server/utils/rate-limit.ts` 時。

---

### docs/SERVER_API.md

說明所有 Server API endpoint 的用途、參數、回應格式。

**何時更新：** 新增或修改 `server/api/` 下的任何路由時。

**格式：**

```markdown
# Server API 技術文件

## POST /api/send-email

- 說明：...
- 參數：...
- 回應：...

## GET /api/proxy-image

...
```

---

### docs/SEO_SETUP.md

說明 @nuxtjs/seo 配置、Sitemap 生成、Open Graph、hreflang 設定。

**何時更新：** 修改 SEO 相關設定或 sitemap 邏輯時。

---

### docs/I18N_IMPLEMENTATION_PLAN.md

i18n 完整實作計畫與進度紀錄，包含架構決策、已知問題。

**何時更新：** 新增翻譯命名空間、修改語系策略、發現並解決 i18n bug 時。

---

### docs/DEPLOYMENT_CHECKLIST.md

Cloudflare Pages 部署前的檢查清單。

**何時更新：** 新增頁面（需更新 prerenderRoutes）、修改部署設定時。

---

## 注意事項

- `i18n/locales/zh-TW.json` 和 `i18n/locales/en.json` 需同步更新，缺少任何 key 會導致 build 錯誤
- 新增頁面時，`nuxt.config.ts` 的 `prerenderRoutes` 需同時包含 `/zh-TW/{path}` 和 `/en/{path}`
- 不要修改 node_modules 裡的任何文件
- `docs/README.md` 是文件總索引，新增文件時記得更新索引
