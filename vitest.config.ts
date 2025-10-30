import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'json-summary', 'html'],
      all: true,
      include: [
        'app/**/*.{js,jsx,ts,tsx,vue}',
        'composables/**/*.{js,ts}',
        'server/**/*.{js,ts}',
        'utils/**/*.{js,ts}'
      ],
      exclude: [
        'app/assets/**',
        'app/plugins/**',
        'server/plugins/**',
        'server/api/__sitemap__/**',
        'tests/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
      '@composables': fileURLToPath(new URL('./composables', import.meta.url)),
      '@data': fileURLToPath(new URL('./data', import.meta.url)),
      '@server': fileURLToPath(new URL('./server', import.meta.url))
    }
  }
})

