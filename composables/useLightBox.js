import { onMounted, nextTick } from 'vue'
import { useImageFormat } from './useImageFormat'

export function enableImageLightbox(originalImages = []) {
  const { toWebP } = useImageFormat()

  // 儲存原始圖片與WebP對應關係
  const imageMap = {}
  if (originalImages && originalImages.length) {
    originalImages.forEach(img => {
      if (img) {
        const webpImg = toWebP(img)
        imageMap[webpImg] = img // 儲存WebP到原始圖片的映射
      }
    })
  }

  // 等 DOM 渲染完
  nextTick(() => {
    const images = document.querySelectorAll('.imgs img, .img img, .cont .image img')
    images.forEach(img => {
      let hasLinkParent = false
      let node = img.parentElement
      while (node) {
        if (node.tagName && node.tagName.toLowerCase() === 'a') {
          hasLinkParent = true
          break
        }
        node = node.parentElement
      }
      if (!hasLinkParent) {
        img.style.cursor = 'zoom-in'
        img.onclick = e => {
          e.stopPropagation()

          // 檢查是否有對應的原始圖片（用於後備）
          const originalSrc = imageMap[img.src] || img.src
          openLightbox(img.src, img.alt, originalSrc)
        }
      } else {
        img.style.cursor = 'pointer'
        img.onclick = null
      }
    })
  })
}

// 使用WebP圖片，但提供原始圖片作為後備
function openLightbox(src, alt, fallbackSrc) {
  // 這裡用最簡單的 modal 實現
  const modal = document.createElement('div')
  modal.style =
    'position:fixed;z-index:9999;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;'
  modal.onclick = () => document.body.removeChild(modal)
  const img = document.createElement('img')
  img.src = src
  img.alt = alt

  // 如果WebP圖片載入失敗，使用原始圖片
  if (fallbackSrc && fallbackSrc !== src) {
    img.onerror = function () {
      this.onerror = null
      this.src = fallbackSrc
    }
  }

  img.style = [
    'max-width:90vw',
    'max-height:90vh',
    'width:auto',
    'height:90vh',
    'border-radius:10px',
    'box-shadow:0 0 20px #000',
    'object-fit:contain', // 保持等比例
    'display:block',
  ].join(';')
  modal.appendChild(img)
  document.body.appendChild(modal)
}

export function useLightBox() {
  onMounted(() => {
    enableImageLightbox()
  })
}
