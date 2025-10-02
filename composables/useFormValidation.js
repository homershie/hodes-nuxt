// useFormValidation.js
import { ref } from 'vue'
import * as yup from 'yup'

export function useFormValidation() {
  const formSchema = yup.object({
    name: yup
      .string()
      .required('請輸入您的名字')
      .min(2, '名字至少需要2個字元')
      .max(50, '名字不能超過50個字元')
      .matches(/^[\u4e00-\u9fa5a-zA-Z\s]+$/, '名字只能包含中文、英文和空格'),
    email: yup.string().required('請輸入您的電子信箱').email('請輸入有效的電子信箱格式'),
    subject: yup.string().max(100, '主旨不能超過100個字元'),
    message: yup
      .string()
      .required('請輸入您的訊息')
      .min(10, '訊息至少需要10個字元')
      .max(1000, '訊息不能超過1000個字元')
      .test('no-spam', '訊息內容不適當', value => {
        if (!value) return true
        // 檢查是否包含常見的垃圾訊息關鍵字
        const spamKeywords = ['賭博', '博彩', '賭場', '賭錢', '賭博網站', '博彩網站', '賭場網站']
        return !spamKeywords.some(keyword => value.includes(keyword))
      }),
  })

  // 蜜罐欄位 (Honeypot)
  const honeypot = ref('')

  // 防止重複提交
  const submitCount = ref(0)
  const lastSubmitTime = ref(0)

  // 檢查是否為機器人
  const isBot = () => {
    // 檢查蜜罐欄位是否被填寫
    if (honeypot.value) {
      return true
    }

    // 檢查提交速度 (人類不可能在2秒內填完表單)
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
    // 檢查提交頻率
    const now = Date.now()
    if (now - lastSubmitTime.value < 60000) {
      // 1分鐘內不能重複提交
      return false
    }

    // 檢查提交次數
    if (submitCount.value >= 5) {
      // 24小時內最多提交5次
      const hoursSinceLastSubmit = (now - lastSubmitTime.value) / (1000 * 60 * 60)
      if (hoursSinceLastSubmit < 24) {
        return false
      }
      // 重置計數器
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
