<script setup lang="ts">
type CatalogGalleryItem = {
  id: string
  src: string
  alt: string
}

type DesktopRenderItem = CatalogGalleryItem & {
  realIndex: number
  renderKey: string
}

const DESKTOP_VISIBLE_SLIDES = 3

const props = defineProps<{
  items: CatalogGalleryItem[]
}>()

const activeIndex = ref(0)
const isLightboxOpen = ref(false)
const desktopViewportRef = ref<HTMLElement | null>(null)
const desktopStartIndex = ref(0)
const desktopSlideWidth = ref(0)
const desktopGap = ref(18)
const desktopAnimate = ref(true)

const galleryItems = computed(() => props.items || [])
const hasMultipleItems = computed(() => galleryItems.value.length > 1)
const activeItem = computed(() => galleryItems.value[activeIndex.value] || null)
const desktopVisibleCount = computed(() =>
  Math.min(DESKTOP_VISIBLE_SLIDES, Math.max(galleryItems.value.length, 1))
)
const desktopCanLoop = computed(() => galleryItems.value.length > desktopVisibleCount.value)
const desktopMaxStaticIndex = computed(() =>
  Math.max(galleryItems.value.length - desktopVisibleCount.value, 0)
)

const desktopRenderedItems = computed<DesktopRenderItem[]>(() => {
  if (!galleryItems.value.length) {
    return []
  }

  if (!desktopCanLoop.value) {
    return galleryItems.value.map((item, realIndex) => ({
      ...item,
      realIndex,
      renderKey: `static-${item.id}-${realIndex}`
    }))
  }

  return [...galleryItems.value, ...galleryItems.value, ...galleryItems.value].map((item, renderIndex) => ({
    ...item,
    realIndex: renderIndex % galleryItems.value.length,
    renderKey: `loop-${item.id}-${renderIndex}`
  }))
})

const desktopTrackStyle = computed(() => ({
  gap: `${desktopGap.value}px`,
  transform: `translate3d(-${desktopStartIndex.value * (desktopSlideWidth.value + desktopGap.value)}px, 0, 0)`,
  transition: desktopAnimate.value ? 'transform 0.62s cubic-bezier(0.22, 1, 0.36, 1)' : 'none'
}))

const desktopSlideStyle = computed(() => ({
  width: `${desktopSlideWidth.value}px`
}))

const runInBrowserFrame = (callback: () => void) => {
  if (!import.meta.client) {
    callback()
    return
  }

  requestAnimationFrame(callback)
}

const syncDesktopStartToActive = () => {
  if (!galleryItems.value.length) {
    desktopStartIndex.value = 0
    return
  }

  if (desktopCanLoop.value) {
    desktopStartIndex.value = galleryItems.value.length + activeIndex.value
    return
  }

  desktopStartIndex.value = Math.min(activeIndex.value, desktopMaxStaticIndex.value)
}

const updateDesktopMetrics = () => {
  if (!import.meta.client || !desktopViewportRef.value) {
    return
  }

  desktopGap.value = window.innerWidth > 1240 ? 18 : 16
  const visibleCount = desktopVisibleCount.value
  const viewportWidth = desktopViewportRef.value.clientWidth
  desktopSlideWidth.value = Math.max(
    (viewportWidth - desktopGap.value * (visibleCount - 1)) / visibleCount,
    0
  )
}

const updateForItems = async () => {
  if (!galleryItems.value.length) {
    activeIndex.value = 0
    isLightboxOpen.value = false
    desktopStartIndex.value = 0
    return
  }

  if (activeIndex.value > galleryItems.value.length - 1) {
    activeIndex.value = 0
  }

  desktopAnimate.value = false
  syncDesktopStartToActive()
  await nextTick()
  updateDesktopMetrics()

  runInBrowserFrame(() => {
    desktopAnimate.value = true
  })
}

watch(galleryItems, updateForItems, { immediate: true })

const selectIndex = (index: number) => {
  if (index < 0 || index >= galleryItems.value.length) {
    return
  }

  activeIndex.value = index
}

const openLightbox = () => {
  if (!activeItem.value) {
    return
  }

  isLightboxOpen.value = true
}

const openLightboxAt = (index: number) => {
  selectIndex(index)
  openLightbox()
}

const closeLightbox = () => {
  isLightboxOpen.value = false
}

const goToPrevious = () => {
  if (!galleryItems.value.length) {
    return
  }

  activeIndex.value =
    activeIndex.value === 0 ? galleryItems.value.length - 1 : activeIndex.value - 1
}

const goToNext = () => {
  if (!galleryItems.value.length) {
    return
  }

  activeIndex.value =
    activeIndex.value === galleryItems.value.length - 1 ? 0 : activeIndex.value + 1
}

const goDesktopPrevious = () => {
  if (!galleryItems.value.length) {
    return
  }

  if (!desktopCanLoop.value) {
    activeIndex.value =
      activeIndex.value === 0 ? desktopMaxStaticIndex.value : Math.max(activeIndex.value - 1, 0)
    desktopStartIndex.value = activeIndex.value
    return
  }

  activeIndex.value =
    activeIndex.value === 0 ? galleryItems.value.length - 1 : activeIndex.value - 1
  desktopStartIndex.value -= 1
}

const goDesktopNext = () => {
  if (!galleryItems.value.length) {
    return
  }

  if (!desktopCanLoop.value) {
    activeIndex.value =
      activeIndex.value >= desktopMaxStaticIndex.value ? 0 : Math.min(activeIndex.value + 1, desktopMaxStaticIndex.value)
    desktopStartIndex.value = activeIndex.value
    return
  }

  activeIndex.value =
    activeIndex.value === galleryItems.value.length - 1 ? 0 : activeIndex.value + 1
  desktopStartIndex.value += 1
}

