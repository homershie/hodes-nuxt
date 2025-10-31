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
            <!-- 使用 ContentRenderer 渲染 Nuxt Content，並以自訂元件全面接管標籤 -->
            <div class="article-typo">
              <ContentRenderer
                v-if="article.body"
                :value="article.body"
                :components="{
                  p: ArticleP,
                  h2: ArticleH2,
                  h3: ArticleH3,
                  img: ArticleImg,
                  figure: ArticleFigure,
                  figcaption: ArticleFigcaption,
                  a: ArticleA,
                  ul: ArticleUl,
                  ol: ArticleOl,
                  li: ArticleLi,
                  blockquote: ArticleBlockquote,
                  'image-gallery': ArticleImageGallery,
                  'image-gallery-3': ArticleImageGallery3,
                  'image-masonry': ArticleImageMasonry,
                }"
              />
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

<script setup lang="ts">
import { computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { articles as legacyArticles } from '@data/articleData.js'
import { useScroll } from '@vueuse/core'
import { enableImageLightbox } from '@composables/useLightBox.js'
import ArticleH2 from '@components/article/ArticleH2.vue'
import ArticleH3 from '@components/article/ArticleH3.vue'
import ArticleP from '@components/article/ArticleP.vue'
import ArticleImg from '@components/article/ArticleImg.vue'
import ArticleFigure from '@components/article/ArticleFigure.vue'
import ArticleFigcaption from '@components/article/ArticleFigcaption.vue'
import ArticleA from '@components/article/ArticleA.vue'
import ArticleUl from '@components/article/ArticleUl.vue'
import ArticleOl from '@components/article/ArticleOl.vue'
import ArticleLi from '@components/article/ArticleLi.vue'
import ArticleBlockquote from '@components/article/ArticleBlockquote.vue'
import ArticleImageGallery from '@components/article/ArticleImageGallery.vue'
import ArticleImageMasonry from '@components/article/ArticleImageMasonry.vue'
const ArticleImageGallery3 = ArticleImageGallery

const route = useRoute()
const articleId = route.params.id as string

// 使用 queryCollection API (Nuxt Content v3)
const { data: allArticles } = await useAsyncData('all-articles', () =>
  queryCollection('content').all()
)

// 找到當前文章
const currentArticle = computed(() => {
  if (!allArticles.value) return null
  const articles = allArticles.value.filter(item => item.path && item.path.startsWith('/articles/'))
  return articles.find(item => {
    const id = item.stem ? item.stem.replace(/^articles\//, '') : null
    return id === articleId
  })
})

// 轉換當前文章格式
const article = computed(() => {
  if (!currentArticle.value) return null
  
  const item = currentArticle.value
  const meta = typeof item.meta === 'string' ? JSON.parse(item.meta) : item.meta || item || {}
  const legacyExcerpt = legacyArticles?.[articleId]?.excerpt || ''
  const computedExcerpt = meta.excerpt || item.excerpt || legacyExcerpt
  
  if (import.meta.client) {
    // eslint-disable-next-line no-console
    console.log('Article excerpt debug:', {
      id: articleId,
      hasExcerpt: Boolean(meta.excerpt || item.excerpt),
      computedExcerptSample: (computedExcerpt || '').slice(0, 80),
    })
  }
  
  return {
    id: articleId,
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

// 排序文章（按日期降序）
const sortedArticles = computed(() => {
  if (!allArticles.value) return []

  return allArticles.value
    .filter(item => item.path && item.path.startsWith('/articles/'))
    .map(item => {
      const meta = typeof item.meta === 'string' ? JSON.parse(item.meta) : item.meta || {}
      const id = item.stem ? item.stem.replace(/^articles\//, '') : meta.id || item.stem
      return {
        id,
        title: item.title,
        date: meta.date,
        thumbnail: meta.thumbnail || meta.image || item.thumbnail || item.image,
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
    { property: 'og:type', content: 'article' },
    { property: 'article:published_time', content: article.value.date },
    { property: 'article:author', content: article.value.author },
    // 新增 Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: article.value.title },
    { name: 'twitter:description', content: article.value.excerpt },
    { name: 'twitter:image', content: article.value.image },
    // 新增 robots
    { name: 'robots', content: 'index, follow' },
  ],
  link: [{ rel: 'canonical', href: `https://homershie.com/article/${articleId}` }],
  // 新增 BlogPosting Schema
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.value.title,
        description: article.value.excerpt,
        image: article.value.image,
        datePublished: article.value.date,
        author: {
          '@type': 'Person',
          name: article.value.author || 'Homer Shie',
        },
        publisher: {
          '@type': 'Organization',
          name: 'HODES',
          logo: {
            '@type': 'ImageObject',
            url: 'https://r2bucket.homershie.com/assets/imgs/favicon_homer.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://homershie.com/article/${articleId}`,
        },
      }),
    },
  ],
})

// 在掛載後啟用 lightbox 並調整 gallery 圖片方向
onMounted(async () => {
  if (import.meta.client) {
    await nextTick()
    enableImageLightbox()

    // 自動判斷 gallery 中圖片的方向並設定樣式
    const galleries = document.querySelectorAll('.image-gallery, .image-gallery-3')
    galleries.forEach(gallery => {
      const images = gallery.querySelectorAll('.image img')
      images.forEach(img => {
        // 確保圖片已載入
        if (img.complete) {
          adjustImageOrientation(img)
        } else {
          img.addEventListener('load', () => adjustImageOrientation(img))
        }
      })
    })
  }
})

// 根據圖片寬高比調整樣式
function adjustImageOrientation(img) {
  const aspectRatio = img.naturalWidth / img.naturalHeight

  // 如果是高圖（寬高比 < 1），使用 height: 100%
  // 如果是寬圖或正方形（寬高比 >= 1），使用 width: 100%
  if (aspectRatio < 1) {
    img.classList.add('portrait')
  } else {
    img.classList.remove('portrait')
  }
}
</script>

<style lang="scss">
/* 覆蓋 gallery/masonry 中的 ArticleImg 寬度 */
.cont .image-gallery .article-img,
.cont .image-gallery-3 .article-img,
.cont .image-masonry .article-img {
  width: 100% !important;
  margin: 0 !important;
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
    border-radius: 5px;

    img {
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      object-fit: cover;

      /* 預設寬圖：填滿高度，寬度自適應 */
      height: 100%;
      width: auto;
      min-width: 100%;

      /* 高圖時會被 JS 動態設定為：填滿寬度，高度自適應 */
      &.portrait {
        width: 100%;
        height: auto;
        min-height: 100%;
      }
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
