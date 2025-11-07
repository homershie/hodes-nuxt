import { defineNitroPlugin } from 'nitropack/runtime/plugin'

export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('prerender:routes', async ctx => {
    console.log('[Prerender] Starting route generation...')

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

    console.log(`[Prerender] Generating ${totalPages} blog pages...`)
    for (let i = 1; i <= totalPages; i++) {
      const route = `/blog/page/${i}`
      ctx.routes.add(route)
      console.log(`[Prerender] Added: ${route}`)
    }

    // 生成文章路由
    console.log(`[Prerender] Generating ${articleIds.length} article pages...`)
    for (const id of articleIds) {
      const route = `/article/${id}`
      ctx.routes.add(route)
      console.log(`[Prerender] Added: ${route}`)
    }

    // 動態導入作品資料（使用 @data 指向專案根目錄的 data/）
    try {
      const { portfolio } = await import('@data/portfolioData.js')

      // 生成作品路由
      console.log(`[Prerender] Generating ${portfolio.length} project pages...`)
      for (const work of portfolio) {
        const route = `/project/${work.id}`
        ctx.routes.add(route)
        console.log(`[Prerender] Added: ${route}`)
      }

      // Portfolio 分頁 (SEO 用)
      const WORKS_PER_PAGE = 15
      const totalPortfolioPages = Math.ceil(portfolio.length / WORKS_PER_PAGE)

      console.log(`[Prerender] Generating ${totalPortfolioPages} portfolio pages...`)
      for (let i = 1; i <= totalPortfolioPages; i++) {
        const route = `/portfolio?page=${i}`
        ctx.routes.add(route)
        console.log(`[Prerender] Added: ${route}`)
      }

      console.log('[Prerender] Route generation completed successfully!')
    } catch (error) {
      console.error('[Prerender] Error loading portfolio data:', error)
    }
  })
})
