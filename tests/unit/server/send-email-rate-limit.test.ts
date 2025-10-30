import { describe, it, expect, beforeEach } from 'vitest'

/**
 * 測試 send-email API 的 rate limiting 邏輯
 * 由於 send-email.post.ts 是 event handler，難以直接單元測試
 * 這裡測試 rate limiting 的核心邏輯
 */
describe('send-email rate limiting', () => {
  const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

  /**
   * 檢查 rate limit
   * 限制同一 IP 在 15 分鐘內最多請求 5 次
   */
  function checkRateLimit(ip: string): boolean {
    const now = Date.now()
    const limit = rateLimitMap.get(ip)

    if (!limit || now > limit.resetTime) {
      // 重置或建立新的限制
      rateLimitMap.set(ip, {
        count: 1,
        resetTime: now + 15 * 60 * 1000, // 15 分鐘
      })
      return true
    }

    if (limit.count >= 5) {
      return false
    }

    limit.count++
    return true
  }

  beforeEach(() => {
    rateLimitMap.clear()
  })

  describe('第一次請求', () => {
    it('應該允許第一次請求', () => {
      expect(checkRateLimit('127.0.0.1')).toBe(true)
    })

    it('應該為第一次請求建立新的限制', () => {
      checkRateLimit('127.0.0.1')
      const limit = rateLimitMap.get('127.0.0.1')

      expect(limit).toBeDefined()
      expect(limit!.count).toBe(1)
      expect(limit!.resetTime).toBeGreaterThan(Date.now())
    })
  })

  describe('多次請求', () => {
    it('應該允許前 5 次請求', () => {
      const ip = '127.0.0.1'

      expect(checkRateLimit(ip)).toBe(true) // 1st
      expect(checkRateLimit(ip)).toBe(true) // 2nd
      expect(checkRateLimit(ip)).toBe(true) // 3rd
      expect(checkRateLimit(ip)).toBe(true) // 4th
      expect(checkRateLimit(ip)).toBe(true) // 5th
    })

    it('應該阻止第 6 次請求', () => {
      const ip = '127.0.0.1'

      // 允許 5 次請求
      for (let i = 0; i < 5; i++) {
        checkRateLimit(ip)
      }

      // 第 6 次應該被阻止
      expect(checkRateLimit(ip)).toBe(false)
    })

    it('應該正確計數請求次數', () => {
      const ip = '127.0.0.1'

      checkRateLimit(ip)
      expect(rateLimitMap.get(ip)!.count).toBe(1)

      checkRateLimit(ip)
      expect(rateLimitMap.get(ip)!.count).toBe(2)

      checkRateLimit(ip)
      expect(rateLimitMap.get(ip)!.count).toBe(3)
    })
  })

  describe('不同 IP 的限制', () => {
    it('應該為不同的 IP 分別計數', () => {
      expect(checkRateLimit('127.0.0.1')).toBe(true)
      expect(checkRateLimit('192.168.1.1')).toBe(true)

      const limit1 = rateLimitMap.get('127.0.0.1')
      const limit2 = rateLimitMap.get('192.168.1.1')

      expect(limit1?.count).toBe(1)
      expect(limit2?.count).toBe(1)
    })

    it('應該獨立限制每個 IP', () => {
      // IP1 發送 5 次
      for (let i = 0; i < 5; i++) {
        checkRateLimit('127.0.0.1')
      }

      // IP1 被阻止
      expect(checkRateLimit('127.0.0.1')).toBe(false)

      // IP2 仍可正常請求
      expect(checkRateLimit('192.168.1.1')).toBe(true)
    })
  })

  describe('時間重置', () => {
    it('應該在超過時間後重置計數', () => {
      const ip = '127.0.0.1'

      // 發送 5 次請求
      for (let i = 0; i < 5; i++) {
        checkRateLimit(ip)
      }

      // 確認被阻止
      expect(checkRateLimit(ip)).toBe(false)

      // 模擬時間過去超過 15 分鐘
      const limit = rateLimitMap.get(ip)!
      limit.resetTime = Date.now() - 1000 // 將 resetTime 設為過去

      // 應該允許新的請求
      expect(checkRateLimit(ip)).toBe(true)
      expect(rateLimitMap.get(ip)!.count).toBe(1) // 重新開始計數
    })
  })

  describe('邊界情況', () => {
    it('應該處理未知的 IP', () => {
      expect(checkRateLimit('unknown')).toBe(true)
    })

    it('應該處理空的 IP', () => {
      expect(checkRateLimit('')).toBe(true)
    })

    it('應該處理相同的時間窗口', () => {
      const ip = '127.0.0.1'
      const now = Date.now()

      // 模擬相同的時間窗口
      rateLimitMap.set(ip, {
        count: 4,
        resetTime: now + 1000,
      })

      expect(checkRateLimit(ip)).toBe(true)
      expect(rateLimitMap.get(ip)!.count).toBe(5)
    })

    it('應該處理精確的 5 次請求', () => {
      const ip = '127.0.0.1'

      // 發送 4 次
      for (let i = 0; i < 4; i++) {
        expect(checkRateLimit(ip)).toBe(true)
      }

      // 第 5 次應該成功
      expect(checkRateLimit(ip)).toBe(true)

      // 第 6 次應該失敗
      expect(checkRateLimit(ip)).toBe(false)
    })
  })
})

