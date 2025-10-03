<script setup>
import { ref, onMounted, watch } from "vue";
import { useImageCache } from "@composables/useImageCache";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "",
  },
  width: {
    type: [String, Number],
    default: "auto",
  },
  height: {
    type: [String, Number],
    default: "auto",
  },
  loading: {
    type: String,
    default: "lazy",
  },
});

const emit = defineEmits(["load", "error"]);

const { loadImage, isLoading, error } = useImageCache();
const imageUrl = ref("");

// 載入圖片
const loadImageData = async () => {
  try {
    imageUrl.value = await loadImage(props.src);
    emit("load");
  } catch (err) {
    emit("error", err);
  }
};

// 監聽 src 變化
watch(
  () => props.src,
  () => {
    loadImageData();
  }
);

// 元件掛載時載入圖片
onMounted(() => {
  loadImageData();
});
</script>

<template>
  <div class="cached-image-container" :style="{ width, height }">
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="alt"
      :loading="loading"
      class="cached-image"
      @load="$emit('load')"
      @error="$emit('error', $event)"
    />
    <div v-else-if="isLoading" class="loading-placeholder">
      <div class="loading-spinner"></div>
    </div>
    <div v-else-if="error" class="error-placeholder">
      <span>圖片載入失敗</span>
    </div>
  </div>
</template>

<style scoped>
.cached-image-container {
  position: relative;
  overflow: hidden;
}

.cached-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loading-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  color: #666;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
