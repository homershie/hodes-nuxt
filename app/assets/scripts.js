/*-----------------------------------------------------------------------------------

    Theme Name: Gilb
    Theme URI: http://
    Description: Creative Personal & Portfolio (Vanilla JS Version)
    Author: UI-ThemeZ
    Author URI: http://themeforest.net/user/UI-ThemeZ
    Version: 2.0 (Fully Converted to Vanilla JS)

-----------------------------------------------------------------------------------*/

document.addEventListener('DOMContentLoaded', function () {
  'use strict'
  /* global Swiper */

  /* =============================================================================
      --------------------------------  Performance & Error Handling   --------------------------------
      ============================================================================= */

  // External link security
  function secureExternalLinks() {
    const externalLinks = document.querySelectorAll(
      `a[href^="http"]:not([href*="${window.location.hostname}"])`
    )
    externalLinks.forEach(link => {
      if (!link.getAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer')
      }
    })
  }

  // Initialize performance optimizations
  secureExternalLinks()

  /* =============================================================================
      --------------------------------  Navbar Menu   --------------------------------
      ============================================================================= */

  // Mobile menu visibility is handled by Vue components, so avoid
  // manually toggling navbar elements here to prevent conflicts.

  // Navbar scroll effect is now handled by AppNavbar.vue component

  /* =============================================================================
      --------------------------------  Navbar Tabs   --------------------------------
      ============================================================================= */

  const menuLinks = document.querySelectorAll('.fixed-menu .menu-links a')

  menuLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault()
      const tabId = this.getAttribute('data-tab')

      // Remove active class from all links
      menuLinks.forEach(l => l.classList.remove('active'))
      this.classList.add('active')

      // Remove current class from all sections
      const minSecs = document.querySelectorAll('.min-box .min-sec')
      minSecs.forEach(sec => sec.classList.remove('current'))

      // Add current class to target section
      const targetSection = document.getElementById(tabId)
      if (targetSection) {
        targetSection.classList.add('current')
      }
    })
  })

  /* =============================================================================
      ------------------------------  Data Background   ------------------------------
      ============================================================================= */

  // 背景圖片處理已移至 OptimizedImage.vue 組件
  // 請使用 OptimizedImage 組件處理所有圖片，包括背景圖片
  // 例如：
  // <OptimizedImage
  //   :src="imageUrl"
  //   :alt="imageAlt"
  //   class="bg-img"
  //   :isBackground="true"
  // />

  /* =============================================================================
      -----------------------------------  Tabs  -------------------------------------
      ============================================================================= */

  // Regular tabs
  const tabLinks = document.querySelectorAll('#tabs .tab-links .item-link')

  tabLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault()
      const tabId = this.getAttribute('data-tab')

      // Remove current class from all tab links
      tabLinks.forEach(l => l.classList.remove('current'))
      this.classList.add('current')

      // Hide all tab content
      const tabContents = document.querySelectorAll('.tab-content')
      tabContents.forEach(content => (content.style.display = 'none'))

      // Show target tab content
      const targetTab = document.getElementById(tabId)
      if (targetTab) {
        targetTab.style.display = 'block'
      }
    })
  })

  // Fade tabs
  const fadeTabLinks = document.querySelectorAll('#tabs-fade .tab-links .item-link')

  fadeTabLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault()
      const tabId = this.getAttribute('data-tab')

      // Remove current class from all tab links
      fadeTabLinks.forEach(l => l.classList.remove('current'))
      this.classList.add('current')

      // Fade out all tab content
      const tabContents = document.querySelectorAll('.tab-content')
      tabContents.forEach(content => {
        content.style.opacity = '0'
        setTimeout(() => (content.style.display = 'none'), 300)
      })

      // Fade in target tab content
      const targetTab = document.getElementById(tabId)
      if (targetTab) {
        setTimeout(() => {
          targetTab.style.display = 'block'
          setTimeout(() => (targetTab.style.opacity = '1'), 10)
        }, 300)
      }
    })
  })

  /* =============================================================================
      --------------------------------  Accordion  -----------------------------------
      ============================================================================= */

  const accordionTitles = document.querySelectorAll('.accordion .title')

  accordionTitles.forEach(title => {
    title.addEventListener('click', function () {
      const accordionInfo = this.nextElementSibling

      // Close all other accordion items
      const allAccordionInfos = document.querySelectorAll('.accordion-info')
      allAccordionInfos.forEach(info => {
        if (info !== accordionInfo) {
          info.style.display = 'none'
          info.previousElementSibling.classList.remove('active')
        }
      })

      // Toggle current accordion item
      if (accordionInfo.style.display === 'block') {
        accordionInfo.style.display = 'none'
        this.classList.remove('active')
      } else {
        accordionInfo.style.display = 'block'
        this.classList.add('active')
      }
    })
  })

  /* =============================================================================
      ---------------------------------  Tooltip  ------------------------------------
      ============================================================================= */

  const tooltipElements = document.querySelectorAll('[data-tooltip-tit]')

  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', function () {
      const tooltipText = this.getAttribute('data-tooltip-tit')
      const tooltip = document.createElement('div')
      tooltip.className = 'div-tooltip-tit'
      tooltip.textContent = tooltipText
      tooltip.style.cssText = `
                  position: absolute;
                  background: #333;
                  color: white;
                  padding: 5px 10px;
                  border-radius: 4px;
                  font-size: 12px;
                  z-index: 9999;
                  pointer-events: none;
                  opacity: 0;
                  transition: opacity 0.3s ease;
              `

      document.body.appendChild(tooltip)

      // Position tooltip
      const rect = this.getBoundingClientRect()
      tooltip.style.left = `${rect.left}px`
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`

      // Fade in
      setTimeout(() => (tooltip.style.opacity = '1'), 10)
    })

    element.addEventListener('mouseleave', function () {
      const tooltips = document.querySelectorAll('.div-tooltip-tit')
      tooltips.forEach(tooltip => tooltip.remove())
    })

    element.addEventListener('mousemove', function (e) {
      const tooltip = document.querySelector('.div-tooltip-tit')
      if (tooltip) {
        tooltip.style.left = `${e.pageX + 10}px`
        tooltip.style.top = `${e.pageY - 30}px`
      }
    })
  })

  // Sub tooltips
  const subTooltipElements = document.querySelectorAll('[data-tooltip-sub]')

  subTooltipElements.forEach(element => {
    element.addEventListener('mouseenter', function () {
      const tooltipText = this.getAttribute('data-tooltip-sub')
      const tooltip = document.createElement('div')
      tooltip.className = 'div-tooltip-sub'
      tooltip.textContent = tooltipText
      tooltip.style.cssText = `
                  position: absolute;
                  background: #333;
                  color: white;
                  padding: 5px 10px;
                  border-radius: 4px;
                  font-size: 12px;
                  z-index: 9999;
                  pointer-events: none;
                  opacity: 0;
                  transition: opacity 0.3s ease;
              `

      document.body.appendChild(tooltip)

      // Position tooltip
      const rect = this.getBoundingClientRect()
      tooltip.style.left = `${rect.left + 30}px`
      tooltip.style.top = `${rect.top - 15}px`

      // Fade in
      setTimeout(() => (tooltip.style.opacity = '1'), 10)
    })

    element.addEventListener('mouseleave', function () {
      const tooltips = document.querySelectorAll('.div-tooltip-sub')
      tooltips.forEach(tooltip => tooltip.remove())
    })

    element.addEventListener('mousemove', function (e) {
      const tooltip = document.querySelector('.div-tooltip-sub')
      if (tooltip) {
        tooltip.style.left = `${e.pageX + 30}px`
        tooltip.style.top = `${e.pageY - 15}px`
      }
    })
  })

  // Menu hover effects
  const menuHoverElements = document.querySelectorAll('.fixed-menu a, .left-area .menu-links a')

  menuHoverElements.forEach(element => {
    element.addEventListener('mouseenter', function () {
      this.classList.add('show')
    })

    element.addEventListener('mouseleave', function () {
      this.classList.remove('show')
    })
  })

  /* =============================================================================
      ---------------------------------  Progress  -----------------------------------
      ============================================================================= */
  // Trigger progress animation when in viewport
  window.addEventListener('scroll', function () {
    const progressBars = document.querySelectorAll('.skill-progress .progres')

    progressBars.forEach(progress => {
      const rect = progress.getBoundingClientRect()
      const windowHeight = window.innerHeight

      if (rect.bottom <= windowHeight && rect.top >= 0) {
        const percentage = progress.getAttribute('data-value')
        if (percentage && !progress.classList.contains('animated')) {
          progress.classList.add('animated')
          progress.style.width = percentage
        }
      }
    })
  })

  /* =============================================================================
      --------------------------------  Parallax  ----------------------------------
      ============================================================================= */

  const parallaxElements = document.querySelectorAll('.parallaxie')

  function updateParallax() {
    parallaxElements.forEach(element => {
      const speed = 0.8
      const yPos = -(window.pageYOffset * speed)
      element.style.transform = `translateY(${yPos}px)`
      element.style.backgroundSize = 'cover'
    })
  }

  window.addEventListener('scroll', updateParallax)

  /* =============================================================================
      --------------------------------  Counter  ----------------------------------
      ============================================================================= */

  function animateCounters() {
    const counters = document.querySelectorAll('.number-sec .count')

    counters.forEach(counter => {
      const target = parseInt(counter.textContent)
      const duration = 500
      const increment = target / (duration / 16)
      let current = 0

      const updateCounter = () => {
        current += increment
        if (current < target) {
          counter.textContent = Math.floor(current)
          requestAnimationFrame(updateCounter)
        } else {
          counter.textContent = target
        }
      }

      updateCounter()
    })
  }

  // Trigger counter animation when in viewport
  const numberSection = document.querySelector('.number-sec')
  if (numberSection) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters()
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(numberSection)
  }

  /* =============================================================================
      --------------------------------  Cursor Animation  -------------------------
      ============================================================================= */

  const hoverElements = document.querySelectorAll('.hover-this')
  const cursor = document.querySelector('.cursor')

  hoverElements.forEach(element => {
    element.addEventListener('mousemove', function (e) {
      const hoverAnim = this.querySelector('.hover-anim')
      if (hoverAnim) {
        const rect = this.getBoundingClientRect()
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

    element.addEventListener('mouseleave', function () {
      const hoverAnim = this.querySelector('.hover-anim')
      if (hoverAnim) {
        hoverAnim.style.transform = ''
      }
    })
  })

  // Cursor movement
  if (cursor) {
    window.addEventListener('mousemove', function (e) {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
    })

    // Cursor hover effects
    const cursorElements = document.querySelectorAll('a, .cursor-pointer')

    cursorElements.forEach(element => {
      element.addEventListener('mouseenter', function () {
        cursor.classList.add('cursor-active')
      })

      element.addEventListener('mouseleave', function () {
        cursor.classList.remove('cursor-active')
      })
    })
  }

  /* =============================================================================
      --------------------------------  Rolling Text  -----------------------------
      ============================================================================= */

  const rollingTextElements = document.querySelectorAll('.rolling-text')

  rollingTextElements.forEach(element => {
    const innerText = element.innerText
    element.innerHTML = ''

    const textContainer = document.createElement('div')
    textContainer.classList.add('block')

    for (const letter of innerText) {
      const span = document.createElement('span')
      span.innerText = letter.trim() === '' ? '\xa0' : letter
      span.classList.add('letter')
      textContainer.appendChild(span)
    }

    element.appendChild(textContainer)
    element.appendChild(textContainer.cloneNode(true))

    element.addEventListener('mouseover', () => {
      element.classList.remove('play')
    })
  })

  /* =============================================================================
      ----------------------------  Swiper Data Controls   ---------------------------
      ============================================================================= */

  const swiperElements = document.querySelectorAll('[data-carousel="swiper"]')

  swiperElements.forEach(function (element) {
    const containerEl = element.querySelector('[data-swiper="container"]')
    const paginationEl = element.querySelector('[data-swiper="pagination"]')
    const prevEl = element.querySelector('[data-swiper="prev"]')
    const nextEl = element.querySelector('[data-swiper="next"]')

    const containe = containerEl ? containerEl.getAttribute('id') : null
    const pagination = paginationEl ? paginationEl.getAttribute('id') : null
    const prev = prevEl ? prevEl.getAttribute('id') : null
    const next = nextEl ? nextEl.getAttribute('id') : null

    const items = element.dataset.items
    const autoplay = element.dataset.autoplay
    const iSlide = element.dataset.initial
    const loop = element.dataset.loop
    const parallax = element.dataset.parallax
    const space = element.dataset.space
    const speed = element.dataset.speed
    const center = element.dataset.center
    const effect = element.dataset.effect
    const direction = element.dataset.direction
    const mousewheel = element.dataset.mousewheel

    // Configuration
    let conf = {}

    // Responsive configurations
    if (element.classList.contains('swiper5')) {
      conf = {
        breakpoints: {
          0: {
            slidesPerView: 2,
          },
          640: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 5,
          },
        },
      }
    }

    if (element.classList.contains('swiper4')) {
      conf = {
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        },
      }
    }

    if (element.classList.contains('resume-swiper')) {
      conf = {
        pagination: {
          el: '.resume .swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        },
      }
    }

    if (element.classList.contains('resume-swiper2')) {
      conf = {
        pagination: {
          el: '.resume .swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 2,
          },
        },
      }
    }

    if (element.classList.contains('testim-swiper')) {
      conf = {
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        },
        pagination: {
          el: '.testimonials .swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.testimonials .testim-controls .swiper-button-next',
          prevEl: '.testimonials .testim-controls .swiper-button-prev',
        },
      }
    }

    if (element.classList.contains('testim-swiper2')) {
      conf = {
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 1,
          },
          1024: {
            slidesPerView: 2,
          },
        },
        pagination: {
          el: '.testimonials .swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.testimonials .testim-controls .swiper-button-next',
          prevEl: '.testimonials .testim-controls .swiper-button-prev',
        },
      }
    }

    if (element.classList.contains('pagination')) {
      conf = {
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      }
    }

    // Apply additional configuration options
    if (items) {
      conf.slidesPerView = parseInt(items)
    }
    if (autoplay) {
      conf.autoplay = JSON.parse(autoplay)
    }
    if (iSlide) {
      conf.initialSlide = parseInt(iSlide)
    }
    if (center) {
      conf.centeredSlides = JSON.parse(center)
    }
    if (loop) {
      conf.loop = JSON.parse(loop)
    }
    if (parallax) {
      conf.parallax = JSON.parse(parallax)
    }
    if (space) {
      conf.spaceBetween = parseInt(space)
    }
    if (speed) {
      conf.speed = parseInt(speed)
    }
    if (mousewheel) {
      conf.mousewheel = JSON.parse(mousewheel)
    }
    if (effect) {
      conf.effect = effect
    }
    if (direction) {
      conf.direction = direction
    }
    if (prev) {
      if (!conf.navigation) conf.navigation = {}
      conf.navigation.prevEl = `#${prev}`
    }
    if (next) {
      if (!conf.navigation) conf.navigation = {}
      conf.navigation.nextEl = `#${next}`
    }
    if (pagination) {
      conf.pagination = {
        el: `#${pagination}`,
        clickable: true,
      }
    }

    // Initialize Swiper
    if (containe) {
      const initID = `#${containe}`
      new Swiper(initID, conf)
    }
  })

  /* =============================================================================
      -------------------------------  Preloader svg   -------------------------------
      ============================================================================= */

  // Mobile navbar dropdown functionality
  function handleMobileNavbar() {
    const windowWidth = window.innerWidth
    if (windowWidth < 991) {
      const navbarNav = document.querySelector('.navbar .navbar-nav')
      if (navbarNav) {
        const navLinks = navbarNav.querySelectorAll('.nav-link')

        navLinks.forEach(function (navLink) {
          navLink.addEventListener('click', function () {
            // Hide all dropdown menus first
            const allDropdownMenus = navbarNav.querySelectorAll('.dropdown .dropdown-menu')
            allDropdownMenus.forEach(function (menu) {
              menu.classList.remove('show')
            })

            // Show the dropdown menu of the clicked item
            const parentDropdown = this.parentElement
            const dropdownMenu = parentDropdown.querySelector('.dropdown-menu')
            if (dropdownMenu) {
              dropdownMenu.classList.add('show')
            }
          })
        })
      }
    }
  }

  // Initialize mobile navbar handling
  handleMobileNavbar()

  // Re-initialize on window resize
  window.addEventListener('resize', handleMobileNavbar)
})

/* =============================================================================
  -----------------------------  Button scroll up   ------------------------------
  ============================================================================= */

window.addEventListener('load', function () {
  'use strict'

  /* =============================================================================
      ---------------------------------  Preloader  ----------------------------------
      ============================================================================= */

  const body = document.body
  body.classList.add('loaded')
  setTimeout(function () {
    body.classList.remove('loaded')
  }, 1500)
})
