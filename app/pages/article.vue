<template>
  <section v-if="article" class="main-post section-padding">
    <div class="container with-pad">
      <!-- 閱讀進度條 -->
      <div
        class="reading-progress-bar"
        :style="{ width: progress + '%' }"
      ></div>

      <div class="row justify-content-center">
        <div class="col-lg-10">
          <div class="caption text-center">
            <div class="gat">
              <a href="#0"
                ><span>{{ article.categoryName }}</span></a
              >
            </div>
            <h1 class="fz-40 mt-30">{{ article.title }}</h1>
            <p class="sub-title mt-15">
              {{ article.date }} - By {{ article.author }}
            </p>
          </div>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-lg-9">
          <div class="cont">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="article.content"></div>

            <!-- 分享區域 -->
            <div
              class="info-area flex mt-20 pb-20 pt-20 bord-thin-top bord-thin-bottom"
            >
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
                    <a :href="shareUrls.facebook" target="_blank"
                      ><i class="fab fa-facebook-f"></i
                    ></a>
                    <a :href="shareUrls.twitter" target="_blank"
                      ><i class="fab fa-x"></i
                    ></a>
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
                <router-link :to="`/article/${prevArticle.id}`">
                  <span
                    class="fz-12 text-u ls1 main-color mb-15"
                    style="text-shadow: 2px 2px 2px #000"
                  >
                    <i class="fas fa-angle-left"></i>
                    上一篇
                  </span>
                  <h6
                    class="fw-500 fz-16"
                    style="text-shadow: 2px 2px 2px #000"
                  >
                    {{ prevArticle.title }}
                  </h6>
                </router-link>
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
                <router-link :to="`/article/${nextArticle.id}`">
                  <span
                    class="fz-12 text-u ls1 main-color mb-15"
                    style="text-shadow: 2px 2px 2px #000"
                  >
                    下一篇 <i class="fas fa-angle-right"></i>
                  </span>
                  <h6
                    class="fw-500 fz-16"
                    style="text-shadow: 2px 2px 2px #000"
                  >
                    {{ nextArticle.title }}
                  </h6>
                </router-link>
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
      <router-link to="/blogs" class="butn butn-md butn-bord radius-30 mt-30">
        <span>回到部落格</span>
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { articles } from "@data/articleData.js";
import { useImageCache } from "@composables/useImageCache";
import { useHead } from "@vueuse/head";
import { enableImageLightbox } from "@composables/useLightBox.js";
import { useScroll } from "@vueuse/core";
// import { BASE_TITLE } from '@/router/index.js'
const BASE_TITLE = "HOEDES｜荷馬桑 Homer Shie";

const route = useRoute();
const router = useRouter();
const { preloadImages, loadImage, startCacheCleanup, stopCacheCleanup } =
  useImageCache();

// 使用 useScroll 來計算閱讀進度
const { y } = useScroll(window);
const progress = computed(() => {
  const scrollTop = y.value;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  return docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
});

const article = ref(null);
const articleIds = Object.keys(articles);

// 計算上一篇和下一篇文章
const prevArticle = computed(() => {
  if (!article.value) return null;
  const currentIndex = articleIds.indexOf(article.value.id);
  if (currentIndex === -1) return null;
  const prevIndex = currentIndex - 1;
  return prevIndex >= 0 ? articles[articleIds[prevIndex]] : null;
});

const nextArticle = computed(() => {
  if (!article.value) return null;
  const currentIndex = articleIds.indexOf(article.value.id);
  if (currentIndex === -1) return null;
  const nextIndex = currentIndex + 1;
  return nextIndex < articleIds.length ? articles[articleIds[nextIndex]] : null;
});

// 分享連結
const shareUrls = computed(() => {
  if (!article.value) return {};
  // 取原始完整 URL
  const fullPath = router.currentRoute.value.fullPath;
  const currentUrl = `${window.location.origin}${fullPath}`;
  const url = encodeURIComponent(currentUrl);
  const title = encodeURIComponent(article.value.title);

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
  };
});

// 更新頁面標題的函數
const updatePageTitle = () => {
  if (article.value && article.value.title) {
    document.title = `${article.value.title}|${BASE_TITLE}`;
  } else {
    document.title = `文章詳情|${BASE_TITLE}`;
  }
};

// 載入文章
function loadArticle() {
  const articleId = route.params.id;
  if (articles[articleId]) {
    article.value = articles[articleId];
    // 更新頁面標題
    updatePageTitle();
    // 更新 SEO meta 標籤
    if (article.value.seo) {
      updateMetaTags(article.value.seo);
    }
  } else {
    article.value = null;
    document.title = `文章不存在|${BASE_TITLE}`;
  }
}

// 更新 meta 標籤
function updateMetaTags(seo) {
  // 更新 description
  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta) {
    descMeta.setAttribute("content", seo.description);
  }

  // 更新 keywords
  const keywordsMeta = document.querySelector('meta[name="keywords"]');
  if (keywordsMeta) {
    keywordsMeta.setAttribute("content", seo.keywords);
  }
}

// 監聽路由變化
watch(
  () => route.params.id,
  () => {
    loadArticle();
  }
);

watch(article, async (a) => {
  if (!a) return;

  // 更新頁面標題
  updatePageTitle();

  // 更新 useHead
  useHead({
    title: `${a.title}|${BASE_TITLE}`,
    meta: [
      { name: "description", content: a.seo.description },
      { name: "keywords", content: a.seo.keywords },
      { property: "og:title", content: a.title },
      { property: "og:description", content: a.seo.description },
      { property: "og:image", content: a.image },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  });

  // 收集所有文章內圖片 URL
  const urls = Array.from(document.querySelectorAll(".cont .image img")).map(
    (img) => img.src
  );

  // 預載入圖片
  if (urls.length > 0) {
    await preloadImages(urls);
  }

  // 轉換所有文章內圖片為WebP格式並使用快取
  const imageElements = document.querySelectorAll(".cont .image img");
  for (const img of imageElements) {
    const originalSrc = img.src;
    try {
      const cachedUrl = await loadImage(originalSrc);
      img.src = cachedUrl;
    } catch {
      // 如果快取載入失敗，使用原始圖片
      img.src = originalSrc;
    }
  }

  // 圖片載完後才開 lightbox
  enableImageLightbox();
});

onMounted(() => {
  loadArticle();
  startCacheCleanup();
});

onUnmounted(() => {
  stopCacheCleanup();
});
</script>

<style lang="scss">
article {
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
        content: "•";
        color: var(--maincolor);
        margin-right: 10px;
      }
    }
  }
  ol {
    counter-reset: li; // ← 在 ol 上先把 li 歸零
    padding-left: 20px;
    margin: 40px 0;

    li {
      margin-bottom: 10px;
      font-size: 1.1rem;
      font-weight: normal;
      line-height: 1.6;

      &::before {
        counter-increment: li; // 每個 li 自動 +1
        content: counter(li) "."; // 顯示目前計數
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
    aspect-ratio: 1 / 1; // 讓每個格子都是正方形
    margin: 0;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover; // 填滿且裁切
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
  grid-template-columns: repeat(3, 1fr); // 覆蓋欄數
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
  article {
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
