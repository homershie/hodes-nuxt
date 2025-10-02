import { ref, onMounted, onUnmounted } from 'vue'
import { useMouse, useEventListener } from '@vueuse/core'

export function useCustomCursor() {
  const cursor = ref(null)
  const { x, y } = useMouse()
  const isActive = ref(false)

  // 初始化游標
  onMounted(() => {
    cursor.value = document.querySelector('.cursor')
    if (!cursor.value) {
      cursor.value = document.createElement('div')
      cursor.value.className = 'cursor'
      document.body.appendChild(cursor.value)
    }
  })

  // 更新游標位置
  useEventListener('mousemove', () => {
    if (cursor.value) {
      cursor.value.style.left = `${x.value}px`
      cursor.value.style.top = `${y.value}px`
    }
  })

  // 處理游標懸停效果
  const handleCursorHover = elements => {
    elements.forEach(element => {
      useEventListener(element, 'mouseenter', () => {
        if (cursor.value) {
          cursor.value.classList.add('cursor-active')
          isActive.value = true
        }
      })

      useEventListener(element, 'mouseleave', () => {
        if (cursor.value) {
          cursor.value.classList.remove('cursor-active')
          isActive.value = false
        }
      })
    })
  }

  // 清理
  onUnmounted(() => {
    if (cursor.value && cursor.value.parentNode) {
      cursor.value.parentNode.removeChild(cursor.value)
    }
  })

  return {
    cursor,
    isActive,
    handleCursorHover,
  }
}
