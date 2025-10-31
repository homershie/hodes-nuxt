const fs = require('fs')
const path = require('path')

const articlesDir = path.resolve(__dirname, '../content/articles')
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'))

let totalFixed = 0

files.forEach(file => {
  const filePath = path.join(articlesDir, file)
  let content = fs.readFileSync(filePath, 'utf-8')
  const originalContent = content

  // 修復多行 <a> 標籤
  // 模式 1: <a href="..." target="_blank"\n>
  content = content.replace(/<a\s+([^>]*?)\s*\n\s*>/g, '<a $1>')

  // 模式 2: </a\n>
  content = content.replace(/<\/a\s*\n\s*>/g, '</a>')

  // 模式 3: 標籤內部的換行
  content = content.replace(/(<a[^>]*?)\n\s+([^>]*?>)/g, '$1 $2')

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`✅ 修復了: ${file}`)
    totalFixed++
  }
})

console.log(`\n🎉 總計修復了 ${totalFixed} 個文件`)
