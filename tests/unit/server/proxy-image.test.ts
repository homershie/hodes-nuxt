import { describe, it, expect, vi, beforeEach } from 'vitest'

async function importHandler() {
  vi.resetModules()
  const headers: Record<string, string> = {}

  vi.doMock('h3', async () => {
    const actual = await vi.importActual<any>('h3')
    return {
      ...actual,
      defineEventHandler: (fn: any) => fn,
      getQuery: (e: any) => e.query || {},
      setHeader: (_e: any, k: string, v: string) => {
        headers[k] = v
      },
      createError: (o: any) => ({ ...o }),
    }
  })

  const mod = await import('@/server/api/proxy-image.get')
  return { handler: mod.default as (event: any) => Promise<any>, headers }
}

describe('server/api/proxy-image.get', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('缺少 url -> 400', async () => {
    const { handler } = await importHandler()
    await expect(handler({ query: {} })).rejects.toMatchObject({ statusCode: 400 })
  })

  it('無效 url -> 400', async () => {
    const { handler } = await importHandler()
    // Mock fetch to prevent actual network calls
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Should not reach fetch'))
    await expect(handler({ query: { url: ':://bad' } })).rejects.toMatchObject({ statusCode: 400 })
  })

  it('禁止的 host -> 403', async () => {
    const { handler } = await importHandler()
    // Mock fetch to prevent actual network calls
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Should not reach fetch'))
    await expect(handler({ query: { url: 'https://example.com/a.png' } })).rejects.toMatchObject({
      statusCode: 403,
    })
  })

  it('上游錯誤 -> 轉拋上游狀態碼', async () => {
    const { handler } = await importHandler()
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(null, { status: 404, statusText: 'Not Found' }) as any
    )
    await expect(
      handler({ query: { url: 'https://r2bucket.homershie.com/a.png' } })
    ).rejects.toMatchObject({ statusCode: 404 })
  })

  it('成功代理，設定 headers 與回傳串流', async () => {
    const { handler, headers } = await importHandler()
    const body = new ReadableStream()
    const upstream = new Response(body, {
      status: 200,
      headers: {
        'content-type': 'image/png',
        'cache-control': 'public, max-age=60',
      },
    })
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(upstream as any)

    const res = await handler({ query: { url: 'https://r2bucket.homershie.com/a.png' } })
    expect(headers['Content-Type']).toBe('image/png')
    expect(headers['Cache-Control']).toBe('public, max-age=60')
    expect(headers['Access-Control-Allow-Origin']).toBe('*')
    expect(res).toBeInstanceOf(Response)
    expect((res as Response).status).toBe(200)
  })
})
