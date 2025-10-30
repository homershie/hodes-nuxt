// 簡易的記憶體型 rate limit 工具

export type RateLimitEntry = { count: number; resetTime: number }

const rateLimitMap = new Map<string, RateLimitEntry>()

/**
 * 檢查 rate limit：限制同一 IP 在 15 分鐘內最多請求 5 次
 */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + 15 * 60 * 1000,
    })
    return true
  }

  if (limit.count >= 5) {
    return false
  }

  limit.count++
  return true
}

export function clearRateLimit(): void {
  rateLimitMap.clear()
}

export function getRateLimit(ip: string): RateLimitEntry | undefined {
  return rateLimitMap.get(ip)
}

export function setRateLimit(ip: string, entry: RateLimitEntry): void {
  rateLimitMap.set(ip, entry)
}


