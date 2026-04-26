<script setup lang="ts">
import {
  createMasterClassCategoryHref,
  createMasterClassHref,
  masterClassCategories,
  workshopItems
} from '~/data/catalog'

useSeoMeta({
  title: 'Мастер-классы',
  description: 'Каталог выездных мастер-классов Magic Iris по категориям, форматам и отдельным страницам.'
})
</script>

<template>
  <section class="section page-hero">
    <div class="container">
      <div class="page-heading">
        <p class="eyebrow">Мастер-классы</p>
        <h1 class="page-title">Каталог выездных мастер-классов для праздников, школ и корпоративов</h1>
        <p class="page-intro">
          Подберите формат по аудитории, сезону и типу события, а затем откройте подробную страницу
          мастер-класса с фотографиями, описанием и стоимостью.
        </p>
      </div>

      <div class="catalog-page-grid catalog-page-grid--categories">
        <NuxtLink
          v-for="category in masterClassCategories"
          :key="category.id"
          :to="createMasterClassCategoryHref(category.slug)"
          class="catalog-page-card"
        >
          <div class="catalog-page-card__media" :style="{ backgroundImage: `url(${category.image})` }" />

          <div class="catalog-page-card__body">
            <p class="catalog-page-card__kicker">Подборка</p>
            <h2>{{ category.title }}</h2>
            <p>{{ category.description }}</p>

            <div class="catalog-page-card__meta">
              <span>{{ category.count }} форматов</span>
              <strong>Открыть</strong>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div class="detail-block">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Популярные форматы</p>
            <h2>С чего удобно начать выбор</h2>
          </div>
        </div>

        <div class="workshop-card-grid">
          <article v-for="workshop in workshopItems.slice(0, 6)" :key="workshop.id" class="workshop-card">
            <div class="workshop-card__media" :style="{ backgroundImage: `url(${workshop.image})` }" />

            <div class="workshop-card__body">
              <p class="catalog-page-card__kicker">{{ workshop.audienceLabel }}</p>
              <h3>{{ workshop.title }}</h3>
              <p>{{ workshop.summary }}</p>
              <div class="catalog-page-card__meta">
                <span>{{ workshop.priceFrom }}</span>
                <NuxtLink :to="createMasterClassHref(workshop.primaryCategorySlug, workshop.slug)">Подробнее</NuxtLink>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
