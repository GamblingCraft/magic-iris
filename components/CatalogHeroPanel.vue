<script setup lang="ts">
import { extractPriceAmount } from '~/utils/format-price'

type CatalogHeroFact = {
  label: string
  value: string
}

type CatalogHeroAction = {
  label: string
  href: string
  kind?: 'accent' | 'ghost'
}

type CatalogHeroProduct = {
  sku: string
  category: string
  description?: string
  price?: string
  url?: string
}

const props = withDefaults(defineProps<{
  eyebrow: string
  title: string
  lead?: string
  description?: string
  image: string
  imageAlt?: string
  tags?: string[]
  facts?: CatalogHeroFact[]
  actions?: CatalogHeroAction[]
  product?: CatalogHeroProduct
}>(), {
  lead: '',
  description: '',
  imageAlt: '',
  tags: () => [],
  facts: () => [],
  actions: () => []
})

const requestUrl = useRequestURL()

const offerPrice = computed(() => extractPriceAmount(props.product?.price))

const productUrl = computed(() => {
  const target = props.product?.url || requestUrl.pathname

  try {
    return new URL(target, requestUrl.origin).toString()
  }
  catch {
    return target
  }
})

const productDescription = computed(() =>
  props.product?.description || props.lead || props.description || props.title
)

const normalizeCompareText = (value?: string) =>
  (value || '')
    .replace(/\s+/g, ' ')
    .replace(/[.!?]+$/g, '')
    .trim()
    .toLowerCase()

const displayLead = computed(() => props.lead?.trim() || '')

const displayDescription = computed(() => {
  const description = props.description?.trim() || ''

  if (!description) {
    return ''
  }

  const normalizedLead = normalizeCompareText(displayLead.value)
  const normalizedDescription = normalizeCompareText(description)

  if (!normalizedLead) {
    return description
  }

  if (!normalizedDescription || normalizedDescription === normalizedLead) {
    return ''
  }

  if (normalizedDescription.startsWith(normalizedLead)) {
    return ''
  }

  return description
})

const displayTags = computed(() => {
  const seen = new Set<string>()

  return props.tags.filter((tag) => {
    const normalizedTag = normalizeCompareText(tag)

    if (!normalizedTag || seen.has(normalizedTag)) {
      return false
    }

    seen.add(normalizedTag)
    return true
  })
})
</script>

<template>
  <component
    :is="product ? 'article' : 'div'"
    class="catalog-hero-panel"
    :itemscope="product ? true : undefined"
    :itemtype="product ? 'https://schema.org/Product' : undefined"
  >
    <meta v-if="product" itemprop="sku" :content="product.sku">
    <meta v-if="product" itemprop="category" :content="product.category">
    <meta v-if="product" itemprop="description" :content="productDescription">
    <meta v-if="product" itemprop="url" :content="productUrl">

    <div
      v-if="product"
      itemprop="brand"
      itemscope
      itemtype="https://schema.org/Brand"
    >
      <meta itemprop="name" content="Magic Iris">
    </div>

    <div
      v-if="product && offerPrice"
      itemprop="offers"
      itemscope
      itemtype="https://schema.org/Offer"
    >
      <meta itemprop="priceCurrency" content="RUB">
      <meta itemprop="price" :content="offerPrice">
      <meta itemprop="availability" content="https://schema.org/InStock">
      <meta itemprop="url" :content="productUrl">
    </div>

    <div class="catalog-hero-panel__media">
      <img
        :src="image"
        :alt="imageAlt || title"
        loading="lazy"
        :itemprop="product ? 'image' : undefined"
      >
    </div>

    <div class="catalog-hero-panel__veil" />
    <div class="catalog-hero-panel__glow" />

    <div class="catalog-hero-panel__content">
      <p class="eyebrow eyebrow--light">{{ eyebrow }}</p>
      <h1 class="catalog-hero-panel__title" :itemprop="product ? 'name' : undefined">{{ title }}</h1>
      <p v-if="displayLead" class="catalog-hero-panel__lead">{{ displayLead }}</p>
      <p v-if="displayDescription" class="catalog-hero-panel__copy">{{ displayDescription }}</p>

      <div v-if="displayTags.length" class="catalog-hero-panel__tags">
        <span v-for="tag in displayTags" :key="tag">{{ tag }}</span>
      </div>

      <div v-if="facts.length" class="catalog-hero-panel__facts">
        <div v-for="fact in facts" :key="fact.label" class="catalog-hero-panel__fact">
          <span>{{ fact.label }}</span>
          <strong>{{ fact.value }}</strong>
        </div>
      </div>

      <div v-if="actions.length" class="catalog-hero-panel__actions">
        <NuxtLink
          v-for="action in actions"
          :key="`${action.label}-${action.href}`"
          :to="action.href"
          :class="['button', action.kind === 'ghost' ? 'button--ghost catalog-hero-panel__button--ghost' : 'button--accent']"
        >
          {{ action.label }}
        </NuxtLink>
      </div>
    </div>
  </component>
</template>
