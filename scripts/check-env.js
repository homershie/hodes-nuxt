// 載入 .env 文件
import dotenv from 'dotenv'
dotenv.config()

const requiredEnvVars = [
  'NUXT_PUBLIC_RECAPTCHA_SITE_KEY',
  'RECAPTCHA_SECRET_KEY',
  'RESEND_API_KEY',
  'TO_EMAIL',
]

console.log('🔍 檢查環境變數...\n')

let allSet = true
const missingVars = []
const defaultVars = []

requiredEnvVars.forEach(varName => {
  const value = process.env[varName]

  if (!value) {
    console.log(`❌ ${varName}: 未設定`)
    missingVars.push(varName)
    allSet = false
  } else if (value.includes('your_') || value.includes('_here')) {
    console.log(`⚠️  ${varName}: 使用預設值 (需要更新)`)
    defaultVars.push(varName)
    allSet = false
  } else {
    const maskedValue = value.substring(0, 8) + '...' + value.substring(value.length - 4)
    console.log(`✅ ${varName}: ${maskedValue}`)
  }
})

console.log('\n' + '='.repeat(60))

if (allSet) {
  console.log('\n✅ 所有環境變數已正確設定！')
  console.log('\n可以安全地進行部署。\n')
  process.exit(0)
} else {
  console.log('\n⚠️  環境變數配置不完整\n')

  if (missingVars.length > 0) {
    console.log('缺少的變數:')
    missingVars.forEach(v => console.log(`  - ${v}`))
  }

  if (defaultVars.length > 0) {
    console.log('\n使用預設值的變數 (需要更新):')
    defaultVars.forEach(v => console.log(`  - ${v}`))
  }

  console.log('\n請參考 .env.example 文件進行配置。\n')
  process.exit(1)
}
