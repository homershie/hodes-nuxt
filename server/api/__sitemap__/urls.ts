import { defineSitemapEventHandler, asSitemapUrl } from '#imports'
import { portfolio } from '@data/portfolioData.js'

export default defineSitemapEventHandler(async () => {
  // 生成作品路由
  const projectUrls = portfolio.map((work) =>
    asSitemapUrl({
      loc: `/project/${work.id}`,
      lastmod: work.date || new Date().toISOString(),
      priority: 0.8,
    })
  )

  // 添加 Blog 分頁路由
  // 注意：文章本身會由 Nuxt Content 自動處理
  const POSTS_PER_PAGE = 10
  // 這裡我們假設有一定數量的文章，實際上可以從 content 查詢
  // 但為了避免 #content/server 的問題，我們暫時使用固定值
  const totalBlogPages = 5 // 可以根據實際情況調整
  const blogPageUrls = Array.from({ length: totalBlogPages }, (_, i) =>
    asSitemapUrl({
      loc: `/blog/page/${i + 1}`,
      lastmod: new Date().toISOString(),
      priority: i === 0 ? 0.9 : 0.7,
    })
  )

  return [...projectUrls, ...blogPageUrls]
})
