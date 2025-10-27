import { defineNitroPlugin } from 'nitropack/runtime/plugin'

export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('prerender:routes', async ctx => {
    // 由於我們使用 serverQueryContent 需要 event context
    // 我們改用簡單的方式：直接從資料檔案生成路由

    // 文章路由 - 從 content 目錄讀取
    const articleIds = [
      'pop-art',
      'mbe',
      'pixel-art',
      'vaporwave',
      'modern-design-intro',
      'art-nouveau',
    ]

    // 生成 Blog 分頁路由
    const POSTS_PER_PAGE = 10
    const totalPages = Math.ceil(articleIds.length / POSTS_PER_PAGE)

    for (let i = 1; i <= totalPages; i++) {
      ctx.routes.add(`/blog/page/${i}`)
    }

    // 生成文章路由
    for (const id of articleIds) {
      ctx.routes.add(`/article/${id}`)
    }

    // 動態導入作品資料（使用 @data 指向專案根目錄的 data/）
    const { portfolio } = await import('@data/portfolioData.js')

    // 生成作品路由
    for (const work of portfolio) {
      ctx.routes.add(`/project/${work.id}`)
    }

    // Portfolio 分頁 (SEO 用)
    const WORKS_PER_PAGE = 15
    const totalPortfolioPages = Math.ceil(portfolio.length / WORKS_PER_PAGE)

    for (let i = 1; i <= totalPortfolioPages; i++) {
      ctx.routes.add(`/portfolio?page=${i}`)
    }
  })
})
