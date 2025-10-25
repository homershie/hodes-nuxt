/**
 * 將 data/articleData.js 轉換為 Markdown 檔案
 *
 * 轉換規則:
 * 1. 每篇文章 → 獨立 .md 檔案
 * 2. 保留 frontmatter (id, title, date, category, image, excerpt, author)
 * 3. HTML 內容保持原樣 (Nuxt Content 支援 HTML in Markdown)
 * 4. 自動加上 loading="lazy" 到所有 <img> 標籤 (已有則跳過)
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function migrateArticles() {
  // 動態導入 articleData.js
  const { articles } = await import('../data/articleData.js')

  const contentDir = path.resolve(__dirname, '../content/articles')

  // 確保目錄存在
  await fs.mkdir(contentDir, { recursive: true })

  for (const [id, article] of Object.entries(articles)) {
    const frontmatter = `---
id: ${article.id}
title: "${article.title}"
date: ${article.date}
category: ${article.category}
categoryName: ${article.categoryName}
excerpt: "${article.excerpt}"
image: ${article.image}
thumbnail: ${article.thumbnail}
author: ${article.author}
---

`

    // 處理圖片，自動加上 loading="lazy" (若尚未加上)
    let content = article.content
    // 只對沒有 loading 屬性的 img 標籤加上 loading="lazy"
    content = content.replace(/<img(?![^>]*loading=)/g, '<img loading="lazy"')

    // 修復問題 URL: 移除可能造成 MDC 解析錯誤的 URL 片段
    // 1. 移除結尾的單獨 # (包含有無 > 的情況)
    content = content.replace(/href="([^"]+)#"/g, 'href="$1"')
    // 2. 移除 #/media/ 開頭的片段 (維基百科圖片連結)
    content = content.replace(/href="([^"#]+)#\/media\/[^"]*"/g, 'href="$1"')
    // 3. 移除包含無效 UTF-8 替換字符的 URL 參數
    // %EF%BF%BD 是 UTF-8 replacement character，會導致 decodeURIComponent 失敗
    content = content.replace(/href="([^"]*?)(%EF%BF%BD)+[^"]*"/g, (match, baseUrl) => {
      // 移除問題參數，保留 URL 的基礎部分
      const cleanUrl = baseUrl.split(/[?&]/)[0]
      return `href="${cleanUrl}"`
    })
    // 4. 修復不完整的 URL 編碼 (如 today27s 應該是 today%27s)
    //    27 = ', 3F = ?, 這些是 URL 編碼但缺少 % 前綴
    content = content.replace(/(\w)27s/g, '$1%27s') // Fix apostrophes
    content = content.replace(/(\w)3F"/g, '$1%3F"') // Fix question marks at end

    const markdown = frontmatter + content

    const filePath = path.join(contentDir, `${id}.md`)
    await fs.writeFile(filePath, markdown, 'utf-8')

    console.log(`✅ 轉換完成: ${id}.md`)
  }

  console.log(`\n🎉 總計轉換 ${Object.keys(articles).length} 篇文章`)
}

migrateArticles().catch(console.error)
