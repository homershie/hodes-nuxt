<template>
  <section v-if="article" class="main-post section-padding">
    <div class="container with-pad">
      <!-- 閱讀進度條 -->
      <div class="reading-progress-bar" :style="{ width: progress + '%' }"></div>

      <div class="row justify-content-center">
        <div class="col-lg-10">
          <div class="caption text-center">
            <div class="gat">
              <a href="#0"
                ><span>{{ article.categoryName }}</span></a
              >
            </div>
            <h1 class="fz-40 mt-30">{{ article.title }}</h1>
            <p class="sub-title mt-15">{{ formatDate(article.date) }} - By {{ article.author }}</p>
          </div>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-lg-9">
          <div class="cont">
            <!-- 使用 ContentRenderer 渲染 Nuxt Content v3 的 body -->
            <div class="article-content">
              <ContentRenderer v-if="article.body" :value="article.body" />
            </div>

            <!-- 分享區域 -->
            <div class="info-area flex mt-20 pb-20 pt-20 bord-thin-top bord-thin-bottom">
              <div>
                <div class="tags flex">
                  <div class="valign">
                    <span>Tags :</span>
                  </div>
                  <div>
                    <a href="#0">{{ article.categoryName }}</a>
                  </div>
                </div>
              </div>
              <div class="ml-auto">
                <div class="share-icon flex">
                  <div class="valign">
                    <span>Share :</span>
                  </div>
                  <div>
                    <a :href="shareUrls.facebook" target="_blank">
                      <i class="fab fa-facebook-f"></i>
                    </a>
                    <a :href="shareUrls.twitter" target="_blank">
                      <i class="fab fa-x"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- 上一篇/下一篇 -->
            <div class="next-prv-post flex mt-50">
              <div
                v-if="prevArticle"
                class="thumb-post bg-img"
                :style="{
                  backgroundImage: `url('${prevArticle.thumbnail}')`,
                  backgroundPosition: 'center center',
                  backgroundSize: 'cover',
                }"
              >
                <NuxtLink :to="`/article/${prevArticle.id}`">
                  <span
                    class="fz-12 text-u ls1 main-color mb-15"
                    style="text-shadow: 2px 2px 2px #000"
                  >
                    <i class="fas fa-angle-left"></i>
                    上一篇
                  </span>
                  <h6 class="fw-500 fz-16" style="text-shadow: 2px 2px 2px #000">
                    {{ prevArticle.title }}
                  </h6>
                </NuxtLink>
              </div>
              <div
                v-if="nextArticle"
                class="thumb-post ml-auto text-right bg-img"
                :style="{
                  backgroundImage: `url('${nextArticle.thumbnail}')`,
                  backgroundPosition: 'center center',
                  backgroundSize: 'cover',
                }"
              >
                <NuxtLink :to="`/article/${nextArticle.id}`">
                  <span
                    class="fz-12 text-u ls1 main-color mb-15"
                    style="text-shadow: 2px 2px 2px #000"
                  >
                    下一篇 <i class="fas fa-angle-right"></i>
                  </span>
                  <h6 class="fw-500 fz-16" style="text-shadow: 2px 2px 2px #000">
                    {{ nextArticle.title }}
                  </h6>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 404 狀態 -->
  <section v-else class="section-padding">
    <div class="container text-center">
      <h2>文章不存在</h2>
      <NuxtLink to="/blog/page/1" class="butn butn-md butn-bord radius-30 mt-30">
        <span>回到部落格</span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { articles as legacyArticles } from '@data/articleData.js'
import { useScroll } from '@vueuse/core'
import { enableImageLightbox } from '@composables/useLightBox.js'

const route = useRoute()
const articleId = route.params.id

// 從 Nuxt Content 查詢文章 (使用 v3 API)
// 注意：v3 中只有一個 'content' collection
const { data: allArticles } = await useAsyncData('all-articles', () =>
  queryCollection('content').all()
)

// 工具：從 Content v3 的 body（minimark）擷取第一個段落文字，避開圖片/圖說
function extractExcerptFromBody(body, maxLen = 120) {
  if (!body) return ''
  if (typeof body === 'string') {
    return body
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, maxLen)
  }
  const nodes = Array.isArray(body?.value) ? body.value : []
  function findFirstParagraphText(arr) {
    for (const node of arr) {
      if (typeof node === 'string') continue
      if (Array.isArray(node)) {
        const [tag, _attrs, ...children] = node
        if (tag === 'p') {
          return children
            .map(child => (typeof child === 'string' ? child : findFirstParagraphText([child])))
            .join(' ')
        }
        const nested = findFirstParagraphText(children)
        if (nested && nested.trim()) return nested
      }
    }
    return ''
  }
  const text = findFirstParagraphText(nodes).replace(/\s+/g, ' ').trim()
  return text.slice(0, maxLen)
}

