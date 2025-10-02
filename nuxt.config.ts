// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "nuxt-gtag",
  ],

  gtag: {
    id: "G-8YSG21XKMM",
  },

  // 全域 SEO 設定
  app: {
    head: {
      htmlAttrs: {
        lang: "zh-Hant-TW",
      },
      title: "HOEDES｜荷馬桑 Homer Shie｜設計 ‧ 插畫 ‧ 動畫 ‧ 藝術 | 台北",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "HODES 是荷馬桑 Homer Shie 的個人網站，來自台灣的自由接案工作者，擅長平面設計、插畫以及動畫，有興趣可以隨意逛逛，歡迎和我連絡！",
        },
        { name: "keywords", content: "設計,動畫,插畫,藝術,homer shie,作品集" },
        { name: "author", content: "Homer Shie" },
        { name: "robots", content: "index, follow" },

        // Open Graph
        {
          property: "og:title",
          content:
            "HOEDES｜荷馬桑 Homer Shie｜設計 ‧ 插畫 ‧ 動畫 ‧ 藝術 | 台北",
        },
        {
          property: "og:description",
          content:
            "HODES 是荷馬桑 Homer Shie 的個人網站，來自台灣的自由接案工作者，擅長平面設計、插畫以及動畫，有興趣可以隨意逛逛，歡迎和我連絡！",
        },
        {
          property: "og:image",
          content:
            "https://images.homershie.com/assets/imgs/thumbnail/og-image.jpg",
        },
        { property: "og:url", content: "https://homershie.com" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "zh_TW" },

        // Twitter Card
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "荷馬桑 Homer Shie｜設計 ‧ 插畫 ‧ 動畫 ‧ 藝術 | 台北",
        },
        {
          name: "twitter:description",
          content:
            "Hi！這裡是荷馬桑 Homer Shie，台灣的自由接案工作者，擅長平面設計、插畫以及動畫",
        },
        {
          name: "twitter:image",
          content:
            "https://images.homershie.com/assets/imgs/thumbnail/twitter-card.jpg",
        },
      ],
      link: [
        {
          rel: "icon",
          href: "https://images.homershie.com/assets/imgs/favicon_homer.png",
        },
        { rel: "canonical", href: "https://homershie.com" },
      ],
    },
  },
});
