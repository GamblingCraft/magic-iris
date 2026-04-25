<script setup lang="ts">
import { homeSteps } from '~/data/home-steps'

const sectionRef = ref<HTMLElement | null>(null)
const scrollShellRef = ref<HTMLElement | null>(null)
const navRef = ref<HTMLElement | null>(null)
const navItemRefs = ref<HTMLElement[]>([])
const activeIndex = ref(0)
const touchStartX = ref<number | null>(null)
let stepsAnimationContext: { revert: () => void } | null = null
let stepsMediaMatcher: { revert: () => void } | null = null
let pinnedTrigger: { start: number, end: number, kill: () => void } | null = null

const setNavItemRef = (el: unknown) => {
  if (el instanceof HTMLElement && !navItemRefs.value.includes(el)) {
    navItemRefs.value.push(el)
  }
}

const previousIndex = computed(() =>
  activeIndex.value === 0 ? homeSteps.length - 1 : activeIndex.value - 1
)

const nextIndex = computed(() =>
  activeIndex.value === homeSteps.length - 1 ? 0 : activeIndex.value + 1
)

const activeStep = computed(() => homeSteps[activeIndex.value])
const previousStep = computed(() => homeSteps[previousIndex.value])
const nextStep = computed(() => homeSteps[nextIndex.value])
const progressWidth = computed(() => `${((activeIndex.value + 1) / homeSteps.length) * 100}%`)
const sliderTrackStyle = computed(() => ({
  transform: `translate3d(-${activeIndex.value * 100}%, 0, 0)`
}))

const syncActiveNav = () => {
  if (!import.meta.client || !navRef.value) {
    return
  }

  const activeItem = navItemRefs.value[activeIndex.value]

  if (!activeItem) {
    return
  }

  const left = activeItem.offsetLeft - navRef.value.clientWidth / 2 + activeItem.clientWidth / 2

  navRef.value.scrollTo({
    left: Math.max(0, left),
    behavior: 'smooth'
  })
}

const setActiveStep = (index: number) => {
  const normalizedIndex = ((index % homeSteps.length) + homeSteps.length) % homeSteps.length
  const usesPinnedScroll = Boolean(pinnedTrigger && import.meta.client && window.innerWidth > 900)

  if (usesPinnedScroll && pinnedTrigger) {
    if (normalizedIndex === activeIndex.value) {
      return
    }

    const progress = homeSteps.length > 1 ? normalizedIndex / (homeSteps.length - 1) : 0
    const targetTop = pinnedTrigger.start + (pinnedTrigger.end - pinnedTrigger.start) * progress

    // In the pinned desktop mode ScrollTrigger owns the active slide.
    // Jump straight to the matching scroll position so we don't fight its scrub/snap logic.
    window.scrollTo({ top: targetTop, behavior: 'auto' })

    return
  }

  if (normalizedIndex === activeIndex.value) {
    return
  }

  activeIndex.value = normalizedIndex
  nextTick(syncActiveNav)
}

const goPrevious = () => {
  setActiveStep(previousIndex.value)
}

const goNext = () => {
  setActiveStep(nextIndex.value)
}

const getStepNumber = (index: number) => String(index + 1).padStart(2, '0')

const onTouchStart = (event: TouchEvent) => {
  touchStartX.value = event.touches[0]?.clientX ?? null
}

const onTouchEnd = (event: TouchEvent) => {
  if (touchStartX.value === null) {
    return
  }

  const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.value
  const deltaX = touchEndX - touchStartX.value

  if (Math.abs(deltaX) > 42) {
    if (deltaX < 0) {
      goNext()
    } else {
      goPrevious()
    }
  }

  touchStartX.value = null
}

onBeforeUpdate(() => {
  navItemRefs.value = []
})

onMounted(async () => {
  if (!import.meta.client || !scrollShellRef.value) {
    return
  }

  const gsapModule = await import('gsap')
  const scrollTriggerModule = await import('gsap/ScrollTrigger')
  const gsap = gsapModule.gsap || gsapModule.default || gsapModule
  const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default

  if (!ScrollTrigger) {
    return
  }

  gsap.registerPlugin(ScrollTrigger)

  stepsAnimationContext = gsap.context(() => {
    stepsMediaMatcher = gsap.matchMedia()

    stepsMediaMatcher.add('(min-width: 901px)', () => {
      const totalSlides = Math.max(homeSteps.length - 1, 1)

      pinnedTrigger = ScrollTrigger.create({
        trigger: scrollShellRef.value,
        start: 'top top+=108',
        end: () => `+=${Math.max(window.innerHeight * 0.68, 420) * totalSlides}`,
        pin: true,
        scrub: 0.18,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: {
          snapTo: (value: number) => Math.round(value * totalSlides) / totalSlides,
          duration: { min: 0.08, max: 0.22 },
          delay: 0.02,
          ease: 'power1.out'
        },
        onUpdate: (self) => {
          const nextIndex = Math.round(self.progress * totalSlides)

          if (nextIndex !== activeIndex.value) {
            activeIndex.value = nextIndex
            nextTick(syncActiveNav)
          }
        },
        onRefresh: (self) => {
          const nextIndex = Math.round(self.progress * totalSlides)

          activeIndex.value = nextIndex
          nextTick(syncActiveNav)
        }
      })

      return () => {
        pinnedTrigger?.kill()
        pinnedTrigger = null
      }
    })
  }, sectionRef.value || undefined)
})

