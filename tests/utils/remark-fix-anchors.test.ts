import { describe, it, expect } from 'vitest'
import remarkFixAnchors from '@/utils/remark-fix-anchors'

type LinkNode = {
  type: 'link'
  url: string
  children?: any[]
}

type Root = {
  type: 'root'
  children: any[]
}

function runPluginOn(links: string[]): string[] {
  const tree: Root = {
    type: 'root',
    children: links.map(url => ({ type: 'link', url }) as LinkNode),
  }
  const transformer = remarkFixAnchors()
  // @ts-expect-error: transformer is untyped
  transformer(tree)
  return (tree.children as LinkNode[]).map(n => n.url)
}

describe('remark-fix-anchors', () => {
  it('保留無錨點的連結', () => {
    const result = runPluginOn(['https://example.com/page'])
    expect(result[0]).toBe('https://example.com/page')
  })

  it('移除單獨#的 fragment', () => {
    const result = runPluginOn(['https://a.com/p#'])
    expect(result[0]).toBe('https://a.com/p')
  })

  it('移除#/media/... 的 fragment', () => {
    const result = runPluginOn(['https://a.com/p#/media/img.jpg'])
    expect(result[0]).toBe('https://a.com/p')
  })

  it('移除包含 %EF%BF%BD 的 fragment', () => {
    const result = runPluginOn(['https://a.com/p#bad%EF%BF%BDfrag'])
    expect(result[0]).toBe('https://a.com/p')
  })

  it('對無法 decode 的 fragment 進行 encode', () => {
    // 包含非法百分比轉義，如 %ZZ
    const result = runPluginOn(['https://a.com/p#abc%ZZdef'])
    expect(result[0]).toBe('https://a.com/p#abc%25ZZdef')
  })

  it('保留可正常 decode 的 fragment', () => {
    const result = runPluginOn(['https://a.com/p#hello-world'])
    expect(result[0]).toBe('https://a.com/p#hello-world')
  })
})


