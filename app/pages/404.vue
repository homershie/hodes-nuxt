<template>
  <div class="not-found">
    <div class="container">
      <div class="text-center">
        <h1>404</h1>
        <h2>{{ t('404.title') }}</h2>
        <p>{{ t('404.message') }}</p>
        <NuxtLink :to="localePath('/')" class="btn btn-primary">{{ t('404.back_home') }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: computed(() => t('seo.404.title')),
})

useHead({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found h1 {
  font-size: 6rem;
  color: var(--maincolor);
}

.not-found h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.btn {
  padding: 10px 20px;
  background: var(--maincolor);
  color: black;
  font-weight: bold;
  text-decoration: none;
  border-radius: 5px;
  margin-top: 20px;
  display: inline-block;
}
</style>
