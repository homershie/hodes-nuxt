import { VueReCaptcha } from 'vue-recaptcha-v3'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  // 只在 client-side 載入 reCAPTCHA
  // 使用環境變數中的 NUXT_PUBLIC_RECAPTCHA_SITE_KEY
  nuxtApp.vueApp.use(VueReCaptcha, {
    siteKey: config.public.recaptchaSiteKey,
    loaderOptions: {
      useRecaptchaNet: true,
      autoHideBadge: false,
    },
  })
})
