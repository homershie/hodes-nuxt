import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import PortfolioList from '@/app/components/PortfolioList.vue'

// Stub NuxtLink
const NuxtLinkStub = {
  template: '<a :href="to"><slot /></a>',
  props: ['to'],
}

// Mock useImagePreloader 以控制載入進度顯示
vi.mock('@composables/useImagePreloader', () => {
  const loadingProgress = ref(0)
  const isPreloading = ref(false)
  return {
    useImagePreloader: () => ({ loadingProgress, isPreloading }),
  }
})

const baseWorks = [
  {
    id: 'w1',
    title: 'Work 1',
    image: '/img/1.jpg',
    category: ['A'],
    imageDimensions: { width: 400, height: 300 },
  },
  {
    id: 'w2',
    title: 'Work 2',
    image: '/img/2.jpg',
    category: ['B', 'C'],
    imageDimensions: { width: 500, height: 400 },
  },
  { id: 'w3', title: 'Work 3', image: '/img/3.jpg', category: ['A', 'C'] },
]

function mountComp(extra: any = {}) {
  return mount(PortfolioList, {
    props: { works: baseWorks, isLoadingMore: false, itemsPerPage: 3, ...extra },
    global: { stubs: { NuxtLink: NuxtLinkStub } },
    attachTo: document.body,
  })
}

describe('PortfolioList.vue', () => {
  it('渲染作品卡片並顯示標題與標籤', () => {
    const wrapper = mountComp()
    const items = wrapper.findAll('.masonry-item .item')
    expect(items.length).toBe(3)
    expect(wrapper.text()).toContain('Work 1')
    expect(wrapper.text()).toContain('Work 2')
    expect(wrapper.text()).toContain('Work 3')
    // 標籤
    const tags = wrapper.findAll('.clickable-tag')
    expect(tags.length).toBeGreaterThan(0)
  })

  it('圖片 load 後會加上 loaded class', async () => {
    const wrapper = mountComp()
    const img = wrapper.find('.img img')
    await img.trigger('load')
    expect(img.classes()).toContain('loaded')
  })

  it('isLoadingMore=true 時，顯示 skeleton 項目', async () => {
    const wrapper = mountComp({ isLoadingMore: true, itemsPerPage: 3 })
    const skeletons = wrapper.findAll('.skeleton-item')
    expect(skeletons.length).toBe(3)
  })

  it('點擊 tag 會觸發 tag-click 事件', async () => {
    const wrapper = mountComp()
    const tag = wrapper.find('.clickable-tag')
    await tag.trigger('click')
    const events = wrapper.emitted('tag-click')
    expect(events && events.length).toBe(1)
    expect(events?.[0]?.[0]).toBeTruthy()
  })

  it('點擊作品卡箭頭會觸發 view-details 事件', async () => {
    const wrapper = mountComp()
    const arrow = wrapper.find('.arrow a')
    await arrow.trigger('click')
    const events = wrapper.emitted('view-details')
    expect(events && events.length).toBe(1)
    expect(events?.[0]?.[0]).toMatchObject({ id: 'w1' })
  })

  it('更新 works 後，清單數量增加', async () => {
    const wrapper = mountComp()
    expect(wrapper.findAll('.masonry-item').length).toBe(3)
    await wrapper.setProps({
      works: [...baseWorks, { id: 'w4', title: 'Work 4', image: '/img/4.jpg', category: ['D'] }],
    })
    expect(wrapper.findAll('.masonry-item').length).toBe(4)
  })
})
