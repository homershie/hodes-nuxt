import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import http from 'http'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 圖片目錄路徑
const IMAGES_DIR = path.join(__dirname, '../public/images/works')
const OUTPUT_FILE = path.join(__dirname, '../data/imageDimensions.json')

// 支援的圖片格式
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

// 外部圖片基礎 URL (保留供未來使用)
// const EXTERNAL_BASE_URL = 'https://r2bucket.homershie.com/assets/imgs/works/'

/**
 * 下載圖片並獲取尺寸資訊
 */
async function downloadAndAnalyzeImage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http

    client
      .get(url, response => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${url}`))
          return
        }

        const chunks = []
        response.on('data', chunk => chunks.push(chunk))
        response.on('end', async () => {
          try {
            const buffer = Buffer.concat(chunks)
            const metadata = await sharp(buffer).metadata()
            resolve(metadata)
          } catch (error) {
            reject(error)
          }
        })
      })
      .on('error', reject)
  })
}

/**
 * 掃描圖片目錄並獲取所有圖片的尺寸資訊
 * 目前未被使用，保留供未來使用
 */
// async function scanImages() {
//   console.log('🔍 開始掃描圖片...')
//   // ... implementation ...
// }

/**
 * 從 portfolioData.js 中提取所有圖片 URL 並分析
 */
async function analyzePortfolioImages() {
  console.log('🔍 分析作品集中的圖片...')

  const portfolioDataPath = path.join(__dirname, '../data/portfolioData.js')
  // 使用動態 import 來載入 portfolio 資料
  const portfolioModule = await import('../data/portfolioData.js')
  const portfolio = portfolioModule.portfolio
  const imageData = {}

  // 收集所有唯一的圖片 URL
  const imageUrls = new Set()
  portfolio.forEach(work => {
    if (work.image) imageUrls.add(work.image)
    if (work.mainImage) imageUrls.add(work.mainImage)
  })

  console.log(`📁 找到 ${imageUrls.size} 個唯一圖片 URL`)

  let processedCount = 0
  for (const url of imageUrls) {
    try {
      console.log(`⏳ 正在分析: ${url}`)
      const metadata = await downloadAndAnalyzeImage(url)

      if (metadata.width && metadata.height) {
        const aspectRatio = metadata.width / metadata.height
        const fileName = url.split('/').pop()

        imageData[fileName] = {
          width: metadata.width,
          height: metadata.height,
          aspectRatio: Math.round(aspectRatio * 100) / 100,
          format: metadata.format,
          url: url,
        }

        processedCount++
        console.log(
          `✅ ${fileName}: ${metadata.width}x${metadata.height} (${aspectRatio.toFixed(2)})`
        )
      } else {
        console.warn(`⚠️  無法獲取 ${url} 的尺寸資訊`)
      }

      // 添加延遲避免過於頻繁的請求
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`❌ 處理 ${url} 時發生錯誤:`, error.message)
    }
  }

  console.log(`\n📊 處理完成: ${processedCount}/${imageUrls.size} 個檔案`)
  return { imageData, portfolio }
}

/**
 * 更新 portfolioData.js 檔案，添加圖片尺寸資訊
 */
async function updatePortfolioDataWithDimensions(portfolio, imageData) {
  console.log('\n📝 更新 portfolioData.js...')

  const portfolioDataPath = path.join(__dirname, '../data/portfolioData.js')

  // 更新每個作品項目的圖片資訊
  let updatedCount = 0
  portfolio.forEach(work => {
    if (work.image) {
      // 從 URL 中提取檔案名
      const fileName = work.image.split('/').pop()

      if (imageData[fileName]) {
        work.imageDimensions = imageData[fileName]
        updatedCount++
      } else {
        console.warn(`⚠️  找不到 ${fileName} 的尺寸資訊`)
      }
    }
  })

  // 重新生成檔案內容
  const portfolioJson = JSON.stringify(portfolio, null, 2)
  const newContent = `const w = file => \`https://r2bucket.homershie.com/assets/imgs/works/\${file}\`

export const portfolio = ${portfolioJson}`

  // 寫入更新後的檔案
  fs.writeFileSync(portfolioDataPath, newContent, 'utf8')

  console.log(`✅ 已更新 ${updatedCount} 個作品項目的圖片尺寸資訊`)
}

/**
 * 生成獨立的圖片尺寸 JSON 檔案
 */
async function generateImageDimensionsFile(imageData) {
  console.log('\n💾 生成圖片尺寸 JSON 檔案...')

  const jsonContent = JSON.stringify(imageData, null, 2)
  fs.writeFileSync(OUTPUT_FILE, jsonContent, 'utf8')

  console.log(`✅ 圖片尺寸資料已儲存至: ${OUTPUT_FILE}`)
}

/**
 * 主執行函數
 */
async function main() {
  try {
    console.log('🚀 開始生成圖片尺寸資料...\n')

    // 分析作品集中的圖片
    const { imageData, portfolio } = await analyzePortfolioImages()

    if (Object.keys(imageData).length === 0) {
      console.log('❌ 沒有找到任何圖片檔案')
      return
    }

    // 更新 portfolioData.js
    await updatePortfolioDataWithDimensions(portfolio, imageData)

    // 生成獨立的 JSON 檔案
    await generateImageDimensionsFile(imageData)

    console.log('\n🎉 圖片尺寸資料生成完成！')
    console.log(`📈 總共處理了 ${Object.keys(imageData).length} 個圖片檔案`)
  } catch (error) {
    console.error('❌ 執行過程中發生錯誤:', error.message)
    process.exit(1)
  }
}

// 執行主函數
main()
