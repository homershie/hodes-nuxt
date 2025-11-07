import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppNavbar from '@/app/components/AppNavbar.vue'

const NuxtLinkStub = {
  template: '<a :href="to"><slot /></a>',
  props: ['to'],
}

describe('AppNavbar.vue', () => {
  it('點擊切換按鈕切換選單開關，顯示 overlay', async () => {
    const wrapper = mount(AppNavbar, {
      global: { stubs: { NuxtLink: NuxtLinkStub } },
      attachTo: document.body,
    })

    const btn = wrapper.find('.navbar-toggler')
    expect(btn.exists()).toBe(true)
    // 初始 overlay 尚未顯示（teleport 到 body）
    expect(document.body.querySelector('.overlay')).toBeTruthy()

    await btn.trigger('click')
    expect(btn.classes()).toContain('active')
    // overlay v-show=true（存在於 body）
    const overlay = document.body.querySelector('.overlay') as HTMLElement
    expect(overlay).toBeTruthy()

    await btn.trigger('click')
    expect(btn.classes()).not.toContain('active')
  })

  it('路由變更時自動關閉選單', async () => {
    const wrapper = mount(AppNavbar, {
      global: { stubs: { NuxtLink: NuxtLinkStub } },
      attachTo: document.body,
    })

    const btn = wrapper.find('.navbar-toggler')
    await btn.trigger('click')
    expect(btn.classes()).toContain('active')

    // 透過全域 route 模擬變更
    const routeObj = (globalThis as any).__testRoute
    routeObj.path = '/about'
    await wrapper.vm.$nextTick()
    expect(btn.classes()).not.toContain('active')
  })
})
