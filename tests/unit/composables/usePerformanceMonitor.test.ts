import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePerformanceMonitor } from '@/composables/usePerformanceMonitor'

describe('usePerformanceMonitor', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('記錄起訖並產生指標與平均時間', () => {
    vi.spyOn(performance, 'now').mockReturnValueOnce(100).mockReturnValueOnce(250)
    const { recordImageLoadStart, recordImageLoadComplete, getMetrics, getAverageLoadTime, clearMetrics } = usePerformanceMonitor()

    recordImageLoadStart()
    recordImageLoadComplete()

    const metrics = getMetrics()
    expect(metrics.length).toBe(1)
    expect(metrics[0].type).toBe('image-load')
    expect(metrics[0].duration).toBe(150)
    expect(getAverageLoadTime()).toBe(150)

    clearMetrics()
    expect(getMetrics().length).toBe(0)
  })
})


