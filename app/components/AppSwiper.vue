<template>
  <div :class="['swiper-wrapper-component', variant]">
    <div :id="containerId" class="swiper">
      <div class="swiper-wrapper">
        <slot />
      </div>
      <div v-if="showPagination" :id="paginationId" class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  // 基本配置
  variant: {
    type: String,
    default: '',
    validator: value =>
      [
        '',
        'resume-swiper',
        'resume-swiper2',
        'testim-swiper',
        'testim-swiper2',
        'swiper4',
        'swiper5',
      ].includes(value),
  },
  // Swiper 配置
  slidesPerView: {
    type: Number,
    default: undefined,
  },
  spaceBetween: {
    type: Number,
    default: 30,
  },
  speed: {
    type: Number,
    default: 1000,
  },
  autoplay: {
    type: [Boolean, Object],
    default: false,
  },
  loop: {
    type: Boolean,
    default: false,
  },
  centeredSlides: {
    type: Boolean,
    default: false,
  },
  initialSlide: {
    type: Number,
    default: 0,
  },
  effect: {
    type: String,
    default: 'slide',
  },
  direction: {
    type: String,
    default: 'horizontal',
  },
  mousewheel: {
    type: Boolean,
    default: false,
  },
  parallax: {
    type: Boolean,
    default: false,
  },
  // UI 控制
  showPagination: {
    type: Boolean,
    default: true,
  },
  showNavigation: {
    type: Boolean,
    default: false,
  },
  // 自訂 breakpoints
  customBreakpoints: {
    type: Object,
    default: null,
  },
})

const id = useId()
const containerId = `swiper-container-${id}`
const paginationId = `swiper-pagination-${id}`
let swiperInstance = null

// 根據 variant 決定預設的 breakpoints
const getBreakpoints = computed(() => {
  if (props.customBreakpoints) {
    return props.customBreakpoints
  }

  switch (props.variant) {
    case 'swiper5':
      return {
        0: { slidesPerView: 2 },
        640: { slidesPerView: 3 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 5 },
      }
    case 'swiper4':
      return {
        0: { slidesPerView: 1, spaceBetween: 10 },
        640: { slidesPerView: 2, spaceBetween: 30 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }
    case 'resume-swiper':
      return {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      }
    case 'resume-swiper2':
      return {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      }
    case 'testim-swiper':
      return {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      }
    case 'testim-swiper2':
      return {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      }
    default:
      return undefined
  }
})

// 初始化 Swiper
onMounted(async () => {
  const { default: Swiper } = await import('swiper')
  const { Pagination, Navigation, Autoplay, Mousewheel, Parallax, EffectFade } = await import(
    'swiper/modules'
  )

  const config = {
    modules: [Pagination, Navigation, Autoplay, Mousewheel, Parallax, EffectFade],
    speed: props.speed,
    spaceBetween: props.spaceBetween,
    loop: props.loop,
    centeredSlides: props.centeredSlides,
    initialSlide: props.initialSlide,
    effect: props.effect,
    direction: props.direction,
    grabCursor: true,
  }

  // 加入 slidesPerView
  if (props.slidesPerView) {
    config.slidesPerView = props.slidesPerView
  }

  // 加入 autoplay
  if (props.autoplay) {
    config.autoplay = typeof props.autoplay === 'boolean' ? { delay: 3000 } : props.autoplay
  }

  // 加入 mousewheel
  if (props.mousewheel) {
    config.mousewheel = true
  }

  // 加入 parallax
  if (props.parallax) {
    config.parallax = true
  }

  // 加入 breakpoints
  if (getBreakpoints.value) {
    config.breakpoints = getBreakpoints.value
  }

  // 加入 pagination
  if (props.showPagination) {
    config.pagination = {
      el: `#${paginationId}`,
      clickable: true,
    }
  }

  // 加入 navigation
  if (props.showNavigation) {
    config.navigation = {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  }

  swiperInstance = new Swiper(`#${containerId}`, config)
})

// 清理
onUnmounted(() => {
  if (swiperInstance) {
    swiperInstance.destroy()
    swiperInstance = null
  }
})

// 暴露 swiper 實例給父組件
defineExpose({
  swiper: computed(() => swiperInstance),
})
</script>

<style scoped>
.swiper-wrapper-component {
  width: 100%;
}
</style>
