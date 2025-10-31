import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { enableImageLightbox } from '@/composables/useLightBox'

function createImage(attrs: Record<string, string> = {}) {
  const img = document.createElement('img')
  Object.entries(attrs).forEach(([k, v]) => img.setAttribute(k, v))
  return img
}

describe('useLightBox / enableImageLightbox', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('未被 <a> 包裹的圖片會綁定點擊開啟 lightbox', async () => {
    const container = document.createElement('div')
    container.className = 'imgs'
    const img = createImage({ src: '/img/a.webp', alt: 'A' })
    container.appendChild(img)
    document.body.appendChild(container)

    // 提供 original 映射：a.webp -> a.jpg
    enableImageLightbox(['/img/a.jpg'])

    // 等待 nextTick 中的事件綁定
    await nextTick()

    // 觸發點擊（若 JSDOM click 未觸發 inline handler，直接呼叫 onclick）
    if (typeof (img as any).onclick === 'function') {
      ;(img as any).onclick({ stopPropagation() {} })
    } else {
      img.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    }

    // 應該生成 modal 並帶入圖片
    const modal = Array.from(document.querySelectorAll('div')).find(el =>
      (el as HTMLElement).style.position === 'fixed'
    ) as HTMLElement | undefined
    expect(modal).toBeTruthy()
    const modalImg = modal!.querySelector('img') as HTMLImageElement
    expect(modalImg).toBeTruthy()
    expect(modalImg.src).toContain('/img/a.webp')
  })

  it('被 <a> 包裹的圖片不綁定點擊事件', async () => {
    const container = document.createElement('div')
    container.className = 'imgs'
    const link = document.createElement('a')
    const img = createImage({ src: '/img/b.webp', alt: 'B' })
    link.appendChild(img)
    container.appendChild(link)
    document.body.appendChild(container)

    enableImageLightbox()
    // 嘗試點擊，但不應新增 modal
    img.click()
    const modal = document.body.querySelector('div[style*="position:fixed"]')
    expect(modal).toBeFalsy()
  })
})


