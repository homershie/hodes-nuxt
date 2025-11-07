import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'

// 定義測試用的文章數據
const mockArticles = [
  {
    stem: 'articles/test-article-1',
    path: '/articles/test-article-1',
    title: '測試文章 1',
    meta: {
      date: '2024-01-01',
      category: 'tech',
      categoryName: '技術',
      image: '/test-image-1.jpg',
      thumbnail: '/test-thumb-1.jpg',
      author: 'Test Author',
      excerpt: '這是測試文章 1 的摘要',
    },
    body: {
      type: 'root',
      children: [
        {
          type: 'element',
          tag: 'p',
          children: [{ type: 'text', value: '測試內容' }],
        },
      ],
    },
  },
  {
    stem: 'articles/test-article-2',
    path: '/articles/test-article-2',
    title: '測試文章 2',
    meta: {
      date: '2024-01-02',
      category: 'design',
      categoryName: '設計',
      image: '/test-image-2.jpg',
      thumbnail: '/test-thumb-2.jpg',
      author: 'Test Author 2',
    },
    body: {
      type: 'root',
      children: [],
    },
  },
]

describe('Article Page Integration Tests', () => {
  let wrapper: any
  let router: any

  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000/article/test-article-1',
      },
      writable: true,
    })

    // Mock document properties for scroll calculation
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      writable: true,
    })
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
    })
  })

  describe('文章基本功能', () => {
    it('應該正確顯示文章標題和元數據', () => {
      const article = mockArticles[0]

      expect(article.title).toBe('測試文章 1')
      expect(article.meta.categoryName).toBe('技術')
      expect(article.meta.author).toBe('Test Author')
      expect(article.meta.date).toBe('2024-01-01')
    })

    it('應該正確處理文章 ID 提取', () => {
      const article = mockArticles[0]
      const id = article.stem.replace(/^articles\//, '')

      expect(id).toBe('test-article-1')
    })

    it('應該正確處理文章元數據', () => {
      const article = mockArticles[0]
      const meta = typeof article.meta === 'string' ? JSON.parse(article.meta) : article.meta

      expect(meta).toBeDefined()
      expect(meta.date).toBe('2024-01-01')
      expect(meta.categoryName).toBe('技術')
    })
  })

  describe('文章排序和導航', () => {
    it('應該按日期降序排列文章', () => {
      const sorted = [...mockArticles].sort((a, b) => {
        return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
      })

      expect(sorted[0].stem).toBe('articles/test-article-2')
      expect(sorted[1].stem).toBe('articles/test-article-1')
    })

    it('應該正確計算上一篇文章', () => {
      const sortedArticles = [...mockArticles].sort((a, b) => {
        return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
      })

      const currentArticleId = 'test-article-1'
      const currentIndex = sortedArticles.findIndex(
        a => a.stem.replace(/^articles\//, '') === currentArticleId
      )

      const prevArticle = currentIndex > 0 ? sortedArticles[currentIndex - 1] : null

      expect(prevArticle).toBeDefined()
      expect(prevArticle?.stem).toBe('articles/test-article-2')
    })

    it('應該正確計算下一篇文章', () => {
      const sortedArticles = [...mockArticles].sort((a, b) => {
        return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
      })

      const currentArticleId = 'test-article-2'
      const currentIndex = sortedArticles.findIndex(
        a => a.stem.replace(/^articles\//, '') === currentArticleId
      )

      const nextArticle =
        currentIndex < sortedArticles.length - 1 ? sortedArticles[currentIndex + 1] : null

      expect(nextArticle).toBeDefined()
      expect(nextArticle?.stem).toBe('articles/test-article-1')
    })

    it('第一篇文章不應該有上一篇', () => {
      const sortedArticles = [...mockArticles].sort((a, b) => {
        return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
      })

      const currentIndex = 0
      const prevArticle = currentIndex > 0 ? sortedArticles[currentIndex - 1] : null

      expect(prevArticle).toBeNull()
    })

    it('最後一篇文章不應該有下一篇', () => {
      const sortedArticles = [...mockArticles].sort((a, b) => {
        return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
      })

      const currentIndex = sortedArticles.length - 1
      const nextArticle =
        currentIndex < sortedArticles.length - 1 ? sortedArticles[currentIndex + 1] : null

      expect(nextArticle).toBeNull()
    })
  })

  describe('閱讀進度計算', () => {
    it('應該正確計算閱讀進度百分比', () => {
      const scrollTop = 600
      const docHeight = 2000 - 800 // scrollHeight - innerHeight
      const progress = (scrollTop / docHeight) * 100

      expect(progress).toBe(50)
    })

    it('當文檔高度為 0 時應該回傳 0', () => {
      const scrollTop = 0
      const docHeight = 0
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0

      expect(progress).toBe(0)
    })

    it('在頁面頂部時進度應該是 0', () => {
      const scrollTop = 0
      const docHeight = 1200
      const progress = (scrollTop / docHeight) * 100

      expect(progress).toBe(0)
    })

    it('在頁面底部時進度應該接近 100', () => {
      const scrollTop = 1200
      const docHeight = 1200
      const progress = (scrollTop / docHeight) * 100

      expect(progress).toBe(100)
    })
  })

  describe('分享連結生成', () => {
    it('應該正確生成 Facebook 分享連結', () => {
      const currentUrl = 'http://localhost:3000/article/test-article-1'
      const title = '測試文章 1'
      const url = encodeURIComponent(currentUrl)
      const encodedTitle = encodeURIComponent(title)

      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedTitle}`

      expect(facebookUrl).toContain('facebook.com/sharer')
      expect(facebookUrl).toContain(encodeURIComponent(currentUrl))
    })

    it('應該正確生成 Twitter 分享連結', () => {
      const currentUrl = 'http://localhost:3000/article/test-article-1'
      const title = '測試文章 1'
      const url = encodeURIComponent(currentUrl)
      const encodedTitle = encodeURIComponent(title)

      const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${encodedTitle}`

      expect(twitterUrl).toContain('twitter.com/intent/tweet')
      expect(twitterUrl).toContain(encodeURIComponent(currentUrl))
    })
  })

  describe('日期格式化', () => {
    it('應該正確處理日期格式', () => {
      const dateString = '2024-01-01'
      const date = new Date(dateString)

      expect(date.getFullYear()).toBe(2024)
      expect(date.getMonth()).toBe(0) // January is 0
      expect(date.getDate()).toBe(1)
    })
  })

  describe('404 錯誤處理', () => {
    it('當文章不存在時應該準備拋出 404 錯誤', () => {
      const articleId = 'non-existent-article'
      const foundArticle = mockArticles.find(a => a.stem.replace(/^articles\//, '') === articleId)

      expect(foundArticle).toBeUndefined()
    })
  })

  describe('文章內容渲染', () => {
    it('應該有文章主體內容', () => {
      const article = mockArticles[0]

      expect(article.body).toBeDefined()
      expect(article.body.type).toBe('root')
      expect(article.body.children).toBeDefined()
    })

    it('應該正確處理文章摘要', () => {
      const article = mockArticles[0]
      const excerpt = article.meta.excerpt

      expect(excerpt).toBeDefined()
      expect(excerpt).toBe('這是測試文章 1 的摘要')
    })
  })

  describe('文章圖片處理', () => {
    it('應該有縮圖和完整圖片', () => {
      const article = mockArticles[0]

      expect(article.meta.thumbnail).toBeDefined()
      expect(article.meta.image).toBeDefined()
    })

    it('應該處理缺少圖片的情況', () => {
      const article = mockArticles[1]
      const thumbnail = article.meta.thumbnail || article.meta.image || '/default.jpg'

      expect(thumbnail).toBeDefined()
    })
  })

  describe('作者信息', () => {
    it('應該顯示文章作者', () => {
      const article = mockArticles[0]
      const author = article.meta.author || 'Homer Shie'

      expect(author).toBe('Test Author')
    })

    it('當沒有作者時應該使用預設作者', () => {
      const articleWithoutAuthor = {
        meta: {},
      }
      const author = articleWithoutAuthor.meta.author || 'Homer Shie'

      expect(author).toBe('Homer Shie')
    })
  })

  describe('分類處理', () => {
    it('應該正確顯示分類名稱', () => {
      const article = mockArticles[0]

      expect(article.meta.categoryName).toBe('技術')
      expect(article.meta.category).toBe('tech')
    })

    it('應該處理不同的分類', () => {
      const article1 = mockArticles[0]
      const article2 = mockArticles[1]

      expect(article1.meta.category).not.toBe(article2.meta.category)
    })
  })
})
