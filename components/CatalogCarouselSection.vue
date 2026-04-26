<script setup lang="ts">
const props = withDefaults(defineProps<{
  eyebrow: string
  title: string
  description?: string
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
  description: ''
})

const trackRef = ref<HTMLElement | null>(null)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

const updateScrollState = () => {
  const track = trackRef.value

  if (!track) {
    return
  }

  const maxScroll = track.scrollWidth - track.clientWidth
  canScrollPrev.value = track.scrollLeft > 8
  canScrollNext.value = track.scrollLeft < maxScroll - 8
}

const scrollTrack = (direction: -1 | 1) => {
  const track = trackRef.value

  if (!track) {
    return
  }

  const amount = Math.max(track.clientWidth * 0.86, 320) * direction
  track.scrollBy({ left: amount, behavior: 'smooth' })
}

onMounted(() => {
  nextTick(updateScrollState)
  window.addEventListener('resize', updateScrollState)
  trackRef.value?.addEventListener('scroll', updateScrollState, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScrollState)
  trackRef.value?.removeEventListener('scroll', updateScrollState)
})

watch(
  () => props.items.length,
  async () => {
    await nextTick()
    updateScrollState()
  }
)
</script>

<template>
  <div class="catalog-carousel-section">
    <div class="catalog-cards-section__head">
      <div>
        <p class="eyebrow">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
      </div>

      <div class="catalog-carousel-section__aside">
        <p v-if="description">{{ description }}</p>

        <div class="catalog-carousel-section__controls">
          <button
            type="button"
            class="catalog-carousel-section__control"
            :disabled="!canScrollPrev"
            aria-label="Прокрутить назад"
            @click="scrollTrack(-1)"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M15 5L8 12L15 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            class="catalog-carousel-section__control"
            :disabled="!canScrollNext"
            aria-label="Прокрутить вперед"
            @click="scrollTrack(1)"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div ref="trackRef" class="catalog-carousel-track">
      <CatalogLinkCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        class="catalog-link-card--carousel"
      />
    </div>
  </div>
</template>
