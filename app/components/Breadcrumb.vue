<template>
  <nav v-if="items.length > 0" class="breadcrumb-nav" aria-label="麵包屑導航">
    <ol class="breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="breadcrumb-item"
        :class="{ active: index === items.length - 1 }"
        itemprop="itemListElement"
        itemscope
        itemtype="https://schema.org/ListItem"
      >
        <NuxtLink
          v-if="index < items.length - 1"
          :to="item.path"
          itemprop="item"
          :aria-label="`前往${item.name}`"
        >
          <span itemprop="name">{{ item.name }}</span>
        </NuxtLink>
        <span v-else itemprop="name">{{ item.name }}</span>
        <meta itemprop="position" :content="String(index + 1)" />
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineOptions({
  name: 'AppBreadcrumb',
})

const { items } = defineProps({
  items: {
    type: Array,
    required: false,
    default: () => [],
  },
})
</script>

<style scoped>
.breadcrumb-nav {
  padding: 15px 0;
  margin-bottom: 30px;
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: '/';
  padding: 0 10px;
  color: rgba(255, 255, 255, 0.7);
}

.breadcrumb-item a {
  color: var(--maincolor);
  transition: color 0.3s ease;
}

.breadcrumb-item a:hover {
  color: var(--maincolor);
  text-decoration: underline;
}

.breadcrumb-item.active {
  color: rgba(255, 255, 255, 0.7);
}
</style>
