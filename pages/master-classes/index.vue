<script setup lang="ts">
import { getMasterClassesIndexSeo } from '~/data/site-seo'
import type { MasterClassesIndexPayload } from '~/types/public-catalog'
import type { CatalogPagesContent } from '~/data/catalog-pages'

const { data: masterClassesPayload } = await useFetch<MasterClassesIndexPayload>('/api/site/master-classes', {
  key: 'site-master-classes-index'
})

const { data: catalogPages } = await useFetch<CatalogPagesContent>('/api/site/catalog-pages', {
  key: 'site-catalog-pages-master-classes'
})

const categoryPreviews = computed(() => masterClassesPayload.value?.categories || [])
const workshopPreviews = computed(() => masterClassesPayload.value?.workshops || [])
const heroImage = computed(() => masterClassesPayload.value?.heroImage || '')
const masterClassesPage = computed(() => catalogPages.value?.masterClasses || null)
const faqItems = computed(() => masterClassesPage.value?.faq.items || [])

const selectedTag = ref('all')
const openIndex = ref(0)

const toggleItem = (index: number) => {
  openIndex.value = openIndex.value === index ? -1 : index
}

const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Мастер-классы' }
]

const filterTags = computed(() => [
  { slug: 'all', title: 'Все' },
  ...categoryPreviews.value.map((category) => ({
    slug: category.slug,
    title: category.title
  }))
])

const categoryCards = computed(() => categoryPreviews.value.map((category) => category.card))

const uniqueById = <T extends { id: string }>(items: T[]) => {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

const filteredWorkshopItems = computed(() => {
  if (selectedTag.value === 'all') return workshopPreviews.value
  return workshopPreviews.value.filter((workshop) => workshop.categorySlugs.includes(selectedTag.value))
})

const filteredWorkshopCards = computed(() => filteredWorkshopItems.value.slice(0, 8).map((workshop) => workshop.card))

const popularWorkshopCards = computed(() => {
  const popular = [
    ...workshopPreviews.value.filter((w) => w.categorySlugs.length >= 4),
    ...workshopPreviews.value.filter((w) => w.categorySlugs.includes('v-shkolu')),
    ...workshopPreviews.value
  ]
  return uniqueById(popular).slice(0, 8).map((w) => w.card)
})

const recommendedWorkshopCards = computed(() => {
  const recommended = [
    ...workshopPreviews.value.filter((w) => w.categorySlugs.includes('dlya-zhenshchin')),
    ...workshopPreviews.value.filter((w) => w.categorySlugs.includes('letnie')),
    ...workshopPreviews.value.filter((w) => w.categorySlugs.includes('novogodnie')),
    ...workshopPreviews.value
  ]
  return uniqueById(recommended).slice(0, 8).map((w) => w.card)
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.value.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      }))
    }
  ]
})

usePageSeo(
  computed(() => ({
    ...getMasterClassesIndexSeo(),
    image: heroImage.value || '/images/hero.webp'
  }))
)
</script>

<template>
  <div class="catalog-shell">
    <section class="section catalog-shell__section catalog-shell__section--hero">
      <div class="container">
        <CatalogBreadcrumbs :items="breadcrumbs" />

        <CatalogHeroPanel
          eyebrow="Мастер-классы"
          title="Творческие форматы для праздников, школ, корпоративов и городских площадок"
          title-tag="h2"
          description="В каталоге собраны творческие мастер-классы для детей и взрослых."
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
          title="Выберите направление"
          description="Подборки по аудитории и формату."
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
              <h2>Мастер-классы</h2>
            </div>
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
        <CatalogCarouselSection :items="filteredWorkshopCards" />
      </div>
    </section>

    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <CatalogCarouselSection title="Популярные" description="Подходят для разных сценариев мероприятий." :items="popularWorkshopCards" />
      </div>
    </section>

    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <CatalogCarouselSection title="Рекомендуем" description="Универсальные решения." :items="recommendedWorkshopCards" />
      </div>
    </section>

    <section v-if="masterClassesPage" class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <div class="sec-title-double catalog-text-head">
          <div>
            <p class="eyebrow">{{ masterClassesPage.text.eyebrow }}</p>
            <h1 class="h2">{{ masterClassesPage.text.title }}</h1>
          </div>
          <p class="catalog-preview__lead">{{ masterClassesPage.text.lead }}</p>
        </div>

        <div class="catalog-text-block">
          <p v-for="(paragraph, index) in masterClassesPage.text.paragraphs" :key="`master-text-${index}`">{{ paragraph }}</p>
        </div>
      </div>
    </section>

    <section v-if="masterClassesPage" class="section faq-section">
      <div class="container">
        <p class="eyebrow">{{ masterClassesPage.faq.eyebrow }}</p>

        <div class="sec-title-double faq-section__head">
          <div>
            <h2 class="h2">{{ masterClassesPage.faq.title }} <strong>{{ masterClassesPage.faq.titleAccent }}</strong></h2>
          </div>
          <p class="catalog-preview__lead">{{ masterClassesPage.faq.description }}</p>
        </div>

        <div class="faq-list">
          <article
            v-for="(item, index) in faqItems"
            :key="item.question"
            class="faq-item"
            :class="{ 'faq-item--open': openIndex === index }"
          >
            <button type="button" class="faq-item__button" @click="toggleItem(index)">
              <span>{{ item.question }}</span>
              <span class="faq-item__icon">{{ openIndex === index ? '−' : '+' }}</span>
            </button>

            <div class="faq-item__content" :class="{ 'faq-item__content--open': openIndex === index }">
              <div class="faq-item__answer">
                <p>{{ item.answer }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
