import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useLazyImage } from '@/composables/useLazyImage'

describe('useLazyImage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('IntersectionObserver 觸發後標記可見，手動呼叫 loadImage 後載入完成', async () => {
    let ioCallback: any
    const observeMock = vi.fn((el: Element) => {
      setTimeout(() => ioCallback?.([{ isIntersecting: true, target: el }]), 0)
    })
    const disconnectMock = vi.fn()

    ;(globalThis as any).window = globalThis as any
    ;(window as any).IntersectionObserver = vi.fn((cb: any) => {
      ioCallback = cb
      return { observe: observeMock, disconnect: disconnectMock }
    })

    const Comp = defineComponent({
      setup() {
        const { imageRef, isLoaded, isVisible, loadImage } = useLazyImage()
        return { imageRef, isLoaded, isVisible, loadImage }
      },
      render() {
        return h('img', { ref: 'imageRef', 'data-src': '/x.png' })
      },
    })

    const wrapper = mount(Comp)
    const imgEl = wrapper.find('img').element as HTMLImageElement

    await new Promise(r => setTimeout(r, 0))
    await nextTick()

    expect((wrapper.vm as any).isVisible).toBe(true)

    ;(wrapper.vm as any).loadImage()
    imgEl.onload && imgEl.onload(new Event('load'))
    await nextTick()

    expect((wrapper.vm as any).isLoaded).toBe(true)
  })
})


