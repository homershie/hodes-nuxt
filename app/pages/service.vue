<template>
  <!-- ==================== Start Services ==================== -->
  <section class="services section-padding">
    <div class="container with-pad">
      <div class="sec-head mb-80">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center">
            <div class="d-inline-block">
              <div class="sub-title-icon d-flex align-items-center">
                <font-awesome-icon :icon="['fas', 'bell']" class="icon" />
                <h6>我的服務</h6>
              </div>
            </div>
            <h3>我有哪些方式讓您眼前一亮？</h3>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4 col-md-6">
          <div class="item mb-30">
            <div class="cont">
              <div class="d-flex align-items-center mb-30">
                <div>
                  <span class="icon-img-50 mr-40">
                    <img
                      :src="
                        getWebpImage(
                          'https://images.homershie.com/assets/imgs/serv-img/1.png'
                        )
                      "
                      alt="平面設計"
                    />
                  </span>
                </div>
                <div>
                  <span class="opacity-7 fz-13 mb-5"
                    >{{ getProjectCount("平面設計") }}+ 專案</span
                  >
                  <h5 class="fz-20">平面設計</h5>
                </div>
              </div>
              <p>
                擅長品牌識別、海報與包裝設計，從色彩到構圖，每一筆都蘊含策略思維與視覺魔法，協助你在一眼之間脫穎而出。
              </p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="item mb-30">
            <div class="cont">
              <div class="d-flex align-items-center mb-30">
                <div>
                  <span class="icon-img-50 mr-40">
                    <img
                      :src="
                        getWebpImage(
                          'https://images.homershie.com/assets/imgs/serv-img/2.png'
                        )
                      "
                      alt="動態設計"
                    />
                  </span>
                </div>
                <div>
                  <span class="opacity-7 fz-13 mb-5"
                    >{{ getProjectCount("動畫") }}+ 專案</span
                  >
                  <h5 class="fz-20">動態設計</h5>
                </div>
              </div>
              <p>
                為靜態畫面注入靈魂，打造流暢、有記憶點的動畫內容——不論是品牌動畫、行銷短片，或社群用的動態視覺，皆能呈現故事的脈動。
              </p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="item mb-30">
            <div class="cont">
              <div class="d-flex align-items-center mb-30">
                <div>
                  <span class="icon-img-50 mr-40">
                    <img
                      :src="
                        getWebpImage(
                          'https://images.homershie.com/assets/imgs/serv-img/3.png'
                        )
                      "
                      alt="插畫創作"
                    />
                  </span>
                </div>
                <div>
                  <span class="opacity-7 fz-13 mb-5"
                    >{{ getProjectCount("插畫") }}+ 專案</span
                  >
                  <h5 class="fz-20">插畫創作</h5>
                </div>
              </div>
              <p>
                從奇想世界到品牌角色，風格橫跨可愛、極簡、奇幻與實驗。每一筆插畫不只是圖像，而是能與觀者對話的故事容器。
              </p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="item md-mb30">
            <div class="cont">
              <div class="d-flex align-items-center mb-30">
                <div>
                  <span class="icon-img-50 mr-40">
                    <img
                      :src="
                        getWebpImage(
                          'https://images.homershie.com/assets/imgs/serv-img/4.png'
                        )
                      "
                      alt="3D動畫"
                    />
                  </span>
                </div>
                <div>
                  <span class="opacity-7 fz-13 mb-5"
                    >{{ getProjectCount("3D") }}+ 專案</span
                  >
                  <h5 class="fz-20">3D</h5>
                </div>
              </div>
              <p>
                利用3D模型與動畫打造立體世界，讓幻想栩栩如生，把概念化為實體，為品牌和行銷帶來更高維度的想像空間。
              </p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="item sm-mb30">
            <div class="cont">
              <div class="d-flex align-items-center mb-30">
                <div>
                  <span class="icon-img-50 mr-40">
                    <img
                      :src="
                        getWebpImage(
                          'https://images.homershie.com/assets/imgs/serv-img/5.png'
                        )
                      "
                      alt="品牌設計"
                    />
                  </span>
                </div>
                <div>
                  <span class="opacity-7 fz-13 mb-5"
                    >{{ getProjectCount("品牌設計") }}+ 專案</span
                  >
                  <h5 class="fz-20">品牌設計</h5>
                </div>
              </div>
              <p>
                從 Logo
                到整體識別系統，量身打造一套視覺語言，讓品牌在每個接觸點都一致、鮮明且令人記住，打造專屬於你的符號學。
              </p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="item">
            <div class="cont">
              <div class="d-flex align-items-center mb-30">
                <div>
                  <span class="icon-img-50 mr-40">
                    <img
                      :src="
                        getWebpImage(
                          'https://images.homershie.com/assets/imgs/serv-img/6.png'
                        )
                      "
                      alt="UI設計"
                    />
                  </span>
                </div>
                <div>
                  <span class="opacity-7 fz-13 mb-5"
                    >{{ getProjectCount("網頁設計") }}+ 專案</span
                  >
                  <h5 class="fz-20">網頁前端設計</h5>
                </div>
              </div>
              <p>
                結合設計美感與互動邏輯，打造富有視覺張力且使用直覺的網站介面。讓使用者不只瀏覽，而是享受每一次的點擊與滑動。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== End Services ==================== -->
  <!-- ==================== Start Pricing ==================== -->

  <section class="price section-padding pt-0">
    <div class="container with-pad">
      <div class="sec-head mb-80">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center">
            <div class="d-inline-block">
              <div class="sub-title-icon d-flex align-items-center">
                <font-awesome-icon
                  :icon="['fas', 'sticky-note']"
                  class="icon"
                />
                <h6>合作方案</h6>
              </div>
            </div>
            <h3>讓好的設計成為值得的投資</h3>
            <p class="mt-15">
              我重視與每一位客戶的深入溝通，致力於理解需求、解決設計挑戰，並透過專業的視覺語言為專案創造實質價值。
            </p>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6">
          <div class="item md-mb50">
            <h6 class="type">平面設計方案</h6>
            <div class="content d-flex align-items-center">
              <div class="amount mr-40">
                <h2 class="main-color">議價</h2>
                <button
                  type="button"
                  class="butn butn-md butn-bord radius-30 text-u text-center mt-30"
                  @click="scrollToContact"
                >
                  <span>聯絡我</span>
                </button>
              </div>
              <div class="feat">
                <ul class="rest">
                  <li>
                    <i class="fas fa-check"></i>
                    <span>平面設計服務</span>
                  </li>
                  <li>
                    <i class="fas fa-check"></i>
                    <span>品牌識別設計</span>
                  </li>
                  <li>
                    <i class="fas fa-check"></i>
                    <span>插畫創作</span>
                  </li>
                  <li>
                    <i class="fas fa-check"></i>
                    <span>主視覺設計</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="item">
            <h6 class="type">動態設計方案</h6>
            <div class="content d-flex align-items-center">
              <div class="amount mr-40">
                <h2 class="main-color">議價</h2>
                <button
                  type="button"
                  class="butn butn-md butn-bord radius-30 text-u text-center mt-30"
                  @click="scrollToContact"
                >
                  <span>聯絡我</span>
                </button>
              </div>
              <div class="feat">
                <ul class="rest">
                  <li>
                    <i class="fas fa-check"></i>
                    <span>動態設計與動畫</span>
                  </li>
                  <li>
                    <i class="fas fa-check"></i>
                    <span>3D視覺效果</span>
                  </li>
                  <li>
                    <i class="fas fa-check"></i>
                    <span>影片特效與剪輯</span>
                  </li>
                  <li>
                    <i class="fas fa-check"></i>
                    <span>現代化網頁設計</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== End Pricing ==================== -->
  <!-- ==================== Start Brands ==================== -->

  <section class="brands section-padding pt-0">
    <div class="container with-pad">
      <div class="text-center">
        <h6>
          超過
          <span class="main-color">{{ totalProjectCount }}+ 專案</span>
          的成功合作經驗
        </h6>
      </div>
      <div class="row">
        <div class="col">
          <div class="item">
            <div class="img w-25">
              <img
                :src="
                  getWebpImage(
                    'https://images.homershie.com/assets/imgs/brands/garmin.png'
                  )
                "
                style="filter: brightness(0.5)"
                alt="garmin-logo"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== End Brands ==================== -->
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { portfolio } from "@data/portfolioData.js";
import { useImageFormat } from "@composables/useImageFormat.js";

const router = useRouter();
const portfolioData = ref(portfolio);
const { toWebP } = useImageFormat();

// 將圖片路徑轉換為WebP格式
const getWebpImage = (imagePath) => {
  return toWebP(imagePath);
};

// 計算總專案數量
const totalProjectCount = computed(() => portfolioData.value.length);

// 根據類別計算專案數量
const getProjectCount = (targetCategory) => {
  if (!portfolioData.value.length) return 0;
  return portfolioData.value.filter((project) => {
    if (Array.isArray(project.category)) {
      return project.category.includes(targetCategory);
    }
    return project.category === targetCategory;
  }).length;
};

function scrollToContact() {
  // 導航到聯絡頁面並滾動到表單區域
  router.push("/contact#contact-form");
}
</script>
