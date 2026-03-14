import { ref, computed } from 'vue'
import { portfolio } from '@data/portfolioData.js'
import { useImageFormat } from './useImageFormat.js'

// 直接使用 portfolioData.js 的靜態資料
const portfolioData = ref(portfolio)
const loading = ref(false)
const error = ref(null)

/** 依語系翻譯作品 title、description、category、client */
function translateWork(work, t) {
  const id = String(work.id)
  const base = `portfolioData.works.${id}`

  const title = t(`${base}.title`)
  const desc = t(`${base}.description`)
  const hasTitle = title && !title.startsWith('portfolioData.')
  const hasDesc = desc && !desc.startsWith('portfolioData.')

  const translated = {
    ...work,
    title: hasTitle ? title : work.title,
    description: hasDesc ? desc : work.description,
    // category 保留原文（用於 URL/篩選），顯示時由元件用 t() 翻譯
    category: work.category || [],
  }
  const clientKey = `${base}.client`
  const clientTr = t(clientKey)
  if (work.client && clientTr && !clientTr.startsWith('portfolioData.')) {
    translated.client = clientTr
  }
  return translated
}

export function usePortfolio() {
  const { t } = useI18n()
  const { toWebP } = useImageFormat()

  // 將所有圖片路徑轉換為WebP格式，並套用 i18n 翻譯
  const convertPortfolioToWebP = data => {
    return data.map(item => {
      const translated = translateWork(item, t)
      const newItem = { ...translated }

      // 轉換主圖
      if (newItem.mainImage) {
        newItem.mainImage = toWebP(newItem.mainImage)
      }

      // 轉換畫廊圖片
      if (Array.isArray(newItem.gallery)) {
        newItem.gallery = newItem.gallery.map(img => (img ? toWebP(img) : null))
      }

      return newItem
    })
  }

  // 使用WebP格式的作品集（含 i18n 翻譯）
  const webpPortfolioData = computed(() => {
    return convertPortfolioToWebP(portfolioData.value)
  })

  // 根據 ID 取得單一作品
  const getWorkById = id => {
    const work = portfolioData.value.find(w => w.id === parseInt(id))
    if (!work) return null

    const translated = translateWork(work, t)
    const webpWork = { ...translated }
    if (webpWork.mainImage) {
      webpWork.mainImage = toWebP(webpWork.mainImage)
    }
    if (Array.isArray(webpWork.gallery)) {
      webpWork.gallery = webpWork.gallery.map(img => (img ? toWebP(img) : null))
    }

    return webpWork
  }

  // 根據類別篩選作品（category 篩選仍用中文 key，顯示時已翻譯）
  const getWorksByCategory = category => {
    let filtered = []

    if (!category || category === 'all') {
      filtered = portfolioData.value
    } else {
      // 支援多分類陣列
      filtered = portfolioData.value.filter(work =>
        Array.isArray(work.category) ? work.category.includes(category) : work.category === category
      )
    }

    // 轉換為WebP格式並翻譯
    return convertPortfolioToWebP(filtered)
  }

  // 取得所有類別（展平成單一陣列）
  const categories = computed(() => {
    const cats = portfolioData.value.flatMap(work => work.category || [])
    return ['all', ...Array.from(new Set(cats))]
  })

  // 取得相關作品（基於類別和日期）
  const getRelatedWorks = (currentWorkId, limit = 6) => {
    const currentWork = portfolioData.value.find(work => work.id === parseInt(currentWorkId))
    if (!currentWork) return []

    // 計算相關性分數
    const scoredWorks = portfolioData.value
      .filter(work => work.id !== parseInt(currentWorkId)) // 排除當前作品
      .map(work => {
        let score = 0

        // 相同類別加分
        if (Array.isArray(work.category) && Array.isArray(currentWork.category)) {
          const commonCategories = work.category.filter(cat => currentWork.category.includes(cat))
          score += commonCategories.length * 10
        }

        // 日期相近加分（同一年加5分，相差一年加3分）
        const currentYear = currentWork.date ? new Date(currentWork.date).getFullYear() : 0
        const workYear = work.date ? new Date(work.date).getFullYear() : 0
        if (currentYear && workYear) {
          const yearDiff = Math.abs(currentYear - workYear)
          if (yearDiff === 0) score += 5
          else if (yearDiff === 1) score += 3
          else if (yearDiff <= 2) score += 1
        }

        return { work, score }
      })
      .sort((a, b) => b.score - a.score) // 按分數排序
      .slice(0, limit)
      .map(item => item.work)

    // 轉換為WebP格式
    return convertPortfolioToWebP(scoredWorks)
  }

  return {
    portfolioData: webpPortfolioData,
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    getWorkById,
    getWorksByCategory,
    getRelatedWorks,
    categories,
  }
}
