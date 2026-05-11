<script setup lang="ts">
import type { HomeScenarioContent } from '~/data/home-content'
import { homeScenarioContent } from '~/data/home-content'

const props = defineProps<{
  content?: HomeScenarioContent | null
}>()

const sectionRef = ref<HTMLElement | null>(null)
const scenarioContent = computed(() => props.content || homeScenarioContent)

const scenarioCards = computed(() =>
  scenarioContent.value.cards.slice(0, 3).map((item, index) => ({
    ...item,
    number: index + 1,
    image: item.image || '/images/placeholder.webp'
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
          <p class="eyebrow">{{ scenarioContent.eyebrow }}</p>
          <h2 class="scenario-showcase__title">
            <strong>{{ scenarioContent.titleStrong }}</strong>
            <em>{{ scenarioContent.titleAccent }}</em>
          </h2>
        </div>

        <p class="scenario-showcase__lead">
          {{ scenarioContent.lead }}
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
