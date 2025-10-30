/**
 * 全域測試前置設定。
 *
 * - 可在此放入全域 mock、環境變數與 DOM API polyfill。
 */

import { vi } from 'vitest'
import 'fake-indexeddb/auto'

// Mock Nuxt 全域函數（#imports）
vi.mock('#imports', async () => {
  const actual = await vi.importActual('#imports')
  return {
    ...actual,
    useRuntimeConfig: vi.fn(() => ({
      recaptchaSecretKey: 'test-secret-key',
      resendApiKey: 'test-resend-api-key',
      toEmail: 'test@example.com',
    })),
    defineEventHandler: vi.fn(),
    createError: vi.fn((options: { statusMessage: string }) => new Error(options.statusMessage)),
    getRequestHeader: vi.fn(),
    readBody: vi.fn(),
  }
})

// Mock gsap 與其外掛，避免在 JSDOM 進行真實動畫
vi.mock('gsap', () => {
  const noop = () => {}
  return {
    gsap: {
      registerPlugin: noop,
      set: noop,
      to: noop,
      fromTo: noop,
      timeline: () => ({ to: noop, fromTo: noop, add: noop, play: noop }),
    },
    default: {
      registerPlugin: noop,
      set: noop,
      to: noop,
      fromTo: noop,
      timeline: () => ({ to: noop, fromTo: noop, add: noop, play: noop }),
    },
  }
})

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { refresh: () => {}, kill: () => {} },
  default: { refresh: () => {}, kill: () => {} },
}))

// Mock masonry-layout，避免真實佈局行為
vi.mock('masonry-layout', () => {
  class MasonryMock {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(public container: Element | null, public options: Record<string, unknown>) {}
    layout() {}
    reloadItems() {}
    destroy() {}
  }
  return { default: MasonryMock }
})

// IntersectionObserver polyfill（最小可用實作）
class IO {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(public callback: (...args: unknown[]) => void) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

const g = globalThis as unknown as { IntersectionObserver?: typeof IO }
g.IntersectionObserver = g.IntersectionObserver || IO

// 常見環境變數（供服務端工具/測試使用）
process.env.RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || 'test-secret-key'
process.env.RESEND_API_KEY = process.env.RESEND_API_KEY || 'test-resend-api-key'


