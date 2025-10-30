import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppFooter from '@/app/components/AppFooter.vue'

describe('AppFooter.vue', () => {
  it('顯示當前年份', () => {
    const wrapper = mount(AppFooter)
    const year = new Date().getFullYear().toString()
    expect(wrapper.text()).toContain(year)
  })
})


