# i18n 導入錯誤紀錄 (I18N Implementation Bugs)

> 本文件整理 i18n 國際化導入過程中實際發生之錯誤、成因與解決方式，供後續維護參考。
> 來源：Agent 對話紀錄 (27a2b0e4, 1eff7932, 37428c65, 1e1ef433)

---

## 總覽

| 錯誤類型 | 影響頁面／元件 | 錯誤訊息 | 狀態 |
|----------|----------------|----------|------|
| tm() 回傳 message 物件 | index.vue, service.vue, about.vue | 畫面上顯示 JSON 物件 | ✅ 已解決 |
| NuxtIcon 收到物件 | about.vue | `name.startsWith is not a function` | ✅ 已解決 |
| useI18nList 未定義 | index.vue, service.vue | `useI18nList is not defined` | ✅ 已解決 |
| localePath 非函式 | index.vue | `$setup.localePath is not a function` | ⚠️ 需確認 |
| 對 computed 做 unshift | about.vue | 唯讀資料被修改 | ✅ 已解決 |

---

## 1. Vue I18n `tm()` 回傳編譯後 message 物件

### 現象

- 首頁 headline 輪播、服務頁方案條列、關於頁核心能力／學歷／工作經驗等，畫面上顯示整顆 JSON 物件，例如：

```json
{
  "type": 0,
  "start": 0,
  "end": 5,
  "loc": { "start": {...}, "end": {...}, "source": "健身愛好者" },
  "body": { "type": 2, "items": [...], "static": "健身愛好者" }
}
```

### 成因

Vue I18n 的 **`tm()`** 在取得陣列或巢狀物件時，回傳的是**編譯後的 message 結構**（含 `type`、`loc`、`body`、`static` 等），並非純字串或字串陣列。模板直接 `{{ word }}`、`v-for="feature in tm('...')"` 時，會印出整顆物件。

### 受影響位置

| 頁面 | 鍵值 | 用途 |
|------|------|------|
| `index.vue` | `home.headline_words` | 輪播文字（全端設計師、前端開發者、健身愛好者等） |
| `service.vue` | `service.plans.graphic.features` | 平面設計方案條列 |
| `service.vue` | `service.plans.motion.features` | 動態設計方案條列 |
| `about.vue` | `about.capabilities` | 核心能力（title, summary, items, icon） |
| `about.vue` | `about.experiences` | 學歷／工作經驗（period, title, company, description） |

### 解法

建立 `composables/useI18nList.js`，提供：

- **`resolveMessageList(value)`**：把 `tm()` 回傳的陣列轉成字串陣列，元素若是物件則從 `body.static` 或 `loc.source` 取出文字。
- **`resolveNestedMessages(val)`**：遞迴處理巢狀結構，將巢狀陣列／物件內所有 message 物件轉成純字串，供 capabilities、experiences 使用。

使用方式：

- 首頁：`headlineWords = computed(() => resolveMessageList(tm('home.headline_words')))`
- 服務頁：`graphicPlanFeatures`、`motionPlanFeatures` 使用 `resolveMessageList(tm('...'))`
- 關於頁：`capabilities`、`experiences` 使用 `resolveNestedMessages(tm('about.capabilities'))`、`resolveNestedMessages(tm('about.experiences'))`

---

## 2. NuxtIcon `name` prop 收到物件

### 現象

- 關於頁 500 錯誤
- 終端錯誤：`name.startsWith is not a function`

### 成因

`tm('about.capabilities')` 回傳的物件中，`cap.icon` 也是編譯後的 message 物件，而非字串。NuxtIcon 對 `name` 呼叫 `name.startsWith()`，遇到物件會拋錯。

### 受影響位置

- `about.vue`：`<Icon :name="cap.icon" />`

### 解法

新增輔助函式 **`getCapabilityIconName(cap)`**：

- 若 `cap.icon` 已是字串，直接回傳。
- 若為 message 物件，從 `icon.body?.static` 或 `icon.loc?.source` 取出字串。
- 其他情況回傳預設 `'mdi:help-circle'`，確保傳給 `<Icon>` 的永遠是字串。

模板改為：`<Icon :name="getCapabilityIconName(cap)" />`。

---

## 3. `useI18nList is not defined`

### 現象

- 500 錯誤
- 終端錯誤：`useI18nList is not defined`

### 成因

1. **Nuxt composable 命名**：`useI18nList.js` 若只 export `resolveMessageList`，Nuxt 自動匯入會尋找與檔名對應的 `useI18nList` 函式，找不到就會在執行時報錯。
2. **專案慣例**：本專案 composables 採 **顯式匯入**（`@composables/...`），未依賴 Nuxt 自動匯入。若頁面直接呼叫 `useI18nList()` 卻未 import，就會 `useI18nList is not defined`。

### 解法

1. 在 `useI18nList.js` 中匯出與檔名相符的函式：

   ```js
   export function useI18nList() {
     return { resolveMessageList, resolveNestedMessages, resolveMessageValue }
   }
   ```

2. 在使用頁面中加入明確匯入：

   ```js
   import { useI18nList } from '@composables/useI18nList.js'
   const { resolveMessageList } = useI18nList()
   ```

---

## 4. `localePath is not a function`

### 現象

- 500 錯誤
- 終端錯誤：`$setup.localePath is not a function`（發生於 `index.vue:158`）

### 成因

`localePath` 來自 `@nuxtjs/i18n`，通常透過 `useLocalePath()` 取得。若模板或 setup 中使用了 `localePath` 卻未正確取得，可能原因包括：

- 未呼叫 `useLocalePath()` 或未從 `useNuxtI18n()` 解構取得。
- setup 執行順序或 composable 初始化有誤，導致 `localePath` 尚未注入。

### 解法建議

- 在需要語言前綴路徑的元件中明確使用：

  ```js
  const localePath = useLocalePath()
  ```

- 確認 `@nuxtjs/i18n` 已在 `nuxt.config.ts` 中正確設定。
- 若與其他錯誤（如 `useI18nList is not defined`）同時發生，先修復 composable 匯入，再檢查 `localePath` 是否已正確注入。

---

## 5. 對 computed 做 `unshift` 導致錯誤

### 現象

`about.vue` 中 `addExperience` 對 `experiences` 做 `unshift`，但 `experiences` 已改為由 `resolveNestedMessages(tm('about.experiences'))` 產生的 **computed**，為唯讀，無法直接修改。

### 成因

i18n 導入後，`experiences` 改為從 locale 唯讀計算，不再是可以 push/unshift 的 ref 陣列。

### 解法

移除或重構 `addExperience`。若未來需動態新增經驗，應改為：

- 使用獨立的 `ref` 存放動態項目，再與 i18n 的 experiences 合併顯示；或
- 將「可變動內容」放在別處（例如後端／CMS），而非對 i18n 唯讀資料做寫入。

---

## 相關檔案

| 檔案 | 說明 |
|------|------|
| `composables/useI18nList.js` | 提供 `resolveMessageList`、`resolveNestedMessages`、`resolveMessageValue` |
| `app/pages/index.vue` | 使用 `resolveMessageList` 處理 headline，需 `useLocalePath` |
| `app/pages/service.vue` | 使用 `resolveMessageList` 處理方案條列 |
| `app/pages/about.vue` | 使用 `resolveNestedMessages`、`getCapabilityIconName`，移除 `addExperience` |

---

## 參考

- [I18N_IMPLEMENTATION_PLAN.md](./I18N_IMPLEMENTATION_PLAN.md) — i18n 實作計畫
- Vue I18n：`tm()` 回傳編譯後 message 結構，取陣列／物件時需額外解析為字串
