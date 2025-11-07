import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PreLoader from '@/app/components/PreLoader.vue'

// Mock GSAP
vi.mock('gsap', () => {
  const mockTimeline = {
    add: vi.fn().mockReturnThis(),
    to: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
  }

  return {
    gsap: {
      timeline: vi.fn(() => mockTimeline),
      to: vi.fn(),
      set: vi.fn(),
    },
  }
})

describe('PreLoader', () => {
  it('renders loader wrap container', () => {
    const wrapper = mount(PreLoader)

    expect(wrapper.find('.loader-wrap').exists()).toBe(true)
  })

  it('renders SVG element', () => {
    const wrapper = mount(PreLoader)

    expect(wrapper.find('#svg').exists()).toBe(true)
    expect(wrapper.find('#loader-path').exists()).toBe(true)
  })

  it('renders loading text', () => {
    const wrapper = mount(PreLoader)

    expect(wrapper.find('.load-text').exists()).toBe(true)

    // 檢查每個字母是否正確渲染
    const spans = wrapper.findAll('.load-text span')
    expect(spans.length).toBe(7) // "Loading" 有 7 個字母

    const letters = spans.map(span => span.text())
    expect(letters.join('')).toBe('Loading')
  })

  it('is visible by default', () => {
    const wrapper = mount(PreLoader)

    // 預設應該是可見的
    const loaderWrap = wrapper.find('.loader-wrap')
    expect(loaderWrap.element).toBeTruthy()
  })

  it('has correct SVG path attribute', () => {
    const wrapper = mount(PreLoader)

    const path = wrapper.find('#loader-path')
    expect(path.attributes('d')).toBe('M0,1005S175,995,500,995s500,5,500,5V0H0Z')
  })

  it('initializes with visible state', async () => {
    const wrapper = mount(PreLoader)
    await nextTick()

    const vm = wrapper.vm as any
    // visible 在初始時應該是 true
    expect(vm.visible).toBe(true)
  })
})
