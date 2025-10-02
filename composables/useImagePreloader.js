import { ref } from 'vue'

export function useImagePreloader() {
  const loadingProgress = ref(0)
  const isPreloading = ref(false)

  /**
   * 重置進度條
   */
  const resetProgress = () => {
    loadingProgress.value = 0
    isPreloading.value = false
  }

  /**
   * 預載入圖片
   * @param {string[]} urls - 要預載入的圖片URL陣列
   * @param {number} batchSize - 每批次處理的圖片數量
   * @returns {Promise<string[]>} - 預載入完成的圖片URL陣列
   */
  const preloadImages = async (urls = [], batchSize = 6) => {
    if (!Array.isArray(urls) || urls.length === 0) {
      resetProgress()
      return []
    }

    // 重置狀態
    resetProgress()
    isPreloading.value = true

    const totalImages = urls.length
    const batches = Math.ceil(totalImages / batchSize)
    const loadedUrls = []
    let loadedCount = 0

    try {
      for (let i = 0; i < batches; i++) {
        const start = i * batchSize
        const end = Math.min(start + batchSize, totalImages)
        const batchUrls = urls.slice(start, end)

        const batchPromises = batchUrls.map(src => {
          return new Promise(resolve => {
            const img = new Image()

            const handleLoad = () => {
              loadedCount++
              loadedUrls.push(src)
              loadingProgress.value = Math.round((loadedCount / totalImages) * 100)
              cleanup()
              resolve()
            }

            const handleError = () => {
              loadedCount++
              loadedUrls.push(src)
              loadingProgress.value = Math.round((loadedCount / totalImages) * 100)
              cleanup()
              resolve()
            }

            const cleanup = () => {
              img.removeEventListener('load', handleLoad)
              img.removeEventListener('error', handleError)
            }

            img.addEventListener('load', handleLoad)
            img.addEventListener('error', handleError)
            img.src = src
          })
        })

        await Promise.all(batchPromises)
      }
    } catch (error) {
      // 靜默處理錯誤
    } finally {
      isPreloading.value = false
      // 確保進度條在完成時是 100%
      if (loadedCount === totalImages) {
        loadingProgress.value = 100
      }
    }

    return loadedUrls
  }

  /**
   * 預載入特定元素的圖片
   * @param {string} selector - 要預載入的圖片選擇器
   * @param {number} batchSize - 每批次處理的圖片數量
   * @returns {Promise<string[]>} - 預載入完成的圖片URL陣列
   */
  const preloadElementImages = async (selector, batchSize = 6) => {
    const elements = document.querySelectorAll(selector)
    const urls = Array.from(elements)
      .map(el => el.src || el.getAttribute('src'))
      .filter(Boolean)
    return preloadImages(urls, batchSize)
  }

  return {
    preloadImages,
    preloadElementImages,
    loadingProgress,
    isPreloading,
    resetProgress,
  }
}
