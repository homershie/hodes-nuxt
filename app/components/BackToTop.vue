<template>
  <Transition name="fade">
    <button v-if="showButton" class="back-to-top" aria-label="回到頂部" @click="scrollToTop">
      <i class="fas fa-arrow-up"></i>
    </button>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const showButton = ref(false)

// 監聽滾動位置，當超過 300px 時顯示按鈕
watch(y, val => {
  showButton.value = val > 300
})

// 平滑滾動到頂部
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 30px;
  bottom: 30px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(79, 79, 79, 0.5));
  color: var(--maincolor);
  border: 2px solid var(--maincolor);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 20px;
  cursor: pointer;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-to-top:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
