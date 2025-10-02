<template>
  <footer>
    <div class="container pb-30 pt-30 bord-thin-top">
      <div class="row">
        <div class="col-12">
          <div class="text-center">
            <p class="fz-13">
              © {{ currentYear }} Homer Shie. Proudly powered by
              <span class="underline main-color">
                <a
                  href="https://themeforest.net/user/ui-themez"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Ui-ThemeZ</a
                >
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

// 動態取得當前年份
const currentYear = computed(() => {
  return new Date().getFullYear()
})
</script>

<style lang="scss" scoped>
.footer {
  background: #000;
  color: #fff;

  .footer-logo img {
    max-height: 40px;
  }

  .footer-desc {
    color: #ccc;
    line-height: 1.6;
  }

  .social-links {
    display: flex;
    gap: 15px;

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border-radius: 50%;
      text-decoration: none;
      transition: all 0.3s ease;

      &:hover {
        background: var(--maincolor);
        transform: translateY(-3px);
      }
    }
  }

  .footer-title {
    color: #fff;
    font-weight: 600;
  }

  .contact-item {
    display: flex;
    align-items: center;
    color: #ccc;

    i {
      color: var(--maincolor);
      width: 20px;
    }
  }

  .footer-divider {
    border-color: rgba(255, 255, 255, 0.1);
  }

  .footer-bottom {
    color: #999;

    .fa-heart {
      animation: heartbeat 1.5s ease-in-out infinite;
    }
  }
}

@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
