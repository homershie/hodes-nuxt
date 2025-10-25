/**
 * 結構化資料 (Schema.org) Composable
 * 用於生成符合 SEO 標準的 JSON-LD 結構化資料
 */

export function useArticleSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Person',
      name: article.author,
      url: 'https://homershie.com/about',
    },
    publisher: {
      '@type': 'Person',
      name: 'Homer Shie',
      logo: {
        '@type': 'ImageObject',
        url: 'https://r2bucket.homershie.com/assets/imgs/favicon_homer.png',
      },
    },
  }
}

export function usePortfolioSchema(works) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: works.map((work, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: work.title,
        description: work.description,
        image: work.image || work.mainImage,
        dateCreated: work.date,
        creator: {
          '@type': 'Person',
          name: 'Homer Shie',
        },
      },
    })),
  }
}

export function usePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Homer Shie',
    alternateName: '荷馬桑',
    url: 'https://homershie.com',
    image: 'https://r2bucket.homershie.com/assets/imgs/favicon_homer.png',
    description: '來自台灣的自由接案工作者，擅長平面設計、插畫以及動畫',
    jobTitle: '平面設計師 / 插畫家 / 動畫師',
    worksFor: {
      '@type': 'Organization',
      name: 'HODES',
    },
    sameAs: [
      // 可以加入社群媒體連結
    ],
  }
}

export function useWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'HODES',
    description: 'HODES 是荷馬桑 Homer Shie 的個人網站，來自台灣的自由接案工作者，擅長平面設計、插畫以及動畫',
    url: 'https://homershie.com',
    inLanguage: 'zh-TW',
    publisher: {
      '@type': 'Person',
      name: 'Homer Shie',
    },
  }
}
