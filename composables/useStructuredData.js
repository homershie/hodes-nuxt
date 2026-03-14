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
  const { t } = useI18n()
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Homer Shie',
    alternateName: '荷馬桑',
    url: 'https://homershie.com',
    image: 'https://r2bucket.homershie.com/assets/imgs/favicon_homer.png',
    description: t('structured_data.person_description'),
    jobTitle: t('structured_data.person_job_title'),
    worksFor: {
      '@type': 'Organization',
      name: 'HODES',
    },
    sameAs: [],
  }
}

export function useWebsiteSchema() {
  const { t } = useI18n()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'HODES',
    description: t('structured_data.website_description'),
    url: 'https://homershie.com',
    inLanguage: t('structured_data.website_language'),
    publisher: {
      '@type': 'Person',
      name: 'Homer Shie',
    },
  }
}
