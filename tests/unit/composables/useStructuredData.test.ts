import { describe, it, expect } from 'vitest'
import {
  useArticleSchema,
  usePortfolioSchema,
  usePersonSchema,
  useWebsiteSchema,
} from '@/composables/useStructuredData'

describe('useStructuredData', () => {
  it('產生 Article schema', () => {
    const schema = useArticleSchema({
      title: 'T',
      excerpt: 'E',
      image: '/a.jpg',
      date: '2024-01-01',
      author: 'A',
    })
    expect(schema['@type']).toBe('BlogPosting')
    expect(schema.headline).toBe('T')
  })

  it('產生 Portfolio ItemList schema', () => {
    const schema = usePortfolioSchema([
      { title: 'W1', description: 'D1', image: '/1.jpg', date: '2024-01-01' },
      { title: 'W2', description: 'D2', mainImage: '/2.jpg', date: '2024-01-02' },
    ])
    expect(schema['@type']).toBe('ItemList')
    expect(schema.itemListElement.length).toBe(2)
    expect(schema.itemListElement[1].position).toBe(2)
  })

  it('產生 Person 與 Website schema', () => {
    const person = usePersonSchema()
    expect(person['@type']).toBe('Person')
    const site = useWebsiteSchema()
    expect(site['@type']).toBe('WebSite')
  })
})
