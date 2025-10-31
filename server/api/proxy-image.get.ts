import { defineEventHandler, getQuery, createError, setResponseHeaders } from 'h3'

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

  try {
    // 代理請求
    const res = await fetch(target.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HomesShie/1.0)',
      },
    })

    if (!res.ok) {
      throw createError({ statusCode: res.status, statusMessage: res.statusText })
    }

    // 設定回應標頭
    const contentType = res.headers.get('content-type') || 'application/octet-stream'
    const cacheControl = res.headers.get('cache-control') || 'public, max-age=31536000, immutable'

    setResponseHeaders(event, {
      'Content-Type': contentType,
      'Cache-Control': cacheControl,
      'Access-Control-Allow-Origin': '*',
    })

    // 返回 buffer 以確保與 Cloudflare Pages 相容
    const arrayBuffer = await res.arrayBuffer()
    return new Uint8Array(arrayBuffer)
  } catch (error) {
    // 捕獲並處理任何錯誤
    console.error('Proxy image error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to proxy image',
    })
  }
})
