/**
 * 測試所有 Markdown 文件中的 URL 是否可以被 decodeURIComponent 正確解碼
 */

import fs from 'fs/promises'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function testUrls() {
  const contentDir = path.resolve(__dirname, '../content/articles')
  const files = await fs.readdir(contentDir)

  console.log('🔍 檢查 Markdown 文件中的所有 URL...\n')

  let errorCount = 0

  for (const file of files) {
    if (!file.endsWith('.md')) continue

    const filePath = path.join(contentDir, file)
    const content = await fs.readFile(filePath, 'utf-8')

    // 提取所有 href 屬性
    const hrefRegex = /href="([^"]*)"/g
    let match

    while ((match = hrefRegex.exec(content)) !== null) {
      const url = match[1]

      try {
        decodeURIComponent(url)
        // console.log(`✓ ${file}: ${url.substring(0, 80)}`)
      } catch (e) {
        errorCount++
        console.log(`\n❌ 錯誤在: ${file}`)
        console.log(`   URL: ${url}`)
        console.log(`   錯誤: ${e.message}`)
        console.log(`   ---`)
      }
    }
  }

  if (errorCount === 0) {
    console.log('\n✅ 所有 URL 都可以正確解碼！')
  } else {
    console.log(`\n⚠️  發現 ${errorCount} 個問題 URL`)
  }
}

testUrls().catch(console.error)