onBeforeUnmount(() => {
  stepsMediaMatcher?.revert()
  stepsAnimationContext?.revert()
  pinnedTrigger = null
})

useGsapReveal(sectionRef, ['.home-steps-section__head > div:first-child > *', '.home-steps-section__lead', '.home-steps-nav', '.steps-slider', '.home-steps-slider__progress'], {
  start: 'top 84%',
  stagger: 0.08,
  y: 34,
  blur: 8
})
</script>

<template>
  <section ref="sectionRef" class="section home-steps-section s-home-steps">
    <div class="container">
      <div class="sec-title-double home-steps-section__head">
        <div>
          <p class="eyebrow">Шаги</p>
          <div class="h2 home-steps-section__title">
            6 шагов <strong>как мы создадим</strong> ваше событие
          </div>
        </div>
        <div class="text-3 home-steps-section__lead">
          Показываем путь от первой идеи до готового шоу или мастер-класса. На каждом этапе вы понимаете,
          что происходит, сколько это стоит и как именно будет выглядеть событие в день проведения.
        </div>
      </div>

      <div ref="scrollShellRef" class="home-steps-scroll-shell">
        <div ref="navRef" class="home-steps-nav" data-steps-nav>
          <button
            v-for="(step, index) in homeSteps"
            :key="step.id"
            :ref="setNavItemRef"
            type="button"
            class="home-steps-nav__item"
            :class="{
              active: index === activeIndex,
              'active-prev': index === previousIndex
            }"
            :aria-pressed="index === activeIndex"
            @click="setActiveStep(index)"
          >
            <span class="home-steps-nav__thumb">
              <img :src="step.navImage || step.image" :alt="step.navLabel">
            </span>
            <span class="home-steps-nav__label">{{ step.navLabel }}</span>
          </button>
        </div>

        <div class="steps-slider home-steps-slider">
          <button
            type="button"
            class="step-panel step-panel--side step-panel--prev"
            :style="{ '--bg-color': previousStep.color, '--panel-image': `url(${previousStep.image})` }"
            :aria-label="`Открыть шаг ${getStepNumber(previousIndex)}`"
            @click="goPrevious"
          >
            <div class="step-panel__num">Шаг {{ getStepNumber(previousIndex) }}</div>
            <div class="step-panel__title">{{ previousStep.navLabel }}</div>
          </button>

          <article class="step-panel step-panel--active" :style="{ '--bg-color': activeStep.color }">
            <div
              class="step-panel__viewport"
              @touchstart.passive="onTouchStart"
              @touchend.passive="onTouchEnd"
            >
              <div class="step-panel__track" :style="sliderTrackStyle">
                <div
                  v-for="(step, index) in homeSteps"
                  :key="step.id"
                  class="step-panel__slide"
                  :style="{ '--bg-color': step.color }"
                >
                  <picture class="step-panel__picture">
                    <img :src="step.image" :alt="step.navLabel" class="step-panel__img" loading="lazy">
                  </picture>

                  <div class="step-panel__body">
                    <div class="step-panel__num">Шаг {{ getStepNumber(index) }}</div>
                    <div class="h3 step-panel__title">{{ step.title }}</div>
                    <div class="text-2 step-panel__descr">{{ step.description }}</div>

                    <div class="step-panel__actions">
                      <NuxtLink to="/#contacts" class="step-panel__cta">
                        <span class="step-panel__cta-text">обсудить событие</span>
                        <span class="step-panel__cta-icon">↗</span>
                      </NuxtLink>

                      <div class="step-panel__controls">
                        <button
                          type="button"
                          class="step-panel__control"
                          aria-label="Предыдущий шаг"
                          @click="goPrevious"
                        >
                          ←
                        </button>

                        <button
                          type="button"
                          class="step-panel__control"
                          aria-label="Следующий шаг"
                          @click="goNext"
                        >
                          →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <button
            type="button"
            class="step-panel step-panel--side step-panel--next"
            :style="{ '--bg-color': nextStep.color, '--panel-image': `url(${nextStep.image})` }"
            :aria-label="`Открыть шаг ${getStepNumber(nextIndex)}`"
            @click="goNext"
          >
            <div class="step-panel__num">Шаг {{ getStepNumber(nextIndex) }}</div>
            <div class="step-panel__title">{{ nextStep.navLabel }}</div>
          </button>
        </div>

        <div class="home-steps-slider__progress" aria-hidden="true">
          <span :style="{ width: progressWidth }"></span>
        </div>
      </div>
    </div>
  </section>
</template>
