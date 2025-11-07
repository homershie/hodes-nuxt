/**
 * Canonical URL Composable
 *
 * 提供統一的方法來設定 canonical URL，自動移除查詢參數
 */

export const useCanonicalUrl = (customPath?: string) => {
  const route = useRoute()
  const config = useRuntimeConfig()

  const siteUrl = config.public.siteUrl || 'https://homershie.com'

  // 使用自定義路徑或當前路由路徑（不含查詢參數）
  const path = customPath || route.path

  // 移除尾部斜線（如果有的話）
  const cleanPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path

  // 構建完整的 canonical URL
  const canonicalUrl = `${siteUrl}${cleanPath}`

  return {
    canonicalUrl,
    setCanonical: () => {
      useHead({
        link: [
          {
            rel: 'canonical',
            href: canonicalUrl,
          },
        ],
      })
    },
  }
}