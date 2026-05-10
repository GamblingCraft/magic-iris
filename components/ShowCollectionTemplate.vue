<script setup lang="ts">
import type { ShowCollectionPage } from '~/data/show-collections'
import {
  resolveShowCollectionCards,
  resolveWorkshopCollectionCards
} from '~/data/show-collections'
import { buildAbsoluteUrl } from '~/data/site-seo'

const props = defineProps<{
  content: ShowCollectionPage
}>()

const route = useRoute()
const showCards = computed(() => resolveShowCollectionCards(props.content.cards.showSlugs))
const workshopCards = computed(() =>
  resolveWorkshopCollectionCards(props.content.workshops.categorySlugs)
)

const pageUrl = computed(() => buildAbsoluteUrl(route.path))

const structuredData = computed(() => [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: buildAbsoluteUrl('/')
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Шоу',
        item: buildAbsoluteUrl('/shows')
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: props.content.breadcrumbLabel,
        item: pageUrl.value
      }
    ]
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: props.content.hero.title,
    description: `${props.content.hero.lead} ${props.content.hero.description}`.trim(),
    areaServed: 'Иркутск',
    serviceType: props.content.breadcrumbLabel,
    provider: {
      '@type': 'Organization',
      name: 'Magic Iris',
      url: buildAbsoluteUrl('/')
    },
    url: pageUrl.value
  }
])

useHead({
  script: computed(() => [
    {
      type: 'application/ld+json',
      children: JSON.stringify(structuredData.value)
    }
  ])
})
</script>

<template>
  <div class="show-collection-page">
    <section class="hero intro hero--reference show-collection-page__hero">
      <div class="hero__scene">
        <img :src="content.hero.image" :alt="content.hero.title">
      </div>

      <div class="hero__overlay" />

      <div class="container hero__inner">
        <div class="hero__copy">
          <CatalogBreadcrumbs
            :items="[
              { label: 'Главная', href: '/' },
              { label: 'Шоу', href: '/shows' },
              { label: content.breadcrumbLabel }
            ]"
          />

          <p class="hero__eyebrow">{{ content.hero.eyebrow }}</p>
          <h1 class="hero__headline">{{ content.hero.title }}</h1>
          <p class="hero__script">{{ content.hero.lead }}</p>
          <p class="hero__summary">{{ content.hero.description }}</p>

          <div class="hero__cta">
            <NuxtLink :to="content.cta.primary.href" class="button button--accent btn hero__button">
              <span>{{ content.cta.primary.label }}</span>
            </NuxtLink>
          </div>
        </div>

        <div class="show-collection-page__hero-aside">
          <div class="show-collection-page__hero-tags">
            <span v-for="tag in content.hero.tags" :key="tag">{{ tag }}</span>
          </div>

          <div class="show-collection-page__hero-facts">
            <article
              v-for="fact in content.hero.facts"
              :key="fact.label"
              class="show-collection-page__hero-fact"
            >
              <p>{{ fact.label }}</p>
              <strong>{{ fact.value }}</strong>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--light show-collection-page__scenario">
      <div class="container">
        <div class="show-collection-page__section-head">
          <div>
            <p class="eyebrow">{{ content.scenario.eyebrow }}</p>
            <h2>{{ content.scenario.title }}</h2>
          </div>

          <p>{{ content.scenario.text }}</p>
        </div>

        <div class="show-collection-page__scenario-grid">
          <article
            v-for="(point, index) in content.scenario.points"
            :key="point"
            class="show-collection-page__scenario-card"
          >
            <span>{{ `0${index + 1}`.slice(-2) }}</span>
            <p>{{ point }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section show-collection-page__cards">
      <div class="container">
        <CatalogCardsSection
          :eyebrow="content.cards.eyebrow"
          :title="content.cards.title"
          :description="content.cards.description"
          :columns="2"
          :items="showCards"
        />
      </div>
    </section>

    <section class="section section--cream show-collection-page__cards">
      <div class="container">
        <CatalogCardsSection
          :eyebrow="content.workshops.eyebrow"
          :title="content.workshops.title"
          :description="content.workshops.description"
          :columns="3"
          :items="workshopCards"
        />
      </div>
    </section>

    <section class="section show-collection-page__about">
      <div class="container">
        <div class="show-collection-page__section-head">
          <div>
            <p class="eyebrow">{{ content.about.eyebrow }}</p>
            <h2>{{ content.about.title }}</h2>
          </div>

          <p>{{ content.about.lead }}</p>
        </div>

        <div class="show-collection-page__about-text">
          <p v-for="paragraph in content.about.paragraphs" :key="paragraph">
            {{ paragraph }}
          </p>
        </div>
      </div>
    </section>

    <section class="section cta-section show-collection-page__cta">
      <div class="container">
        <article class="cta-ref cta-ref--compact">
          <div class="cta-ref__content">
            <p class="eyebrow">{{ content.cta.eyebrow }}</p>
            <h2 class="cta-ref__title cta-ref__title--plain">{{ content.cta.title }}</h2>
            <p class="cta-ref__descr">{{ content.cta.text }}</p>

            <div class="show-collection-page__cta-actions">
              <NuxtLink :to="content.cta.primary.href" class="button button--accent">
                {{ content.cta.primary.label }}
              </NuxtLink>
              <NuxtLink :to="content.cta.secondary.href" class="button button--ghost">
                {{ content.cta.secondary.label }}
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
