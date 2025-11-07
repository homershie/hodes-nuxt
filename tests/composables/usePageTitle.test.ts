import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePageTitle } from '@/composables/usePageTitle'

describe('usePageTitle', () => {
  beforeEach(() => {
    // 每次重置全域 useSeoMeta mock
    // @ts-expect-error - inject global mock
    globalThis.useSeoMeta = vi.fn()
  })

  it('getPageTitle：無 pageName 時回傳 baseTitle', () => {
    const { baseTitle, getPageTitle } = usePageTitle()
    expect(getPageTitle('')).toBe(baseTitle)
    expect(getPageTitle(undefined as unknown as string)).toBe(baseTitle)
  })

  it('getPageTitle：有 pageName 時加上 suffix', () => {
    const { getPageTitle, suffix } = usePageTitle()
    expect(getPageTitle('首頁')).toBe(`首頁${suffix}`)
  })

  it('setPageTitle：呼叫 useSeoMeta 設定標題', () => {
    const { setPageTitle, suffix } = usePageTitle()
    setPageTitle('關於')
    expect((globalThis as any).useSeoMeta).toHaveBeenCalledWith({ title: `關於${suffix}` })
  })
})
