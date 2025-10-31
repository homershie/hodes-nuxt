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
      img.src = src
      img.onload = () => {
        isLoaded.value = true
        img.removeAttribute('data-src')
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
              // Disconnect observer after first visibility
              if (observer) {
                observer.disconnect()
              }
            }
          })
        },
        {
          rootMargin: '50px', // Start loading 50px before entering viewport
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
