import { ref } from 'vue'

/**
 * Performance monitoring composable
 * Tracks image load times and other performance metrics
 */
export function usePerformanceMonitor() {
  const loadStartTime = ref(null)
  const loadDuration = ref(null)
  const metrics = ref([])

  /**
   * Record the start time of an image load
   */
  const recordImageLoadStart = () => {
    loadStartTime.value = performance.now()
  }

  /**
   * Record the completion time of an image load
   */
  const recordImageLoadComplete = () => {
    if (loadStartTime.value) {
      const endTime = performance.now()
      loadDuration.value = endTime - loadStartTime.value

      // Store metric for analysis
      metrics.value.push({
        type: 'image-load',
        duration: loadDuration.value,
        timestamp: endTime,
      })

      // Log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log(`Image loaded in ${loadDuration.value.toFixed(2)}ms`)
      }

      // Reset for next measurement
      loadStartTime.value = null
    }
  }

  /**
   * Get performance metrics
   */
  const getMetrics = () => {
    return metrics.value
  }

  /**
   * Clear all metrics
   */
  const clearMetrics = () => {
    metrics.value = []
    loadStartTime.value = null
    loadDuration.value = null
  }

  /**
   * Get average load time
   */
  const getAverageLoadTime = () => {
    if (metrics.value.length === 0) return 0

    const total = metrics.value.reduce((sum, metric) => sum + metric.duration, 0)
    return total / metrics.value.length
  }

  return {
    loadStartTime,
    loadDuration,
    recordImageLoadStart,
    recordImageLoadComplete,
    getMetrics,
    clearMetrics,
    getAverageLoadTime,
  }
}
