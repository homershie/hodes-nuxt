import { defineNuxtModule } from '@nuxt/kit'

type ContentFileMutable = Record<string, unknown> & {
  _id?: string
  body?: string
  content?: string
  _content?: string
}

export default defineNuxtModule({
  meta: {
    name: 'content-link-sanitize',
    configKey: 'contentLinkSanitize',
  },
  setup(_, nuxt) {
    // 嘗試使用 modules:done hook，在所有模組加載後註冊
    nuxt.hooks.hook('modules:done', () => {
      // 註冊 content:file:beforeParse hook
      nuxt.hooks.hook('content:file:beforeParse', file => {
        const mutableFile = file as ContentFileMutable

        const bodyKey = (['body', 'content', '_content'] as const).find(key =>
          Object.prototype.hasOwnProperty.call(mutableFile, key)
        )

        if (!bodyKey) {
          return
        }

        const rawContent = mutableFile[bodyKey]

        if (typeof rawContent !== 'string') {
          return
        }

        const sanitizedContent = sanitizeContent(rawContent)

        if (sanitizedContent !== rawContent) {
          mutableFile[bodyKey] = sanitizedContent
        }
      })
    })
  },
})

function sanitizeContent(s: string): string {
  if (typeof s !== 'string') return s

  let content = s

  // 0) 修復多行 HTML 標籤 - 將斷行的標籤合併成單行
  // 匹配 <a href="..." 後面可能有換行和空格的模式
  content = content.replace(/<a\s+([^>]*?)\s*\n\s*>/g, '<a $1>')
  content = content.replace(/<\/a\s*\n\s*>/g, '</a>')

  // 移除標籤屬性中的換行符
  content = content.replace(/(<a[^>]*?)\n\s+([^>]*?>)/g, '$1 $2')

  // 1) 去掉結尾單獨的 #（e.g. href="...#"）
  content = content.replace(/href="([^"#]+)#"/g, 'href="$1"')

  // 2) 移除維基常見的 #/media/... 片段
  content = content.replace(/href="([^"#]+)#\/media\/[^"]*"/g, 'href="$1"')

  // 3) 移除包含 %EF%BF%BD (UTF-8 replacement character) 的 URL 參數
  content = content.replace(/href="([^"]*?)(%EF%BF%BD)+[^"]*"/g, (match, baseUrl) => {
    const cleanUrl = baseUrl.split(/[?&]/)[0]
    return `href="${cleanUrl}"`
  })

  // 4) 修復不完整的 URL 編碼（27s → %27s, 3F → %3F）
  content = content.replace(/(\w)27s/g, '$1%27s')
  content = content.replace(/(\w)3F"/g, '$1%3F"')

  // 5) 嘗試把 fragment 轉合法編碼（避免 decodeURIComponent 崩潰）
  content = content.replace(/href="([^"#]+)#([^"]*)"/g, (m, base, frag) => {
    try {
      // 只要能 decode 成功就維持原樣，不能則 re-encode
      decodeURIComponent(frag)
      return m
    } catch {
      // 無法 decode，重新編碼 fragment
      return `href="${base}#${encodeURIComponent(frag)}"`
    }
  })

  return content
}
