import { defineSitemapEventHandler, asSitemapUrl } from '#imports'
import { portfolio } from '@data/portfolioData.js'

export default defineSitemapEventHandler(async () => {
  // 按日期排序作品，最新的優先級更高
  const sortedPortfolio = [...portfolio].sort((a, b) => {
    const dateA = new Date(a.date || '2000-01-01')
    const dateB = new Date(b.date || '2000-01-01')
    return dateB.getTime() - dateA.getTime()
  })

  // 生成作品路由 - 動態計算優先級
  const projectUrls = sortedPortfolio.map((work, index) => {
    // 最新的20個作品給予較高優先級
    let priority = 0.7
    if (index < 10) priority = 0.9  // 最新10個
    else if (index < 20) priority = 0.85  // 11-20個
    else if (index < 40) priority = 0.8  // 21-40個

    // 計算作品年份，決定更新頻率
    const workYear = work.date ? new Date(work.date).getFullYear() : new Date().getFullYear()
    const currentYear = new Date().getFullYear()
    const yearsOld = currentYear - workYear

    // 根據作品年份決定更新頻率
    let changefreq = 'monthly'
    if (yearsOld === 0) changefreq = 'weekly'  // 今年的作品
    else if (yearsOld === 1) changefreq = 'monthly'  // 去年的作品
    else changefreq = 'yearly'  // 更舊的作品

    return asSitemapUrl({
      loc: `/project/${work.id}`,
      lastmod: work.date || new Date().toISOString(),
      priority,
      changefreq,
    })
  })

  // 添加 Blog 分頁路由
  const totalBlogPages = 5
  const blogPageUrls = Array.from({ length: totalBlogPages }, (_, i) =>
    asSitemapUrl({
      loc: `/blog/page/${i + 1}`,
      lastmod: new Date().toISOString(),
      priority: i === 0 ? 0.95 : 0.8,  // 第一頁優先級更高
      changefreq: 'weekly',  // Blog頁面更新較頻繁
    })
  )

  return [...projectUrls, ...blogPageUrls]
})
