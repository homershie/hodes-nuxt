<template>
  <div class="portfolio">
    <!-- 載入進度顯示 -->
    <div v-if="isPreloading" class="loading-progress">
      <div class="progress-bar">
        <div class="progress" :style="{ width: `${loadingProgress}%` }"></div>
      </div>
      <div class="progress-text">載入中... {{ loadingProgress }}%</div>
    </div>

    <!-- 作品列表 -->
    <div class="gallery">
      <div class="row">
        <div
          v-for="(work, index) in displayedWorks"
          :key="work.id"
          class="col-lg-4 items masonry-item"
          :data-index="index"
        >
          <div class="item">
            <div class="img">
              <img :src="work.image" :alt="work.title" class="radius-5 w-100" />
              <a href="#0" class="link" @click.prevent="viewDetails(work)"></a>
            </div>
            <div class="cont d-flex align-items-center">
              <div>
                <h6>{{ work.title }}</h6>
                <span
                  v-for="(tag, tagIndex) in work.category"
                  :key="tagIndex"
                  class="tag"
                  >{{ tag }}</span
                >
              </div>
              <div class="ml-auto">
                <div class="arrow">
                  <a href="#0" @click.prevent="viewDetails(work)">
                    <svg
                      class="arrow-right"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 34.2 32.3"
                      style="stroke-width: 2"
                    >
                      <line x1="0" y1="16" x2="33" y2="16"></line>
                      <line x1="17.3" y1="0.7" x2="33.2" y2="16.5"></line>
                      <line x1="17.3" y1="31.6" x2="33.5" y2="15.4"></line>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Masonry from "masonry-layout";
import { useImagePreloader } from "@composables/useImagePreloader";
import {
  useEventListener,
  useIntersectionObserver,
  useTimeoutFn,
} from "@vueuse/core";

gsap.registerPlugin(ScrollTrigger);

const props = defineProps({
  works: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["view-details"]);

function viewDetails(work) {
  emit("view-details", work);
}

const displayedWorks = ref([]);
const sortedWorks = computed(() => {
  return [...props.works].sort((a, b) => b.id - a.id);
});

const { preloadImages, loadingProgress, isPreloading } = useImagePreloader();

let masonryInstance = null;

// 初始化 Masonry
const initMasonry = () => {
  const container = document.querySelector(".gallery");
  if (!container) return;

  if (masonryInstance) {
    masonryInstance.destroy();
  }

  masonryInstance = new Masonry(container, {
    itemSelector: ".items",
    columnWidth: ".items",
    percentPosition: true,
    gutter: 0,
    transitionDuration: 0,
    stagger: 30,
    initLayout: true,
  });
};

// 等待短暫延遲，用於確保 DOM 更新
const waitForDomUpdate = () => {
  return new Promise((resolve) => {
    useTimeoutFn(resolve, 50);
  });
};

// 為新項目設置動畫
const setupAnimationsForNewItems = (specificItems = null) => {
  // 選擇要設置動畫的項目
  const items = specificItems || document.querySelectorAll(".items");
  const itemsToAnimate = Array.isArray(items) ? items : Array.from(items);

  // 僅為未動畫的項目設定初始狀態
  itemsToAnimate.forEach((item) => {
    if (!item.classList.contains("animated")) {
      gsap.set(item, { opacity: 0, y: 50 });
    }
  });

  // 使用 VueUse 的 useIntersectionObserver
  itemsToAnimate.forEach((item) => {
    if (!item.classList.contains("animated")) {
      const { stop } = useIntersectionObserver(
        item,
        ([{ isIntersecting, target }]) => {
          if (isIntersecting && !target.classList.contains("animated")) {
            target.classList.add("animated");

            gsap.to(target, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              onComplete: () => {
                // 動畫完成後重新布局 Masonry
                if (masonryInstance) {
                  masonryInstance.layout();
                }
              },
            });

            stop();
          }
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -10% 0px",
        }
      );
    }
  });
};

onMounted(async () => {
  // 直接加載所有作品
  displayedWorks.value = sortedWorks.value;

  // 收集所有需要預載入的圖片URL
  const imageUrls = displayedWorks.value
    .map((work) => [work.image, ...(work.gallery || [])])
    .flat()
    .filter(Boolean);

  // 預載入圖片
  await preloadImages(imageUrls);

  // 等待 DOM 更新
  await waitForDomUpdate();

  // 初始化 Masonry 和動畫
  initMasonry();
  setupAnimationsForNewItems();

  // 使用 VueUse 的 useEventListener 監聽窗口大小改變
  useEventListener(window, "resize", () => {
    if (masonryInstance) {
      // 使用 setTimeout 進行防抖處理
      setTimeout(() => {
        masonryInstance.layout();
      }, 100);
    }
  });
});

onUnmounted(() => {
  if (masonryInstance) {
    masonryInstance.destroy();
  }
  // useEventListener 會自動清理事件監聽器，不需要手動移除
});
</script>

<style scoped>
.img {
  position: relative;
  overflow: hidden;
}

.img img {
  width: 100%;
  height: auto;
  transition: opacity 0.6s ease;
}

/* 禁用所有元素的動畫，避免初始加載時的閃爍 */
.items {
  will-change: transform, opacity;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.loading-progress {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.progress-bar {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress {
  height: 100%;
  background: var(--maincolor);
  transition: width 0.3s ease;
}

.progress-text {
  color: #fff;
  font-size: 14px;
}
</style>
