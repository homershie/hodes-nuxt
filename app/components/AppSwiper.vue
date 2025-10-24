<template>
  <div :class="['swiper-wrapper-component', variant]">
    <div class="swiper-container" :id="containerId">
      <div class="swiper-wrapper">
        <slot />
      </div>
      <div v-if="showPagination" class="swiper-pagination" :id="paginationId"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  // 基本配置
  variant: {
    type: String,
    default: '',
    validator: value =>
      ['', 'resume-swiper', 'resume-swiper2', 'testim-swiper', 'testim-swiper2', 'swiper4', 'swiper5'].includes(value),
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

const containerId = ref(`swiper-container-${Math.random().toString(36).substr(2, 9)}`)
const paginationId = ref(`swiper-pagination-${Math.random().toString(36).substr(2, 9)}`)
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
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }
    case 'resume-swiper2':
      return {
        0: { slidesPerView: 1 },
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 2 },
      }
    case 'testim-swiper':
      return {
        0: { slidesPerView: 1 },
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }
    case 'testim-swiper2':
      return {
        0: { slidesPerView: 1 },
        640: { slidesPerView: 1 },
        768: { slidesPerView: 1 },
        1024: { slidesPerView: 2 },
      }
    default:
      return undefined
  }
})

// 初始化 Swiper
onMounted(() => {
  const config = {
    speed: props.speed,
    spaceBetween: props.spaceBetween,
    loop: props.loop,
    centeredSlides: props.centeredSlides,
    initialSlide: props.initialSlide,
    effect: props.effect,
    direction: props.direction,
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
      el: `#${paginationId.value}`,
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

  // 等待 Swiper 從 CDN 載入
  if (typeof window.Swiper !== 'undefined') {
    swiperInstance = new window.Swiper(`#${containerId.value}`, config)
  } else {
    // 如果 Swiper 還沒載入，等待一下
    const checkSwiper = setInterval(() => {
      if (typeof window.Swiper !== 'undefined') {
        clearInterval(checkSwiper)
        swiperInstance = new window.Swiper(`#${containerId.value}`, config)
      }
    }, 100)

    // 10 秒後停止檢查
    setTimeout(() => clearInterval(checkSwiper), 10000)
  }
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
