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
            if (entry.isIntersecting) {
              isVisible.value = true
              // 只在圖片已載入完成後才 disconnect observer
              // 這樣如果圖片載入失敗，下次進入視窗時仍可重試
              if (isLoaded.value && observer) {
                observer.disconnect()
              }
            }
          })
        },
        {
          rootMargin: '200px', // 增加預載入距離，提前 200px 開始載入
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
