<template>
  <nav class="pagination-wrapper">
    <ul class="pagination">
      <!-- 上一頁 -->
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <NuxtLink v-if="currentPage > 1" :to="`${baseUrl}/${currentPage - 1}`" class="page-link">
          <i class="fas fa-chevron-left"></i>
          <span class="ml-2">上一頁</span>
        </NuxtLink>
        <span v-else class="page-link disabled">
          <i class="fas fa-chevron-left"></i>
          <span class="ml-2">上一頁</span>
        </span>
      </li>

      <!-- 頁碼 -->
      <li
        v-for="page in visiblePages"
        :key="page"
        class="page-item"
        :class="{ active: page === currentPage }"
      >
        <NuxtLink v-if="page !== '...'" :to="`${baseUrl}/${page}`" class="page-link">
          {{ page }}
        </NuxtLink>
        <span v-else class="page-link dots">...</span>
      </li>

      <!-- 下一頁 -->
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <NuxtLink
          v-if="currentPage < totalPages"
          :to="`${baseUrl}/${currentPage + 1}`"
          class="page-link"
        >
          <span class="mr-2">下一頁</span>
          <i class="fas fa-chevron-right"></i>
        </NuxtLink>
        <span v-else class="page-link disabled">
          <span class="mr-2">下一頁</span>
          <i class="fas fa-chevron-right"></i>
        </span>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'BlogPagination',
})

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  baseUrl: {
    type: String,
    required: true,
  },
})

/**
 * 計算顯示的頁碼
 * 規則:
 * - 總頁數 <= 7: 顯示全部
 * - 總頁數 > 7: 顯示 1 ... 當前前後各2頁 ... 最後一頁
 */
const visiblePages = computed(() => {
  const { currentPage, totalPages } = props
  const pages = []

  if (totalPages <= 7) {
    // 顯示所有頁碼
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // 總是顯示第一頁
    pages.push(1)

    if (currentPage > 3) {
      pages.push('...')
    }

    // 顯示當前頁前後各2頁
    const start = Math.max(2, currentPage - 2)
    const end = Math.min(totalPages - 1, currentPage + 2)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push('...')
    }

    // 總是顯示最後一頁
    if (totalPages > 1) {
      pages.push(totalPages)
    }
  }

  return pages
})
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.pagination {
  display: flex;
  list-style: none;
  gap: 0.5rem;
  padding: 0;
}

.page-item {
  display: inline-block;
}

.page-link {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  color: var(--color-font);
  text-decoration: none;
  transition: all 0.3s ease;
}

.page-link:hover:not(.disabled) {
  background-color: var(--maincolor);
  color: white;
  border-color: var(--maincolor);
}

.page-item.active .page-link {
  background-color: var(--maincolor);
  color: white;
  border-color: var(--maincolor);
}

.page-link.disabled {
  color: #999;
  cursor: not-allowed;
  opacity: 0.5;
}

.page-link.dots {
  border: none;
  cursor: default;
}

.page-link.dots:hover {
  background-color: transparent;
  color: var(--color-font);
}

/* 響應式 */
@media (max-width: 576px) {
  .page-link {
    min-width: 35px;
    height: 35px;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }

  .page-link span {
    display: none;
  }
}
</style>
