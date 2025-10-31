import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import OptimizedImage from '@/app/components/OptimizedImage.vue'

vi.mock('@/composables/useLazyImage.js', () => {
  const imageRef = ref<any>(null)
  const isLoaded = ref(false)
  const isVisible = ref(false)
  const loadImage = vi.fn(() => {
    if (imageRef.value) {
      imageRef.value.src = imageRef.value.getAttribute('data-src')
    }
  })
  return {
    imageRef,
    isLoaded,
    isVisible,
    useLazyImage: () => ({ imageRef, isLoaded, isVisible, loadImage }),
  }
})

vi.mock('@/composables/usePerformanceMonitor.js', () => {
  return {
    usePerformanceMonitor: () => ({
      recordImageLoadStart: vi.fn(),
      recordImageLoadComplete: vi.fn(),
    }),
  }
})

describe('OptimizedImage.vue', () => {
  it('preload 或 high priority 會立即設定 src', async () => {
    const wrapper = mount(OptimizedImage, {
      props: { src: '/img/a.jpg', alt: 'a', preload: true },
      attachTo: document.body,
    })
    await nextTick()
    const img = wrapper.find('img')
    expect((img.element as HTMLImageElement).getAttribute('src')).toBe('/img/a.jpg')
  })

  it('可見時觸發 loadImage，將 data-src 套到 src', async () => {
    const wrapper = mount(OptimizedImage, {
      props: { src: '/img/a.jpg', alt: 'a' },
      attachTo: document.body,
    })
    const img = wrapper.find('img')
    const mod = await import('@/composables/useLazyImage.js') as any
    mod.imageRef.value = img.element
    mod.isVisible.value = true
    await nextTick()
    // loadImage 會把 data-src 套到 src
    expect((img.element as HTMLImageElement).getAttribute('data-src')).toBe('/img/a.jpg')
  })
})


