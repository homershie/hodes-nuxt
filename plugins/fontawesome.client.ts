import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'

// 防止 FontAwesome 自動添加 CSS
config.autoAddCss = false

// 將所有 solid icons 加入 library
library.add(fas)

export default defineNuxtPlugin(nuxtApp => {
  // 註冊全局組件（兩種命名方式都支援）
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
