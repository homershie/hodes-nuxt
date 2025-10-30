import { describe, it, expect } from 'vitest'

describe('useRawArticle (client fallback)', () => {
  it('在 client 環境回傳 null', async () => {
    const { useRawArticle } = await import('@/composables/useRawArticle')
    const res = await useRawArticle('non-exist')
    expect(res).toBeNull()
  })
})


