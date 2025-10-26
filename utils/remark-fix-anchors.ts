import { visit } from 'unist-util-visit'

export default function remarkFixAnchors() {
  return (tree: any) => {
    visit(tree, 'link', (node: any) => {
      if (typeof node.url !== 'string') return

      const url = node.url
      const i = url.indexOf('#')

      if (i === -1) return

      const base = url.slice(0, i)
      const frag = url.slice(i + 1)

      // 去除單獨 # 或 #/media/...
      if (frag === '' || frag.startsWith('/media/')) {
        node.url = base
        return
      }

      // 移除包含 %EF%BF%BD (UTF-8 replacement character) 的 URL
      if (frag.includes('%EF%BF%BD')) {
        node.url = base
        return
      }

      // 保障 fragment 是合法的 percent-encoding
      try {
        decodeURIComponent(frag)
      } catch {
        node.url = base + '#' + encodeURIComponent(frag)
      }
    })
  }
}
