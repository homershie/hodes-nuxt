<template>
  <!-- ==================== Start About ==================== -->
  <div>
    <!-- 載入進度顯示 -->
    <div v-if="isPreloading" class="loading-progress">
      <div class="progress-bar">
        <div class="progress" :style="{ width: `${loadingProgress}%` }"></div>
      </div>
      <div class="progress-text">載入中... {{ loadingProgress }}%</div>
    </div>

    <section class="about section-padding">
      <div class="container with-pad">
        <div class="row lg-marg">
          <div class="col-lg-5 valign">
            <div class="profile-img">
              <div class="img">
                <img
                  :src="
                    toWebP(
                      'https://images.homershie.com/assets/imgs/header/profile.jpg'
                    )
                  "
                  alt="荷馬桑個人照片"
                />
              </div>
              <span class="icon">
                <img
                  :src="
                    toWebP(
                      'https://images.homershie.com/assets/imgs/header/icon1.png'
                    )
                  "
                  alt=""
                />
              </span>
              <span class="icon">
                <img
                  :src="
                    toWebP(
                      'https://images.homershie.com/assets/imgs/header/icon2.png'
                    )
                  "
                  alt=""
                />
              </span>
              <span class="icon">
                <img
                  :src="
                    toWebP(
                      'https://images.homershie.com/assets/imgs/header/icon3.png'
                    )
                  "
                  alt=""
                />
              </span>
              <span class="icon">
                <img
                  :src="
                    toWebP(
                      'https://images.homershie.com/assets/imgs/header/icon4.png'
                    )
                  "
                  alt=""
                />
              </span>
            </div>
          </div>
          <div class="col-lg-7 valign">
            <div class="cont">
              <div class="sub-title-icon d-flex align-items-center">
                <span class="icon fas fa-lightbulb"></span>
                <h6>關於</h6>
              </div>
              <div class="text">
                <h4 class="mb-30">
                  我是荷馬桑，來自台灣的
                  <span class="main-color"> 視覺和動態設計師 </span> 。
                  <br />
                  專注於平面媒體工作和思考如何平面媒體轉換為活潑的動畫，擅長將複雜的概念轉化為直覺且吸引人的視覺呈現。
                </h4>
                <p>
                  我利用平面和動態的設計元素，結合我日常的興趣，
                  如插畫、動畫、遊戲、音樂和動漫，創造出獨特且具有個人風格的設計作品。同時，致力於從多元包容的視角出發，有效地傳達行銷訊息和塑造品牌形象。
                  我在設計領域累積了豐富的經驗，並且在商業界創作了大量的設計作品。
                  <br />
                  在閒暇之餘，我會更新部落格，發表我對視覺美感的見解，並整理出視覺風格和一些厲害的巨巨給視覺視覺麻瓜們認識。
                  我認為視覺美感也需要普及，不管是提案還是喜歡視覺藝術，我希望我的文章能對你有所幫助。有時間的話，可以幫我點一下LikeCoin，
                  你們的支持也許能成為我前進的動力。
                  <br />
                  感謝你們！
                </p>

                <div class="feat mt-30">
                  <div class="row">
                    <div class="col-sm-6">
                      <div class="item mb-15">
                        <h6 class="sub-title ls1">
                          <span class="fz-13 mr-10 main-color">
                            <i class="fas fa-check"></i>
                          </span>
                          平面設計
                        </h6>
                      </div>
                      <div class="item sm-mb15">
                        <h6 class="sub-title ls1">
                          <span class="fz-13 mr-10 main-color">
                            <i class="fas fa-check"></i>
                          </span>
                          動態設計
                        </h6>
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="item mb-15">
                        <h6 class="sub-title ls1">
                          <span class="fz-13 mr-10 main-color">
                            <i class="fas fa-check"></i>
                          </span>
                          3D動畫
                        </h6>
                      </div>
                      <div class="item">
                        <h6 class="sub-title ls1">
                          <span class="fz-13 mr-10 main-color">
                            <i class="fas fa-check"></i>
                          </span>
                          插畫
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="info mt-50">
                  <div class="row">
                    <div class="col-sm-6">
                      <div class="item d-flex align-items-center sm-mb30">
                        <div class="mr-15">
                          <font-awesome-icon
                            :icon="['far', 'envelope']"
                            class="icon main-color"
                          />
                        </div>
                        <div>
                          <span class="opacity-7 mb-5">電子信箱</span>
                          <h6>homerxworkshop@gmail.com</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== End About ==================== -->
    <!-- ==================== Start Skills ==================== -->
    <section class="skills section-padding pt-0">
      <div class="container with-pad">
        <div class="sec-head mb-80">
          <div class="row justify-content-center">
            <div class="col-lg-6 text-center">
              <div class="sub-title-icon d-flex align-items-center mx-auto">
                <font-awesome-icon :icon="['fas', 'dumbbell']" class="icon" />
                <h6>我的技能</h6>
              </div>
              <h3>優勢</h3>
            </div>
          </div>
        </div>
        <div class="row">
          <!-- 使用 v-for 重構技能列表 -->
          <div
            v-for="skill in skills"
            :key="skill.id"
            class="col-lg-4 col-md-6"
          >
            <div class="item mb-30">
              <div class="d-flex align-items-center mb-30">
                <div class="mr-30">
                  <div class="img icon-img-40">
                    <img :src="skill.icon" :alt="skill.name" />
                  </div>
                </div>
                <div>
                  <h6 class="fz-18">{{ skill.name }}</h6>
                </div>
              </div>
              <div class="skill-progress">
                <span
                  class="progres"
                  :data-value="skill.percentage + '%'"
                  :style="{
                    width: animatedSkills ? skill.percentage + '%' : '0%',
                  }"
                ></span>
              </div>
              <span class="value">{{ skill.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== Start Resume ==================== -->
    <section class="resume section-padding pt-0">
      <div class="container with-pad">
        <div class="sec-head mb-80">
          <div class="row justify-content-center">
            <div class="col-lg-6 text-center">
              <div class="d-inline-block">
                <div class="sub-title-icon d-flex align-items-center">
                  <font-awesome-icon :icon="['fas', 'file-alt']" class="icon" />
                  <h6>我的簡歷</h6>
                </div>
              </div>
              <h3>學歷和工作經驗</h3>
            </div>
          </div>
        </div>

        <div>
          <div
            class="resume-swiper"
            data-carousel="swiper"
            data-space="50"
            data-speed="1000"
          >
            <div
              id="content-carousel-container-unq-resume"
              class="swiper-container"
              data-swiper="container"
            >
              <div class="swiper-wrapper">
                <!-- 使用 v-for 重構履歷列表 -->
                <div
                  v-for="experience in experiences"
                  :key="experience.id"
                  class="swiper-slide"
                >
                  <div class="item text-center">
                    <h6 class="main-color date fz-15 mb-60">
                      {{ experience.period }}
                    </h6>
                    <h5>{{ experience.title }}</h5>
                    <span class="opacity-8 fw-500 mt-10"
                      >[ {{ experience.company }} ]</span
                    >
                    <p class="fz-13 mt-15">{{ experience.description }}</p>
                  </div>
                </div>
              </div>
              <div class="swiper-pagination"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useTimeoutFn } from "@vueuse/core";
import { useImagePreloader } from "@/composables/useImagePreloader.js";
import { useImageFormat } from "@/composables/useImageFormat.js";

// 設定頁面標題範例
const { setPageTitle } = usePageTitle();
setPageTitle("關於我");
useSeoMeta({
  description:
    "了解荷馬桑 Homer Shie 的背景、技能和經歷，以及各式各樣擅長的工具，展示專業的視覺設計師和動態設計師必備的技能。",
});

const { preloadImages, loadingProgress, isPreloading } = useImagePreloader();
const { toWebP } = useImageFormat();

// 響應式資料
const animatedSkills = ref(false);

// 技能資料
const skills = ref([
  {
    id: 1,
    name: "平面設計",
    percentage: 95,
    icon: "https://images.homershie.com/assets/imgs/resume/s1.png",
  },
  {
    id: 2,
    name: "插畫",
    percentage: 85,
    icon: "https://images.homershie.com/assets/imgs/resume/s2.png",
  },
  {
    id: 3,
    name: "動態設計",
    percentage: 80,
    icon: "https://images.homershie.com/assets/imgs/resume/s3.png",
  },
  {
    id: 4,
    name: "3D動畫",
    percentage: 72,
    icon: "https://images.homershie.com/assets/imgs/resume/s4.png",
  },
  {
    id: 5,
    name: "UI設計",
    percentage: 65,
    icon: "https://images.homershie.com/assets/imgs/resume/s5.png",
  },
  {
    id: 6,
    name: "網頁開發",
    percentage: 60,
    icon: "https://images.homershie.com/assets/imgs/resume/s6.png",
  },
]);

// 工作經驗資料
const experiences = ref([
  {
    id: 1,
    period: "2025 - 現在",
    title: "前端工程師學生",
    company: "職訓局北分署",
    description:
      "因應2024年年底前公司業務縮減，於2025年報名職訓局北分署的前端設計課程，系統性學習 HTML、CSS、JavaScript、Vue.js 等技術。課程中也實作 LINE Bot 專案，深入體驗應用層開發流程。期望結合過往設計專長與新習得的開發技能，轉型為能獨立製作互動產品的前端工程師。",
  },
  {
    id: 2,
    period: "2019 - 現在",
    title: "視覺&動態設計師",
    company: "接案暫停中",
    description:
      "自2019年起全職自由接案，與 Garmin 等品牌合作智慧手錶錶面設計，專精視覺整合與動畫製作。服務內容涵蓋品牌形象、平面設計、行銷素材、動態視覺與影片剪輯。平時持續學習 3D、UI、網頁建置等技術，拓展跨領域創作能力與實踐經驗。",
  },
  {
    id: 3,
    period: "2023 - 2025",
    title: "兼職資深美術編輯",
    company: "問禮有限公司",
    description:
      "為穩定收入轉任兼職設計職，參與兒童英文教材出版專案。負責插圖繪製、教材排版、包裝設計與品牌視覺整合。兼顧專案品質與時效，並於此期間積極準備轉職前端工程師，朝設計與開發整合的方向前進。",
  },
  {
    id: 4,
    period: "2018 - 2019",
    title: "視覺設計師",
    company: "臺灣娜珂黛肌有限公司",
    description:
      "我負責薑類保健品的產品視覺與網站素材設計，專注於品牌定位與行銷轉換。協助行銷團隊優化網站視覺與用戶體驗，提升品牌識別與商品曝光。該經驗讓我深入理解設計與商業目標之間的整合策略。",
  },
  {
    id: 5,
    period: "2013 - 2017",
    title: "應用美術學系",
    company: "天主教輔仁大學",
    description:
      "主修視覺設計與美術應用，專注於概念發想、圖像溝通與使用者導向設計。課堂外積極參與接案與工作，提前累積業界經驗，奠定視覺創作與創新思維的堅實基礎，為日後的職涯發展鋪路。",
  },
]);

// 新增技能的方法
const addSkill = (newSkill) => {
  skills.value.push({
    id: skills.value.length + 1,
    ...newSkill,
  });
};

// 新增經驗的方法
const addExperience = (newExperience) => {
  experiences.value.unshift({
    id: experiences.value.length + 1,
    ...newExperience,
  });
};

onMounted(async () => {
  // 收集所有圖片URL
  const imageUrls = [
    // 個人照片
    "https://images.homershie.com/assets/imgs/header/profile.jpg",
    // 圖示
    "https://images.homershie.com/assets/imgs/header/icon1.png",
    "https://images.homershie.com/assets/imgs/header/icon2.png",
    "https://images.homershie.com/assets/imgs/header/icon3.png",
    "https://images.homershie.com/assets/imgs/header/icon4.png",
    // 技能圖示
    ...skills.value.map((skill) => skill.icon),
  ]
    .filter(Boolean)
    .map((url) => toWebP(url));

  // 預載入圖片
  await preloadImages(imageUrls);

  // 啟動技能動畫 - 使用 VueUse 的 useTimeoutFn 替代 setTimeout
  useTimeoutFn(() => {
    animatedSkills.value = true;
  }, 500);

  new window.Swiper(".resume-swiper .swiper-container", {
    spaceBetween: 50,
    speed: 1000,
    loop: false,
    pagination: {
      el: ".resume-swiper .swiper-pagination",
      clickable: true,
      dynamicBullets: false, // 不要用動態分頁
      type: "bullets", // 預設就是 bullets
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      },
    },
  });
});
// 導出方法供其他組件使用
defineExpose({
  addSkill,
  addExperience,
});
</script>

<style lang="scss" scoped>
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
