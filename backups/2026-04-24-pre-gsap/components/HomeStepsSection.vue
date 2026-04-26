<script setup lang="ts">
import { homeSteps } from '~/data/home-steps'

const activeIndex = ref(1)

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

const setActiveStep = (index: number) => {
  activeIndex.value = index
}

const goPrevious = () => {
  setActiveStep(previousIndex.value)
}

const goNext = () => {
  setActiveStep(nextIndex.value)
}

const getStepNumber = (index: number) => String(index + 1).padStart(2, '0')
</script>

<template>
  <section class="section home-steps-section s-home-steps">
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

      <div class="home-steps-nav" data-steps-nav>
        <button
          v-for="(step, index) in homeSteps"
          :key="step.id"
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

        <article
          class="step-panel step-panel--active"
          :style="{ '--bg-color': activeStep.color }"
        >
          <picture class="step-panel__picture">
            <img :src="activeStep.image" :alt="activeStep.navLabel" class="step-panel__img" loading="lazy">
          </picture>

          <div class="step-panel__body">
            <div class="step-panel__num">Шаг {{ getStepNumber(activeIndex) }}</div>
            <div class="h3 step-panel__title">{{ activeStep.title }}</div>
            <div class="text-2 step-panel__descr">{{ activeStep.description }}</div>

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
  </section>
</template>
