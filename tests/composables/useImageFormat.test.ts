import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useImageFormat } from '@/composables/useImageFormat'

describe('useImageFormat', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('processPath：補齊 / 並保留完整 URL', () => {
    const { processPath } = useImageFormat()
    expect(processPath('img/a.jpg')).toBe('/img/a.jpg')
    expect(processPath('/img/a.jpg')).toBe('/img/a.jpg')
    expect(processPath('https://a.com/x.png')).toBe('https://a.com/x.png')
    expect(processPath('')).toBe('')
  })

  it('toWebP：轉換 jpg/png 為 webp，已是 webp 則保留', () => {
    const { toWebP } = useImageFormat()
    expect(toWebP('/img/a.jpg')).toBe('/img/a.webp')
    expect(toWebP('/img/a.png')).toBe('/img/a.webp')
    expect(toWebP('/img/a.webp')).toBe('/img/a.webp')
    expect(toWebP('')).toBe('')
  })

  it('getImageAttributes：返回 src/alt/class 與 onerror fallback', () => {
    const { getImageAttributes } = useImageFormat()
    const attrs = getImageAttributes('/img/a.jpg', 'alt', 'cls')
    expect(attrs.src).toBe('/img/a.webp')
    expect(attrs.alt).toBe('alt')
    expect(attrs.class).toBe('cls')

    const img: any = { src: attrs.src }
    attrs.onerror.call(img)
    expect(img.src).toBe('/img/a.jpg')
  })

  it('checkImageExists：HEAD ok 為 true，失敗為 false', async () => {
    const { checkImageExists } = useImageFormat()
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true }) as any
    await expect(checkImageExists('/a.webp')).resolves.toBe(true)
    ;(globalThis.fetch as any).mockResolvedValue({ ok: false })
    await expect(checkImageExists('/b.webp')).resolves.toBe(false)
    ;(globalThis.fetch as any).mockRejectedValue(new Error('net'))
    await expect(checkImageExists('/c.webp')).resolves.toBe(false)
  })

  it('getBestImagePath：存在 webp 返回 webp；否則回原始', async () => {
    const { getBestImagePath } = useImageFormat()
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true }) as any
    await expect(getBestImagePath('/img/a.jpg')).resolves.toBe('/img/a.webp')
    ;(globalThis.fetch as any).mockResolvedValue({ ok: false })
    await expect(getBestImagePath('/img/b.jpg')).resolves.toBe('/img/b.jpg')
  })
})
