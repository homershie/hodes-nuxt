import { describe, it, expect, vi, beforeEach } from 'vitest'

// 工具：建立可呼叫的 handler（將 defineEventHandler 設為 identity）
async function importHandlerWithMocks(mocks: {
  body?: any
  isHuman?: boolean
  resendOk?: boolean
  env?: { resendApiKey?: string; toEmail?: string }
}) {
  vi.resetModules()

  // 覆蓋 #imports，使 defineEventHandler 回傳原 handler
  vi.doMock('#imports', async () => {
    const actual = await vi.importActual<any>('#imports')
    return {
      ...actual,
      useRuntimeConfig: vi.fn(() => ({
        resendApiKey: mocks.env?.resendApiKey ?? 'test-resend-api-key',
        toEmail: mocks.env?.toEmail ?? 'to@example.com',
      })),
      defineEventHandler: (fn: any) => fn,
      createError: (opts: any) => ({ ...opts }),
      getRequestHeader: vi.fn(() => '1.1.1.1'),
      readBody: vi.fn(() => Promise.resolve(mocks.body ?? {})),
    }
  })

  // mock recaptcha
  vi.doMock('@/server/utils/recaptcha', () => ({
    verifyRecaptcha: vi.fn(async () => mocks.isHuman !== false),
  }))

  // mock resend
  class ResendMock {
    constructor(public key: string) {}
    emails = {
      send: vi.fn(async () => {
        if (mocks.resendOk === false) throw new Error('send failed')
        return { id: 'email_123' }
      }),
    }
  }
  vi.doMock('resend', () => ({ Resend: ResendMock }))

  const mod = await import('@/server/api/send-email.post')
  return mod.default as (event: any) => Promise<any>
}

describe('server/api/send-email.post 行為', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it.skip('成功送出', async () => {
    const handler = await importHandlerWithMocks({
      body: {
        name: 'A',
        email: 'a@a.com',
        message: 'hi',
        subject: 's',
        recaptchaToken: 't',
      },
      isHuman: true,
      resendOk: true,
    })
    const res = await handler({})
    expect(res.success).toBe(true)
    expect(res.data).toBeDefined()
  })

  it('缺少必要欄位 -> 400', async () => {
    const handler = await importHandlerWithMocks({ body: { email: 'a@a.com' } })
    await expect(handler({})).rejects.toMatchObject({ statusCode: 400 })
  })

  it.skip('reCAPTCHA 驗證失敗 -> 403', async () => {
    const handler = await importHandlerWithMocks({
      body: { name: 'A', email: 'a@a.com', message: 'hi', recaptchaToken: 't' },
      isHuman: false,
    })
    await expect(handler({})).rejects.toMatchObject({ statusCode: 403 })
  })

  it.skip('缺少環境變數 -> 500', async () => {
    const handler = await importHandlerWithMocks({
      body: { name: 'A', email: 'a@a.com', message: 'hi', recaptchaToken: 't' },
      env: { resendApiKey: '', toEmail: '' },
    })
    await expect(handler({})).rejects.toMatchObject({ statusCode: 500 })
  })

  it.skip('Resend 送信失敗 -> 500', async () => {
    const handler = await importHandlerWithMocks({
      body: { name: 'A', email: 'a@a.com', message: 'hi', recaptchaToken: 't' },
      resendOk: false,
    })
    await expect(handler({})).rejects.toMatchObject({ statusCode: 500 })
  })
})
