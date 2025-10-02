/**
 * 統一的頁面標題格式管理
 * 格式：頁面名稱｜HOEDES｜荷馬桑 Homer Shie｜設計 ‧ 插畫 ‧ 動畫 ‧ 藝術 | 台北
 */
export const usePageTitle = () => {
  const baseTitle = "HOEDES｜荷馬桑 Homer Shie｜設計 ‧ 插畫 ‧ 動畫 ‧ 藝術 | 台北";
  const suffix = "｜HOEDES｜荷馬桑 Homer Shie｜設計 ‧ 插畫 ‧ 動畫 ‧ 藝術 | 台北";

  /**
   * 生成完整的頁面標題
   * @param {string} pageName - 頁面名稱
   * @returns {string} 完整標題
   */
  const getPageTitle = (pageName) => {
    if (!pageName) return baseTitle;
    return `${pageName}${suffix}`;
  };

  /**
   * 設定頁面 SEO 標題
   * @param {string} pageName - 頁面名稱
   */
  const setPageTitle = (pageName) => {
    useSeoMeta({
      title: getPageTitle(pageName)
    });
  };

  return {
    baseTitle,
    suffix,
    getPageTitle,
    setPageTitle
  };
};
