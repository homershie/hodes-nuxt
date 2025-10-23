import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'

// 防止 FontAwesome 自動添加 CSS（因為我們會用 Nuxt 的方式處理）
config.autoAddCss = false

// 將所有 solid icons 加入 library
library.add(fas)

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
