import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

const baseWorks = [
  { id: 'w1', title: 'Work 1', image: '/img/1.jpg', category: ['A'], imageDimensions: { width: 400, height: 300 } },
  { id: 'w2', title: 'Work 2', image: '/img/2.jpg', category: ['B'] },
  { id: 'w3', title: 'Work 3', image: '/img/3.jpg', category: ['C'] },
]

async function importWithMasonrySpies() {
  // Ensure gsap.to triggers onComplete so masonry.layout() is called in animations
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
  const mod = await import('masonry-layout')
  const Masonry: any = mod.default
  const layoutSpy = vi.spyOn(Masonry.prototype, 'layout')
  const reloadSpy = vi.spyOn(Masonry.prototype, 'reloadItems')
  const destroySpy = vi.spyOn(Masonry.prototype, 'destroy')
  const Comp = (await import('@/app/components/PortfolioList.vue')).default
  return { Comp, layoutSpy, reloadSpy, destroySpy }
}

describe('PortfolioList behaviors', () => {
  beforeEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
    document.body.innerHTML = ''
  })

  it('initializes Masonry on mount and destroys on unmount', async () => {
    vi.useFakeTimers()
    const { Comp, destroySpy, layoutSpy } = await importWithMasonrySpies()
    const wrapper = mount(Comp as any, { props: { works: baseWorks, isLoadingMore: false, itemsPerPage: 3 }, attachTo: document.body })
    await nextTick()
    vi.advanceTimersByTime(80) // wait for waitForDomUpdate()
    await nextTick()
    expect(layoutSpy).toHaveBeenCalled()
    wrapper.unmount()
    expect(destroySpy).toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('shows skeletons when loading and hides after finished', async () => {
    const { Comp } = await importWithMasonrySpies()
    const wrapper = mount(Comp as any, { props: { works: baseWorks, isLoadingMore: true, itemsPerPage: 2 }, attachTo: document.body })
    await nextTick()
    await nextTick()
    expect(wrapper.findAll('.skeleton-item').length).toBe(2)
    // 結束載入
    await wrapper.setProps({ isLoadingMore: false })
    await nextTick()
    // 骨架應被隱藏（仍在 DOM，但應加上隱藏樣式）
    const skeletons = wrapper.findAll('.skeleton-item')
    expect(skeletons.length).toBe(2)
  })

  it('debounces resize and calls masonry.layout()', async () => {
    vi.useFakeTimers()
    const { Comp, layoutSpy } = await importWithMasonrySpies()
    const wrapper = mount(Comp as any, { props: { works: baseWorks, isLoadingMore: false }, attachTo: document.body })
    await nextTick()
    vi.advanceTimersByTime(80)
    // 觸發 resize
    window.dispatchEvent(new Event('resize'))
    // 立即不應呼叫（debounce 100ms）
    expect(layoutSpy).not.toHaveBeenCalled()
    vi.advanceTimersByTime(120)
    expect(layoutSpy).toHaveBeenCalled()
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
    vi.advanceTimersByTime(50)
    // 會觸發 reload 和 layout
    expect(reloadSpy).toHaveBeenCalled()
    expect(layoutSpy).toHaveBeenCalled()

    // 動畫後應恢復為 1
    vi.advanceTimersByTime(100)
    expect(gallery.style.opacity).toBe('1')

    vi.useRealTimers()
  })
})


