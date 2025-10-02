<template>
  <div ref="elementRef" :class="['animate-on-scroll', { 'is-visible': isVisible }, animationType]">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps({
  animationType: {
    type: String,
    default: 'fade-up',
    validator: value => ['fade-up', 'fade-in', 'slide-up', 'slide-in'].includes(value),
  },
  threshold: {
    type: Number,
    default: 0.1,
  },
})

const elementRef = ref(null)
const isVisible = ref(false)

onMounted(() => {
  if (!elementRef.value) return

  useIntersectionObserver(
    elementRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        isVisible.value = true
      }
    },
    { threshold: props.threshold }
  )
})
</script>

<style scoped>
.animate-on-scroll {
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  will-change: transform, opacity;
}

.animate-on-scroll.is-visible {
  opacity: 1;
}

/* 淡入上升 */
.fade-up {
  transform: translateY(40px);
}
.fade-up.is-visible {
  transform: translateY(0);
}

/* 淡入 */
.fade-in {
  opacity: 0;
}
.fade-in.is-visible {
  opacity: 1;
}

/* 滑入上升 */
.slide-up {
  transform: translateY(100px);
}
.slide-up.is-visible {
  transform: translateY(0);
}

/* 滑入 */
.slide-in {
  transform: translateX(-100px);
}
.slide-in.is-visible {
  transform: translateX(0);
}
</style>
