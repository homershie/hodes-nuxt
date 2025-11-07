#!/usr/bin/env node

import http from 'http'

const testUrl = 'https://r2bucket.homershie.com/assets/imgs/works/work_0090.webp'
const encodedUrl = encodeURIComponent(testUrl)
const apiUrl = `http://localhost:3000/api/proxy-image?url=${encodedUrl}`

console.log('Testing API endpoint:', apiUrl)

const req = http.request(apiUrl, { method: 'GET' }, res => {
  console.log('Status Code:', res.statusCode)
  console.log('Headers:', res.headers)

  if (res.statusCode === 200) {
    console.log('✅ API route is working correctly')
  } else {
    console.log('❌ API route returned error:', res.statusCode)
  }

  // Close the response
  res.on('data', () => {})
  res.on('end', () => {
    console.log('Test completed')
  })
})

req.on('error', err => {
  console.error('❌ Request failed:', err.message)
})

req.setTimeout(5000, () => {
  console.error('❌ Request timed out')
  req.destroy()
})

req.end()
