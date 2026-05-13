<script setup lang="ts">
import type { HomeShowTile } from '~/types/public-catalog'

const sectionRef = ref<HTMLElement | null>(null)

defineProps<{
  tiles: HomeShowTile[]
}>()

useGsapReveal(sectionRef, ['.eyebrow', '.catalog-preview__head > *', '.catalog-wall__card'], {
  start: 'top 88%',
  stagger: 0.12,
  y: 36,
  blur: 8
})
</script>

<template>
  <section
    id="shows"
    ref="sectionRef"
    class="section section--light catalog-preview catalog-preview--shows"
  >
    <div class="container">
      <div class="catalog-preview__head">
        <div>
          <p class="eyebrow">Шоу</p>
          <h2 class="catalog-preview__title">
            <strong>Шоу-программы</strong>
            <em>которые становятся главным моментом вечера</em>
          </h2>
        </div>

        <p class="catalog-preview__lead">
          Выберите формат для яркого открытия, трогательного сюрприза или эффектного финала мероприятия.
        </p>
      </div>

      <div class="catalog-wall">
        <NuxtLink
          v-for="tile in tiles"
          :key="tile.id"
          :to="tile.href"
          class="catalog-wall__card"
          :class="`catalog-wall__card--${tile.size}`"
        >
          <div class="catalog-wall__media" :style="{ backgroundImage: `url(${tile.image})` }" />

          <div class="catalog-wall__overlay" />

          <div class="catalog-wall__content">
            <h3>{{ tile.title }}</h3>
            <p>{{ tile.description }}</p>
          </div>

          <span class="catalog-wall__arrow">↗</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
