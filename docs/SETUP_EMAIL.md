# 📧 Email 聯絡表單設定指南

## 快速開始

### 1. 設定環境變數

複製 `.env.example` 為 `.env`：

```bash
cp .env.example .env
```

然後填入以下資訊：

```env
# Google reCAPTCHA v3
NUXT_PUBLIC_RECAPTCHA_SITE_KEY=你的_site_key
RECAPTCHA_SECRET_KEY=你的_secret_key

# Resend Email API
RESEND_API_KEY=你的_resend_api_key

# 收件人 Email
TO_EMAIL=你的email@example.com
```

### 2. 取得 reCAPTCHA Keys

1. 前往 [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. 點擊「建立」
3. 選擇 **reCAPTCHA v3**
4. 填寫網站資訊：
   - **標籤**: 你的網站名稱
   - **網域**: `localhost` (開發) 和 `yourdomain.com` (生產環境)
5. 複製：
   - **網站金鑰 (Site Key)** → `NUXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - **密鑰 (Secret Key)** → `RECAPTCHA_SECRET_KEY`

### 3. 取得 Resend API Key

1. 前往 [Resend](https://resend.com)
2. 註冊/登入帳號
3. 前往 [API Keys](https://resend.com/api-keys)
4. 建立新的 API Key
5. 複製 API Key → `RESEND_API_KEY`

**重要**: 設定 Resend 的寄件網域

1. 前往 [Domains](https://resend.com/domains)
2. 新增你的網域 (例如: `homershie.com`)
3. 依照指示設定 DNS records (SPF, DKIM, DMARC)
4. 等待驗證通過

### 4. 測試

啟動開發伺服器：

```bash
npm run dev
```

前往聯絡頁面測試表單：

```
http://localhost:3000/contact
```

## 檔案結構

```
hodes-nuxt/
├── .env.example                     # 環境變數範例
├── .env                             # 你的環境變數 (不要提交到 git!)
├── nuxt.config.ts                   # Nuxt 配置 (含 runtimeConfig)
├── server/
│   ├── api/
│   │   └── send-email.post.ts       # Email API endpoint
│   └── utils/
│       └── recaptcha.ts             # reCAPTCHA 驗證工具
├── plugins/
│   └── recaptcha.client.ts          # reCAPTCHA plugin (client-side)
└── app/
    └── pages/
        └── contact.vue              # 聯絡表單頁面
```

## API 端點

### `POST /api/send-email`

發送聯絡表單 email。

**Request:**

```json
{
  "name": "使用者名稱",
  "email": "user@example.com",
  "subject": "主旨 (選填)",
  "message": "訊息內容",
  "recaptchaToken": "reCAPTCHA token"
}
```

**Response (成功):**

```json
{
  "success": true,
  "data": {
    "id": "email_id"
  }
}
```

**錯誤代碼:**

- `400` - 缺少必要欄位
- `403` - reCAPTCHA 驗證失敗
- `429` - 請求過於頻繁 (15 分鐘內超過 5 次)
- `500` - 伺服器錯誤

## 安全功能

✅ **已實作**

- ✉️ 使用 Resend API 發送郵件
- 🛡️ Google reCAPTCHA v3 驗證 (score >= 0.5)
- 🚦 Rate limiting: 每個 IP 15 分鐘最多 5 次請求
- 🍯 Honeypot 欄位防止機器人
- 🔒 收件人 email 寫死在環境變數中
- 🔐 敏感資訊使用 runtimeConfig 管理
- 📝 表單驗證 (使用 vee-validate + yup)

## 部署

### Vercel

1. 前往 Vercel Dashboard
2. 選擇你的專案
3. Settings → Environment Variables
4. 新增所有環境變數：
   - `NUXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - `RECAPTCHA_SECRET_KEY`
   - `RESEND_API_KEY`
   - `TO_EMAIL`

### Cloudflare Pages

1. 前往 Cloudflare Dashboard
2. 選擇你的專案
3. Settings → Environment Variables
4. 新增所有環境變數 (同上)

### Netlify

1. 前往 Netlify Dashboard
2. Site Settings → Environment Variables
3. 新增所有環境變數 (同上)

## 常見問題

### Q: Email 沒有收到？

1. 檢查 Resend 的 [Logs](https://resend.com/logs) 查看發送狀態
2. 確認 Resend 網域已驗證
3. 檢查垃圾郵件資料夾
4. 確認 `TO_EMAIL` 設定正確

### Q: reCAPTCHA 驗證失敗？

1. 確認 Site Key 和 Secret Key 都正確
2. 確認網域已加入 reCAPTCHA 設定中
3. 開啟瀏覽器 Console 查看錯誤訊息

### Q: Rate limit 錯誤？

每個 IP 15 分鐘內最多 5 次請求。請稍後再試。

### Q: 如何測試不透過表單？

使用 curl 測試 API：

```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "測試",
    "email": "test@example.com",
    "message": "這是測試訊息",
    "recaptchaToken": "test_token"
  }'
```

注意：沒有有效的 reCAPTCHA token 會失敗。

## 技術細節

- **Email Provider**: [Resend](https://resend.com)
- **reCAPTCHA**: Google reCAPTCHA v3
- **Framework**: Nuxt 3
- **Form Validation**: vee-validate + yup
- **Rate Limiting**: 記憶體存儲 (生產環境建議使用 Redis)

## 下一步優化建議

1. **Rate Limiting**: 改用 Redis 或 KV storage (Cloudflare Workers KV, Vercel KV)
2. **Email Template**: 使用更漂亮的 HTML email template
3. **通知**: 發送確認 email 給寄件者
4. **分析**: 追蹤表單提交數據
5. **測試**: 新增單元測試和 E2E 測試

## 參考資源

- [Nuxt Server Routes](https://nuxt.com/docs/guide/directory-structure/server)
- [Resend Documentation](https://resend.com/docs)
- [reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [vee-validate Documentation](https://vee-validate.logaretm.com/v4/)
