<script setup lang="ts">
import { homeHeroSlides } from '~/data/home-slider'

import { contactInfo } from '~/data/site'

const slides = homeHeroSlides.length ? homeHeroSlides : [
  {
    id: 'fallback-slide',
    eyebrow: 'РўРІРѕСЂС‡РµСЃРєР°СЏ СЃС‚СѓРґРёСЏ РІ РСЂРєСѓС‚СЃРєРµ',
    title: 'РЁРѕСѓ Рё РјР°СЃС‚РµСЂ-РєР»Р°СЃСЃС‹, СЃРѕР·РґР°РЅРЅС‹Рµ СЃРїРµС†РёР°Р»СЊРЅРѕ РґР»СЏ РІР°С€РµРіРѕ СЃРѕР±С‹С‚РёСЏ',
    script: 'РІ РСЂРєСѓС‚СЃРєРµ',
    summary:
      'РћСЃС‚Р°РІСЊС‚Рµ Р·Р°СЏРІРєСѓ Рё РјС‹ РїРѕРґР±РµСЂС‘Рј РїРµСЃРѕС‡РЅРѕРµ С€РѕСѓ, СЃРІРµС‚РѕРІРѕР№ РЅРѕРјРµСЂ, С€РѕСѓ-РїРѕСЂС‚СЂРµС‚ РёР»Рё РІС‹РµР·РґРЅРѕР№ РјР°СЃС‚РµСЂ-РєР»Р°СЃСЃ РїРѕРґ С„РѕСЂРјР°С‚ РІР°С€РµРіРѕ РїСЂР°Р·РґРЅРёРєР°.',
    buttonLabel: 'Р·Р°РєР°Р·Р°С‚СЊ С€РѕСѓ',
    buttonHref: contactInfo.whatsapp,
    image: '/images/hero.webp',
    imageAlt: 'Magic Iris event show'
  }
]

const activeIndex = ref(0)

const activeSlide = computed(() => slides[activeIndex.value] || slides[0])

const goToSlide = (index: number) => {
  if (!slides.length) {
    return
  }

  activeIndex.value = (index + slides.length) % slides.length
}

const goToNext = () => goToSlide(activeIndex.value + 1)
const goToPrev = () => goToSlide(activeIndex.value - 1)

let autoplayTimer: ReturnType<typeof setInterval> | null = null

const startAutoplay = () => {
  if (!import.meta.client || slides.length < 2 || autoplayTimer) {
    return
  }

  autoplayTimer = window.setInterval(goToNext, 6500)
}

const stopAutoplay = () => {
  if (!autoplayTimer) {
    return
  }

  clearInterval(autoplayTimer)
  autoplayTimer = null
}

onMounted(startAutoplay)
onBeforeUnmount(stopAutoplay)
</script>

<template>
  <section
    class="hero intro hero--reference"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
  >
    <div class="hero__scene">
      <img
        :src="activeSlide.image"
        :alt="activeSlide.imageAlt || activeSlide.title"
        loading="eager"
        fetchpriority="high"
        decoding="async"
      >
    </div>

    <div class="hero__overlay" />

    <div class="container hero__inner">
      <div class="hero__copy">
        <p class="hero__eyebrow">{{ activeSlide.eyebrow }}</p>
        <h1 class="hero__headline">{{ activeSlide.title }}</h1>
        <p v-if="activeSlide.script" class="hero__script">{{ activeSlide.script }}</p>

        <p v-if="activeSlide.summary" class="hero__summary">
          {{ activeSlide.summary }}
        </p>

        <div class="hero__cta">
          <a
            class="button button--accent btn hero__button"
            :href="activeSlide.buttonHref || contactInfo.whatsapp"
            target="_blank"
            rel="noreferrer"
          >
            <span>{{ activeSlide.buttonLabel }}</span>
          </a>
        </div>
      </div>

      <div v-if="slides.length > 1" class="hero__slider-ui">
        <div class="hero__slider-controls">
          <button type="button" class="hero__slider-control" aria-label="РџСЂРµРґС‹РґСѓС‰РёР№ СЃР»Р°Р№Рґ" @click="goToPrev">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5L8 12L15 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <button type="button" class="hero__slider-control" aria-label="РЎР»РµРґСѓСЋС‰РёР№ СЃР»Р°Р№Рґ" @click="goToNext">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <div class="hero__slider-dots" role="tablist" aria-label="РЎР»Р°Р№РґС‹">
          <button
            v-for="(slide, index) in slides"
            :key="slide.id"
            type="button"
            :class="['hero__slider-dot', { 'is-active': index === activeIndex }]"
            :aria-label="`РЎР»Р°Р№Рґ ${index + 1}`"
            :aria-pressed="index === activeIndex"
            @click="goToSlide(index)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

