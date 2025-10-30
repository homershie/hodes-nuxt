import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PortfolioList from '@/app/components/PortfolioList.vue'

const originalClientFlag = (import.meta as any).client

const baseWorks = [
  { id: 'w1', title: 'Work 1', image: '/img/1.jpg', category: ['A'], imageDimensions: { width: 400, height: 300 } },
  { id: 'w2', title: 'Work 2', image: '/img/2.jpg', category: ['B'] },
  { id: 'w3', title: 'Work 3', image: '/img/3.jpg', category: ['C'] },
]

describe('PortfolioList behaviors', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    document.body.innerHTML = ''
    // 設置為非客戶端環境，避免執行客戶端專屬邏輯
    Object.defineProperty(import.meta, 'client', { value: false, configurable: true })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders gallery container and masonry items', async () => {
    const wrapper = mount(PortfolioList as any, { 
      props: { works: baseWorks, isLoadingMore: false, itemsPerPage: 3 }, 
      attachTo: document.body 
    })
    
    await nextTick()
    
    // 測試基本渲染
    expect(wrapper.find('.gallery').exists()).toBe(true)
    expect(wrapper.findAll('.masonry-item').length).toBe(baseWorks.length)
    
    // 測試作品資訊是否正確渲染
    const titles = wrapper.findAll('.work-title')
    expect(titles.length).toBe(baseWorks.length)
    expect(titles[0].text()).toBe(baseWorks[0].title)
    
    wrapper.unmount()
  })

  it('shows skeleton items when loading', async () => {
    const wrapper = mount(PortfolioList as any, { 
      props: { works: baseWorks, isLoadingMore: true, itemsPerPage: 2 }, 
      attachTo: document.body 
    })
    
    await nextTick()
    
    // 檢查 skeleton 項目是否存在
    const skeletons = wrapper.findAll('.skeleton-item')
    expect(skeletons.length).toBe(2)
    
    // 檢查 skeleton 內部元素
    expect(wrapper.find('.skeleton-image').exists()).toBe(true)
    expect(wrapper.find('.skeleton-title').exists()).toBe(true)
    expect(wrapper.find('.skeleton-category').exists()).toBe(true)
    
    wrapper.unmount()
  })

  it('hides skeleton items when not loading', async () => {
    const wrapper = mount(PortfolioList as any, { 
      props: { works: baseWorks, isLoadingMore: false, itemsPerPage: 2 }, 
      attachTo: document.body 
    })
    
    await nextTick()
    
    // 當不在載入狀態時，skeleton 不應顯示
    // 注意：skeleton 可能仍在 DOM 中但被隱藏
    // 所以我們檢查它們沒有 visible 類別或被樣式隱藏
    const skeletons = wrapper.findAll('.skeleton-item')
    
    // 如果有 skeleton，它們應該被隱藏
    skeletons.forEach(skeleton => {
      const element = skeleton.element as HTMLElement
      // 檢查是否有隱藏的樣式或類別
      const hasHiddenClass = skeleton.classes().includes('skeleton-hidden')
      const hasHiddenStyle = 
        element.style.display === 'none' ||
        element.style.visibility === 'hidden' ||
        element.style.opacity === '0'
      
      // skeleton 要麼不存在，要麼被隱藏
      expect(hasHiddenClass || hasHiddenStyle || skeletons.length === 0).toBeTruthy()
    })
    
    wrapper.unmount()
  })

  it('emits view-details event when clicking on work', async () => {
    const wrapper = mount(PortfolioList as any, { 
      props: { works: baseWorks, isLoadingMore: false }, 
      attachTo: document.body 
    })
    
    await nextTick()
    
    // 找到第一個作品的連結並點擊
    const link = wrapper.findAll('.link')[0]
    await link.trigger('click')
    
    // 檢查是否發送了 view-details 事件
    expect(wrapper.emitted('view-details')).toBeTruthy()
    expect(wrapper.emitted('view-details')?.length).toBe(1)
    expect(wrapper.emitted('view-details')?.[0]).toEqual([baseWorks[0]])
    
    wrapper.unmount()
  })

  it('emits tag-click event when clicking on tag', async () => {
    const wrapper = mount(PortfolioList as any, { 
      props: { works: baseWorks, isLoadingMore: false }, 
      attachTo: document.body 
    })
    
    await nextTick()
    
    // 找到第一個標籤並點擊
    const tag = wrapper.find('.clickable-tag')
    await tag.trigger('click')
    
    // 檢查是否發送了 tag-click 事件
    expect(wrapper.emitted('tag-click')).toBeTruthy()
    expect(wrapper.emitted('tag-click')?.length).toBe(1)
    expect(wrapper.emitted('tag-click')?.[0]).toEqual([baseWorks[0].category[0]])
    
    wrapper.unmount()
  })

  it('renders correct number of works based on works prop', async () => {
    const wrapper = mount(PortfolioList as any, { 
      props: { works: baseWorks.slice(0, 2), isLoadingMore: false }, 
      attachTo: document.body 
    })
    
    await nextTick()
    
    // 應該只渲染 2 個作品
    expect(wrapper.findAll('.masonry-item').length).toBe(2)
    
    // 更新為 3 個作品
    await wrapper.setProps({ works: baseWorks })
    await nextTick()
    
    // 現在應該有 3 個作品
    expect(wrapper.findAll('.masonry-item').length).toBe(3)
    
    wrapper.unmount()
  })

  it('does not show loading progress when not preloading', async () => {
    const wrapper = mount(PortfolioList as any, { 
      props: { works: baseWorks, isLoadingMore: false }, 
      attachTo: document.body 
    })
    
    await nextTick()
    
    // 檢查載入進度不應顯示（因為 isPreloading 預設為 false）
    const loadingProgress = wrapper.find('.loading-progress')
    expect(loadingProgress.exists()).toBe(false)
    
    wrapper.unmount()
  })

  it('renders images with correct attributes', async () => {
    const wrapper = mount(PortfolioList as any, { 
      props: { works: baseWorks, isLoadingMore: false }, 
      attachTo: document.body 
    })
    
    await nextTick()
    
    const images = wrapper.findAll('.img img')
    expect(images.length).toBe(baseWorks.length)
    
    // 檢查第一張圖片的屬性
    const firstImage = images[0]
    expect(firstImage.attributes('src')).toBe(baseWorks[0].image)
    expect(firstImage.attributes('alt')).toBe(baseWorks[0].title)
    expect(firstImage.attributes('loading')).toBe('lazy')
    expect(firstImage.attributes('width')).toBe(String(baseWorks[0].imageDimensions?.width))
    expect(firstImage.attributes('height')).toBe(String(baseWorks[0].imageDimensions?.height))
    
    wrapper.unmount()
  })
})

afterAll(() => {
  if (originalClientFlag === undefined) {
    Reflect.deleteProperty(import.meta as any, 'client')
  } else {
    Object.defineProperty(import.meta, 'client', { value: originalClientFlag, configurable: true })
  }
})
