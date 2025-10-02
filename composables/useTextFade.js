import { gsap } from 'gsap'

export function useTextFade() {
  const fadeOutText = (selector, options = {}) => {
    const defaultOptions = {
      delay: 0,
      duration: 0.5,
      y: -100,
      opacity: 0,
      ease: 'power2.easeOut',
    }

    return gsap.to(selector, {
      ...defaultOptions,
      ...options,
    })
  }

  return {
    fadeOutText,
  }
}
