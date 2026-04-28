<script setup lang="ts">
import { getMasterClassCategorySeo } from '~/data/site-seo'
import type { MasterClassCategoryPagePayload } from '~/types/public-catalog'

const route = useRoute()
const categorySlug = String(route.params.category)

const { data: categoryPayload } = await useFetch<MasterClassCategoryPagePayload>(
  `/api/site/master-class-categories/${categorySlug}`,
  {
    key: `site-master-class-category-${categorySlug}`
  }
)

const currentCategory = computed(() => categoryPayload.value?.category || null)
const workshopCards = computed(() => categoryPayload.value?.workshopCards || [])

const breadcrumbs = computed(() => [
  { label: 'Главная', href: '/' },
  { label: 'Мастер-классы', href: '/master-classes' },
  { label: currentCategory.value?.title || 'Подборка' }
])

if (!currentCategory.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Категория не найдена'
  })
}

usePageSeo(computed(() => getMasterClassCategorySeo(currentCategory.value!)))
</script>

<template>
  <div class="catalog-shell">
    <section class="section catalog-shell__section catalog-shell__section--hero">
      <div class="container">
        <CatalogBreadcrumbs :items="breadcrumbs" />

        <CatalogHeroPanel
          eyebrow="Подборка мастер-классов"
          :title="currentCategory?.title || ''"
          :lead="currentCategory?.lead || ''"
          :description="currentCategory?.description || ''"
          :image="currentCategory?.image || ''"
          :facts="[
            { label: 'Форматов', value: `${currentCategory?.count || 0}` },
            { label: 'Проведение', value: 'на вашей площадке' },
            { label: 'Подготовка', value: 'материалы и мастера' }
          ]"
          :tags="['выездной формат', 'для гостей', 'под тайминг события']"
          :actions="[
            { label: 'Оставить заявку', href: '/#contacts' },
            { label: 'Все подборки', href: '/master-classes', kind: 'ghost' }
          ]"
        />
      </div>
    </section>

    <section class="section catalog-shell__section">
      <div class="container">
        <CatalogCardsSection
          eyebrow="Каталог категории"
          title="Форматы внутри подборки"
          description="Ниже собраны форматы этой подборки: с фото, коротким описанием, ориентиром по стоимости и переходом на страницу мастер-класса."
          :items="workshopCards"
        />
      </div>
    </section>
  </div>
</template>
