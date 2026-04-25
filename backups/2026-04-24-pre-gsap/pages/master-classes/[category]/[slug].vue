<script setup lang="ts">
import {
  createMasterClassCategoryHref,
  getMasterClassCategoryBySlug,
  getWorkshopBySlugs
} from '~/data/catalog'

const route = useRoute()
const categorySlug = computed(() => String(route.params.category))
const workshopSlug = computed(() => String(route.params.slug))

const currentCategory = computed(() => getMasterClassCategoryBySlug(categorySlug.value))
const currentWorkshop = computed(() => getWorkshopBySlugs(categorySlug.value, workshopSlug.value))

if (!currentCategory.value || !currentWorkshop.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Мастер-класс не найден'
  })
}

useSeoMeta({
  title: () => currentWorkshop.value?.title ?? 'Мастер-класс',
  description: () => currentWorkshop.value?.summary ?? 'Описание мастер-класса Magic Iris.'
})
</script>

<template>
  <section class="section page-hero">
    <div class="container detail-layout">
      <div class="detail-hero">
        <div class="detail-hero__media" :style="{ backgroundImage: `url(${currentWorkshop?.image})` }" />

        <div class="detail-hero__body">
          <p class="eyebrow">{{ currentCategory?.title }}</p>
          <h1 class="page-title">{{ currentWorkshop?.title }}</h1>
          <p class="detail-page__lead">{{ currentWorkshop?.summary }}</p>
          <p class="detail-page__copy">{{ currentWorkshop?.description }}</p>

          <div class="detail-facts">
            <div class="detail-fact">
              <span>Длительность</span>
              <strong>{{ currentWorkshop?.duration }}</strong>
            </div>
            <div class="detail-fact">
              <span>Участники</span>
              <strong>{{ currentWorkshop?.participants }}</strong>
            </div>
            <div class="detail-fact">
              <span>Стоимость</span>
              <strong>{{ currentWorkshop?.priceFrom }}</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-section-grid">
        <div class="detail-section-card">
          <p class="eyebrow">Форматы проведения</p>
          <ul class="detail-list">
            <li v-for="item in currentWorkshop?.formats" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div class="detail-section-card">
          <p class="eyebrow">Что входит</p>
          <ul class="detail-list">
            <li v-for="item in currentWorkshop?.includes" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>

      <div class="detail-block">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Стоимость</p>
            <h2>Стоимость и организация</h2>
          </div>
        </div>

        <div class="price-grid">
          <article v-for="price in currentWorkshop?.pricing" :key="price.label" class="price-card">
            <p>{{ price.label }}</p>
            <h3>{{ price.value }}</h3>
            <span>{{ price.note || currentWorkshop?.priceNote }}</span>
          </article>
        </div>
      </div>

      <div class="detail-block">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Фото</p>
            <h2>Как выглядит мастер-класс</h2>
          </div>
        </div>

        <div class="detail-gallery">
          <div
            v-for="image in currentWorkshop?.gallery"
            :key="image.id"
            class="detail-gallery__item"
            :style="{ backgroundImage: `url(${image.src})` }"
          />
        </div>
      </div>

      <div class="detail-actions">
        <NuxtLink :to="createMasterClassCategoryHref(categorySlug)" class="button button--ghost">
          Ко всем форматам категории
        </NuxtLink>
        <NuxtLink to="/#contacts" class="button button--accent">Оставить заявку</NuxtLink>
      </div>
    </div>
  </section>
</template>
