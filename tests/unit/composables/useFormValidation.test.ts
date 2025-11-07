import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useFormValidation } from '@composables/useFormValidation'
import * as yup from 'yup'

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

describe('useFormValidation', () => {
  // Mock global sessionStorage
  beforeEach(() => {
    global.sessionStorage = mockSessionStorage as any
    mockSessionStorage.clear()
    vi.clearAllMocks()
  })

  describe('表單驗證規則', () => {
    it('應該驗證名稱欄位為必填', async () => {
      const { formSchema } = useFormValidation()

      await expect(
        formSchema.validate({
          name: '',
          email: 'test@test.com',
          message: 'This is a test message with more than ten characters.',
        })
      ).rejects.toThrow('請輸入您的名字')
    })

    it('應該驗證名稱長度至少 2 個字元', async () => {
      const { formSchema } = useFormValidation()

      await expect(
        formSchema.validate({
          name: 'A',
          email: 'test@test.com',
          message: 'This is a test message with more than ten characters.',
        })
      ).rejects.toThrow('名字至少需要2個字元')
    })

    it('應該驗證名稱長度不超過 50 個字元', async () => {
      const { formSchema } = useFormValidation()
      const longName = 'A'.repeat(51)

      await expect(
        formSchema.validate({
          name: longName,
          email: 'test@test.com',
          message: 'This is a test message with more than ten characters.',
        })
      ).rejects.toThrow('名字不能超過50個字元')
    })

    it('應該驗證名稱只能包含中文、英文和空格', async () => {
      const { formSchema } = useFormValidation()

      await expect(
        formSchema.validate({
          name: 'Test123',
          email: 'test@test.com',
          message: 'This is a test message with more than ten characters.',
        })
      ).rejects.toThrow('名字只能包含中文、英文和空格')
    })

    it('應該驗證有效的名稱', async () => {
      const { formSchema } = useFormValidation()

      await expect(
        formSchema.validate({
          name: 'Test User',
          email: 'test@test.com',
          message: 'This is a test message with more than ten characters.',
        })
      ).resolves.toBeDefined()
      await expect(
        formSchema.validate({
          name: '測試使用者',
          email: 'test@test.com',
          message: 'This is a test message with more than ten characters.',
        })
      ).resolves.toBeDefined()
    })

    it('應該驗證電子郵件為必填', async () => {
      const { formSchema } = useFormValidation()

      await expect(
        formSchema.validate({
          name: 'Test',
          email: '',
          message: 'This is a test message with more than ten characters.',
        })
      ).rejects.toThrow('請輸入您的電子信箱')
    })

    it('應該驗證電子郵件格式', async () => {
      const { formSchema } = useFormValidation()

      await expect(
        formSchema.validate({
          name: 'Test',
          email: 'invalid-email',
          message: 'This is a test message with more than ten characters.',
        })
      ).rejects.toThrow('請輸入有效的電子信箱格式')
    })

    it('應該驗證有效的電子郵件', async () => {
      const { formSchema } = useFormValidation()

      await expect(
        formSchema.validate({
          name: 'Test',
          email: 'test@example.com',
          message: 'This is a test message with more than ten characters.',
        })
      ).resolves.toBeDefined()
    })

    it('應該驗證主旨長度不超過 100 個字元', async () => {
      const { formSchema } = useFormValidation()
      const longSubject = 'A'.repeat(101)

      await expect(
        formSchema.validate({
          name: 'Test',
          email: 'test@test.com',
          subject: longSubject,
          message: 'This is a test message with more than ten characters.',
        })
      ).rejects.toThrow('主旨不能超過100個字元')
    })

    it('應該驗證訊息為必填', async () => {
      const { formSchema } = useFormValidation()

      await expect(
        formSchema.validate({ name: 'Test', email: 'test@test.com', message: '' })
      ).rejects.toThrow('請輸入您的訊息')
    })

    it('應該驗證訊息長度至少 10 個字元', async () => {
      const { formSchema } = useFormValidation()

      await expect(
        formSchema.validate({ name: 'Test', email: 'test@test.com', message: 'short' })
      ).rejects.toThrow('訊息至少需要10個字元')
    })

    it('應該驗證訊息長度不超過 1000 個字元', async () => {
      const { formSchema } = useFormValidation()
      const longMessage = 'A'.repeat(1001)

      await expect(
        formSchema.validate({ name: 'Test', email: 'test@test.com', message: longMessage })
      ).rejects.toThrow('訊息不能超過1000個字元')
    })

    it('應該驗證訊息不包含垃圾關鍵字', async () => {
      const { formSchema } = useFormValidation()

      await expect(
        formSchema.validate({
          name: 'Test',
          email: 'test@test.com',
          message: '我想去賭博網站看看有什麼好玩的東西',
        })
      ).rejects.toThrow('訊息內容不適當')
    })

    it('應該驗證完整的有效表單', async () => {
      const { formSchema } = useFormValidation()

      const validForm = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a valid test message with enough characters.',
      }

      await expect(formSchema.validate(validForm)).resolves.toBeDefined()
    })
  })

  describe('蜜罐欄位檢測', () => {
    it('應該檢測蜜罐欄位被填寫時為機器人', () => {
      const { honeypot, isBot } = useFormValidation()

      honeypot.value = ''
      expect(isBot()).toBe(false)

      honeypot.value = 'filled'
      expect(isBot()).toBe(true)
    })
  })

  describe('提交速度檢測', () => {
    it('應該檢測快速提交（2秒內）為機器人', () => {
      const { isBot, initFormStartTime } = useFormValidation()

      initFormStartTime()

      // 模擬快速提交（1秒後）
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now + 1000)

      expect(isBot()).toBe(true)
    })

    it('應該允許正常的提交速度（超過 2 秒）', () => {
      const { isBot, initFormStartTime } = useFormValidation()

      initFormStartTime()

      // 模擬正常提交（3秒後）
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now + 3000)

      expect(isBot()).toBe(false)
    })

    it('應該正確初始化表單開始時間', () => {
      const { initFormStartTime } = useFormValidation()

      const mockNow = 1234567890000
      vi.spyOn(Date, 'now').mockReturnValue(mockNow)

      initFormStartTime()

      expect(sessionStorage.getItem('formStartTime')).toBe(mockNow.toString())
    })

    it('不應該覆蓋已存在的表單開始時間', () => {
      const { initFormStartTime } = useFormValidation()

      const existingTime = '1234567890000'
      sessionStorage.setItem('formStartTime', existingTime)

      initFormStartTime()

      expect(sessionStorage.getItem('formStartTime')).toBe(existingTime)
    })
  })

  describe('垃圾訊息檢測', () => {
    it('應該在 1 分鐘內阻止重複提交', () => {
      const { checkSpam, updateSubmitStats } = useFormValidation()

      updateSubmitStats()

      // 模擬 30 秒後再次提交
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now + 30000)

      expect(checkSpam()).toBe(false)
    })

    it('應該在超過 1 分鐘後允許提交', () => {
      const { checkSpam, updateSubmitStats } = useFormValidation()

      updateSubmitStats()

      // 模擬 2 分鐘後再次提交
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now + 120000)

      expect(checkSpam()).toBe(true)
    })

    it('應該在 24 小時內限制最多 5 次提交', () => {
      const { checkSpam, updateSubmitStats } = useFormValidation()

      // 模擬提交 5 次
      for (let i = 0; i < 5; i++) {
        updateSubmitStats()
      }

      expect(checkSpam()).toBe(false)
    })

    it('應該在超過 24 小時後重置提交次數', () => {
      const { checkSpam, updateSubmitStats } = useFormValidation()

      // 模擬提交 5 次
      for (let i = 0; i < 5; i++) {
        updateSubmitStats()
      }

      // 模擬 25 小時後再次提交
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now + 25 * 60 * 60 * 1000)

      expect(checkSpam()).toBe(true)
    })

    it('應該正確更新提交統計', () => {
      const { submitCount, lastSubmitTime, updateSubmitStats } = useFormValidation()

      const mockNow = 1234567890000
      vi.spyOn(Date, 'now').mockReturnValue(mockNow)

      updateSubmitStats()

      expect(submitCount.value).toBe(1)
      expect(lastSubmitTime.value).toBe(mockNow)

      updateSubmitStats()
      expect(submitCount.value).toBe(2)
    })
  })

  describe('回傳值測試', () => {
    it('應該回傳所有必要的函數和狀態', () => {
      const result = useFormValidation()

      expect(result).toHaveProperty('formSchema')
      expect(result).toHaveProperty('honeypot')
      expect(result).toHaveProperty('isBot')
      expect(result).toHaveProperty('checkSpam')
      expect(result).toHaveProperty('updateSubmitStats')
      expect(result).toHaveProperty('initFormStartTime')
      expect(result).toHaveProperty('submitCount')
      expect(result).toHaveProperty('lastSubmitTime')

      expect(typeof result.isBot).toBe('function')
      expect(typeof result.checkSpam).toBe('function')
      expect(typeof result.updateSubmitStats).toBe('function')
      expect(typeof result.initFormStartTime).toBe('function')
    })
  })
})
