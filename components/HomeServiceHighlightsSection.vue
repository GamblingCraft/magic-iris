<script setup lang="ts">
import { serviceHighlights } from '~/data/site'

const sectionRef = ref<HTMLElement | null>(null)

const scenarioImages = [
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80'
]

const scenarioCards = computed(() =>
  serviceHighlights.slice(0, 3).map((item, index) => ({
    ...item,
    number: index + 1,
    image: scenarioImages[index]
  }))
)

useGsapReveal(sectionRef, ['.scenario-showcase__title-wrap > *', '.scenario-showcase__lead', '.scenario-card'], {
  start: 'top 88%',
  stagger: 0.12,
  y: 36,
  blur: 8
})
</script>

<template>
  <section ref="sectionRef" class="section section--light scenario-showcase">
    <div class="container">
      <div class="scenario-showcase__head">
        <div class="scenario-showcase__title-wrap">
          <p class="eyebrow">Сценарий под ваше событие</p>
          <h2 class="scenario-showcase__title">
            <strong>Визуал и подача</strong>
            <em>создают сильное впечатление</em>
          </h2>
        </div>

        <p class="scenario-showcase__lead">
          Подбираем формат, длительность, визуальные акценты и организацию так, чтобы шоу точно
          встроилось в площадку, тайминг и настроение события.
        </p>
      </div>

      <div class="scenario-showcase__grid">
        <article
          v-for="card in scenarioCards"
          :key="card.title"
          class="scenario-card"
        >
          <div class="scenario-card__photo" :style="{ backgroundImage: `url(${card.image})` }" />
          <span class="scenario-card__number">{{ card.number }}</span>

          <div class="scenario-card__body">
            <h3><span>{{ card.title }}</span></h3>
            <p><span>{{ card.description }}</span></p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
