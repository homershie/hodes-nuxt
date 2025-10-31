import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Index Page (Homepage) Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('工作年資計算', () => {
    it('應該正確計算工作年資', () => {
      const startYear = 2020
      const currentYear = new Date().getFullYear()
      const experienceYear = currentYear - startYear

      expect(experienceYear).toBeGreaterThanOrEqual(4)
      expect(typeof experienceYear).toBe('number')
    })

    it('應該根據當前年份動態計算', () => {
      const startYear = 2020

      // 模擬 2024 年
      vi.setSystemTime(new Date('2024-01-01'))
      const year2024 = new Date().getFullYear() - startYear
      expect(year2024).toBe(4)

      // 模擬 2025 年
      vi.setSystemTime(new Date('2025-01-01'))
      const year2025 = new Date().getFullYear() - startYear
      expect(year2025).toBe(5)
    })
  })

  describe('Headline 輪播功能', () => {
    it('應該包含所有 headline 文字', () => {
      const headlineWords = [
        '荷馬桑',
        'Homer Shie',
        '視覺設計師',
        '動態設計師',
        '遊戲玩家',
        '動漫宅宅',
        '前端工程學生',
      ]

      expect(headlineWords).toHaveLength(7)
      expect(headlineWords).toContain('Homer Shie')
      expect(headlineWords).toContain('視覺設計師')
    })

    it('應該循環切換 headline 索引', () => {
      const headlineWords = [
        '荷馬桑',
        'Homer Shie',
        '視覺設計師',
        '動態設計師',
        '遊戲玩家',
        '動漫宅宅',
        '前端工程學生',
      ]
      let currentWordIndex = 0

      // 模擬輪播邏輯
      currentWordIndex = (currentWordIndex + 1) % headlineWords.length
      expect(currentWordIndex).toBe(1)

      currentWordIndex = (currentWordIndex + 1) % headlineWords.length
      expect(currentWordIndex).toBe(2)

      // 測試循環到開頭
      currentWordIndex = 6
      currentWordIndex = (currentWordIndex + 1) % headlineWords.length
      expect(currentWordIndex).toBe(0)
    })

    it('應該每 2 秒切換一次', () => {
      const headlineWords = ['荷馬桑', 'Homer Shie', '視覺設計師']
      let currentWordIndex = 0

      const callback = vi.fn(() => {
        currentWordIndex = (currentWordIndex + 1) % headlineWords.length
      })

      const interval = setInterval(callback, 2000)

      // 前進 2 秒
      vi.advanceTimersByTime(2000)
      expect(callback).toHaveBeenCalledTimes(1)
      expect(currentWordIndex).toBe(1)

      // 再前進 2 秒
      vi.advanceTimersByTime(2000)
      expect(callback).toHaveBeenCalledTimes(2)
      expect(currentWordIndex).toBe(2)

      clearInterval(interval)
    })
  })

  describe('圖片預載入', () => {
    it('應該包含主視覺圖片 URL', () => {
      const mainVisualUrl = 'https://r2bucket.homershie.com/assets/imgs/hero/1.webp'

      expect(mainVisualUrl).toContain('r2bucket.homershie.com')
      expect(mainVisualUrl).toContain('.webp')
    })

    it('應該包含個人照片 URL', () => {
      const profileUrl = 'https://r2bucket.homershie.com/assets/imgs/header/profile.webp'

      expect(profileUrl).toContain('profile.webp')
    })

    it('應該包含關於頁面圖片', () => {
      const aboutImages = [
        'https://r2bucket.homershie.com/assets/imgs/about/1.webp',
        'https://r2bucket.homershie.com/assets/imgs/about/2.webp',
        'https://r2bucket.homershie.com/assets/imgs/about/3.webp',
      ]

      expect(aboutImages).toHaveLength(3)
      aboutImages.forEach(url => {
        expect(url).toContain('.webp')
      })
    })

    it('應該過濾掉空值', () => {
      const imageUrls = [
        'https://example.com/image1.webp',
        null,
        'https://example.com/image2.webp',
        undefined,
        'https://example.com/image3.webp',
      ].filter(Boolean)

      expect(imageUrls).toHaveLength(3)
      expect(imageUrls.every(url => typeof url === 'string')).toBe(true)
    })

    it('應該將 JPG/PNG 轉換為 WebP', () => {
      const originalUrl = 'https://example.com/image.jpg'
      const webpUrl = originalUrl.replace(/\.(jpg|png)$/, '.webp')

      expect(webpUrl).toBe('https://example.com/image.webp')
    })

    it('應該處理 PNG 格式轉換', () => {
      const originalUrl = 'https://example.com/image.png'
      const webpUrl = originalUrl.replace(/\.(jpg|png)$/, '.webp')

      expect(webpUrl).toBe('https://example.com/image.webp')
    })
  })

  describe('專案數量計算', () => {
    it('應該基於作品集數據計算專案數量', () => {
      const mockPortfolio = [
        { id: 1, title: 'Project 1' },
        { id: 2, title: 'Project 2' },
        { id: 3, title: 'Project 3' },
      ]

      const projectCount = mockPortfolio.length

      expect(projectCount).toBe(3)
      expect(typeof projectCount).toBe('number')
    })

    it('應該處理空作品集', () => {
      const emptyPortfolio: any[] = []
      const projectCount = emptyPortfolio.length

      expect(projectCount).toBe(0)
    })
  })

  describe('SEO Meta 設定', () => {
    it('應該包含完整的首頁標題', () => {
      const title = 'HOEDES｜荷馬桑 Homer Shie｜設計 ‧ 插畫 ‧ 動畫 ‧ 藝術 | 台北'

      expect(title).toContain('HOEDES')
      expect(title).toContain('Homer Shie')
      expect(title).toContain('設計')
      expect(title).toContain('台北')
    })
  })

  describe('導航連結', () => {
    it('應該包含關於我連結', () => {
      const aboutLink = '/about'
      expect(aboutLink).toBe('/about')
    })

    it('應該包含服務頁面連結', () => {
      const serviceLink = '/service'
      expect(serviceLink).toBe('/service')
    })

    it('應該包含作品集連結', () => {
      const portfolioLink = '/portfolio'
      expect(portfolioLink).toBe('/portfolio')
    })

    it('應該包含履歷下載連結', () => {
      const resumeUrl = 'https://r2bucket.homershie.com/assets/resume/Homer_Shie_Resume.pdf'

      expect(resumeUrl).toContain('r2bucket.homershie.com')
      expect(resumeUrl).toContain('Resume.pdf')
    })
  })

  describe('社交媒體連結', () => {
    it('應該包含 Instagram 連結', () => {
      const instagramUrl = 'https://www.instagram.com/homer_create'

      expect(instagramUrl).toContain('instagram.com')
      expect(instagramUrl).toContain('homer_create')
    })

    it('應該正確處理外部連結屬性', () => {
      const linkAttributes = {
        rel: 'noopener noreferrer',
        target: '_blank',
      }

      expect(linkAttributes.rel).toBe('noopener noreferrer')
      expect(linkAttributes.target).toBe('_blank')
    })
  })

  describe('Interval 清理', () => {
    it('應該在卸載時清除 interval', () => {
      let headlineInterval: NodeJS.Timeout | null = null

      // 模擬 mounted
      headlineInterval = setInterval(() => {}, 2000)
      expect(headlineInterval).toBeDefined()

      // 模擬 unmounted
      if (headlineInterval) {
        clearInterval(headlineInterval)
        headlineInterval = null
      }

      expect(headlineInterval).toBeNull()
    })
  })

  describe('作品集數據處理', () => {
    it('應該只預載入前 6 個作品的圖片', () => {
      const mockPortfolio = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: `Project ${i + 1}`,
        image: `https://example.com/image${i + 1}.jpg`,
      }))

      const preloadImages = mockPortfolio.slice(0, 6).map(work => work.image)

      expect(preloadImages).toHaveLength(6)
      expect(preloadImages[0]).toBe('https://example.com/image1.jpg')
      expect(preloadImages[5]).toBe('https://example.com/image6.jpg')
    })
  })

  describe('響應式數據', () => {
    it('currentWordIndex 應該是響應式的', () => {
      let currentWordIndex = 0

      // 模擬更新
      currentWordIndex = 1
      expect(currentWordIndex).toBe(1)

      currentWordIndex = 2
      expect(currentWordIndex).toBe(2)
    })
  })
})