const onDesktopTransitionEnd = () => {
  if (!desktopCanLoop.value || !galleryItems.value.length) {
    return
  }

  const itemsCount = galleryItems.value.length
  let nextIndex = desktopStartIndex.value

  if (desktopStartIndex.value < itemsCount) {
    nextIndex = desktopStartIndex.value + itemsCount
  } else if (desktopStartIndex.value >= itemsCount * 2) {
    nextIndex = desktopStartIndex.value - itemsCount
  }

  if (nextIndex === desktopStartIndex.value) {
    return
  }

  desktopAnimate.value = false
  desktopStartIndex.value = nextIndex

  runInBrowserFrame(() => {
    runInBrowserFrame(() => {
      desktopAnimate.value = true
    })
  })
}

const onKeydown = (event: KeyboardEvent) => {
  if (!isLightboxOpen.value) {
    return
  }

  if (event.key === 'Escape') {
    closeLightbox()
  }

  if (event.key === 'ArrowLeft') {
    goToPrevious()
  }

  if (event.key === 'ArrowRight') {
    goToNext()
  }
}

onMounted(() => {
  updateDesktopMetrics()
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', updateDesktopMetrics)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', updateDesktopMetrics)
})
</script>

<template>
  <div v-if="galleryItems.length" class="catalog-gallery-viewer">
    <div class="catalog-gallery-desktop">
      <div ref="desktopViewportRef" class="catalog-gallery-desktop__viewport">
        <div
          class="catalog-gallery-desktop__track"
          :style="desktopTrackStyle"
          @transitionend="onDesktopTransitionEnd"
        >
          <button
            v-for="item in desktopRenderedItems"
            :key="item.renderKey"
            type="button"
            class="catalog-gallery-desktop__slide"
            :style="desktopSlideStyle"
            @click="openLightboxAt(item.realIndex)"
          >
            <img :src="item.src" :alt="item.alt" loading="lazy">

            <span class="catalog-gallery-desktop__zoom">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M10.5 4a6.5 6.5 0 1 0 4.26 11.42l4.91 4.91 1.41-1.41-4.91-4.91A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm-.75 1.75v2h-2v1.5h2v2h1.5v-2h2v-1.5h-2v-2h-1.5Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <div v-if="hasMultipleItems" class="catalog-gallery-desktop__footer">
        <span class="catalog-gallery-desktop__count">
          {{ activeIndex + 1 }} / {{ galleryItems.length }}
        </span>

        <div class="catalog-gallery-desktop__controls">
          <button type="button" class="catalog-gallery-viewer__arrow" @click="goDesktopPrevious">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5L8 12L15 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <button type="button" class="catalog-gallery-viewer__arrow" @click="goDesktopNext">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="catalog-gallery-viewer__mobile">
      <div class="catalog-gallery-viewer__stage">
        <button
          type="button"
          class="catalog-gallery-viewer__main"
          @click="openLightbox"
        >
          <img
            v-if="activeItem"
            :src="activeItem.src"
            :alt="activeItem.alt"
            loading="lazy"
          >

          <span class="catalog-gallery-viewer__zoom">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M10.5 4a6.5 6.5 0 1 0 4.26 11.42l4.91 4.91 1.41-1.41-4.91-4.91A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm-.75 1.75v2h-2v1.5h2v2h1.5v-2h2v-1.5h-2v-2h-1.5Z"
                fill="currentColor"
              />
            </svg>
            <span>Увеличить</span>
          </span>
        </button>

        <div v-if="hasMultipleItems" class="catalog-gallery-viewer__nav">
          <button type="button" class="catalog-gallery-viewer__arrow" @click="goToPrevious">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5L8 12L15 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <span class="catalog-gallery-viewer__count">{{ activeIndex + 1 }} / {{ galleryItems.length }}</span>

          <button type="button" class="catalog-gallery-viewer__arrow" @click="goToNext">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="hasMultipleItems" class="catalog-gallery-viewer__thumbs">
        <button
          v-for="(image, index) in galleryItems"
          :key="image.id"
          type="button"
          :class="['catalog-gallery-viewer__thumb', { 'is-active': index === activeIndex }]"
          @click="selectIndex(index)"
        >
          <img :src="image.src" :alt="image.alt" loading="lazy">
        </button>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="catalog-lightbox">
        <div v-if="isLightboxOpen && activeItem" class="catalog-lightbox" role="dialog" aria-modal="true">
          <button type="button" class="catalog-lightbox__backdrop" @click="closeLightbox" />

          <div class="catalog-lightbox__dialog">
            <div class="catalog-lightbox__topbar">
              <span class="catalog-lightbox__counter">{{ activeIndex + 1 }} / {{ galleryItems.length }}</span>

              <button type="button" class="catalog-lightbox__close" @click="closeLightbox">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>
            </div>

            <div class="catalog-lightbox__body">
              <button
                v-if="hasMultipleItems"
                type="button"
                class="catalog-lightbox__arrow"
                @click="goToPrevious"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M15 5L8 12L15 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>

              <figure class="catalog-lightbox__figure">
                <img :src="activeItem.src" :alt="activeItem.alt">
              </figure>

              <button
                v-if="hasMultipleItems"
                type="button"
                class="catalog-lightbox__arrow"
                @click="goToNext"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
