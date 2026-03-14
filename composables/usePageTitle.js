/**
 * 統一的頁面標題格式管理
 * 格式：頁面名稱 | HODES | Homer Shie | ...
 */
export const usePageTitle = () => {
  const { t } = useI18n()

  const getPageTitle = pageName => {
    if (!pageName) return t('seo.page_title_base')
    return `${pageName}${t('seo.page_title_suffix')}`
  }

  const setPageTitle = pageName => {
    if (typeof useSeoMeta !== 'undefined') {
      useSeoMeta({
        title: computed(() => getPageTitle(pageName)),
      })
    }
  }

  return {
    getPageTitle,
    setPageTitle,
  }
}
