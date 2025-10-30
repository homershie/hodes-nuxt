import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PortfolioSkeleton from '@/app/components/PortfolioSkeleton.vue'

describe('PortfolioSkeleton', () => {
  it('renders default number of skeleton items', () => {
    const wrapper = mount(PortfolioSkeleton)
    
    const skeletonItems = wrapper.findAll('.skeleton-item')
    expect(skeletonItems.length).toBe(3) // 預設值
  })

  it('renders custom number of skeleton items', () => {
    const wrapper = mount(PortfolioSkeleton, {
      props: {
        count: 5,
      },
    })
    
    const skeletonItems = wrapper.findAll('.skeleton-item')
    expect(skeletonItems.length).toBe(5)
  })

  it('renders skeleton structure correctly', () => {
    const wrapper = mount(PortfolioSkeleton, {
      props: {
        count: 1,
      },
    })
    
    // 檢查骨架結構
    expect(wrapper.find('.skeleton-container').exists()).toBe(true)
    expect(wrapper.find('.skeleton-image').exists()).toBe(true)
    expect(wrapper.find('.skeleton-title').exists()).toBe(true)
    expect(wrapper.find('.skeleton-category').exists()).toBe(true)
  })

  it('applies animation delay to each skeleton item', () => {
    const wrapper = mount(PortfolioSkeleton, {
      props: {
        count: 3,
      },
    })
    
    const skeletonItems = wrapper.findAll('.skeleton-item')
    
    // 檢查每個項目是否有動畫延遲
    skeletonItems.forEach((item, index) => {
      const style = item.attributes('style')
      expect(style).toContain('animation-delay')
      // v-for 從 1 開始，所以延遲是 (index + 1) * 0.1
      const expectedDelay = (index + 1) * 0.1
      expect(style).toContain(`${expectedDelay}s`)
    })
  })

  it('renders with zero count', () => {
    const wrapper = mount(PortfolioSkeleton, {
      props: {
        count: 0,
      },
    })
    
    const skeletonItems = wrapper.findAll('.skeleton-item')
    expect(skeletonItems.length).toBe(0)
  })
})
