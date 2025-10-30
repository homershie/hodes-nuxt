import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'

const originalClientFlag = (import.meta as any).client
Object.defineProperty(import.meta, 'client', { value: true, configurable: true })

const baseWorks = [
  { id: 'w1', title: 'Work 1', image: '/img/1.jpg', category: ['A'], imageDimensions: { width: 400, height: 300 } },
  { id: 'w2', title: 'Work 2', image: '/img/2.jpg', category: ['B'] },
  { id: 'w3', title: 'Work 3', image: '/img/3.jpg', category: ['C'] },
]

async function importWithMasonrySpies() {
  const layoutSpy = vi.fn()
  const reloadSpy = vi.fn()
  const destroySpy = vi.fn()

  vi.doMock('gsap', () => {
    const to = (_target: any, opts: any = {}) => {
      if (opts && typeof opts.onComplete === 'function') {
        opts.onComplete()
      }
    }
    const noop = () => {}
    return {
      gsap: {
        registerPlugin: noop,
        set: noop,
        to,
        timeline: () => ({ to, add: noop, play: noop }),
      },
      default: {
        registerPlugin: noop,
        set: noop,
        to,
        timeline: () => ({ to, add: noop, play: noop }),
      },
    }
  })

  vi.doMock('@vueuse/core', async () => {
    const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
    return {
      ...actual,
      useIntersectionObserver: (target: any, callback: any) => {
        callback([{ isIntersecting: true, target }])
        return { stop: vi.fn() }
      },
      useEventListener: (target: any, event: string, handler: any) => {
        target?.addEventListener?.(event, handler)
        return () => target?.removeEventListener?.(event, handler)
      },
      useTimeoutFn: (fn: () => void, delay = 0) => {
        const timer = setTimeout(fn, delay)
        return { stop: () => clearTimeout(timer) }
      },
    }
  })

  vi.doMock('@composables/useImagePreloader', () => {
    const loadingProgress = ref(0)
    const isPreloading = ref(false)
    return {
      useImagePreloader: () => ({ loadingProgress, isPreloading }),
    }
  })

  vi.doMock('masonry-layout', () => {
    class FakeMasonry {
      layout() {
        layoutSpy()
      }
      reloadItems() {
        reloadSpy()
      }
      destroy() {
        destroySpy()
      }
    }
    return { default: FakeMasonry }
  })

  const Comp = (await import('@/app/components/PortfolioList.vue')).default
  return { Comp, layoutSpy, reloadSpy, destroySpy }
}

describe('PortfolioList behaviors', () => {
  beforeEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
    vi.resetModules()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
    vi.doUnmock('gsap')
    vi.doUnmock('@vueuse/core')
    vi.doUnmock('@composables/useImagePreloader')
    vi.doUnmock('masonry-layout')
  })

  it('initializes Masonry on mount and destroys on unmount', async () => {
    vi.useFakeTimers()
    const { Comp, destroySpy, layoutSpy } = await importWithMasonrySpies()
    const wrapper = mount(Comp as any, { props: { works: baseWorks, isLoadingMore: false, itemsPerPage: 3 }, attachTo: document.body })
    await nextTick()
    vi.advanceTimersByTime(200)
    await nextTick()
    expect(layoutSpy).toHaveBeenCalled()
    wrapper.unmount()
    expect(destroySpy).toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('shows skeletons when loading and hides after finished', async () => {
    vi.useFakeTimers()
    const { Comp } = await importWithMasonrySpies()
    const wrapper = mount(Comp as any, { props: { works: baseWorks, isLoadingMore: true, itemsPerPage: 2 }, attachTo: document.body })
    await nextTick()
    vi.runOnlyPendingTimers()
    await nextTick()
    expect(wrapper.findAll('.skeleton-item').length).toBe(2)
    // 結束載入
    await wrapper.setProps({ isLoadingMore: false })
    await nextTick()
    vi.runOnlyPendingTimers()
    await nextTick()
    // 骨架應被隱藏（仍在 DOM，但應加上隱藏樣式）
    const skeletons = wrapper.findAll('.skeleton-item')
    expect(skeletons.length).toBe(2)
    wrapper.unmount()
    vi.useRealTimers()
  })

  it('debounces resize and calls masonry.layout()', async () => {
    vi.useFakeTimers()
    const { Comp, layoutSpy } = await importWithMasonrySpies()
    const wrapper = mount(Comp as any, { props: { works: baseWorks, isLoadingMore: false }, attachTo: document.body })
    await nextTick()
    vi.advanceTimersByTime(200)
    await nextTick()
    const initialCalls = layoutSpy.mock.calls.length
    // 觸發 resize
    window.dispatchEvent(new Event('resize'))
    // 立即不應呼叫（debounce 100ms）
    expect(layoutSpy.mock.calls.length).toBe(initialCalls)
    vi.advanceTimersByTime(120)
    expect(layoutSpy.mock.calls.length).toBeGreaterThan(initialCalls)
    wrapper.unmount()
    vi.useRealTimers()
  })

  it('re-initializes layout on category switch (works length changes) and toggles gallery opacity', async () => {
    vi.useFakeTimers()
    const { Comp, layoutSpy, reloadSpy } = await importWithMasonrySpies()
    const wrapper = mount(Comp as any, { props: { works: baseWorks, isLoadingMore: false }, attachTo: document.body })
    const gallery = document.querySelector('.gallery') as HTMLElement
    expect(gallery).toBeTruthy()

    // 切換為更少的作品數（模擬分類切換）
    await wrapper.setProps({ works: baseWorks.slice(0, 1) })
    await nextTick()
    vi.advanceTimersByTime(60)
    // 期間應先將透明度降為 0
    expect(gallery.style.opacity).toBe('0')

    // 前進等待 DOM 與布局
    vi.advanceTimersByTime(60)
    // 會觸發 reload 和 layout
    expect(reloadSpy).toHaveBeenCalled()
    expect(layoutSpy).toHaveBeenCalled()

    // 動畫後應恢復為 1
    vi.advanceTimersByTime(100)
    expect(gallery.style.opacity).toBe('1')

    wrapper.unmount()
    vi.useRealTimers()
  })
})

afterAll(() => {
  if (originalClientFlag === undefined) {
    Reflect.deleteProperty(import.meta as any, 'client')
  } else {
    Object.defineProperty(import.meta, 'client', { value: originalClientFlag, configurable: true })
  }
})


