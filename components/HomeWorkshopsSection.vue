<script setup lang="ts">
import type { HomeWorkshopTile } from '~/types/public-catalog'

const sectionRef = ref<HTMLElement | null>(null)

defineProps<{
  tiles: HomeWorkshopTile[]
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
    id="master-classes"
    ref="sectionRef"
    class="section section--cream catalog-preview catalog-preview--workshops"
  >
    <div class="container">
      <div class="catalog-preview__head">
        <div>
          <p class="eyebrow">Мастер-классы</p>
          <h2 class="catalog-preview__title">
            <strong>Все мастер-классы</strong>
            <em>для творческой части события</em>
          </h2>
        </div>

        <p class="catalog-preview__lead">
          Подберите направление для корпоратива, школьного события, женской компании или
          сезонного праздника.
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

          <span class="catalog-wall__arrow">&#8599;</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
