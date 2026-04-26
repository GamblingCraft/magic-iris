<script setup lang="ts">
import { createShowHref, shows } from '~/data/catalog'

useSeoMeta({
  title: 'Шоу',
  description: 'Каталог песочного шоу, светового шоу, шоу-портретов и визуальных форматов Magic Iris.'
})
</script>

<template>
  <section class="section page-hero">
    <div class="container">
      <div class="page-heading">
        <p class="eyebrow">Шоу</p>
        <h1 class="page-title">Каталог шоу-программ для событий, где важно впечатлить гостей</h1>
        <p class="page-intro">
          Все форматы уже разложены по slug и отдельным страницам. Это даст нам нормальную базу
          под будущую админку, когда вы захотите редактировать цены, фото и описания.
        </p>
      </div>

      <div class="catalog-page-grid">
        <NuxtLink
          v-for="program in shows"
          :key="program.id"
          :to="createShowHref(program.slug)"
          class="catalog-page-card"
        >
          <div class="catalog-page-card__media" :style="{ backgroundImage: `url(${program.image})` }" />

          <div class="catalog-page-card__body">
            <p class="catalog-page-card__kicker">{{ program.kicker }}</p>
            <h2>{{ program.title }}</h2>
            <p>{{ program.description }}</p>

            <div class="catalog-page-card__meta">
              <span>{{ program.pricing[0]?.value }}</span>
              <strong>Подробнее</strong>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
