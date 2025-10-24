import { VueReCaptcha } from 'vue-recaptcha-v3'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()

  // 只在 client-side 且有設定 site key 時載入 reCAPTCHA
  if (config.public.recaptchaSiteKey) {
    nuxtApp.vueApp.use(VueReCaptcha, {
      siteKey: config.public.recaptchaSiteKey,
      loaderOptions: {
        autoHideBadge: false,
        explicitRenderParameters: {
          badge: 'bottomright',
        },
      },
    })
  } else {
    console.warn('⚠️ NUXT_PUBLIC_RECAPTCHA_SITE_KEY 環境變數未設定')
  }
})
