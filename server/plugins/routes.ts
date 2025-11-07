/**
 * Nitro Plugin: 生成 Cloudflare Pages _routes.json
 *
 * 此插件在構建時自動生成 _routes.json 文件，
 * 用於配置 Cloudflare Pages 的路由規則。
 *
 * 參考：https://developers.cloudflare.com/pages/platform/functions/routing/
 */

export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('prerender:done', async () => {
    const fs = await import('node:fs')
    const path = await import('node:path')

    // 定義 Cloudflare Pages 路由配置
    const routes = {
      version: 1,
      include: ['/*'],
      exclude: [
        // 排除靜態資源，讓 Cloudflare CDN 直接提供
        '/_nuxt/*',
        '/fonts/*',
        '/images/*',
        '/*.ico',
        '/*.png',
        '/*.jpg',
        '/*.jpeg',
        '/*.gif',
        '/*.svg',
        '/*.webp',
        '/*.woff',
        '/*.woff2',
        '/*.ttf',
        '/*.eot',
        '/*.css',
        '/*.js',
        '/*.json',
        '/*.xml',
        '/*.txt',
        '/_payload.json',
        '/manifest.webmanifest',
        '/robots.txt',
        '/sitemap.xml',
      ],
    }

    // 寫入 _routes.json 到 public 目錄
    const outputDir = process.env.NITRO_OUTPUT_DIR || 'output'
    const publicDir = path.join(outputDir, 'public')
    const routesPath = path.join(publicDir, '_routes.json')

    try {
      await fs.promises.mkdir(publicDir, { recursive: true })
      await fs.promises.writeFile(routesPath, JSON.stringify(routes, null, 2), 'utf-8')
      console.log('✅ Generated _routes.json for Cloudflare Pages')
    } catch (error) {
      console.error('❌ Failed to generate _routes.json:', error)
    }
  })
})
