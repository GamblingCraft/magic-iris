<script setup lang="ts">
import { getWorkshopSeo } from '~/data/site-seo'
import type { WorkshopDetailPayload } from '~/types/public-catalog'
import { formatDisplayPrice } from '~/utils/format-price'

const route = useRoute()
const categorySlug = String(route.params.category)
const workshopSlug = String(route.params.slug)

const { data: workshopPayload } = await useFetch<WorkshopDetailPayload>(
  `/api/site/workshops/${categorySlug}/${workshopSlug}`,
  {
    key: `site-workshop-${categorySlug}-${workshopSlug}`
  }
)

const currentCategory = computed(() => workshopPayload.value?.category || null)
const currentWorkshop = computed(() => workshopPayload.value?.workshop || null)
const relatedWorkshops = computed(() => workshopPayload.value?.relatedCards || [])

const breadcrumbs = computed(() => [
  { label: 'Главная', href: '/' },
  { label: 'Мастер-классы', href: '/master-classes' },
  { label: currentCategory.value?.title || 'Подборка', href: `/master-classes/${categorySlug}` },
  { label: currentWorkshop.value?.title || 'Карточка мастер-класса' }
])

if (!currentCategory.value || !currentWorkshop.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Мастер-класс не найден'
  })
}

usePageSeo(computed(() => getWorkshopSeo(currentWorkshop.value!, currentCategory.value)))
</script>

<template>
  <div class="catalog-shell catalog-shell--detail">
    <section class="section catalog-shell__section catalog-shell__section--hero">
      <div class="container">
        <CatalogBreadcrumbs :items="breadcrumbs" />

        <CatalogHeroPanel
          :eyebrow="currentCategory?.title || 'Мастер-класс'"
          :title="currentWorkshop?.title || ''"
          :lead="currentWorkshop?.summary || ''"
          :image="currentWorkshop?.image || ''"
          :product="currentWorkshop ? {
            sku: currentWorkshop.id,
            category: currentCategory?.title || 'Мастер-класс',
            description: currentWorkshop.summary,
            price: currentWorkshop.priceFrom,
            url: route.fullPath
          } : undefined"
          :tags="[currentWorkshop?.audienceLabel || '', currentCategory?.title || ''].filter(Boolean)"
          :facts="[
            { label: 'Длительность', value: currentWorkshop?.duration || '' },
            { label: 'Участников', value: currentWorkshop?.participants || '' },
            { label: 'Стоимость', value: formatDisplayPrice(currentWorkshop?.priceFrom || '') }
          ]"
          :actions="[
            { label: 'Оставить заявку', href: '/#contacts' },
            { label: 'Назад к подборке', href: `/master-classes/${categorySlug}`, kind: 'ghost' }
          ]"
        />
      </div>
    </section>

    <section v-if="currentWorkshop?.description" class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <div class="catalog-section-head">
          <div>
            <p class="eyebrow">Описание</p>
            <h2>Что важно знать о мастер-классе</h2>
          </div>
        </div>

        <article class="catalog-panel catalog-panel--rich-copy">
          <p>{{ currentWorkshop.description }}</p>
        </article>
      </div>
    </section>

    <section class="section catalog-shell__section">
      <div class="container">
        <div class="catalog-section-head">
          <div>
            <p class="eyebrow">Как проходит</p>
            <h2>Организация и детали</h2>
          </div>
        </div>

        <div class="catalog-detail-grid">
          <article class="catalog-panel">
            <p class="eyebrow">Форматы проведения</p>
            <ul class="catalog-list">
              <li v-for="item in currentWorkshop?.formats" :key="item">{{ item }}</li>
            </ul>
          </article>

          <article class="catalog-panel">
            <p class="eyebrow">Что включено</p>
            <ul class="catalog-list">
              <li v-for="item in currentWorkshop?.includes" :key="item">{{ item }}</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <div class="catalog-section-head">
          <div>
            <p class="eyebrow">Стоимость</p>
            <h2>Варианты проведения и бюджет</h2>
          </div>
        </div>

        <div class="catalog-pricing-grid">
          <article v-for="price in currentWorkshop?.pricing" :key="price.label" class="catalog-price-card">
            <p>{{ price.label }}</p>
            <h3>{{ formatDisplayPrice(price.value) }}</h3>
            <span>{{ price.note || currentWorkshop?.priceNote }}</span>
          </article>
        </div>
      </div>
    </section>

    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <div class="catalog-section-head">
          <div>
            <p class="eyebrow">Фото</p>
            <h2>Как мастер-класс выглядит на площадке</h2>
          </div>
        </div>

        <CatalogGallerySection :items="currentWorkshop?.gallery || []" />
      </div>
    </section>

    <section v-if="relatedWorkshops.length" class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <CatalogCarouselSection
          eyebrow="Вам может понравиться"
          title="Другие мастер-классы из подборки"
          description="Похожие форматы, которые легко добавить в программу события."
          :items="relatedWorkshops"
        />
      </div>
    </section>
  </div>
</template>