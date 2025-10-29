/* eslint-disable prettier/prettier */
import { defineEventHandler, getQuery, createError, setHeader } from 'h3'

export default defineEventHandler(async event => {
  const { url } = getQuery(event)
  if (!url || typeof url !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Missing url' })
  }

  let target: URL
  try {
    target = new URL(url)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid url' })
  }

  // 僅允許代理指定網域，避免濫用
  const allowedHosts = new Set(['r2bucket.homershie.com'])
  if (!allowedHosts.has(target.hostname)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden host' })
  }

  // 代理請求
  const res = await fetch(target.toString(), {
    method: 'GET',
    // 保留來源快取頭，有助於瀏覽器/中繼快取
    headers: {
      // 可依需求轉送 If-None-Match / If-Modified-Since 等條頭
    },
  })

  if (!res.ok) {
    throw createError({ statusCode: res.status, statusMessage: res.statusText })
  }

  // 設定 CORS 與內容型別
  const contentType = res.headers.get('content-type') || 'application/octet-stream'
  const cacheControl = res.headers.get('cache-control') || 'public, max-age=31536000, immutable'

  setHeader(event, 'Content-Type', contentType)
  setHeader(event, 'Cache-Control', cacheControl)
  setHeader(event, 'Access-Control-Allow-Origin', '*')

  // 直接串流回客戶端
  return new Response(res.body, {
    status: 200,
  })
})
