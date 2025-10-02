import { ref } from 'vue'

const DB_NAME = 'ImageCache'
const DB_VERSION = 1
const STORE_NAME = 'images'
const CACHE_DURATION = 365 * 24 * 60 * 60 * 1000 // 一年的毫秒數
const MAX_CACHE_SIZE = 50 * 1024 * 1024 // 50MB 快取限制
const MAX_RETRY_COUNT = 3 // 最大重試次數
const RETRY_DELAY = 1000 // 重試延遲（毫秒）

export function useImageCache() {
  const isLoading = ref(false)
  const error = ref(null)
  const cacheSize = ref(0)

  // 處理圖片路徑
  const normalizeImagePath = url => {
    // 移除開頭的 /src
    url = url.replace(/^\/src/, '')
    // 確保路徑以 /assets 開頭
    if (!url.startsWith('/assets')) {
      url = `/assets${url}`
    }
    return url
  }

  // 重試機制
  const retryOperation = async (operation, retryCount = 0) => {
    try {
      return await operation()
    } catch (err) {
      if (retryCount < MAX_RETRY_COUNT) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
        return retryOperation(operation, retryCount + 1)
      }
      throw err
    }
  }

  // 初始化資料庫
  const initDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = event => {
        const db = event.target.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'url' })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('size', 'size', { unique: false })
        }
      }
    })
  }

  // 獲取快取大小
  const getCacheSize = async () => {
    try {
      const db = await initDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.getAll()

        request.onsuccess = () => {
          const size = request.result.reduce((total, item) => total + (item.size || 0), 0)
          cacheSize.value = size
          resolve(size)
        }
        request.onerror = () => reject(request.error)
      })
    } catch {
      return 0
    }
  }

  // 清理過期快取
  const cleanExpiredCache = async () => {
    try {
      const db = await initDB()
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const index = store.index('timestamp')
      const expiredTime = Date.now() - CACHE_DURATION

      const range = IDBKeyRange.upperBound(expiredTime)
      const request = index.openCursor(range)

      request.onsuccess = event => {
        const cursor = event.target.result
        if (cursor) {
          store.delete(cursor.primaryKey)
          cursor.continue()
        }
      }
    } catch {
      // 忽略清理錯誤
    }
  }

  // 清理超出大小限制的快取
  const cleanOversizedCache = async () => {
    try {
      const currentSize = await getCacheSize()
      if (currentSize <= MAX_CACHE_SIZE) return

      const db = await initDB()
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const index = store.index('timestamp')
      const request = index.openCursor()

      request.onsuccess = event => {
        const cursor = event.target.result
        if (cursor && cacheSize.value > MAX_CACHE_SIZE) {
          store.delete(cursor.primaryKey)
          cacheSize.value -= cursor.value.size
          cursor.continue()
        }
      }
    } catch {
      // 忽略清理錯誤
    }
  }

  // 從快取中獲取圖片
  const getImageFromCache = async url => {
    const normalizedUrl = normalizeImagePath(url)
    try {
      const db = await initDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.get(normalizedUrl)

        request.onsuccess = () => {
          const result = request.result
          if (result && Date.now() - result.timestamp < CACHE_DURATION) {
            resolve(result.data)
          } else {
            resolve(null)
          }
        }
        request.onerror = () => reject(request.error)
      })
    } catch {
      return null
    }
  }

  // 將圖片存入快取
  const saveImageToCache = async (url, blob) => {
    const normalizedUrl = normalizeImagePath(url)
    try {
      // 檢查快取大小
      await cleanOversizedCache()

      const db = await initDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.put({
          url: normalizedUrl,
          data: blob,
          timestamp: Date.now(),
          size: blob.size,
        })

        request.onsuccess = () => {
          cacheSize.value += blob.size
          resolve()
        }
        request.onerror = () => reject(request.error)
      })
    } catch {
      // 忽略儲存錯誤
    }
  }

  // 預載入圖片
  const preloadImages = async urls => {
    const promises = urls.map(async url => {
      try {
        // 檢查快取
        const cachedImage = await getImageFromCache(url)
        if (cachedImage) {
          return URL.createObjectURL(cachedImage)
        }

        // 從網路載入
        const response = await retryOperation(async () => {
          const res = await fetch(url)
          if (!res.ok) throw new Error(`Failed to load image: ${res.status}`)
          return res
        })

        const blob = await response.blob()
        await saveImageToCache(url, blob)
        return URL.createObjectURL(blob)
      } catch (err) {
        // 預載入圖片失敗，靜默處理
        return null
      }
    })

    return Promise.all(promises)
  }

  // 載入單張圖片
  const loadImage = async url => {
    try {
      isLoading.value = true
      error.value = null

      // 嘗試從快取中獲取
      const cachedImage = await getImageFromCache(url)
      if (cachedImage) {
        isLoading.value = false
        return URL.createObjectURL(cachedImage)
      }

      // 從網路載入
      const response = await retryOperation(async () => {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Failed to load image: ${res.status}`)
        return res
      })

      const blob = await response.blob()
      await saveImageToCache(url, blob)
      isLoading.value = false
      return URL.createObjectURL(blob)
    } catch (err) {
      error.value = err
      isLoading.value = false
      throw err
    }
  }

  // 定期清理過期快取
  let cleanupInterval = null
  const startCacheCleanup = () => {
    if (cleanupInterval) return
    cleanupInterval = setInterval(
      async () => {
        await cleanExpiredCache()
        await cleanOversizedCache()
      },
      24 * 60 * 60 * 1000
    )
  }

  const stopCacheCleanup = () => {
    if (cleanupInterval) {
      clearInterval(cleanupInterval)
      cleanupInterval = null
    }
  }

  return {
    isLoading,
    error,
    cacheSize,
    loadImage,
    preloadImages,
    startCacheCleanup,
    stopCacheCleanup,
    getCacheSize,
  }
}
