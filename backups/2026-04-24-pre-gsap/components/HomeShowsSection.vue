<script setup lang="ts">
import { createShowHref, shows } from '~/data/catalog'

const tiles = computed(() => [
  { ...shows[0], href: createShowHref(shows[0].slug), size: 'wide' },
  { ...shows[1], href: createShowHref(shows[1].slug), size: 'tall' },
  { ...shows[2], href: createShowHref(shows[2].slug), size: 'small' },
  { ...shows[3], href: createShowHref(shows[3].slug), size: 'small' }
])
</script>

<template>
  <section id="shows" class="section section--light catalog-preview">
    <div class="container">
      <div class="catalog-preview__head">
        <div>
          <p class="eyebrow">Шоу</p>
          <h2 class="catalog-preview__title">
            <strong>Все шоу-программы</strong>
            <em>для главного момента события</em>
          </h2>
        </div>

        <p class="catalog-preview__lead">
          Выберите формат для открытия, кульминации, подарочного сюрприза или финального вау-эффекта.
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
            <p>{{ tile.kicker }}</p>
          </div>

          <span class="catalog-wall__arrow">↗</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
