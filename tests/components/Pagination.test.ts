import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from '@/app/components/Pagination.vue'

const NuxtLinkStub = {
  template: '<a :href="to"><slot /></a>',
  props: ['to'],
}

function mountComp(props: any) {
  return mount(Pagination, {
    props,
    global: { stubs: { NuxtLink: NuxtLinkStub } },
  })
}

function getTexts(wrapper: any, selector: string) {
  return wrapper.findAll(selector).map((w: any) => w.text())
}

describe('Pagination.vue', () => {
  it('總頁數 <= 7：顯示所有頁碼', () => {
    const wrapper = mountComp({ currentPage: 1, totalPages: 5, baseUrl: '/blog/page' })
    const pageTexts = getTexts(wrapper, '.page-item .page-link')
    // 期望包含 1 2 3 4 5，且無 ...
    expect(pageTexts.join(' ')).not.toContain('...')
    expect(pageTexts).toContain('1')
    expect(pageTexts).toContain('2')
    expect(pageTexts).toContain('3')
    expect(pageTexts).toContain('4')
    expect(pageTexts).toContain('5')
  })

  it('中間頁：顯示 1 ... 當前前後各2頁 ... 最後頁', () => {
    const wrapper = mountComp({ currentPage: 10, totalPages: 30, baseUrl: '/blog/page' })
    const items = wrapper.findAll('.page-item .page-link')
    const texts = items.map(i => i.text())
    // 必須有前後兩個省略號
    const dotsCount = texts.filter(t => t === '...').length
    expect(dotsCount).toBe(2)
    // 應包含 1、8、9、10、11、12、30
    const str = texts.join(' ')
    for (const t of ['1', '8', '9', '10', '11', '12', '30']) {
      expect(str).toContain(t)
    }
  })

  it('邊界：第一頁時上一頁 disabled，無上一頁連結', () => {
    const wrapper = mountComp({ currentPage: 1, totalPages: 10, baseUrl: '/b' })
    const prevLi = wrapper.findAll('.page-item')[0]
    expect(prevLi.classes()).toContain('disabled')
    expect(prevLi.findAll('a').length).toBe(0)
  })

  it('邊界：最後一頁時下一頁 disabled，無下一頁連結', () => {
    const wrapper = mountComp({ currentPage: 10, totalPages: 10, baseUrl: '/b' })
    const items = wrapper.findAll('.page-item')
    const nextLi = items[items.length - 1]
    expect(nextLi.classes()).toContain('disabled')
    expect(nextLi.findAll('a').length).toBe(0)
  })

  it('產生正確的 NuxtLink href', () => {
    const wrapper = mountComp({ currentPage: 3, totalPages: 5, baseUrl: '/blog/page' })
    const links = wrapper.findAll('.page-item a.page-link')
    const hrefs = links.map(a => (a.element as HTMLAnchorElement).getAttribute('href'))
    // 第一個 a 是上一頁 => /blog/page/2
    expect(hrefs[0]).toBe('/blog/page/2')
    // 中間幾個為頁碼本身之一
    expect(hrefs).toContain('/blog/page/1')
    expect(hrefs).toContain('/blog/page/3')
    expect(hrefs).toContain('/blog/page/5')
    // 最後一個 a 是下一頁 => /blog/page/4
    expect(hrefs[hrefs.length - 1]).toBe('/blog/page/4')
  })
})
