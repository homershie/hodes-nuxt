/**
 * 全域測試前置設定。
 *
 * - 可在此放入全域 mock、環境變數與 DOM API polyfill。
 * - 目前僅設為佔位，後續 Phase 2/3 可按各測試需求擴充。
 */

import { vi } from 'vitest'

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
    createError: vi.fn((options: any) => new Error(options.statusMessage)),
    getRequestHeader: vi.fn(),
    readBody: vi.fn(),
  }
})

// 範例：設定預設時區或環境變數
// process.env.TZ = 'UTC'

// 範例：自訂 @vue/test-utils 全域組態
// import { config } from '@vue/test-utils'
// config.global.stubs = {}
