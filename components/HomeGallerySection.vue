<script setup lang="ts">
import type { HomeGalleryItem } from '~/data/home-gallery'
import { homeGallery } from '~/data/home-gallery'

type GalleryColumnItem = HomeGalleryItem & {
  variant: 'portrait' | 'landscape' | 'wide' | 'square'
}

const sectionRef = ref<HTMLElement | null>(null)
const activeImage = ref<HomeGalleryItem | null>(null)

const columnVariantPatterns: Array<Array<GalleryColumnItem['variant']>> = [
  ['portrait', 'landscape', 'square', 'landscape', 'portrait'],
  ['landscape', 'square', 'portrait', 'landscape', 'square'],
  ['portrait', 'square', 'portrait', 'landscape', 'square']
]

const variantWeights: Record<GalleryColumnItem['variant'], number> = {
  portrait: 1.28,
  landscape: 0.8,
  wide: 0.7,
  square: 1
}

const galleryColumns = computed(() => {
  const columns = Array.from({ length: 3 }, (_, columnIndex) => ({
    columnIndex,
    height: 0,
    items: [] as GalleryColumnItem[]
  }))

  homeGallery.items.forEach((item) => {
    const targetColumn = columns.reduce((shortest, column) => {
      return column.height < shortest.height ? column : shortest
    }, columns[0])

    const variantPattern = columnVariantPatterns[targetColumn.columnIndex]
    const variant = variantPattern[targetColumn.items.length % variantPattern.length]

    targetColumn.items.push({
      ...item,
      variant
    })

    targetColumn.height += variantWeights[variant]
  })

  return columns.map((column) => column.items)
})

const openImage = (item: HomeGalleryItem) => {
  activeImage.value = item
}

const closeImage = () => {
  activeImage.value = null
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeImage()
  }
}

watch(activeImage, (image) => {
  if (!import.meta.client) {
    return
  }

  document.documentElement.style.overflow = image ? 'hidden' : ''
})

useGsapReveal(sectionRef, ['.gallery-section .eyebrow', '.gallery-mosaic__head > *', '.gallery-mosaic__item'], {
  start: 'top 88%',
  stagger: 0.06,
  groupDelay: 0.08,
  y: 24,
  blur: 6
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <section ref="sectionRef" class="section gallery-section">
    <div class="container">
      <p class="eyebrow">{{ homeGallery.eyebrow }}</p>

      <div class="gallery-mosaic__head">
        <h2>{{ homeGallery.title }}</h2>
        <p>{{ homeGallery.description }}</p>
      </div>

      <div class="gallery-mosaic">
        <div
          v-for="(column, columnIndex) in galleryColumns"
          :key="`gallery-column-${columnIndex}`"
          class="gallery-mosaic__column"
        >
          <button
            v-for="(item, itemIndex) in column"
            :key="`${columnIndex}-${itemIndex}-${item.id}`"
            type="button"
            class="gallery-mosaic__item"
            :class="`gallery-mosaic__item--${item.variant}`"
            :aria-label="`Открыть фото: ${item.alt}`"
            @click="openImage(item)"
          >
            <figure class="gallery-mosaic__frame">
              <img :src="item.src" :alt="item.alt" loading="lazy">
              <span class="gallery-mosaic__veil" aria-hidden="true" />
            </figure>
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="gallery-lightbox">
        <div v-if="activeImage" class="about-gallery-modal">
          <button type="button" class="about-gallery-modal__backdrop" aria-label="Закрыть фото" @click="closeImage" />

          <div class="about-gallery-modal__dialog" role="dialog" aria-modal="true" :aria-label="activeImage.alt">
            <button type="button" class="about-gallery-modal__close" aria-label="Закрыть" @click="closeImage">
              ×
            </button>

            <figure class="about-gallery-modal__figure">
              <img :src="activeImage.src" :alt="activeImage.alt">
            </figure>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>
