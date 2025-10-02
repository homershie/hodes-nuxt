/**
 * 用於處理圖片格式轉換的composable
 * 將圖片路徑轉換為WebP格式
 */
export function useImageFormat() {
  /**
   * 處理圖片路徑
   * @param {string} path - 原始路徑
   * @returns {string} - 處理後的路徑
   */
  const processPath = path => {
    if (!path) return ''

    // 移除開頭的斜線，避免重複
    path = path.replace(/^\/+/, '')

    // 如果是完整 URL，直接返回
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }

    // 確保路徑以 / 開頭
    return path.startsWith('/') ? path : `/${path}`
  }

  /**
   * 將圖片路徑轉換為WebP格式
   * @param {string} imagePath - 原始圖片路徑 (jpg/png)
   * @returns {string} - WebP格式的圖片路徑
   */
  const toWebP = imagePath => {
    if (!imagePath) return ''

    // 處理路徑
    imagePath = processPath(imagePath)

    // 如果已經是WebP格式，直接返回
    if (imagePath.toLowerCase().endsWith('.webp')) {
      return imagePath
    }

    // 替換副檔名為.webp
    return imagePath.replace(/\.(jpe?g|png)$/i, '.webp')
  }

  /**
   * 創建圖片標籤，支援WebP與後備圖片
   * @param {string} imagePath - 原始圖片路徑
   * @param {string} alt - 圖片替代文字
   * @param {string} className - CSS類別
   * @returns {object} - 包含src和srcset的物件
   */
  const getImageAttributes = (imagePath, alt = '', className = '') => {
    if (!imagePath) return { src: '', alt, class: className }

    // 處理路徑
    imagePath = processPath(imagePath)
    const webpPath = toWebP(imagePath)

    return {
      src: webpPath,
      alt,
      class: className,
      onerror() {
        // 如果 WebP 載入失敗，嘗試載入原始圖片
        if (this.src === webpPath) {
          this.src = imagePath
        }
      },
    }
  }

  /**
   * 檢查圖片是否存在
   * @param {string} url - 圖片URL
   * @returns {Promise<boolean>} - 圖片是否存在
   */
  const checkImageExists = async url => {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }

  /**
   * 獲取最佳圖片路徑
   * @param {string} imagePath - 原始圖片路徑
   * @returns {Promise<string>} - 最佳圖片路徑
   */
  const getBestImagePath = async imagePath => {
    if (!imagePath) return ''

    const webpPath = toWebP(imagePath)
    const webpExists = await checkImageExists(webpPath)

    return webpExists ? webpPath : imagePath
  }

  return {
    toWebP,
    getImageAttributes,
    checkImageExists,
    getBestImagePath,
    processPath,
  }
}
