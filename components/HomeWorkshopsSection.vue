<script setup lang="ts">
import type { HomeWorkshopTile } from '~/types/public-catalog'

defineProps<{
  tiles: HomeWorkshopTile[]
}>()
</script>

<template>
  <section id="master-classes" class="section section--cream catalog-preview catalog-preview--workshops">
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
