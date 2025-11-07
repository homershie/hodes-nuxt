import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createSendEmailHandler } from '@/server/api/send-email.post'

function makeDeps(overrides: Partial<Parameters<typeof createSendEmailHandler>[0]> = {}) {
  const emailsSend = vi.fn(async () => ({ id: 'email_1' }))
  class ResendMock {
    key: string
    constructor(key: string) {
      this.key = key
    }
    emails = { send: emailsSend }
  }

  return {
    readBody: vi.fn(async () => ({
      name: 'A',
      email: 'a@a.com',
      subject: 'S',
      message: 'hi',
      recaptchaToken: 't',
    })),
    getRequestHeader: vi.fn(() => '1.2.3.4'),
    verifyRecaptcha: vi.fn(async () => true),
    ResendCtor: ResendMock as any,
    useRuntimeConfig: vi.fn(() => ({ resendApiKey: 'key', toEmail: 'to@example.com' })),
    createError: (o: any) => o,
    ...overrides,
  }
}

describe('send-email.post DI handler', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('成功送出', async () => {
    const handler = createSendEmailHandler(makeDeps())
    const res = await handler({})
    expect(res.success).toBe(true)
    expect(res.data).toBeDefined()
  })

  it('reCAPTCHA 驗證失敗 -> 403', async () => {
    const handler = createSendEmailHandler(makeDeps({ verifyRecaptcha: vi.fn(async () => false) }))
    await expect(handler({})).rejects.toMatchObject({ statusCode: 403 })
  })

  it('缺少環境變數 -> 500', async () => {
    const handler = createSendEmailHandler(
      makeDeps({ useRuntimeConfig: vi.fn(() => ({ resendApiKey: '', toEmail: '' })) })
    )
    await expect(handler({})).rejects.toMatchObject({ statusCode: 500 })
  })

  it('Resend 送信失敗 -> 500', async () => {
    class ResendFail {
      emails = {
        send: vi.fn(async () => {
          throw new Error('send failed')
        }),
      }
    }
    const handler = createSendEmailHandler(makeDeps({ ResendCtor: ResendFail as any }))
    await expect(handler({})).rejects.toMatchObject({ statusCode: 500 })
  })
})
