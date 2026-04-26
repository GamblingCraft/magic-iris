<script setup lang="ts">
import {
  createMasterClassCategoryHref,
  createMasterClassHref,
  masterClassCategories,
  workshopItems
} from '~/data/catalog'

const selectedTag = ref('all')

const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Мастер-классы' }
]

const filterTags = computed(() => [
  { slug: 'all', title: 'Все форматы' },
  ...masterClassCategories.map((category) => ({
    slug: category.slug,
    title: category.title
  }))
])

const categoryCards = computed(() =>
  masterClassCategories.map((category) => ({
    id: category.id,
    href: createMasterClassCategoryHref(category.slug),
    image: category.image,
    imageAlt: category.title,
    kicker: 'Подборка',
    title: category.title,
    description: category.description,
    metaPrimary: `${category.count} форматов`,
    metaLabel: 'В каталоге',
    metaSecondary: 'Открыть подборку',
    buttonLabel: 'Открыть подборку'
  }))
)

const toWorkshopCard = (workshop: (typeof workshopItems)[number]) => ({
  id: workshop.id,
  href: createMasterClassHref(workshop.primaryCategorySlug, workshop.slug),
  image: workshop.image,
  imageAlt: workshop.title,
  kicker: workshop.audienceLabel,
  title: workshop.title,
  description: workshop.summary,
  metaPrimary: workshop.priceFrom,
  metaLabel: 'Стоимость',
  metaSecondary: 'Открыть формат',
  buttonLabel: 'Открыть формат',
  priceValue: workshop.priceFrom,
  productMicrodata: true
})

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
    return workshopItems
  }

  return workshopItems.filter((workshop) => workshop.categorySlugs.includes(selectedTag.value))
})

const filteredWorkshopCards = computed(() =>
  filteredWorkshopItems.value.slice(0, 8).map(toWorkshopCard)
)

const popularWorkshopCards = computed(() => {
  const popular = [
    ...workshopItems.filter((workshop) => workshop.categorySlugs.length >= 4),
    ...workshopItems.filter((workshop) => workshop.categorySlugs.includes('v-shkolu')),
    ...workshopItems
  ]

  return uniqueById(popular).slice(0, 8).map(toWorkshopCard)
})

const recommendedWorkshopCards = computed(() => {
  const recommended = [
    ...workshopItems.filter((workshop) => workshop.categorySlugs.includes('dlya-zhenshchin')),
    ...workshopItems.filter((workshop) => workshop.categorySlugs.includes('letnie')),
    ...workshopItems.filter((workshop) => workshop.categorySlugs.includes('novogodnie')),
    ...workshopItems
  ]

  return uniqueById(recommended).slice(0, 8).map(toWorkshopCard)
})

const activeCategory = computed(() =>
  masterClassCategories.find((category) => category.slug === selectedTag.value)
)

const activeTagTitle = computed(() => {
  if (selectedTag.value === 'all') {
    return 'Все форматы'
  }

  return activeCategory.value?.title ?? 'Подборка'
})

const activeTagDescription = computed(() => {
  if (selectedTag.value === 'all') {
    return 'Первые форматы из общего каталога. Выберите тег, чтобы быстро сузить подборку под аудиторию или сезон.'
  }

  return activeCategory.value?.description ?? 'Подборка форматов по выбранному тегу.'
})

const activeTagHref = computed(() =>
  selectedTag.value === 'all'
    ? '/master-classes'
    : createMasterClassCategoryHref(selectedTag.value)
)

const featuredWorkshopCards = computed(() =>
  workshopItems.slice(0, 8).map(toWorkshopCard)
)

useSeoMeta({
  title: 'Мастер-классы',
  description: 'Каталог выездных мастер-классов Magic Iris по категориям, форматам и отдельным страницам.'
})
</script>

<template>
  <div class="catalog-shell">
    <section class="section catalog-shell__section catalog-shell__section--hero">
      <div class="container">
        <CatalogBreadcrumbs :items="breadcrumbs" />

        <CatalogHeroPanel
          eyebrow="Мастер-классы"
          title="Выездные творческие форматы для праздников, школ, корпоративов и городских площадок"
          lead="Собрали полный каталог мастер-классов с отдельными страницами, правильными slug и структурой, готовой под будущую админку."
          description="Можно начать с подборок по аудитории и сезону, а затем открыть отдельный мастер-класс, посмотреть его описание, варианты проведения, стоимость и реальные фото."
          :image="masterClassCategories[0]?.image || workshopItems[0]?.image"
          :facts="[
            { label: 'Подборки', value: `${masterClassCategories.length}` },
            { label: 'Форматы', value: `${workshopItems.length}` },
            { label: 'Организация', value: 'под ключ' }
          ]"
          :tags="['для женщин', 'для мужчин', 'в школу', 'новогодние', 'летние']"
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
          description="На главной странице каталога карточки тоже стали легче: фото, короткое описание, понятный параметр и кнопка открытия."
          :items="categoryCards"
        />
      </div>
    </section>

    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <div class="catalog-filter-panel">
          <div class="catalog-cards-section__head">
            <div>
              <p class="eyebrow">Фильтрация по тегам</p>
              <h2>Быстрый подбор мастер-классов</h2>
            </div>

            <p>Выберите тег, и мы покажем первые форматы по нужной аудитории или сезону. Для полного списка можно перейти в соответствующую подборку.</p>
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
          eyebrow="Подборка по тегу"
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
          title="Форматы, которые чаще всего выбирают для событий"
          description="Универсальные мастер-классы с понятной организацией, красивым результатом и хорошей вовлечённостью гостей."
          :items="popularWorkshopCards"
        />
      </div>
    </section>

    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <CatalogCarouselSection
          eyebrow="Рекомендуем"
          title="Мастер-классы, с которых удобно начать знакомство с каталогом"
          description="Более эстетичные и гибкие форматы для камерных событий, творческих зон и красивой подачи на площадке."
          :items="recommendedWorkshopCards"
        />
      </div>
    </section>

    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <CatalogCardsSection
          eyebrow="С чего начать"
          title="Ещё несколько форматов для быстрого выбора"
          description="Компактная сетка с реальными карточками мастер-классов: фото, описание, стоимость и кнопка перехода."
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
