<script setup lang="ts">
import {
  createMasterClassHref,
  getMasterClassCategoryBySlug,
  getWorkshopsByCategorySlug
} from '~/data/catalog'

const route = useRoute()
const categorySlug = computed(() => String(route.params.category))
const currentCategory = computed(() => getMasterClassCategoryBySlug(categorySlug.value))
const workshops = computed(() => getWorkshopsByCategorySlug(categorySlug.value))

if (!currentCategory.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Категория не найдена'
  })
}

useSeoMeta({
  title: () => currentCategory.value?.title ?? 'Категория мастер-классов',
  description: () => currentCategory.value?.description ?? 'Категория мастер-классов Magic Iris.'
})
</script>

<template>
  <section class="section page-hero">
    <div class="container detail-layout">
      <div class="detail-hero">
        <div class="detail-hero__media" :style="{ backgroundImage: `url(${currentCategory?.image})` }" />

        <div class="detail-hero__body">
          <p class="eyebrow">Подборка мастер-классов</p>
          <h1 class="page-title">{{ currentCategory?.title }}</h1>
          <p class="detail-page__lead">{{ currentCategory?.lead }}</p>
          <p class="detail-page__copy">{{ currentCategory?.description }}</p>

          <div class="detail-tags">
            <span>{{ currentCategory?.count }} форматов</span>
            <span>Выездной формат под ваше событие</span>
          </div>
        </div>
      </div>

      <div class="detail-block">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Каталог категории</p>
            <h2>Форматы в подборке</h2>
          </div>
        </div>

        <div class="workshop-card-grid">
          <NuxtLink
            v-for="workshop in workshops"
            :key="workshop.id"
            :to="createMasterClassHref(categorySlug, workshop.slug)"
            class="workshop-card"
          >
            <div class="workshop-card__media" :style="{ backgroundImage: `url(${workshop.image})` }" />

            <div class="workshop-card__body">
              <p class="catalog-page-card__kicker">{{ workshop.audienceLabel }}</p>
              <h3>{{ workshop.title }}</h3>
              <p>{{ workshop.summary }}</p>
              <div class="catalog-page-card__meta">
                <span>{{ workshop.priceFrom }}</span>
                <strong>Подробнее</strong>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <div class="detail-actions">
        <NuxtLink to="/master-classes" class="button button--ghost">Ко всем подборкам</NuxtLink>
        <NuxtLink to="/#contacts" class="button button--accent">Оставить заявку</NuxtLink>
      </div>
    </div>
  </section>
</template>
