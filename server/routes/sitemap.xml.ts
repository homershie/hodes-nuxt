import { defineEventHandler } from 'h3'
import { serverQueryContent } from '#content/server'
import { portfolio } from '~/data/portfolioData.js'

export default defineEventHandler(async (event) => {
  const baseUrl = 'https://homershie.com'

  // 查詢所有文章
  const articles = await serverQueryContent(event, 'articles').find()

  // 生成 Blog 分頁路由
  const POSTS_PER_PAGE = 10
  const totalBlogPages = Math.ceil(articles.length / POSTS_PER_PAGE)
  const blogPages = Array.from({ length: totalBlogPages }, (_, i) => ({
    loc: `${baseUrl}/blog/page/${i + 1}`,
    lastmod: new Date().toISOString(),
    priority: i === 0 ? 0.9 : 0.7,
  }))

  // 生成文章路由
  const articleRoutes = articles.map((article) => ({
    loc: `${baseUrl}/article/${article.id}`,
    lastmod: article.date,
    priority: 0.8,
  }))

  // 生成作品路由
  const projectRoutes = portfolio.map((work) => ({
    loc: `${baseUrl}/project/${work.id}`,
    lastmod: work.date || new Date().toISOString(),
    priority: 0.8,
  }))

  // 靜態頁面
  const staticRoutes = [
    { loc: baseUrl, priority: 1.0 },
    { loc: `${baseUrl}/about`, priority: 0.9 },
    { loc: `${baseUrl}/portfolio`, priority: 0.9 },
    { loc: `${baseUrl}/service`, priority: 0.8 },
    { loc: `${baseUrl}/contact`, priority: 0.8 },
  ]

  // 合併所有路由
  const routes = [
    ...staticRoutes,
    ...blogPages,
    ...articleRoutes,
    ...projectRoutes,
  ]

  // 生成 XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${route.loc}</loc>
    ${route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : ''}
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  event.node.res.setHeader('Content-Type', 'application/xml')
  return sitemap
})
