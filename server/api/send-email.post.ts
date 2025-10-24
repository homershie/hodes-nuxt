import { Resend } from 'resend'
import { verifyRecaptcha } from '../utils/recaptcha'

// 簡單的 rate limiting (使用記憶體存儲)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

/**
 * 檢查 rate limit
 * 限制同一 IP 在 15 分鐘內最多請求 5 次
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (!limit || now > limit.resetTime) {
    // 重置或建立新的限制
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + 15 * 60 * 1000, // 15 分鐘
    })
    return true
  }

  if (limit.count >= 5) {
    return false
  }

  limit.count++
  return true
}

export default defineEventHandler(async event => {
  try {
    // 獲取 client IP
    const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'

    // 檢查 rate limit
    if (!checkRateLimit(ip)) {
      throw createError({
        statusCode: 429,
        statusMessage: '請求過於頻繁，請 15 分鐘後再試',
      })
    }

    // 讀取請求 body
    const body = await readBody(event)
    const { name, email, subject, message, recaptchaToken } = body

    // 基本驗證
    if (!name || !email || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: '缺少必要欄位',
      })
    }

    // 驗證 reCAPTCHA
    const isHuman = await verifyRecaptcha(recaptchaToken)
    if (!isHuman) {
      throw createError({
        statusCode: 403,
        statusMessage: 'reCAPTCHA 驗證失敗',
      })
    }

    // 初始化 Resend
    const config = useRuntimeConfig()
    const resendApiKey = config.resendApiKey
    const toEmail = config.toEmail

    if (!resendApiKey || !toEmail) {
      console.error('❌ 缺少必要的環境變數')
      throw createError({
        statusCode: 500,
        statusMessage: '伺服器設定錯誤',
      })
    }

    const resend = new Resend(resendApiKey)

    // 發送 email
    const data = await resend.emails.send({
      from: 'HODES <contact@homershie.com>',
      to: toEmail,
      subject: subject || 'Portfolio 聯絡表單',
      html: `
        <p><b>姓名：</b>${name}</p>
        <p><b>Email：</b>${email}</p>
        <p><b>訊息：</b></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    console.log('📧 Email 發送成功:', {
      to: toEmail,
      subject,
      timestamp: new Date().toISOString(),
    })

    return {
      success: true,
      data,
    }
  } catch (error: any) {
    console.error('❌ Email 發送失敗:', error)

    // 如果已經是 H3Error，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 其他錯誤
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '發送失敗',
    })
  }
})
