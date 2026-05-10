<script setup lang="ts">
import { aboutPortrait, aboutSeoParagraphs, aboutSeoTags } from '~/data/home-about'

const headline = 'Творческая студия в Иркутске'
const cardText = ''
const subheadingShows = 'Шоу на праздник'
const subheadingMasterclasses = 'Творческие мастер-классы и арт-вечера'
const subheadingForWhom = 'Для кого и где мы работаем'

const lead =
  'Magic Iris — творческая студия в Иркутске. Мы создаём песочное и световое шоу, шоу-портреты и авторские мастер-классы для частных и городских событий.'

const keywordRowPrimary = [...aboutSeoTags, ...aboutSeoTags]
const keywordRowSecondary = [...[...aboutSeoTags].reverse(), ...[...aboutSeoTags].reverse()]

const aboutSectionRef = ref<HTMLElement | null>(null)

let rafId = 0
let removeListeners: (() => void) | null = null

const setAboutZoom = () => {
  const section = aboutSectionRef.value

  if (!section) {
    return
  }

  if (window.innerWidth <= 900 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    section.style.setProperty('--about-card-scale', '1')
    section.style.setProperty('--about-image-scale', '1')
    section.style.setProperty('--about-card-shift', '0px')
    return
  }

  const stage = section.querySelector<HTMLElement>('.about-section__stage')
  const rect = (stage || section).getBoundingClientRect()
  const viewportHeight = window.innerHeight || 1
  const rawProgress = (viewportHeight - rect.top) / (viewportHeight + rect.height * 0.45)
  const progress = Math.min(1, Math.max(0, rawProgress))

  const eased = 1 - Math.pow(1 - progress, 2)
  const cardScale = 0.78 + eased * 0.22
  const imageScale = 1.24 - eased * 0.24
  const cardShift = 52 - eased * 52

  section.style.setProperty('--about-card-scale', cardScale.toFixed(3))
  section.style.setProperty('--about-image-scale', imageScale.toFixed(3))
  section.style.setProperty('--about-card-shift', `${cardShift.toFixed(1)}px`)
}

const queueAboutZoom = () => {
  if (rafId) {
    return
  }

  rafId = window.requestAnimationFrame(() => {
    rafId = 0
    setAboutZoom()
  })
}

onMounted(() => {
  setAboutZoom()

  const onScroll = () => queueAboutZoom()
  const onResize = () => queueAboutZoom()

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })

  removeListeners = () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
  }
})

onBeforeUnmount(() => {
  if (rafId) {
    window.cancelAnimationFrame(rafId)
    rafId = 0
  }

  removeListeners?.()
  removeListeners = null
})
</script>

<template>
  <section id="about" ref="aboutSectionRef" class="section about-section">
    <div class="container about-section__intro">
      <p class="eyebrow">О нас</p>
    </div>

    <div class="container about-section__stage">
      <div class="about-section__sticky">
        <figure class="about-section__card">
          <img :src="aboutPortrait.src" :alt="aboutPortrait.alt" loading="lazy">
          <div class="about-section__card-overlay" />

          <figcaption class="about-section__card-content">
            <h2 class="about-section__card-title">{{ headline }}</h2>
            <p class="about-section__card-text">{{ cardText }}</p>
          </figcaption>
        </figure>
      </div>
    </div>

    <div class="container">
      <div class="about-section__body">
        <p class="about-section__lead">{{ lead }}</p>

        <div class="about-section__text">
          <p>{{ aboutSeoParagraphs[0] }}</p>
          <p>{{ aboutSeoParagraphs[1] }}</p>

          <h3 class="about-section__subheading">{{ subheadingShows }}</h3>
          <p>{{ aboutSeoParagraphs[2] }}</p>

          <h3 class="about-section__subheading">{{ subheadingMasterclasses }}</h3>
          <p>{{ aboutSeoParagraphs[3] }}</p>

          <h3 class="about-section__subheading">{{ subheadingForWhom }}</h3>
          <p>{{ aboutSeoParagraphs[4] }}</p>
          <p>{{ aboutSeoParagraphs[5] }}</p>

          <p class="about-section__conclusion">{{ aboutSeoParagraphs[6] }}</p>
        </div>
      </div>
    </div>

    <div class="about-section__keywords">
      <div class="about-section__keywords-mask">
        <div class="about-section__keywords-track about-section__keywords-track--primary">
          <span v-for="(tag, index) in keywordRowPrimary" :key="`about-primary-${index}`">{{ tag }}</span>
        </div>
      </div>

      <div class="about-section__keywords-mask">
        <div class="about-section__keywords-track about-section__keywords-track--secondary">
          <span v-for="(tag, index) in keywordRowSecondary" :key="`about-secondary-${index}`">{{ tag }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
