<script setup lang="ts">
defineProps<{
  items: Array<{
    label: string
    href?: string
  }>
}>()
</script>

<template>
  <nav class="catalog-breadcrumbs" aria-label="Хлебные крошки">
    <ol class="catalog-breadcrumbs__list">
      <li
        v-for="(item, index) in items"
        :key="`${item.label}-${index}`"
        class="catalog-breadcrumbs__item"
      >
        <NuxtLink
          v-if="item.href && index !== items.length - 1"
          :to="item.href"
          class="catalog-breadcrumbs__link"
        >
          {{ item.label }}
        </NuxtLink>

        <span v-else class="catalog-breadcrumbs__current">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
