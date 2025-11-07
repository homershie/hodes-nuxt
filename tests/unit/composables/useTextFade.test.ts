import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('useTextFade', async () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('呼叫 gsap.to 以套用動畫參數', async () => {
    const toSpy = vi.fn()
    vi.doMock('gsap', () => ({ gsap: { to: toSpy } }))
    const { useTextFade } = await import('@/composables/useTextFade')
    const { fadeOutText } = useTextFade()
    fadeOutText('.selector', { duration: 1 })
    expect(toSpy).toHaveBeenCalled()
  })
})
