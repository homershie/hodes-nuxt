// useFormValidation.js
import { ref, computed } from 'vue'
import * as yup from 'yup'

export function useFormValidation() {
  const { t } = useI18n()

  const formSchema = computed(() =>
    yup.object({
      name: yup
        .string()
        .required(t('validation.name_required'))
        .min(2, t('validation.name_min'))
        .max(50, t('validation.name_max'))
        .matches(/^[\u4e00-\u9fa5a-zA-Z\s]+$/, t('validation.name_format')),
      email: yup
        .string()
        .required(t('validation.email_required'))
        .email(t('validation.email_format')),
      subject: yup.string().max(100, t('validation.subject_max')),
      message: yup
        .string()
        .required(t('validation.message_required'))
        .min(10, t('validation.message_min'))
        .max(1000, t('validation.message_max'))
        .test('no-spam', t('validation.message_spam'), value => {
          if (!value) return true
          const spamKeywords = ['賭博', '博彩', '賭場', '賭錢', '賭博網站', '博彩網站', '賭場網站']
          return !spamKeywords.some(keyword => value.includes(keyword))
        }),
    })
  )

  // 蜜罐欄位 (Honeypot)
  const honeypot = ref('')

  // 防止重複提交
  const submitCount = ref(0)
  const lastSubmitTime = ref(0)

  // 檢查是否為機器人
  const isBot = () => {
    if (honeypot.value) {
      return true
    }

    const formStartTime = sessionStorage.getItem('formStartTime')
    if (formStartTime) {
      const elapsed = Date.now() - parseInt(formStartTime)
      if (elapsed < 2000) {
        return true
      }
    }

    return false
  }

  // 防垃圾訊息檢查
  const checkSpam = () => {
    const now = Date.now()
    if (now - lastSubmitTime.value < 60000) {
      return false
    }

    if (submitCount.value >= 5) {
      const hoursSinceLastSubmit = (now - lastSubmitTime.value) / (1000 * 60 * 60)
      if (hoursSinceLastSubmit < 24) {
        return false
      }
      submitCount.value = 0
    }

    return true
  }

  // 提交成功後更新計數
  const updateSubmitStats = () => {
    submitCount.value++
    lastSubmitTime.value = Date.now()
  }

  // 初始化表單開始時間
  const initFormStartTime = () => {
    if (!sessionStorage.getItem('formStartTime')) {
      sessionStorage.setItem('formStartTime', Date.now().toString())
    }
  }

  return {
    formSchema,
    honeypot,
    isBot,
    checkSpam,
    updateSubmitStats,
    initFormStartTime,
    submitCount,
    lastSubmitTime,
  }
}
