import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useImagePreloader } from '@/composables/useImagePreloader'

describe('useImagePreloader', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('預載入圖片更新進度並完成為 100%', async () => {
    const { preloadImages, loadingProgress, isPreloading } = useImagePreloader()

    // mock Image 行為：立即觸發 load
    vi.stubGlobal('Image', class {
      onload: any
      onerror: any
      set src(_v: string) {
        setTimeout(() => this.onload && this.onload(new Event('load')), 0)
      }
      addEventListener(evt: string, cb: any) { (evt === 'load' ? (this.onload = cb) : (this.onerror = cb)) }
      removeEventListener() {}
    } as any)

    const urls = ['/a.jpg', '/b.jpg', '/c.jpg']
    const result = await preloadImages(urls, 2)
    expect(isPreloading.value).toBe(false)
    expect(loadingProgress.value).toBe(100)
    expect(result).toEqual(urls)
  })
})


