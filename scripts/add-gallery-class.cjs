// scripts/add-gallery-class.cjs
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'content', 'articles');

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.md'));

function addClassToImgs(block) {
  // 替換 block 中所有 <img ...>：若已有 class 則附加，否則新增
  return block.replace(/<img\b([^>]*?)>/g, (m, attrs) => {
    if (/class\s*=/.test(attrs)) {
      return `<img${attrs.replace(/class\s*=\s*"([^"]*)"/, (mm, cls) => {
        return cls.includes('article-gallery-img')
          ? `class="${cls}"`
          : `class="${cls} article-gallery-img"`;
      })}>`;
    }
    return `<img class="article-gallery-img"${attrs}>`;
  });
}

for (const file of files) {
  const full = path.join(DIR, file);
  let src = fs.readFileSync(full, 'utf8');

  // 1) 自訂標籤容器（非貪婪跨行）
  src = src.replace(/<(image-gallery|image-gallery-3|image-masonry)[\s\S]*?<\/\1>/g, addClassToImgs);

  // 2) div.class 容器（image-gallery | image-gallery-3 | image-masonry）
  src = src.replace(
    /<div[^>]*class="[^"]*\b(image-gallery|image-gallery-3|image-masonry)\b[^"]*"[^>]*>[\s\S]*?<\/div>/g,
    addClassToImgs
  );

  fs.writeFileSync(full, src, 'utf8');
  console.log('Updated:', file);
}