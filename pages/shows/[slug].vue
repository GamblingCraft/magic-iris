<script setup lang="ts">
import { getShowSeo } from '~/data/site-seo'
import type { ShowDetailPayload } from '~/types/public-catalog'

const route = useRoute()
const slug = String(route.params.slug)

const { data: showPayload } = await useFetch<ShowDetailPayload>(`/api/site/shows/${slug}`, {
  key: `site-show-${slug}`
})

const currentProgram = computed(() => showPayload.value?.program || null)

const breadcrumbs = computed(() => [
  { label: 'Главная', href: '/' },
  { label: 'Шоу', href: '/shows' },
  { label: currentProgram.value?.title || 'Карточка шоу' }
])

if (!currentProgram.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Шоу не найдено'
  })
}

usePageSeo(computed(() => getShowSeo(currentProgram.value!)))
</script>

<template>
  <div class="catalog-shell catalog-shell--detail">
    <section class="section catalog-shell__section catalog-shell__section--hero">
      <div class="container">
        <CatalogBreadcrumbs :items="breadcrumbs" />

        <CatalogHeroPanel
          :eyebrow="currentProgram?.kicker || 'Шоу'"
          :title="currentProgram?.title || ''"
          :lead="currentProgram?.lead || ''"
          :description="currentProgram?.description || ''"
          :image="currentProgram?.heroImage || currentProgram?.image || ''"
          :product="currentProgram ? {
            sku: currentProgram.id,
            category: currentProgram.kicker,
            description: currentProgram.description,
            price: currentProgram.pricing[0]?.value,
            url: route.fullPath
          } : undefined"
          :tags="currentProgram?.suitableFor || []"
          :facts="currentProgram?.facts || []"
          :actions="[
            { label: 'Оставить заявку', href: '/#contacts' },
            { label: 'Все шоу', href: '/shows', kind: 'ghost' }
          ]"
        />
      </div>
    </section>

    <section class="section catalog-shell__section">
      <div class="container">
        <div class="catalog-section-head">
          <div>
            <p class="eyebrow">О программе</p>
            <h2>Как формат работает на событии</h2>
          </div>
        </div>

        <div class="catalog-detail-grid">
          <article class="catalog-panel">
            <p class="eyebrow">Что входит в программу</p>
            <ul class="catalog-list">
              <li v-for="feature in currentProgram?.features" :key="feature">{{ feature }}</li>
            </ul>
          </article>

          <article class="catalog-panel">
            <p class="eyebrow">Идеально подходит для</p>
            <div class="catalog-chip-cloud">
              <span v-for="item in currentProgram?.suitableFor" :key="item">{{ item }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <div class="catalog-section-head">
          <div>
            <p class="eyebrow">Стоимость</p>
            <h2>Форматы проведения и цены</h2>
          </div>
        </div>

        <div class="catalog-pricing-grid">
          <article v-for="price in currentProgram?.pricing" :key="price.label" class="catalog-price-card">
            <p>{{ price.label }}</p>
            <h3>{{ price.value }}</h3>
            <span>{{ price.note || 'Точную стоимость уточним после обсуждения площадки, тайминга и ваших задач.' }}</span>
          </article>
        </div>
      </div>
    </section>

    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <div class="catalog-section-head">
          <div>
            <p class="eyebrow">Фото</p>
            <h2>Как формат выглядит на мероприятии</h2>
          </div>
        </div>

        <CatalogGallerySection :items="currentProgram?.gallery || []" />
      </div>
    </section>
  </div>
</template>