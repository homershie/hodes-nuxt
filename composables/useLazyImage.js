import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * Lazy loading composable for images
 * Observes when an image element becomes visible and triggers loading
 */
export function useLazyImage() {
  const imageRef = ref(null)
  const isLoaded = ref(false)
  const isVisible = ref(false)
  let observer = null

  const loadImage = () => {
    if (!imageRef.value || isLoaded.value) return

    const img = imageRef.value
    const src = img.dataset.src || img.getAttribute('data-src')

    if (src) {
      // 如果圖片已經有 src（已經開始載入），則不需要重新設定
      if (img.src && img.src !== '') return
      
      img.src = src
      img.onload = () => {
        isLoaded.value = true
        img.removeAttribute('data-src')
        // 圖片載入完成後才 disconnect observer
        if (observer) {
          observer.disconnect()
        }
      }
      img.onerror = () => {
        // 載入失敗時保留 observer，以便重試
        console.warn('圖片載入失敗:', src)
      }
    }
  }

  onMounted(() => {
    if (!imageRef.value) return

    // Check if IntersectionObserver is available
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !isLoaded.value) {
              isVisible.value = true
              // 圖片進入視窗且尚未載入時才觸發
              loadImage()
              // 立即 disconnect，避免重複觸發
              if (observer) {
                observer.disconnect()
              }
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
    }
  })

  return {
    imageRef,
    isLoaded,
    isVisible,
    loadImage,
  }
}