// 找到當前文章
const article = computed(() => {
  if (!allArticles.value) return null

  // 轉換資料並尋找匹配的文章
  const articles = allArticles.value
    .filter(item => item.path && item.path.startsWith('/articles/'))
    .map(item => {
      const meta = typeof item.meta === 'string' ? JSON.parse(item.meta) : item.meta || item || {}
      // 從 stem 中提取文章 ID (移除 'articles/' 前綴)
      const id = item.stem ? item.stem.replace(/^articles\//, '') : meta.id || item.stem
      const legacyExcerpt = legacyArticles?.[id]?.excerpt || ''
      const computedExcerpt = meta.excerpt || item.excerpt || legacyExcerpt
      if (import.meta.client && id === articleId) {
        // eslint-disable-next-line no-console
        console.log('Article excerpt debug:', {
          id,
          hasMetaExcerpt: Boolean(meta.excerpt),
          hasItemExcerpt: Boolean(item.excerpt),
          computedExcerptSample: (computedExcerpt || '').slice(0, 80),
        })
      }
      return {
        id,
        title: item.title,
        date: meta.date,
        category: meta.category,
        categoryName: meta.categoryName,
        excerpt: computedExcerpt,
        image: meta.image || meta.thumbnail || item.image || item.thumbnail,
        thumbnail: meta.thumbnail || meta.image || item.thumbnail || item.image,
        author: meta.author || item.author || 'Homer Shie',
        body: item.body,
        path: item.path,
      }
    })

  return articles.find(a => a.id === articleId)
})

// 排序文章（按日期降序）
const sortedArticles = computed(() => {
  if (!allArticles.value) return []

  // 轉換並排序所有文章
  return allArticles.value
    .filter(item => item.path && item.path.startsWith('/articles/'))
    .map(item => {
      const meta = typeof item.meta === 'string' ? JSON.parse(item.meta) : item.meta || {}
      // 從 stem 中提取文章 ID (移除 'articles/' 前綴)
      const id = item.stem ? item.stem.replace(/^articles\//, '') : meta.id || item.stem
      return {
        id,
        title: item.title,
        date: meta.date,
        thumbnail: meta.thumbnail || meta.image,
        path: item.path,
      }
    })
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
})

// 404 處理
if (!article.value) {
  throw createError({
    statusCode: 404,
    message: '文章不存在',
  })
}

// 使用 useScroll 來計算閱讀進度
const { y } = useScroll(window)
const progress = computed(() => {
  if (!import.meta.client) return 0
  const scrollTop = y.value
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  return docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
})

// 計算上一篇和下一篇文章
const prevArticle = computed(() => {
  if (!article.value || !sortedArticles.value) return null
  const currentIndex = sortedArticles.value.findIndex(a => a.id === article.value.id)
  if (currentIndex === -1 || currentIndex === 0) return null
  return sortedArticles.value[currentIndex - 1]
})

const nextArticle = computed(() => {
  if (!article.value || !sortedArticles.value) return null
  const currentIndex = sortedArticles.value.findIndex(a => a.id === article.value.id)
  if (currentIndex === -1 || currentIndex === sortedArticles.value.length - 1) return null
  return sortedArticles.value[currentIndex + 1]
})

// 分享連結
const shareUrls = computed(() => {
  if (!article.value || !import.meta.client) return {}
  const currentUrl = window.location.href
  const url = encodeURIComponent(currentUrl)
  const title = encodeURIComponent(article.value.title)

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
  }
})

// 日期格式化
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// SEO Meta
useHead({
  title: `${article.value.title} | HODES`,
  meta: [
    { name: 'description', content: article.value.excerpt },
    { property: 'og:title', content: article.value.title },
    { property: 'og:description', content: article.value.excerpt },
    { property: 'og:image', content: article.value.image },
    { property: 'og:url', content: `https://homershie.com/article/${articleId}` },
    { property: 'article:published_time', content: article.value.date },
    { property: 'article:author', content: article.value.author },
  ],
  link: [{ rel: 'canonical', href: `https://homershie.com/article/${articleId}` }],
})

// 在掛載後啟用 lightbox
onMounted(async () => {
  if (import.meta.client) {
    await nextTick()
    enableImageLightbox()
  }
})
</script>

<style lang="scss">
/* 文章內容樣式 */
.article-content :deep(article) {
  a {
    text-decoration: underline;
    &:hover {
      text-decoration: underline;
      color: var(--maincolor);
    }
  }

  .image {
    margin: 60px 0;
  }

  figcaption {
    text-align: center;
    margin: 20px 0;
    font-size: 0.9rem;
    color: #aaa;
  }

  img {
    width: 50%;
    height: auto;
    display: block;
    margin: 0 auto;
    border-radius: 5px;
  }

  h2 {
    font-size: 2rem;
    margin: 40px 0 20px 0;
    color: var(--maincolor);
  }

  h3 {
    font-size: 1.5rem;
    margin: 40px 0 20px 0;
    text-decoration: underline;
    text-decoration-color: var(--maincolor);
    text-decoration-thickness: 2px;
    text-underline-offset: 10px;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 10px;
    font-weight: normal;
  }

  hr {
    margin-top: 40px;
    border: none;
    border-top: 1px solid #eee;
  }

  ul {
    padding-left: 20px;
    margin: 40px 0;
    li {
      margin-bottom: 10px;
      font-size: 1.1rem;
      font-weight: normal;
      line-height: 1.6;
      &:before {
        content: '•';
        color: var(--maincolor);
        margin-right: 10px;
      }
    }
  }

  ol {
    counter-reset: li;
    padding-left: 20px;
    margin: 40px 0;

    li {
      margin-bottom: 10px;
      font-size: 1.1rem;
      font-weight: normal;
      line-height: 1.6;

      &::before {
        counter-increment: li;
        content: counter(li) '.';
        color: var(--maincolor);
        margin-right: 10px;
      }
    }
  }

  blockquote {
    margin: 40px 0;
    padding-left: 20px;
    border-left: 4px solid var(--maincolor);
    font-style: italic;
    color: #555;
    font-size: 1.1rem;
    line-height: 1.6;
    em {
      font-weight: bold;
    }
  }
}

.cont .image-gallery .artist {
  grid-column: 1 / -1;
  justify-self: center;
  text-align: center;
  font-size: 0.9rem;
  margin: 0 auto;
}

.cont .image-gallery {
  width: 95%;
  margin: 0 auto;
  margin-top: 60px;
  margin-bottom: 60px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  .image {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    margin: 0;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 5px;
      display: block;
    }

    figcaption {
      margin: 0;
      opacity: 0;
      transform: translateY(10px);
      transition:
        opacity 0.3s,
        transform 0.3s;
      text-align: center;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 16px 0 10px 0;
      border-radius: 0 0 5px 5px;
      font-size: 0.95em;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }

    &:hover figcaption,
    &:focus-within figcaption {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
  }
}

.cont .image-gallery-3 {
  @extend .image-gallery;
  grid-template-columns: repeat(3, 1fr);
}

.image-masonry {
  width: 95%;
  margin: 0 auto;
  margin-top: 40px;
  margin-bottom: 40px;
  column-count: 3;
  column-gap: 20px;

  .image {
    display: inline-block;
    width: 100%;
    margin: 0 0 20px 0;
    position: relative;
    overflow: hidden;
    border-radius: 5px;

    img {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 5px;
      object-fit: cover;
    }

    figcaption {
      margin: 0;
      opacity: 0;
      transform: translateY(10px);
      transition:
        opacity 0.3s,
        transform 0.3s;
      text-align: center;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 8px 0 4px 0;
      border-radius: 0 0 5px 5px;
      font-size: 0.95em;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }

    &:hover figcaption,
    &:focus-within figcaption {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
  }
}

@media screen and (max-width: 992px) {
  .cont .image-gallery {
    grid-template-columns: 1fr;
  }
  .image-masonry {
    column-count: 2;
  }
  .cont .image-gallery-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .article-content :deep(article) {
    h2 {
      font-size: 1.8rem;
    }
    h3 {
      font-size: 1.4rem;
    }
    img {
      width: 100%;
    }
  }
  .image-masonry {
    column-count: 1;
  }
  .cont .image-gallery-3 {
    grid-template-columns: repeat(1, 1fr);
  }
}

.reading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: var(--maincolor);
  z-index: 9999;
  transition: width 0.2s;
}
</style>
