<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

// 自動重新導向到第一頁
navigateTo(localePath('/blog/page/1'), { redirectCode: 301 })
</script>
