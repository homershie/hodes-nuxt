import { ref, computed } from 'vue'
import { portfolio } from '@/data/portfolioData.js'
import { useImageFormat } from './useImageFormat.js'

// 直接使用 portfolioData.js 的靜態資料
const portfolioData = ref(portfolio)
const loading = ref(false)
const error = ref(null)

export function usePortfolio() {
  const { toWebP } = useImageFormat()

  // 將所有圖片路徑轉換為WebP格式
  const convertPortfolioToWebP = data => {
    return data.map(item => {
      const newItem = { ...item }

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

  // 使用WebP格式的作品集
  const webpPortfolioData = computed(() => {
    return convertPortfolioToWebP(portfolioData.value)
  })

  // 根據 ID 取得單一作品
  const getWorkById = id => {
    const work = portfolioData.value.find(work => work.id === parseInt(id))
    if (!work) return null

    // 轉換為WebP格式
    const webpWork = { ...work }
    if (webpWork.mainImage) {
      webpWork.mainImage = toWebP(webpWork.mainImage)
    }
    if (Array.isArray(webpWork.gallery)) {
      webpWork.gallery = webpWork.gallery.map(img => (img ? toWebP(img) : null))
    }

    return webpWork
  }

  // 根據類別篩選作品
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

    // 轉換為WebP格式
    return convertPortfolioToWebP(filtered)
  }

  // 取得所有類別（展平成單一陣列）
  const categories = computed(() => {
    const cats = portfolioData.value.flatMap(work => work.category || [])
    return ['all', ...Array.from(new Set(cats))]
  })

  return {
    portfolioData: webpPortfolioData,
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    getWorkById,
    getWorksByCategory,
    categories,
  }
}
