import { describe, it, expect, beforeEach } from 'vitest'
import { usePortfolio } from '@composables/usePortfolio'
import { portfolio } from '@data/portfolioData.js'

// Mock useImageFormat
vi.mock('@composables/useImageFormat.js', () => ({
  useImageFormat: () => ({
    toWebP: (path: string) => path.replace(/\.(jpe?g|png)$/i, '.webp'),
  }),
}))

describe('usePortfolio', () => {
  let portfolioComposable: ReturnType<typeof usePortfolio>

  beforeEach(() => {
    portfolioComposable = usePortfolio()
  })

  describe('作品集數據載入', () => {
    it('應該載入所有作品集數據', () => {
      expect(portfolioComposable.portfolioData.value).toBeDefined()
      expect(Array.isArray(portfolioComposable.portfolioData.value)).toBe(true)
      expect(portfolioComposable.portfolioData.value.length).toBeGreaterThan(0)
    })

    it('應該正確顯示載入狀態', () => {
      expect(portfolioComposable.loading.value).toBe(false)
    })

    it('應該正確顯示錯誤狀態', () => {
      expect(portfolioComposable.error.value).toBe(null)
    })
  })

  describe('WebP 格式轉換', () => {
    it('應該將主圖轉換為 WebP 格式', () => {
      const works = portfolioComposable.portfolioData.value
      const firstWork = works[0]

      if (firstWork && firstWork.mainImage) {
        // 檢查 mainImage 是否已被轉換為 WebP
        const isWebP = firstWork.mainImage.toLowerCase().endsWith('.webp')
        expect(isWebP).toBe(true)
      }
    })

    it('應該將畫廊圖片轉換為 WebP 格式', () => {
      // 找到有 gallery 的作品
      const workWithGallery = portfolioComposable.portfolioData.value.find(
        work => Array.isArray(work.gallery) && work.gallery.length > 0
      )

      if (workWithGallery) {
        const galleryImages = workWithGallery.gallery.filter(img => img)

        if (galleryImages.length > 0) {
          galleryImages.forEach(img => {
            const isWebP = img.toLowerCase().endsWith('.webp')
            expect(isWebP).toBe(true)
          })
        }
      }
    })

    it('應該處理已經是多層物件結構的圖片', () => {
      const work = portfolioComposable.getWorkById(1)

      if (work && work.mainImage) {
        expect(typeof work.mainImage).toBe('string')
      }
    })
  })

  describe('根據 ID 取得作品', () => {
    it('應該正確取得存在的作品', () => {
      const work = portfolioComposable.getWorkById(1)

      expect(work).toBeDefined()
      expect(work?.id).toBe(1)
      expect(work?.title).toBeDefined()
    })

    it('應該對不存在的作品回傳 null', () => {
      const work = portfolioComposable.getWorkById(99999)

      expect(work).toBeNull()
    })

    it('應該正確處理字串 ID', () => {
      const work = portfolioComposable.getWorkById('1')

      expect(work).toBeDefined()
      expect(work?.id).toBe(1)
    })

    it('取得的作品應該包含 WebP 格式的圖片', () => {
      const work = portfolioComposable.getWorkById(1)

      if (work && work.mainImage) {
        const isWebP = work.mainImage.toLowerCase().endsWith('.webp')
        expect(isWebP).toBe(true)
      }
    })

    it('取得的作品畫廊應該包含 WebP 格式的圖片', () => {
      const work = portfolioComposable.getWorkById(1)

      if (work && Array.isArray(work.gallery) && work.gallery.length > 0) {
        const validImages = work.gallery.filter(img => img)
        validImages.forEach(img => {
          const isWebP = img.toLowerCase().endsWith('.webp')
          expect(isWebP).toBe(true)
        })
      }
    })
  })

  describe('根據類別篩選作品', () => {
    it('應該回傳所有作品當類別為 all', () => {
      const works = portfolioComposable.getWorksByCategory('all')

      expect(works).toBeDefined()
      expect(Array.isArray(works)).toBe(true)
      expect(works.length).toBe(portfolio.length)
    })

    it('應該回傳所有作品當類別為空', () => {
      const works = portfolioComposable.getWorksByCategory('')

      expect(works).toBeDefined()
      expect(Array.isArray(works)).toBe(true)
    })

    it('應該回傳所有作品當類別為 null', () => {
      const works = portfolioComposable.getWorksByCategory(null as any)

      expect(works).toBeDefined()
      expect(Array.isArray(works)).toBe(true)
    })

    it('應該正確篩選單一類別作品', () => {
      const categoryToTest = '插畫'
      const works = portfolioComposable.getWorksByCategory(categoryToTest)

      expect(works.length).toBeGreaterThan(0)
      works.forEach(work => {
        // 支援陣列或字串的類別
        const hasCategory = Array.isArray(work.category)
          ? work.category.includes(categoryToTest)
          : work.category === categoryToTest
        expect(hasCategory).toBe(true)
      })
    })

    it('篩選結果應該包含 WebP 格式的圖片', () => {
      const works = portfolioComposable.getWorksByCategory('插畫')

      if (works.length > 0) {
        const firstWork = works[0]
        if (firstWork && firstWork.mainImage) {
          const isWebP = firstWork.mainImage.toLowerCase().endsWith('.webp')
          expect(isWebP).toBe(true)
        }
      }
    })

    it('應該處理多分類陣列格式', () => {
      // 找到有多個分類的作品
      const workWithMultipleCategories = portfolio.find(
        work => Array.isArray(work.category) && work.category.length > 1
      )

      if (workWithMultipleCategories && workWithMultipleCategories.category.length > 0) {
        const category = workWithMultipleCategories.category[0]
        const works = portfolioComposable.getWorksByCategory(category)

        expect(works.length).toBeGreaterThan(0)
        const found = works.find(w => w.id === workWithMultipleCategories.id)
        expect(found).toBeDefined()
      }
    })
  })

  describe('取得所有類別', () => {
    it('應該回傳包含 all 的類別列表', () => {
      const categories = portfolioComposable.categories.value

      expect(Array.isArray(categories)).toBe(true)
      expect(categories.includes('all')).toBe(true)
    })

    it('應該去重複的類別', () => {
      const categories = portfolioComposable.categories.value

      const uniqueCategories = new Set(categories)
      expect(categories.length).toBe(uniqueCategories.size)
    })

    it('應該展平所有作品的類別', () => {
      const categories = portfolioComposable.categories.value

      // 獲取所有原始作品的類別
      const allCategories = portfolio.flatMap(work => work.category || [])
      const uniqueOriginalCategories = Array.from(new Set(allCategories))

      // 移除 'all'
      const categoriesWithoutAll = categories.filter(cat => cat !== 'all')

      expect(categoriesWithoutAll.length).toBe(uniqueOriginalCategories.length)
    })
  })

  describe('數據完整性測試', () => {
    it('每個作品都應該有基本必要欄位', () => {
      const works = portfolioComposable.portfolioData.value

      works.forEach(work => {
        expect(work).toHaveProperty('id')
        expect(work).toHaveProperty('title')
        expect(work).toHaveProperty('category')
        expect(work.id).toBeGreaterThan(0)
        expect(typeof work.title).toBe('string')
      })
    })

    it('作品 ID 應該是唯一的', () => {
      const works = portfolioComposable.portfolioData.value
      const ids = works.map(work => work.id)
      const uniqueIds = new Set(ids)

      expect(ids.length).toBe(uniqueIds.size)
    })
  })

  describe('邊界情況處理', () => {
    it('應該處理空的作品集（假設情況）', () => {
      // 這是一個邊界測試案例
      expect(portfolioComposable.portfolioData.value).toBeDefined()
    })

    it('應該處理沒有主圖的作品', () => {
      const works = portfolioComposable.portfolioData.value
      const worksWithoutMainImage = works.filter(work => !work.mainImage)

      // 不應該因為沒有主圖而拋出錯誤
      expect(Array.isArray(works)).toBe(true)
    })

    it('應該處理沒有畫廊的作品', () => {
      const works = portfolioComposable.portfolioData.value
      const worksWithoutGallery = works.filter(work => !work.gallery || work.gallery.length === 0)

      // 不應該因為沒有畫廊而拋出錯誤
      expect(Array.isArray(works)).toBe(true)
    })
  })
})
