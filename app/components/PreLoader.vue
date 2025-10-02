<template>
  <div v-show="visible" class="loader-wrap">
    <svg id="svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
      <path id="loader-path" d="M0,1005S175,995,500,995s500,5,500,5V0H0Z" />
    </svg>
    <div class="loader-wrap-heading">
      <div class="load-text">
        <span>L</span><span>o</span><span>a</span><span>d</span><span>i</span><span>n</span
        ><span>g</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { useTextFade } from '@/composables/useTextFade'

const visible = ref(true)
const { fadeOutText } = useTextFade()

onMounted(() => {
  const tl = gsap.timeline({
    onComplete() {
      visible.value = false
    },
  })

  // 1. 文字往上淡出
  tl.add(fadeOutText('.loader-wrap-heading .load-text', { delay: 1.5 }))
    // 2. SVG 曲線展開收合
    .to('#loader-path', {
      attr: { d: 'M0 502S175 272 500 272s500 230 500 230V0H0Z' },
      duration: 0.5,
      ease: 'power2.easeIn',
    })
    .to('#loader-path', {
      attr: { d: 'M0 2S175 1 500 1s500 1 500 1V0H0Z' },
      duration: 0.5,
      ease: 'power2.easeOut',
    })
    // 3. SVG 淡出
    .to('#svg', { opacity: 0, duration: 0.5 }, '<')
    // 4. 整個遮罩往上移出畫面
    .to('.loader-wrap', { y: -1500 })
    // 5. 隱藏節點
    .set('.loader-wrap', { display: 'none' })
})
</script>
