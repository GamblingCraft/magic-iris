<script setup lang="ts">
import { getShowsIndexSeo } from '~/data/site-seo'
import type { ShowsIndexPayload } from '~/types/public-catalog'
import type { CatalogPagesContent } from '~/data/catalog-pages'

const { data: showsPayload } = await useFetch<ShowsIndexPayload>('/api/site/shows', {
  key: 'site-shows-index'
})

const { data: catalogPages } = await useFetch<CatalogPagesContent>('/api/site/catalog-pages', {
  key: 'site-catalog-pages'
})

const showCards = computed(() => showsPayload.value?.cards || [])
const heroImage = computed(() => showsPayload.value?.heroImage || '')
const showsCount = computed(() => showCards.value.length)
const showsPage = computed(() => catalogPages.value?.shows || null)
const heroContent = computed(() => showsPage.value?.hero || null)
const faqItems = computed(() => showsPage.value?.faq.items || [])
const openIndex = ref(0)

const toggleItem = (index: number) => {
  openIndex.value = openIndex.value === index ? -1 : index
}

const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Шоу' }
]

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
    ...getShowsIndexSeo(),
    image: heroContent.value?.image || heroImage.value || '/images/hero.webp'
  }))
)
</script>

<template>
  <div class="catalog-shell catalog-shell--shows">
    <section class="section catalog-shell__section catalog-shell__section--hero">
      <div class="container">
        <CatalogBreadcrumbs :items="breadcrumbs" />

        <CatalogHeroPanel
          :eyebrow="heroContent?.eyebrow || 'Шоу'"
          :title="heroContent?.title || 'Сценические форматы, где эмоция, свет и сильный первый кадр решают всё'"
          title-tag="h2"
          lead=""
          :description="heroContent?.description || 'Песочная анимация, световые номера, шоу-портреты и вращающийся портрет — для тех, кто хочет удивить гостей и оставить яркое впечатление.'"
          :image="heroContent?.image || heroImage"
          :facts="heroContent?.facts?.length ? heroContent.facts : [
            { label: 'Форматов', value: `${showsCount}` },
            { label: 'Сценарий', value: 'под ваше событие' },
            { label: 'Выезд', value: 'по Иркутску и области' }
          ]"
          :tags="heroContent?.tags?.length ? heroContent.tags : ['свадьба', 'день рождения', 'корпоратив', 'городское событие']"
          :actions="heroContent?.actions?.length ? heroContent.actions : [
            { label: 'Оставить заявку', href: '/#contacts', kind: 'primary' },
            { label: 'Посмотреть мастер-классы', href: '/master-classes', kind: 'ghost' }
          ]"
        />
      </div>
    </section>

    <section class="section catalog-shell__section">
      <div class="container">
        <CatalogCardsSection
          eyebrow="Каталог шоу"
          title="Выберите программу под ваш праздник"
          description="Фото, короткое описание, ориентир по стоимости и страница с деталями — всё понятно, без лишнего."
          :columns="3"
          :items="showCards"
        />
      </div>
    </section>

    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container" v-if="showsPage">
        <div class="sec-title-double catalog-text-head">
          <div>
            <p class="eyebrow">{{ showsPage.text.eyebrow }}</p>
            <h1 class="h2">{{ showsPage.text.title }}</h1>
          </div>
          <p class="catalog-preview__lead">{{ showsPage.text.lead }}</p>
        </div>

        <div class="catalog-text-block">
          <p v-for="(paragraph, index) in showsPage.text.paragraphs" :key="`shows-text-${index}`">{{ paragraph }}</p>
        </div>
      </div>
    </section>

    <section v-if="showsPage" class="section faq-section">
      <div class="container">
        <p class="eyebrow">{{ showsPage.faq.eyebrow }}</p>

        <div class="sec-title-double faq-section__head">
          <div>
            <h2 class="h2">{{ showsPage.faq.title }} <strong>{{ showsPage.faq.titleAccent }}</strong></h2>
          </div>
          <p class="catalog-preview__lead">{{ showsPage.faq.description }}</p>
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
