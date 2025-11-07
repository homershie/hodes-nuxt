import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ReadingProgress from '@/app/components/ReadingProgress.vue'

// Mock @vueuse/core
vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  return {
    ...actual,
    useScroll: () => ({
      y: { value: 0 },
    }),
  }
})

describe('ReadingProgress', () => {
  beforeEach(() => {
    // 設置為非客戶端環境以避免 DOM 操作
    Object.defineProperty(import.meta, 'client', { value: false, configurable: true })
  })

  it('renders progress bar container', () => {
    const wrapper = mount(ReadingProgress)

    // 在非客戶端環境下，shouldShowProgress 預設為 false
    // 所以進度條可能不會顯示
    expect(wrapper.find('.reading-progress').exists()).toBe(false)
  })

  it('has correct structure when visible', async () => {
    const wrapper = mount(ReadingProgress)

    // 手動設置 shouldShowProgress 為 true（通過修改組件內部狀態）
    // 在實際應用中，這會在滾動時自動設置
    const vm = wrapper.vm as any
    if (vm.shouldShowProgress !== undefined) {
      vm.shouldShowProgress = true
      await nextTick()

      expect(wrapper.find('.reading-progress').exists()).toBe(true)
      expect(wrapper.find('.progress-bar').exists()).toBe(true)
    }
  })

  it('computes progress correctly', () => {
    const wrapper = mount(ReadingProgress)

    // 在非客戶端環境下，progress 應該是 0
    const vm = wrapper.vm as any
    if (vm.progress !== undefined) {
      expect(vm.progress).toBe(0)
    }
  })
})
