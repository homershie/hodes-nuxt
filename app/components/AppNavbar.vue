<template>
  <nav class="navbar navbar-chang navbar-expand-lg" :class="{ 'nav-scroll': isScrolled }">
    <div class="container position-re">
      <div class="row">
        <div class="col-lg-3 col-6 order1">
          <div class="bord">
            <!-- Logo -->
            <router-link class="logo icon-img-120" to="/">
              <img
                src="https://images.homershie.com/assets/imgs/logo-light.png"
                alt="荷馬桑 Homer Shie - 視覺設計師標誌"
                loading="eager"
              />
            </router-link>
          </div>
        </div>

        <div class="col-lg-6 order3">
          <div
            v-show="isMenuOpen || isDesktop"
            ref="bgRef"
            class="bg"
            :class="{ open: isMenuOpen }"
          >
            <!-- navbar links -->
            <div class="full-width">
              <ul class="navbar-nav text-center">
                <li class="nav-item">
                  <router-link class="nav-link" to="/">
                    <span class="rolling-text">首頁</span>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/about">
                    <span class="rolling-text">關於</span>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/services">
                    <span class="rolling-text">服務</span>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/portfolio">
                    <span class="rolling-text">作品</span>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/blogs">
                    <span class="rolling-text">部落格</span>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/contact">
                    <span class="rolling-text">聯絡我</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-6 order2">
          <div class="bord d-flex justify-content-end">
            <ul class="social d-flex rest">
              <li>
                <a
                  href="https://www.instagram.com/homer_create"
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label="前往 Instagram 查看荷馬桑作品"
                >
                  <i class="fab fa-instagram" aria-hidden="true"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/homershie"
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label="前往 GitHub 查看荷馬桑的程式"
                >
                  <i class="fab fa-github" aria-hidden="true"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://medium.com/homer-create"
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label="前往 Medium 閱讀荷馬桑文章"
                >
                  <i class="fab fa-medium" aria-hidden="true"></i>
                </a>
              </li>
            </ul>
            <button
              class="navbar-toggler"
              type="button"
              :class="{ active: isMenuOpen }"
              @click.stop="toggleMenu"
            >
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <teleport to="body">
    <div v-show="isMenuOpen && !isDesktop" class="overlay"></div>
  </teleport>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useScroll, useEventListener } from '@vueuse/core'
import gsap from 'gsap'

const route = useRoute()
const isMenuOpen = ref(false)
const isDesktop = ref(window.innerWidth > 991)
const bgRef = ref(null)
const isScrolled = ref(false)
const { y } = useScroll(window)

// 監聽滾動，控制 navbar 樣式 (與原版 JS 保持一致：300px)
watch(y, scrollY => {
  isScrolled.value = scrollY > 300
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// 使用 VueUse 的 useEventListener 替代原生事件監聽
useEventListener(window, 'resize', () => {
  isDesktop.value = window.innerWidth > 991
  if (isDesktop.value) isMenuOpen.value = false
})

onMounted(() => {
  // 初始化
  isDesktop.value = window.innerWidth > 991
})

// 當打開手機版選單時做 GSAP 動畫
watch(isMenuOpen, async open => {
  if (open && !isDesktop.value) {
    await nextTick()
    gsap.fromTo(
      bgRef.value,
      { y: -100, autoAlpha: 0, filter: 'blur(50px)' },
      { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' }
    )
  }
})

// 路由變換自動收合
watch(
  () => route.path,
  () => {
    if (!isDesktop.value) isMenuOpen.value = false
  }
)
</script>

<style lang="scss" scoped>
/* 遮罩層 */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  height: 200vh;
  z-index: 9;
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

/* 整合 style.css 中的 navbar 相關 CSS */
.navbar {
  /* 基礎樣式 */
  margin: 0;
  width: 100%;
  background: transparent;
  border: 0;
  z-index: 999;

  /* bord 樣式 */
  .bord {
    padding: 10px 30px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    height: 100%;
    display: flex;
    align-items: center;
  }

  /* bg 樣式 */
  .bg {
    padding: 10px 0;
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(2px);
    border-radius: 5px;
    height: 100%;
    display: flex;
    align-items: center;

    /* 手機版隱藏，桌面版顯示 */
    display: none;
    @media (min-width: 992px) {
      display: flex;
    }
    &.open {
      display: flex;
    }
  }

  /* social 樣式 */
  .social {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 50px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      margin-left: 5px;

      a {
        color: #fff;
        font-size: 1.1rem;
        transition: color 0.5s ease;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

        &:hover {
          color: var(--maincolor);
        }
      }
    }
  }

  /* navbar-toggler 樣式 */
  .navbar-toggler {
    border: none;
    background: none;
    color: #fff;
    font-size: 1.2rem;
    padding: 5px;

    &:hover,
    &:focus,
    &:active,
    &:visited {
      outline: none !important;
      box-shadow: none;
    }

    .icon-bar {
      display: block;
      width: 22px;
      height: 2px;
      background: #fff;
      border-radius: 1px;
      transition: all 0.3s ease;
      position: relative;
      color: #fff;

      &:not(:last-child) {
        margin-bottom: 4px;
      }
    }

    &.active {
      .icon-bar:nth-child(1) {
        transform: rotate(45deg) translate(4px, 5px);
      }
      .icon-bar:nth-child(2) {
        opacity: 0;
      }
      .icon-bar:nth-child(3) {
        transform: rotate(-45deg) translate(4px, -5px);
      }
    }
  }

  /* container 樣式 */
  .container,
  .container-fluid {
    display: block !important;
  }

  /* navbar-nav 樣式 */
  .navbar-nav {
    justify-content: center;

    .nav-link {
      font-size: 15px;
      color: #fff !important;
      margin: 0 10px;
      padding: 0 5px;
      font-weight: 500;
      position: relative;
      transition: all 0.5s ease;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

      .rolling-text {
        height: 30px;
        line-height: 30px;
        vertical-align: middle;
      }

      .block:last-of-type {
        color: var(--maincolor);
      }

      &:hover,
      &.router-link-active {
        color: var(--maincolor) !important;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 0;
        height: 2px;
        background: var(--maincolor);
        transition: width 0.3s ease;
      }

      &:hover::after,
      &.router-link-active::after {
        width: 100%;
      }
    }
  }

  .logo {
    transition: all 0.5s ease-in-out;

    img {
      height: auto;
      width: 100%;
      transition: all 0.5s ease-in-out;
    }
  }
}

/* navbar-chang 樣式 - 關鍵的動畫部分 */
.navbar-chang {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transition: transform 0.4s;

  /* 滾動後的樣式 - 保留原版的上往下動畫 */
  &.nav-scroll {
    backdrop-filter: blur(15px);
    background: rgba(0, 0, 0, 0.15);
    position: fixed;
    top: -80px;
    transform: translateY(80px) !important;
    left: 0;
    width: 100%;
    box-shadow: 0 2px 30px rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    /* 滾動後移除文字陰影 */
    .nav-link,
    .social a {
      text-shadow: none;
    }
  }
}

/* 手機版響應式樣式 */
@media (max-width: 991px) {
  .navbar {
    .bg {
      position: absolute;
      left: 0;
      top: 65px;
      display: none;
      width: 100%;
      height: auto;
      background: #0c0c0c;
      padding: 20px 30px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .social {
      display: none !important;
    }
  }

  .navbar-nav {
    flex-direction: column;
    align-items: center;

    .nav-item {
      margin: 10px 0;

      .nav-link {
        font-size: 1rem;
        padding: 10px 20px;
      }
    }
  }
}
</style>
