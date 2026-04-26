<script setup lang="ts">
import { getShowBySlug } from '~/data/catalog'

const route = useRoute()
const currentProgram = computed(() => getShowBySlug(String(route.params.slug)))

if (!currentProgram.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Шоу не найдено'
  })
}

useSeoMeta({
  title: () => currentProgram.value?.title ?? 'Шоу',
  description: () => currentProgram.value?.description ?? 'Описание шоу-программы Magic Iris.'
})
</script>

<template>
  <section class="section page-hero">
    <div class="container detail-layout">
      <div class="detail-hero">
        <div class="detail-hero__media" :style="{ backgroundImage: `url(${currentProgram?.heroImage})` }" />

        <div class="detail-hero__body">
          <p class="eyebrow">{{ currentProgram?.kicker }}</p>
          <h1 class="page-title">{{ currentProgram?.title }}</h1>
          <p class="detail-page__lead">{{ currentProgram?.lead }}</p>
          <p class="detail-page__copy">{{ currentProgram?.description }}</p>

          <div class="detail-facts">
            <div v-for="fact in currentProgram?.facts" :key="fact.label" class="detail-fact">
              <span>{{ fact.label }}</span>
              <strong>{{ fact.value }}</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-section-grid">
        <div class="detail-section-card">
          <p class="eyebrow">Что входит</p>
          <ul class="detail-list">
            <li v-for="feature in currentProgram?.features" :key="feature">{{ feature }}</li>
          </ul>
        </div>

        <div class="detail-section-card">
          <p class="eyebrow">Подходит для</p>
          <div class="detail-tags">
            <span v-for="item in currentProgram?.suitableFor" :key="item">{{ item }}</span>
          </div>
        </div>
      </div>

      <div class="detail-block">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Стоимость</p>
            <h2>Стоимость и форматы проведения</h2>
          </div>
        </div>

        <div class="price-grid">
          <article v-for="price in currentProgram?.pricing" :key="price.label" class="price-card">
            <p>{{ price.label }}</p>
            <h3>{{ price.value }}</h3>
            <span>{{ price.note || 'Точная стоимость уточняется после обсуждения площадки и задачи.' }}</span>
          </article>
        </div>
      </div>

      <div class="detail-block">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Фото</p>
            <h2>Как формат выглядит на событии</h2>
          </div>
        </div>

        <div class="detail-gallery">
          <div
            v-for="image in currentProgram?.gallery"
            :key="image.id"
            class="detail-gallery__item"
            :style="{ backgroundImage: `url(${image.src})` }"
          />
        </div>
      </div>

      <div class="detail-actions">
        <NuxtLink to="/shows" class="button button--ghost">Ко всем шоу</NuxtLink>
        <NuxtLink to="/#contacts" class="button button--accent">Оставить заявку</NuxtLink>
      </div>
    </div>
  </section>
</template>
