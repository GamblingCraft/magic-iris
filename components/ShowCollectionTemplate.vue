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

<style scoped>
.show-collection-page__hero :deep(.catalog-breadcrumbs) {
  margin-bottom: 1.5rem;
}

.show-collection-page__hero :deep(.catalog-breadcrumbs__link),
.show-collection-page__hero :deep(.catalog-breadcrumbs__current),
.show-collection-page__hero :deep(.catalog-breadcrumbs__separator) {
  color: rgba(255, 248, 236, 0.8);
}

.show-collection-page__hero-aside {
  display: grid;
  gap: 1rem;
  align-self: end;
  max-width: 24rem;
}

.show-collection-page__hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.show-collection-page__hero-tags span,
.show-collection-page__hero-fact,
.show-collection-page__scenario-card,
.cta-ref--compact {
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 248, 236, 0.08);
  backdrop-filter: blur(18px);
}

.show-collection-page__hero-tags span {
  padding: 0.7rem 1rem;
  border-radius: 999px;
  color: #fff8ec;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.show-collection-page__hero-facts {
  display: grid;
  gap: 0.85rem;
}

.show-collection-page__hero-fact {
  padding: 1rem 1.1rem;
  border-radius: 1.4rem;
}

.show-collection-page__hero-fact p {
  margin: 0 0 0.35rem;
  color: rgba(255, 248, 236, 0.72);
  font-size: 0.85rem;
}

.show-collection-page__hero-fact strong {
  color: #fff8ec;
  font-size: 1rem;
}

.show-collection-page__section-head {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(18rem, 0.9fr);
  gap: 2rem;
  align-items: start;
  margin-bottom: 2rem;
}

.show-collection-page__section-head h2 {
  margin: 0;
}

.show-collection-page__section-head > p,
.show-collection-page__about-text p,
.show-collection-page__scenario-card p {
  margin: 0;
  color: rgba(33, 22, 17, 0.78);
}

.show-collection-page__scenario-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.show-collection-page__scenario-card {
  min-height: 12rem;
  padding: 1.4rem;
  border-radius: 1.8rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(249, 239, 228, 0.92));
}

.show-collection-page__scenario-card span {
  display: inline-flex;
  margin-bottom: 1.4rem;
  color: #b15f36;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.show-collection-page__about-text {
  display: grid;
  gap: 1rem;
  max-width: 58rem;
}

.cta-ref--compact {
  display: block;
  padding: 3rem;
  border-radius: 2rem;
}

.cta-ref__title--plain {
  display: block;
  font-size: clamp(2rem, 3vw, 3.4rem);
}

.show-collection-page__cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
}

@media (max-width: 1100px) {
  .show-collection-page__section-head,
  .show-collection-page__scenario-grid {
    grid-template-columns: 1fr 1fr;
  }

  .show-collection-page__hero-aside {
    max-width: none;
  }
}

@media (max-width: 900px) {
  .show-collection-page__section-head,
  .show-collection-page__scenario-grid {
    grid-template-columns: 1fr;
  }

  .cta-ref--compact {
    padding: 2rem 1.4rem;
  }
}
</style>
