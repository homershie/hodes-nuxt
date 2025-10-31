import { describe, it, expect, beforeEach } from 'vitest'
import { checkRateLimit, clearRateLimit, getRateLimit, setRateLimit } from '@/server/utils/rate-limit'

describe('send-email rate limiting', () => {
  beforeEach(() => {
    clearRateLimit()
  })

  describe('第一次請求', () => {
    it('應該允許第一次請求', () => {
      expect(checkRateLimit('127.0.0.1')).toBe(true)
    })

    it('應該為第一次請求建立新的限制', () => {
      checkRateLimit('127.0.0.1')
      const limit = getRateLimit('127.0.0.1')

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
      for (let i = 0; i < 5; i++) {
        checkRateLimit(ip)
      }
      expect(checkRateLimit(ip)).toBe(false)
    })

    it('應該正確計數請求次數', () => {
      const ip = '127.0.0.1'

      checkRateLimit(ip)
      expect(getRateLimit(ip)!.count).toBe(1)

      checkRateLimit(ip)
      expect(getRateLimit(ip)!.count).toBe(2)

      checkRateLimit(ip)
      expect(getRateLimit(ip)!.count).toBe(3)
    })
  })

  describe('不同 IP 的限制', () => {
    it('應該為不同的 IP 分別計數', () => {
      expect(checkRateLimit('127.0.0.1')).toBe(true)
      expect(checkRateLimit('192.168.1.1')).toBe(true)

      const limit1 = getRateLimit('127.0.0.1')
      const limit2 = getRateLimit('192.168.1.1')

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

      const limit = getRateLimit(ip)!
      setRateLimit(ip, { ...limit, resetTime: Date.now() - 1000 })

      // 應該允許新的請求
      expect(checkRateLimit(ip)).toBe(true)
      expect(getRateLimit(ip)!.count).toBe(1) // 重新開始計數
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
      setRateLimit(ip, {
        count: 4,
        resetTime: now + 1000,
      })

      expect(checkRateLimit(ip)).toBe(true)
      expect(getRateLimit(ip)!.count).toBe(5)
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

