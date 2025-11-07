import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ArticleP from '@/app/components/article/ArticleP.vue'
import ArticleH2 from '@/app/components/article/ArticleH2.vue'
import ArticleH3 from '@/app/components/article/ArticleH3.vue'
import ArticleA from '@/app/components/article/ArticleA.vue'
import ArticleBlockquote from '@/app/components/article/ArticleBlockquote.vue'
import ArticleFigcaption from '@/app/components/article/ArticleFigcaption.vue'
import ArticleFigure from '@/app/components/article/ArticleFigure.vue'
import ArticleLi from '@/app/components/article/ArticleLi.vue'
import ArticleOl from '@/app/components/article/ArticleOl.vue'
import ArticleUl from '@/app/components/article/ArticleUl.vue'

describe('Article Components', () => {
  describe('ArticleP', () => {
    it('renders paragraph with correct class', () => {
      const wrapper = mount(ArticleP, {
        slots: {
          default: 'Test paragraph content',
        },
      })

      expect(wrapper.find('.article-p').exists()).toBe(true)
      expect(wrapper.text()).toBe('Test paragraph content')
      expect(wrapper.element.tagName).toBe('P')
    })

    it('renders slot content', () => {
      const wrapper = mount(ArticleP, {
        slots: {
          default: '<strong>Bold text</strong>',
        },
      })

      expect(wrapper.html()).toContain('<strong>Bold text</strong>')
    })
  })

  describe('ArticleH2', () => {
    it('renders h2 with correct class', () => {
      const wrapper = mount(ArticleH2, {
        slots: {
          default: 'Test heading 2',
        },
      })

      expect(wrapper.find('.article-h2').exists()).toBe(true)
      expect(wrapper.text()).toBe('Test heading 2')
      expect(wrapper.element.tagName).toBe('H2')
    })

    it('renders slot content', () => {
      const wrapper = mount(ArticleH2, {
        slots: {
          default: 'Heading Content',
        },
      })

      expect(wrapper.text()).toBe('Heading Content')
    })
  })

  describe('ArticleH3', () => {
    it('renders h3 with correct class', () => {
      const wrapper = mount(ArticleH3, {
        slots: {
          default: 'Test heading 3',
        },
      })

      expect(wrapper.find('.article-h3').exists()).toBe(true)
      expect(wrapper.text()).toBe('Test heading 3')
      expect(wrapper.element.tagName).toBe('H3')
    })

    it('renders slot content', () => {
      const wrapper = mount(ArticleH3, {
        slots: {
          default: 'Sub Heading',
        },
      })

      expect(wrapper.text()).toBe('Sub Heading')
    })
  })

  describe('ArticleA', () => {
    it('renders anchor with correct class and href', () => {
      const wrapper = mount(ArticleA, {
        props: {
          href: 'https://example.com',
        },
        slots: {
          default: 'Link text',
        },
      })

      expect(wrapper.find('a.article-a').exists()).toBe(true)
      expect(wrapper.text()).toBe('Link text')
      expect(wrapper.find('a').attributes('href')).toBe('https://example.com')
      expect(wrapper.find('a').attributes('target')).toBe('_self')
    })

    it('uses default href when not provided', () => {
      const wrapper = mount(ArticleA, {
        slots: {
          default: 'Link text',
        },
      })

      expect(wrapper.find('a').attributes('href')).toBe('#')
    })
  })

  describe('ArticleBlockquote', () => {
    it('renders blockquote with correct class', () => {
      const wrapper = mount(ArticleBlockquote, {
        slots: {
          default: 'Quote text',
        },
      })

      expect(wrapper.find('blockquote.article-blockquote').exists()).toBe(true)
      expect(wrapper.text()).toBe('Quote text')
      expect(wrapper.element.tagName).toBe('BLOCKQUOTE')
    })
  })

  describe('ArticleFigcaption', () => {
    it('renders figcaption with correct class', () => {
      const wrapper = mount(ArticleFigcaption, {
        slots: {
          default: 'Caption text',
        },
      })

      expect(wrapper.find('figcaption.article-figcaption').exists()).toBe(true)
      expect(wrapper.text()).toBe('Caption text')
      expect(wrapper.element.tagName).toBe('FIGCAPTION')
    })
  })

  describe('ArticleFigure', () => {
    it('renders figure with correct class', () => {
      const wrapper = mount(ArticleFigure, {
        slots: {
          default: '<img src="test.jpg" alt="test" />',
        },
      })

      expect(wrapper.find('figure.article-figure').exists()).toBe(true)
      expect(wrapper.element.tagName).toBe('FIGURE')
    })
  })

  describe('ArticleLi', () => {
    it('renders list item with correct class', () => {
      const wrapper = mount(ArticleLi, {
        slots: {
          default: 'List item',
        },
      })

      expect(wrapper.find('li.article-li').exists()).toBe(true)
      expect(wrapper.text()).toBe('List item')
      expect(wrapper.element.tagName).toBe('LI')
    })
  })

  describe('ArticleOl', () => {
    it('renders ordered list with correct class', () => {
      const wrapper = mount(ArticleOl, {
        slots: {
          default: '<li>Item 1</li><li>Item 2</li>',
        },
      })

      expect(wrapper.find('ol.article-ol').exists()).toBe(true)
      expect(wrapper.element.tagName).toBe('OL')
    })
  })

  describe('ArticleUl', () => {
    it('renders unordered list with correct class', () => {
      const wrapper = mount(ArticleUl, {
        slots: {
          default: '<li>Item 1</li><li>Item 2</li>',
        },
      })

      expect(wrapper.find('ul.article-ul').exists()).toBe(true)
      expect(wrapper.element.tagName).toBe('UL')
    })
  })
})
