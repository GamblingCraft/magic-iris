<script setup lang="ts">
import { aboutGalleryItems } from '~/data/home-about'

const galleryGrid = ref<HTMLElement | null>(null)
const galleryItemRefs = ref<HTMLElement[]>([])
let galleryAnimationContext: { revert: () => void } | null = null

const setGalleryItemRef = (el: unknown) => {
  if (el instanceof HTMLElement && !galleryItemRefs.value.includes(el)) {
    galleryItemRefs.value.push(el)
  }
}

onMounted(async () => {
  const gsapModule = await import('gsap')
  const scrollTriggerModule = await import('gsap/ScrollTrigger')
  const gsap = gsapModule.gsap || gsapModule.default || gsapModule
  const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default

  if (!galleryGrid.value || galleryItemRefs.value.length === 0 || !ScrollTrigger) {
    return
  }

  gsap.registerPlugin(ScrollTrigger)

  galleryAnimationContext = gsap.context(() => {
    gsap.set(galleryItemRefs.value, {
      opacity: 0,
      y: 70,
      scale: 0.96,
      rotate: (index: number) => (index % 2 === 0 ? -1.5 : 1.5),
      transformOrigin: 'center center'
    })

    gsap.to(galleryItemRefs.value, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      duration: 0.95,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: galleryGrid.value,
        start: 'top 82%',
        once: true
      }
    })
  }, galleryGrid.value)
})

onBeforeUnmount(() => {
  galleryAnimationContext?.revert()
})
</script>

<template>
  <section class="section gallery-section">
    <div class="container">
          <p class="eyebrow">Галерея</p>
      <div class="about-media__head about-media__head--gallery">
        <div>
          <h2>Фото событий и сценических моментов</h2>
        </div>
      </div>

      <div ref="galleryGrid" class="about-gallery__grid">
        <figure
          v-for="(item, index) in aboutGalleryItems"
          :key="item.src"
          :ref="setGalleryItemRef"
          class="about-gallery__item"
          :class="{
            'about-gallery__item--wide': index === 0 || index === 5,
            'about-gallery__item--tall': index === 2
          }"
        >
          <img :src="item.src" :alt="item.alt" loading="lazy">
        </figure>
      </div>
    </div>
  </section>
</template>
