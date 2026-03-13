<template>
  <div class="error-page">
    <div class="container">
      <div class="text-center">
        <h1>{{ statusCode }}</h1>
        <h2>{{ is404 ? '頁面未找到' : '發生錯誤' }}</h2>
        <p v-if="is404">抱歉，您訪問的頁面不存在。</p>
        <p v-else>{{ error?.message || '發生未知錯誤，請稍後再試。' }}</p>
        <NuxtLink to="/" class="btn">返回首頁</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    required: true,
  },
})

const statusCode = computed(() => props.error?.statusCode || 500)
const is404 = computed(() => statusCode.value === 404)

useHead({
  title: is404.value ? '404 - 頁面未找到 | HODES' : '錯誤 | HODES',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  bodyAttrs: { style: 'background-color: #0c0c0c' },
  htmlAttrs: { style: 'background-color: #0c0c0c' },
})
</script>

<style scoped>
.error-page {
  position: fixed;
  inset: 0;
  z-index: 99999;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0c0c0c;
  color: #fff;
}

.error-page :deep(.container) {
  background: transparent;
}

.error-page h1 {
  font-size: 6rem;
  color: var(--maincolor, #00ff00);
}

.error-page h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #fff;
}

.error-page p {
  color: rgba(255, 255, 255, 0.85);
}

.btn {
  padding: 10px 20px;
  background: var(--maincolor, #00ff00);
  color: #0c0c0c;
  font-weight: bold;
  text-decoration: none;
  border-radius: 5px;
  margin-top: 20px;
  display: inline-block;
}
</style>
