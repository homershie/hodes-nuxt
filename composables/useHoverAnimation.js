import { useEventListener } from '@vueuse/core'

export function useHoverAnimation() {
  const handleHoverAnimation = elements => {
    elements.forEach(element => {
      useEventListener(element, 'mousemove', e => {
        const hoverAnim = element.querySelector('.hover-anim')
        if (hoverAnim) {
          const rect = element.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const width = rect.width
          const height = rect.height
          const move = 25
          const xMove = (x / width) * (move * 2) - move
          const yMove = (y / height) * (move * 2) - move
          hoverAnim.style.transform = `translate(${xMove}px, ${yMove}px)`
        }
      })

      useEventListener(element, 'mouseleave', () => {
        const hoverAnim = element.querySelector('.hover-anim')
        if (hoverAnim) {
          hoverAnim.style.transform = ''
        }
      })
    })
  }

  return {
    handleHoverAnimation,
  }
}
