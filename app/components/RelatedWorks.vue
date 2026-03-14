<template>
  <section v-if="relatedWorks.length > 0" class="related-works section-padding">
    <div class="container">
      <div class="sec-head mb-50">
        <h3 class="fw-600">{{ t('related.heading') }}</h3>
        <p>{{ t('related.subtitle') }}</p>
      </div>
      <div class="row">
        <div v-for="work in relatedWorks" :key="work.id" class="col-lg-4 col-md-6 mb-30">
          <NuxtLink
            :to="localePath(`/project/${work.id}`)"
            class="related-work-card"
            :aria-label="t('related.view_aria', { title: work.title })"
          >
            <div class="img-wrapper">
              <img
                :src="work.image"
                :alt="work.title"
                class="radius-5 w-100"
                loading="lazy"
                :style="{
                  objectFit: 'cover',
                  aspectRatio: work.imageDimensions
                    ? `${work.imageDimensions.width}/${work.imageDimensions.height}`
                    : '4/3',
                }"
              />
            </div>
            <div class="cont d-flex align-items-center">
              <div class="content-area">
                <h6 class="work-title">{{ work.title }}</h6>
                <div class="tags-container">
                  <span
                    v-for="(tag, tagIndex) in work.category"
                    :key="tagIndex"
                    class="tag clickable-tag"
                    @click.stop="handleTagClick(tag)"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="ml-auto">
                <div class="arrow">
                  <a
                    href="#0"
                    :aria-label="t('related.view_detail_aria', { title: work.title })"
                    @click.prevent="viewDetails(work)"
                  >
                    <svg
                      class="arrow-right"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 34.2 32.3"
                      style="stroke-width: 2"
                      aria-hidden="true"
                    >
                      <line x1="0" y1="16" x2="33" y2="16"></line>
                      <line x1="17.3" y1="0.7" x2="33.2" y2="16.5"></line>
                      <line x1="17.3" y1="31.6" x2="33.5" y2="15.4"></line>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
      <div class="text-center mt-50">
        <NuxtLink :to="localePath('/portfolio')" class="btn btn-primary">{{ t('related.view_all') }}</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePortfolio } from '@composables/usePortfolio.js'

const { t } = useI18n()
const localePath = useLocalePath()

const props = defineProps({
  currentWorkId: {
    type: [String, Number],
    required: true,
  },
  limit: {
    type: Number,
    default: 6,
  },
})

const router = useRouter()
const { getRelatedWorks } = usePortfolio()

const relatedWorks = computed(() => {
  return getRelatedWorks(props.currentWorkId, props.limit)
})

function viewDetails(work) {
  router.push(localePath(`/project/${work.id}`))
}

function handleTagClick(tag) {
  router.push({ path: localePath('/portfolio'), query: { category: tag } })
}
</script>

<style scoped>
.related-work-card {
  background: rgb(24, 24, 24);
  padding: 10px;
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: 10px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.related-work-card:hover {
  transform: translateY(-5px);
}

.img-wrapper {
  overflow: hidden;
  border-radius: 10px;
}

.img-wrapper img {
  transition: transform 0.3s ease;
}

.related-work-card:hover .img-wrapper img {
  transform: scale(1.05);
}

.content-area {
  flex: 1;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0 5px;
}

.work-title {
  font-weight: 600;
  margin-bottom: 10px;
  color: #fafafa;
}

.tags-container {
  min-height: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 8px;
}

.arrow {
  width: 45px;
  height: 45px;
  line-height: 40px;
  text-align: center;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 50%;
}

.arrow svg {
  stroke: #fff;
  fill: #fff;
  width: 15px;
  transform: rotate(-45deg);
  transition: all 0.4s;
}

.related-work-card:hover .arrow svg {
  stroke: var(--maincolor);
  fill: var(--maincolor);
}

/* 內容區域 */
.cont {
  flex: 1;
  min-height: 80px; /* 確保內容區域有最小高度 */
  margin-bottom: 10px;
  margin-top: 10px;
}

.tag {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 15px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  flex-shrink: 0;
}

.clickable-tag {
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s ease;
}

.clickable-tag:hover {
  transform: translateY(-1px);
}

.clickable-tag:active {
  transform: translateY(0);
}

.btn-primary {
  padding: 12px 30px;
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.7);
  border-radius: 5px;
  border: none;
  text-decoration: none;
  transition: background color 0.3s ease;
}

.btn-primary:hover {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: var(--maincolor);
}
</style>
