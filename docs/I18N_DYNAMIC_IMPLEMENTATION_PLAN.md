# I18N 動態資料國際化實作計畫

> **檔案記錄：** 此計畫存檔於 [docs/I18N_DYNAMIC_IMPLEMENTATION_PLAN.md](docs/I18N_DYNAMIC_IMPLEMENTATION_PLAN.md)

本計畫承接 [docs/I18N_IMPLEMENTATION_PLAN.md](docs/I18N_IMPLEMENTATION_PLAN.md) 的靜態 UI i18n 已完成，擴展至動態資料的國際化。

---

## 一、整體架構

```mermaid
flowchart TB
    subgraph Portfolio [portfolioData.js]
        Raw[Raw Data: title/desc/category 中文]
        i18n[zh-TW.json / en.json]
        usePortfolio[usePortfolio Composable]
        Raw --> usePortfolio
        i18n --> usePortfolio
        usePortfolio --> |"t() by locale"| Display[PortfolioList / project/[id] 等]
    end

    subgraph Articles [content/articles]
        zhTW[content/zh-TW/articles/*.md]
        en[content/en/articles/*.md]
        query[queryCollection 依 locale]
        zhTW --> query
        en --> query
        query --> ArticlePages[article/[id] / blog/page/[page]]
    end
```

---

## 二、Part A：portfolioData.js（i18n key + 翻譯檔）

### 2.1 資料結構策略

- **portfolioData.js** 維持原樣，僅作識別用：保留 `id`、`title`（中文）、`description`（中文）、`category`（中文陣列）、`client`（中文或 null）等。
- **翻譯檔** 新增 `portfolioData` 命名空間，用 `id` 作為 key 對應各作品 title、description；`categories` 子物件對應 category 中文 → 英文。

### 2.2 翻譯檔結構

**zh-TW.json** 新增 `portfolioData.works`（92 筆）、`portfolioData.categories`。
**en.json** 新增對應英文翻譯。

### 2.3 修改檔案清單

| 檔案 | 變更 |
|------|------|
| i18n/locales/zh-TW.json | 新增 `portfolioData.works`、`portfolioData.categories` |
| i18n/locales/en.json | 同上，英文版本 |
| composables/usePortfolio.js | 注入 `useI18n()`，`translateWork()` 翻譯 title/description/client |
| app/pages/portfolio/index.vue | `getCategoryName()` 用 `t('portfolioData.categories.xxx')` |
| app/components/PortfolioList.vue | `getCategoryLabel()` 翻譯 category 顯示 |
| app/components/RelatedWorks.vue | 同上 |

### 2.4 篩選邏輯

- category 篩選仍用中文 key（URL query 保持 `category=插畫`）
- 顯示時用 `t('portfolioData.categories.插畫')` 取得翻譯

---

## 三、Part B：content/articles（雙語 content 目錄）

### 3.1 目錄結構變更

**目標：**

```
content/
  zh-TW/
    articles/
      art-nouveau.md
      ...
  en/
    articles/
      art-nouveau.md
      ...
  config/
    categories.json
```

### 3.2 查詢邏輯

- 方案 B：單一 collection，query 時依 `locale` 過濾 `path` 含 `/{locale}/articles/`
- 修改 article/[id].vue、blog/page/[page].vue 的 path 解析
- 修改 nuxt.config.ts 的 getArticleSlugs

---

## 四、Part C：content/config/categories.json 類別翻譯

- 每個 category 新增 `nameEn`、`descriptionEn` 欄位
- 新增 `Relationships`（關係探討）類別
- BlogSidebar 使用 `getCategoryName()` 依 locale 顯示對應名稱

---

## 五、實作進度

| Part | 狀態 | 說明 |
|------|------|------|
| Part A：portfolioData | ✅ 已完成 | zh-TW.json / en.json 新增 portfolioData；usePortfolio 翻譯；PortfolioList、RelatedWorks、portfolio/index 顯示翻譯 |
| Part B：content/articles | ✅ 已完成 | 建立 zh-TW/articles、en/articles；9 篇雙語文章；article/blog 頁依 locale 過濾；getArticleSlugs 掃描雙目錄；文章 frontmatter 含 lang |
| Part C：categories.json | ✅ 已完成 | 新增 nameEn、descriptionEn、Relationships；BlogSidebar 依 locale 顯示 |
| Part B 延伸：設計風格文章翻譯 | ✅ 已完成 | 6 篇設計風格文章完成 zh-TW → en 全文翻譯（見下方清單） |

### Part B 延伸：已翻譯文章清單

| 文章 | zh-TW | en | 備註 |
|------|-------|-----|------|
| 現代設計入門 | modern-design-intro.md | modern-design-intro.md | 修正筆誤：鼓催→鼓吹、過逞→過程；譯文優化：卑鄙元之助→The Pragmatic Chameleon |
| 新藝術 | art-nouveau.md | art-nouveau.md | 修正筆誤：不訪→不妨、Jaeger Reservo→Reverso、18世紀→19世紀；品牌／平台譯名確認 |
| MBE 風格 | mbe.md | mbe.md | 修正筆誤：攤軟→癱軟、Dribble→Dribbble、8點→9點 |
| 像素藝術 | pixel-art.md | pixel-art.md | 修正筆誤：風及一時→風靡一時、熱忠→熱衷、EBoy→eBoy、Paper, please→Papers, Please、Vin Gogh→Vincent van Gogh |
| 普普藝術 | pop-art.md | pop-art.md | 譯文優化：逍遙客小老虎保留中文、網點→halftone dots |
| 蒸汽波 | vaporwave.md | vaporwave.md | 修正筆誤：取材字→取材自、風刺→諷刺；譯文優化：鏘鏘→tipsy、千元大餐→NT$1,000 meal |

### 其他修正

- **article/[id].vue**：`sortedArticles` 內補上 `const loc = currentLocale.value`，修復 `loc is not defined`
- **article/[id].vue**：`useHead` 改為 computed 條件式，避免 article 為 null 時存取屬性報錯
