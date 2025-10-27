/**
 * 讀取文章的原始內容，繞過 MDC 解析器
 * 這樣可以避免 URL 驗證錯誤
 */

export async function useRawArticle(articleId) {
  // 在服務器端，直接讀取文件
  if (import.meta.server) {
    const fs = await import('fs/promises')
    const path = await import('path')

    try {
      const filePath = path.resolve(process.cwd(), 'content/articles', `${articleId}.md`)
      const content = await fs.readFile(filePath, 'utf-8')

      // 手動解析 frontmatter
      const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
      const match = content.match(frontmatterRegex)

      if (!match) {
        return null
      }

      const [, frontmatterStr, body] = match
      const frontmatter = {}

      // 簡單解析 frontmatter
      frontmatterStr.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':')
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim()
          let value = line.substring(colonIndex + 1).trim()

          // 移除引號
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1)
          }

          frontmatter[key] = value
        }
      })

      return {
        ...frontmatter,
        body,
      }
    } catch (e) {
      console.error('Error reading article:', e)
      return null
    }
  }

  // 在客戶端，使用 Nuxt Content API（如果可用）
  // 或者從服務器端傳遞的數據
  return null
}
