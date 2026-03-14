/**
 * 全局語言偵測 Middleware
 * 只在根路徑 / 時觸發，依瀏覽器語言設定 302 導向對應語系前綴
 * - zh* 開頭的語言（zh-TW, zh-CN, zh-HK 等）→ /zh-TW/
 * - 其他所有語言 → /en/
 * - 無法解析時預設 → /en/
 */
export default defineNuxtRouteMiddleware(to => {
  if (to.path !== '/') return

  if (import.meta.server) {
    const event = useRequestEvent()
    const acceptLang = event?.headers.get('accept-language') ?? ''
    const target = parseAcceptLanguage(acceptLang)
    return navigateTo(`/${target}/`, { redirectCode: 302 })
  }

  if (import.meta.client) {
    const lang = (navigator.language || navigator.languages?.[0] || '').toLowerCase()
    const target = lang.startsWith('zh') ? 'zh-TW' : 'en'
    return navigateTo(`/${target}/`, { replace: true })
  }
})

function parseAcceptLanguage(header: string): string {
  if (!header) return 'en'

  const parts = header
    .split(',')
    .map(part => {
      const [lang, q] = part.trim().split(';q=')
      return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1.0 }
    })
    .sort((a, b) => b.q - a.q)

  for (const { lang } of parts) {
    if (lang.startsWith('zh')) return 'zh-TW'
  }
  return 'en'
}
