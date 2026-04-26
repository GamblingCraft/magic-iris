<script setup lang="ts">
const props = withDefaults(defineProps<{
  eyebrow: string
  title: string
  description?: string
  columns?: 2 | 3
  items: Array<{
    id: string
    href: string
    image: string
    imageAlt?: string
    kicker: string
    title: string
    description: string
    metaPrimary?: string
    metaSecondary?: string
    metaLabel?: string
    priceValue?: string
    buttonLabel?: string
    productMicrodata?: boolean
  }>
}>(), {
  description: '',
  columns: 3
})

const gridClass = computed(() =>
  props.columns === 2
    ? 'catalog-link-grid catalog-link-grid--two'
    : 'catalog-link-grid catalog-link-grid--three'
)
</script>

<template>
  <div class="catalog-cards-section">
    <div class="catalog-cards-section__head">
      <div>
        <p class="eyebrow">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
      </div>

      <p v-if="description">{{ description }}</p>
    </div>

    <div :class="gridClass">
      <CatalogLinkCard
        v-for="item in items"
        :key="item.id"
        :item="item"
      />
    </div>
  </div>
</template>
