import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { defineSitemapEventHandler, asSitemapUrl } from '#imports'
import { portfolio } from '@data/portfolioData.js'

const POSTS_PER_PAGE = 10

function getArticleSlugsWithDates(): Array<{ slug: string; lastmod: string }> {
  try {
    const contentDir = join(process.cwd(), 'content')
    const slugs = new Map<string, string>()

    for (const locale of ['zh-TW', 'en']) {
      const articlesDir = join(contentDir, locale, 'articles')
      try {
        const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'))
        for (const filename of files) {
          const slug = filename.replace(/\.md$/, '')
          const filePath = join(articlesDir, filename)
          const mtime = statSync(filePath).mtime.toISOString()
          const existing = slugs.get(slug)
          if (!existing || mtime > existing) {
            slugs.set(slug, mtime)
          }
        }
      } catch {
        // 某語系目錄可能不存在
      }
    }

    return Array.from(slugs.entries()).map(([slug, lastmod]) => ({ slug, lastmod }))
  } catch (error) {
    console.warn('[sitemap] 讀取文章列表失敗：', error instanceof Error ? error.message : error)
    return []
  }
}

export default defineSitemapEventHandler(async () => {
  const articles = getArticleSlugsWithDates()
  const blogPageTotal = Math.max(1, Math.ceil(articles.length / POSTS_PER_PAGE))

  const urls: Array<ReturnType<typeof asSitemapUrl> & { _i18nTransform?: boolean }> = []

  // 靜態頁面 - 由 _i18nTransform 自動產生雙語 URL 與 alternates
  urls.push(
    asSitemapUrl({
      loc: '/',
      lastmod: new Date().toISOString(),
      priority: 1,
      changefreq: 'weekly',
      _i18nTransform: true,
    })
  )
  for (const path of ['/about', '/service', '/contact', '/portfolio']) {
    urls.push(
      asSitemapUrl({
        loc: path,
        lastmod: new Date().toISOString(),
        priority: 0.9,
        changefreq: 'weekly',
        _i18nTransform: true,
      })
    )
  }

  // 作品路由
  const sortedPortfolio = [...portfolio].sort((a, b) => {
    const dateA = new Date(a.date || '2000-01-01')
    const dateB = new Date(b.date || '2000-01-01')
    return dateB.getTime() - dateA.getTime()
  })

  sortedPortfolio.forEach((work, index) => {
    let priority = 0.7
    if (index < 10) priority = 0.9
    else if (index < 20) priority = 0.85
    else if (index < 40) priority = 0.8

    const workYear = work.date ? new Date(work.date).getFullYear() : new Date().getFullYear()
    const yearsOld = new Date().getFullYear() - workYear
    let changefreq = 'monthly'
    if (yearsOld === 0) changefreq = 'weekly'
    else if (yearsOld > 1) changefreq = 'yearly'

    urls.push(
      asSitemapUrl({
        loc: `/project/${work.id}`,
        lastmod: work.date || new Date().toISOString(),
        priority,
        changefreq,
        _i18nTransform: true,
      })
    )
  })

  // 文章路由
  articles.forEach(({ slug, lastmod }) => {
    urls.push(
      asSitemapUrl({
        loc: `/article/${slug}`,
        lastmod,
        priority: 0.85,
        changefreq: 'monthly',
        _i18nTransform: true,
      })
    )
  })

  // Blog 分頁路由
  for (let i = 0; i < blogPageTotal; i++) {
    urls.push(
      asSitemapUrl({
        loc: `/blog/page/${i + 1}`,
        lastmod: new Date().toISOString(),
        priority: i === 0 ? 0.95 : 0.8,
        changefreq: 'weekly',
        _i18nTransform: true,
      })
    )
  }

  return urls
})
