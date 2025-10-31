#!/bin/bash

# 清理構建緩存
echo "🧹 清理構建緩存..."
rm -rf output
rm -rf .nuxt
rm -rf .output
rm -rf node_modules/.vite
rm -rf node_modules/.cache

# 重新構建
echo "🔨 重新構建專案..."
npm run generate

echo "✅ 構建完成！"
echo ""
echo "📋 接下來的步驟："
echo "1. 本地預覽：npm run preview"
echo "2. 檢查路由是否正確生成"
echo "3. 測試文章和專案頁面"
echo "4. 如果一切正常，提交並推送到 Git"
