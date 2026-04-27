<script setup lang="ts">
import { extractPriceAmount, formatDisplayPrice } from '~/utils/format-price'

const props = defineProps<{
  item: {
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
  }
}>()

const requestUrl = useRequestURL()

const absoluteUrl = computed(() => {
  try {
    return new URL(props.item.href, requestUrl.origin).toString()
  }
  catch {
    return props.item.href
  }
})

const offerPrice = computed(() =>
  extractPriceAmount(props.item.priceValue || props.item.metaPrimary)
)

const metaLabel = computed(() =>
  props.item.metaLabel || (props.item.productMicrodata ? 'Стоимость' : 'Формат')
)

const buttonLabel = computed(() => props.item.buttonLabel || 'Открыть')

const isCollectionCard = computed(() => !props.item.productMicrodata)

const displayMetaPrimary = computed(() =>
  props.item.productMicrodata
    ? formatDisplayPrice(props.item.metaPrimary || 'По запросу')
    : props.item.metaPrimary || ''
)
</script>

<template>
  <article
    :class="['catalog-link-card', { 'catalog-link-card--collection': isCollectionCard }]"
    :itemscope="item.productMicrodata ? true : undefined"
    :itemtype="item.productMicrodata ? 'https://schema.org/Product' : undefined"
  >
    <meta v-if="item.productMicrodata" itemprop="sku" :content="item.id">
    <meta v-if="item.productMicrodata" itemprop="category" :content="item.kicker">

    <div
      v-if="item.productMicrodata"
      itemprop="brand"
      itemscope
      itemtype="https://schema.org/Brand"
    >
      <meta itemprop="name" content="Magic Iris">
    </div>

    <div
      v-if="item.productMicrodata && offerPrice"
      itemprop="offers"
      itemscope
      itemtype="https://schema.org/Offer"
    >
      <meta itemprop="priceCurrency" content="RUB">
      <meta itemprop="price" :content="offerPrice">
      <meta itemprop="availability" content="https://schema.org/InStock">
      <meta itemprop="url" :content="absoluteUrl">
    </div>

    <NuxtLink
      :to="item.href"
      class="catalog-link-card__media"
      :itemprop="item.productMicrodata ? 'url' : undefined"
    >
      <img
        :src="item.image"
        :alt="item.imageAlt || item.title"
        loading="lazy"
        :itemprop="item.productMicrodata ? 'image' : undefined"
      >
    </NuxtLink>

    <div class="catalog-link-card__body">
      <p class="catalog-link-card__kicker">{{ item.kicker }}</p>

      <h3>
        <NuxtLink
          :to="item.href"
          class="catalog-link-card__title-link"
          :itemprop="item.productMicrodata ? 'url' : undefined"
        >
          <span :itemprop="item.productMicrodata ? 'name' : undefined">{{ item.title }}</span>
        </NuxtLink>
      </h3>

      <p
        class="catalog-link-card__description"
        :itemprop="item.productMicrodata ? 'description' : undefined"
      >
        {{ item.description }}
      </p>

      <div class="catalog-link-card__footer">
        <div class="catalog-link-card__price-block">
          <span class="catalog-link-card__label">{{ metaLabel }}</span>
          <strong class="catalog-link-card__price">{{ displayMetaPrimary }}</strong>
        </div>

        <NuxtLink :to="item.href" class="catalog-link-card__button">
          <span>{{ buttonLabel }}</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 17L17 7M17 7H8.5M17 7V15.5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
