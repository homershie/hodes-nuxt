/**
 * 驗證 Google reCAPTCHA v3 token
 * @param token - 前端傳來的 reCAPTCHA token
 * @returns 驗證是否通過
 */
export async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!token) {
    return false
  }

  const config = useRuntimeConfig()
  const secretKey = config.recaptchaSecretKey

  if (!secretKey) {
    console.error('❌ RECAPTCHA_SECRET_KEY 環境變數未設定')
    return false
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    })

    const data = await response.json()

    // reCAPTCHA v3 返回 score (0.0 - 1.0)
    // score >= 0.5 視為人類操作
    if (data.success && data.score >= 0.5) {
      console.log('✅ reCAPTCHA 驗證通過，分數:', data.score)
      return true
    }

    console.warn('⚠️ reCAPTCHA 驗證失敗:', {
      success: data.success,
      score: data.score,
      errorCodes: data['error-codes'],
    })
    return false
  } catch (error) {
    console.error('❌ reCAPTCHA 驗證錯誤:', error)
    return false
  }
}
