<script setup lang="ts">
import {
  getMasterClassCategoryBySlug,
  getWorkshopsByCategorySlug,
  getWorkshopBySlugs
} from '~/data/catalog'
import { getWorkshopSeo } from '~/data/site-seo'
import { formatDisplayPrice } from '~/utils/format-price'

const route = useRoute()
const categorySlug = computed(() => String(route.params.category))
const workshopSlug = computed(() => String(route.params.slug))

const currentCategory = computed(() => getMasterClassCategoryBySlug(categorySlug.value))
const currentWorkshop = computed(() => getWorkshopBySlugs(categorySlug.value, workshopSlug.value))
const relatedWorkshops = computed(() =>
  getWorkshopsByCategorySlug(categorySlug.value)
    .filter((item) => item.slug !== workshopSlug.value)
    .slice(0, 6)
    .map((item) => ({
      id: item.id,
      href: `/master-classes/${item.primaryCategorySlug}/${item.slug}`,
      image: item.image,
      imageAlt: item.gallery[0]?.alt || item.title,
      kicker: currentCategory.value?.title || item.audienceLabel,
      title: item.title,
      description: item.summary,
      metaLabel: 'Стоимость',
      metaPrimary: item.priceFrom,
      metaSecondary: item.audienceLabel,
      buttonLabel: 'Открыть',
      productMicrodata: true
    }))
)

const breadcrumbs = computed(() => [
  { label: 'Главная', href: '/' },
  { label: 'Мастер-классы', href: '/master-classes' },
  { label: currentCategory.value?.title || 'Подборка', href: `/master-classes/${categorySlug.value}` },
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
            { label: 'Участники', value: currentWorkshop?.participants || '' },
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
            <h2>Что важно знать об этом мастер-классе</h2>
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
            <p class="eyebrow">Организация</p>
            <h2>Как проходит мастер-класс</h2>
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
            <p class="eyebrow">Что входит</p>
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
            <h2>Как выглядит мастер-класс на площадке</h2>
          </div>
        </div>

        <CatalogGallerySection :items="currentWorkshop?.gallery || []" />
      </div>
    </section>

    <section v-if="relatedWorkshops.length" class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <CatalogCarouselSection
          eyebrow="Вам может понравиться"
          title="Другие мастер-классы из этой подборки"
          description="Похожие форматы из этой категории, которые можно быстро добавить в программу события."
          :items="relatedWorkshops"
        />
      </div>
    </section>
  </div>
</template>
