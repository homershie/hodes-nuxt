import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('server/utils/recaptcha.verifyRecaptcha', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.resetAllMocks()
  })

  it('缺少 token -> false', async () => {
    const { verifyRecaptcha } = await import('@/server/utils/recaptcha')
    expect(await verifyRecaptcha('')).toBe(false)
  })

  it('缺少 secret key -> false', async () => {
    vi.doMock('#imports', async () => {
      const actual = await vi.importActual<any>('#imports')
      return { ...actual, useRuntimeConfig: () => ({ recaptchaSecretKey: '' }) }
    })
    const { verifyRecaptcha } = await import('@/server/utils/recaptcha')
    expect(await verifyRecaptcha('t')).toBe(false)
  })

  it('Google 驗證成功且分數高 -> true', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      json: async () => ({ success: true, score: 0.9 })
    } as any)
    const { verifyRecaptcha } = await import('@/server/utils/recaptcha')
    expect(await verifyRecaptcha('t')).toBe(true)
  })

  it('Google 驗證成功但分數低 -> false', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      json: async () => ({ success: true, score: 0.1 })
    } as any)
    const { verifyRecaptcha } = await import('@/server/utils/recaptcha')
    expect(await verifyRecaptcha('t')).toBe(false)
  })

  it('fetch 例外 -> false', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('network'))
    const { verifyRecaptcha } = await import('@/server/utils/recaptcha')
    expect(await verifyRecaptcha('t')).toBe(false)
  })
})


