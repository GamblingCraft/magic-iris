<script setup lang="ts">
import { getMasterClassesIndexSeo } from '~/data/site-seo'
import type { MasterClassesIndexPayload } from '~/types/public-catalog'

const { data: masterClassesPayload } = await useFetch<MasterClassesIndexPayload>(
  '/api/site/master-classes',
  {
    key: 'site-master-classes-index'
  }
)

const categoryPreviews = computed(() => masterClassesPayload.value?.categories || [])
const workshopPreviews = computed(() => masterClassesPayload.value?.workshops || [])
const heroImage = computed(() => masterClassesPayload.value?.heroImage || '')

const selectedTag = ref('all')

const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Мастер-классы' }
]

const filterTags = computed(() => [
  { slug: 'all', title: 'Все мастер-классы' },
  ...categoryPreviews.value.map((category) => ({
    slug: category.slug,
    title: category.title
  }))
])

const categoryCards = computed(() =>
  categoryPreviews.value.map((category) => category.card)
)

const uniqueById = <T extends { id: string }>(items: T[]) => {
  const seen = new Set<string>()

  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false
    }

    seen.add(item.id)
    return true
  })
}

const filteredWorkshopItems = computed(() => {
  if (selectedTag.value === 'all') {
    return workshopPreviews.value
  }

  return workshopPreviews.value.filter((workshop) =>
    workshop.categorySlugs.includes(selectedTag.value)
  )
})

const filteredWorkshopCards = computed(() =>
  filteredWorkshopItems.value.slice(0, 8).map((workshop) => workshop.card)
)

const popularWorkshopCards = computed(() => {
  const popular = [
    ...workshopPreviews.value.filter((workshop) => workshop.categorySlugs.length >= 4),
    ...workshopPreviews.value.filter((workshop) => workshop.categorySlugs.includes('v-shkolu')),
    ...workshopPreviews.value
  ]

  return uniqueById(popular).slice(0, 8).map((workshop) => workshop.card)
})

const recommendedWorkshopCards = computed(() => {
  const recommended = [
    ...workshopPreviews.value.filter((workshop) => workshop.categorySlugs.includes('dlya-zhenshchin')),
    ...workshopPreviews.value.filter((workshop) => workshop.categorySlugs.includes('letnie')),
    ...workshopPreviews.value.filter((workshop) => workshop.categorySlugs.includes('novogodnie')),
    ...workshopPreviews.value
  ]

  return uniqueById(recommended).slice(0, 8).map((workshop) => workshop.card)
})

const activeCategory = computed(() =>
  categoryPreviews.value.find((category) => category.slug === selectedTag.value)
)

const activeTagTitle = computed(() => {
  if (selectedTag.value === 'all') {
    return 'Все мастер-классы'
  }

  return activeCategory.value?.title ?? 'Подборка'
})

const activeTagDescription = computed(() => {
  if (selectedTag.value === 'all') {
    return 'Если вы только начинаете выбор, здесь удобно посмотреть разные форматы и почувствовать, какой ритм, материал и подача ближе именно вашему событию.'
  }

  return (
    activeCategory.value?.lead ||
    activeCategory.value?.description ||
    'Подборка мастер-классов для выбранного направления.'
  )
})

const activeTagHref = computed(() =>
  selectedTag.value === 'all'
    ? '/master-classes'
    : activeCategory.value?.href || '/master-classes'
)

const featuredWorkshopCards = computed(() =>
  workshopPreviews.value.slice(0, 8).map((workshop) => workshop.card)
)

usePageSeo(getMasterClassesIndexSeo())
</script>

<template>
  <div class="catalog-shell">
    <section class="section catalog-shell__section catalog-shell__section--hero">
      <div class="container">
        <CatalogBreadcrumbs :items="breadcrumbs" />

        <CatalogHeroPanel
          eyebrow="Мастер-классы"
          title="Выездные творческие форматы для праздников, школ, корпоративов и городских площадок"
          lead="В каталоге собраны выездные творческие форматы для детей и взрослых: от камерных мастер-классов до потоковых зон для больших событий."
          description="Начните с подборки по аудитории или сезону, а затем откройте интересующий формат: внутри есть фото, описание, варианты проведения и ориентир по стоимости."
          :image="heroImage"
          :actions="[
            { label: 'Оставить заявку', href: '/#contacts' },
            { label: 'Посмотреть шоу', href: '/shows', kind: 'ghost' }
          ]"
        />
      </div>
    </section>

    <section class="section catalog-shell__section">
      <div class="container">
        <CatalogCardsSection
          eyebrow="Подборки"
          title="Начните с направления и аудитории"
          description="Выберите подборку, которая ближе вашему формату события: камерные идеи для взрослых, школьные группы, сезонные мастер-классы или форматы для открытых площадок."
          :items="categoryCards"
        />
      </div>
    </section>

    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <div class="catalog-filter-panel">
          <div class="catalog-cards-section__head">
            <div>
              <p class="eyebrow">Подберите формат</p>
              <h2>Мастер-классы под вашу аудиторию и настроение события</h2>
            </div>

            <p>Выберите направление, чтобы сразу увидеть форматы для женской аудитории, школьных групп, сезонных праздников или летних площадок.</p>
          </div>

          <div class="catalog-filter-panel__chips">
            <button
              v-for="tag in filterTags"
              :key="tag.slug"
              type="button"
              :class="['catalog-filter-chip', { 'catalog-filter-chip--active': selectedTag === tag.slug }]"
              @click="selectedTag = tag.slug"
            >
              {{ tag.title }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <CatalogCarouselSection
          eyebrow="Сейчас в фокусе"
          :title="activeTagTitle"
          :description="activeTagDescription"
          :items="filteredWorkshopCards"
        />
      </div>
    </section>

    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <CatalogCarouselSection
          eyebrow="Популярные"
          title="Форматы, которые особенно хорошо работают на событиях"
          description="Это мастер-классы, которые легко встраиваются в тайминг, красиво смотрятся на площадке и вовлекают гостей с первых минут."
          :items="popularWorkshopCards"
        />
      </div>
    </section>

    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <CatalogCarouselSection
          eyebrow="Рекомендуем"
          title="Идеи, с которых приятно начать выбор"
          description="Спокойные, эстетичные и универсальные форматы для камерных праздников, творческих зон и событий, где важна красивая подача."
          :items="recommendedWorkshopCards"
        />
      </div>
    </section>

    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <CatalogCardsSection
          eyebrow="Все мастер-классы"
          title="Ещё несколько идей для вдохновения"
          description="Посмотрите разные форматы и сохраните те, что откликаются по атмосфере, визуалу и результату для гостей."
          :items="featuredWorkshopCards"
        />
      </div>
    </section>

    <section v-if="selectedTag !== 'all'" class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <div class="catalog-filter-panel__footer">
          <NuxtLink :to="activeTagHref" class="button button--accent">
            Перейти в подборку «{{ activeTagTitle }}»
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
