import { Resend } from 'resend'
import { verifyRecaptcha } from '../utils/recaptcha'
import { checkRateLimit } from '../utils/rate-limit'

// rate limit 檢查移至 server/utils/rate-limit.ts 共用

export type SendEmailDeps = {
  readBody: (event: any) => Promise<any>
  getRequestHeader: (event: any, name: string) => string | undefined
  verifyRecaptcha: (token: string) => Promise<boolean>
  ResendCtor: typeof Resend
  useRuntimeConfig: () => { resendApiKey?: string; toEmail?: string }
  createError: (opts: any) => any
}

export function createSendEmailHandler(deps: SendEmailDeps) {
  return async function handler(event: any) {
    const { readBody, getRequestHeader, verifyRecaptcha, ResendCtor, useRuntimeConfig, createError } = deps

    try {
      // 獲取 client IP
      const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'

      // 檢查 rate limit（保留原行為，若需可改為可注入）
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

      const resend = new ResendCtor(resendApiKey)

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
    } catch (error) {
      console.error('❌ Email 發送失敗:', error)

      // 如果已經是 H3Error，直接拋出
      if (error && typeof error === 'object' && 'statusCode' in error) {
        throw error
      }

      // 其他錯誤
      const errorMessage = error instanceof Error ? error.message : '發送失敗'
      throw deps.createError({
        statusCode: 500,
        statusMessage: errorMessage,
      })
    }
  }
}

export default defineEventHandler(async event => {
  const handler = createSendEmailHandler({
    readBody,
    getRequestHeader,
    verifyRecaptcha,
    ResendCtor: Resend,
    useRuntimeConfig,
    createError,
  })
  return handler(event)
})
