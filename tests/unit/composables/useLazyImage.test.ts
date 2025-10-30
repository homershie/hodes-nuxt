import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useLazyImage } from '@/composables/useLazyImage'

describe('useLazyImage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('IntersectionObserver 觸發後標記可見並在載入後設置已載入', async () => {
    const observeMock = vi.fn()
    const disconnectMock = vi.fn()
    ;(globalThis as any).window = globalThis as any
    ;(window as any).IntersectionObserver = vi.fn((cb: any) => {
      // 立刻觸發可見
      setTimeout(() => cb([{ isIntersecting: true, target: imgEl }]), 0)
      return { observe: observeMock, disconnect: disconnectMock }
    })

    const { imageRef, isLoaded, isVisible } = useLazyImage()
    const imgEl = document.createElement('img')
    imgEl.setAttribute('data-src', '/x.png')
    // 模擬載入
    setTimeout(() => {
      imgEl.onload && imgEl.onload(new Event('load'))
    }, 0)
    imageRef.value = imgEl as any

    // 掛載鉤子會在 composable 呼叫時註冊，我們只需等待微任務
    await new Promise(r => setTimeout(r, 0))
    await nextTick()

    expect(isVisible.value).toBe(true)
    // 模擬把 src 指派會觸發 load handler，isLoaded 應該變 true
    imgEl.src = '/x.png'
    await new Promise(r => setTimeout(r, 0))
    expect(isLoaded.value).toBe(true)
  })
})


