/**
 * Canonical URL Plugin
 *
 * 自動為所有頁面添加正確的 canonical URL，移除查詢參數
 * 解決 Google Search Console 「替代頁面 (有適當的標準標記)」問題
 */

export default defineNuxtPlugin(() => {
  const route = useRoute()
  const config = useRuntimeConfig()

  // 監聽路由變化，動態更新 canonical URL
  watch(
    () => route.fullPath,
    () => {
      updateCanonicalUrl()
    },
    { immediate: true }
  )

  function updateCanonicalUrl() {
    // 獲取當前路徑（不含查詢參數）
    const cleanPath = route.path

    // 構建完整的 canonical URL
    const siteUrl = config.public.siteUrl || 'https://homershie.com'
    const canonicalUrl = `${siteUrl}${cleanPath}`

    // 查找或創建 canonical link 元素
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement

    if (!canonicalLink) {
      // 如果不存在，創建新的 canonical link
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }

    // 更新 canonical URL
    canonicalLink.setAttribute('href', canonicalUrl)
  }
})