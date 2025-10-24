# Server API 設定說明

## 📧 Email 發送功能

本專案使用 Nuxt 的 server API 來處理聯絡表單的 email 發送功能。

### 主要功能

- ✉️ 使用 [Resend](https://resend.com) 發送 email
- 🛡️ Google reCAPTCHA v3 驗證
- 🚦 Rate limiting (15 分鐘內最多 5 次請求)
- 🔒 收件人 email 寫死，防止濫用

### 環境變數設定

請複製 `.env.example` 為 `.env` 並填入以下資訊：

```bash
# 1. Google reCAPTCHA v3 設定
# 請到 https://www.google.com/recaptcha/admin 註冊並取得金鑰

# 網站金鑰 (Site Key) - 用於前端
NUXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here

# 密鑰 (Secret Key) - 用於後端驗證
RECAPTCHA_SECRET_KEY=your_secret_key_here

# 2. Resend Email API 設定
# 請到 https://resend.com 註冊並取得 API Key
RESEND_API_KEY=your_resend_api_key_here

# 3. 收件人 Email (寫死以防止濫用)
TO_EMAIL=your_email@example.com
```

### API 路由

#### POST `/api/send-email`

發送聯絡表單 email

**Request Body:**

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

**Response (失敗):**

- `400` - 缺少必要欄位
- `403` - reCAPTCHA 驗證失敗
- `429` - 請求過於頻繁
- `500` - 伺服器錯誤

### 檔案結構

```
server/
├── api/
│   └── send-email.post.ts    # Email 發送 API route
├── utils/
│   └── recaptcha.ts           # reCAPTCHA 驗證工具
└── README.md                  # 本檔案
```

### 本地開發

1. 複製環境變數範例檔：
   ```bash
   cp .env.example .env
   ```

2. 填入必要的 API keys

3. 安裝依賴：
   ```bash
   npm install
   ```

4. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

5. 測試 API：
   ```bash
   curl -X POST http://localhost:3000/api/send-email \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","message":"Hello","recaptchaToken":"xxx"}'
   ```

### 注意事項

⚠️ **重要安全提示**

- 絕對不要將 `.env` 檔案提交到 git
- `RECAPTCHA_SECRET_KEY` 和 `RESEND_API_KEY` 必須保密
- 收件人 email (`TO_EMAIL`) 寫死在環境變數中，防止濫用
- 已實作 rate limiting，每個 IP 15 分鐘最多 5 次請求

### 部署

部署到 production 時，請記得在伺服器環境中設定相同的環境變數。

常見平台設定方式：
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Cloudflare Pages**: Settings → Environment Variables
