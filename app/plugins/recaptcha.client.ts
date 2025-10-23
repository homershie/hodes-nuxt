import { VueReCaptcha } from 'vue-recaptcha-v3'

export default defineNuxtPlugin((nuxtApp) => {
  // 只在 client-side 載入 reCAPTCHA
  nuxtApp.vueApp.use(VueReCaptcha, {
    siteKey: '6LfZb4UpAAAAAMf7tGNFoNPvVXGIAY6dU1r4BKpG',
    loaderOptions: {
      useRecaptchaNet: true,
      autoHideBadge: false,
    },
  })
})
