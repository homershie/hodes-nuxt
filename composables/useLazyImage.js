import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * Lazy loading composable for images
 * Observes when an image element becomes visible and triggers loading
 *
 * 修正重點：
 * 1. 只在圖片載入完成後才 disconnect observer
 * 2. 避免重複設定 src
 * 3. 確保已載入的圖片不會因為重新渲染而消失
 */
export function useLazyImage() {
  const imageRef = ref(null)
  const isLoaded = ref(false)
  const isVisible = ref(false)
  let observer = null
  let hasStartedLoading = false // 追蹤是否已開始載入

  const loadImage = () => {
    if (!imageRef.value || hasStartedLoading) return

    const img = imageRef.value
    const src = img.dataset.src || img.getAttribute('data-src')

    if (src) {
      // 檢查圖片是否已經有 src（避免重複設定）
      const currentSrc = img.getAttribute('src')
      if (currentSrc && currentSrc === src) {
        // 圖片已經開始載入，只需要檢查是否已完成
        if (img.complete) {
          isLoaded.value = true
          hasStartedLoading = true
          if (observer) {
            observer.disconnect()
            observer = null
          }
        }
        return
      }

      // 標記已開始載入，避免重複觸發
      hasStartedLoading = true

      img.src = src
      img.onload = () => {
        isLoaded.value = true
        img.removeAttribute('data-src')
        // 圖片載入完成後才 disconnect observer
        if (observer) {
          observer.disconnect()
          observer = null
        }
      }
      img.onerror = () => {
        // 載入失敗時重置狀態，允許重試
        hasStartedLoading = false
        console.warn('圖片載入失敗:', src)
      }
    }
  }

  onMounted(() => {
    if (!imageRef.value) return

    // 檢查圖片是否已經載入完成（例如從快取載入）
    const img = imageRef.value
    if (img.complete && img.src && img.src !== '') {
      isLoaded.value = true
      hasStartedLoading = true
      return
    }

    // Check if IntersectionObserver is available
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            // 只要圖片進入視窗就標記為可見
            isVisible.value = entry.isIntersecting

            // 只有在圖片進入視窗且尚未開始載入時才觸發
            if (entry.isIntersecting && !hasStartedLoading) {
              loadImage()
            }
          })
        },
        {
          rootMargin: '50px', // 提前 50px 開始載入
          threshold: 0.01,
        }
      )

      observer.observe(imageRef.value)
    } else {
      // Fallback: load immediately if IntersectionObserver is not supported
      isVisible.value = true
      loadImage()
    }
  })

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return {
    imageRef,
    isLoaded,
    isVisible,
    loadImage,
  }
}
