<script setup lang="ts">
import type { ShowCollectionPage } from '~/data/show-collections'

import {
  resolveShowCollectionTiles,
  resolveWorkshopCollectionTiles
} from '~/data/show-collections'
import { buildAbsoluteUrl } from '~/data/site-seo'

const route = useRoute()
const { data: pageData } = await useFetch<ShowCollectionPage>('/api/site/landing-pages/corporative', {
  key: 'corporative.vue-landing-page'
})

const page = computed(() => pageData.value as ShowCollectionPage)
const showTiles = computed(() => resolveShowCollectionTiles(page.value.cards.showSlugs))
const workshopTiles = computed(() => resolveWorkshopCollectionTiles(page.value.workshops.categorySlugs))
const scenarioImages = computed(() =>
  page.value.scenario.images.map((image) => image || page.value.hero.image).slice(0, 3)
)

const pageUrl = computed(() => buildAbsoluteUrl(route.path))

usePageSeo(page.value.seo)

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: '\u0413\u043b\u0430\u0432\u043d\u0430\u044f', item: buildAbsoluteUrl('/') },
            { '@type': 'ListItem', position: 2, name: '\u0428\u043e\u0443', item: buildAbsoluteUrl('/shows') },
            { '@type': 'ListItem', position: 3, name: page.value.breadcrumbLabel, item: pageUrl.value }
          ]
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: page.value.hero.title,
          description: `${page.value.hero.lead} ${page.value.hero.description}`.trim(),
          areaServed: '\u0418\u0440\u043a\u0443\u0442\u0441\u043a',
          serviceType: '\u0428\u043e\u0443 \u043d\u0430 \u043a\u043e\u0440\u043f\u043e\u0440\u0430\u0442\u0438\u0432',
          provider: {
            '@type': 'Organization',
            name: 'Magic Iris',
            url: buildAbsoluteUrl('/')
          },
          url: pageUrl.value
        }
      ])
    }
  ]
})
</script>

<template>
  <div class="landing-page collection-landing">
    <section class="hero intro hero--reference">
      <div class="hero__scene">
        <img :src="page.hero.image" :alt="page.hero.title">
      </div>

      <div class="hero__overlay" />

      <div class="container hero__inner">
        <div class="hero__copy">
          <CatalogBreadcrumbs
            :items="[
              { label: '\u0413\u043b\u0430\u0432\u043d\u0430\u044f', href: '/' },
              { label: '\u0428\u043e\u0443', href: '/shows' },
              { label: page.breadcrumbLabel }
            ]"
          />

          <p class="hero__eyebrow">{{ page.hero.eyebrow }}</p>
          <h1 class="hero__headline">{{ page.hero.title }}</h1>
          <p class="hero__script">{{ page.hero.lead }}</p>
          <p class="hero__summary">{{ page.hero.description }}</p>

          <div class="hero__cta">
            <NuxtLink :to="page.cta.primary.href" class="button button--accent btn hero__button">
              <span>{{ page.cta.primary.label }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--light scenario-showcase">
      <div class="container">
        <div class="scenario-showcase__head">
          <div class="scenario-showcase__title-wrap">
            <p class="eyebrow">{{ page.scenario.eyebrow }}</p>
            <h2 class="scenario-showcase__title">
              <strong>{{ page.scenario.title }}</strong>
            </h2>
          </div>

          <p class="scenario-showcase__lead">{{ page.scenario.text }}</p>
        </div>

        <div class="scenario-showcase__grid">
          <article
            v-for="(point, index) in page.scenario.points"
            :key="`${index}-${point}`"
            class="scenario-card"
          >
            <div class="scenario-card__photo" :style="{ backgroundImage: `url(${scenarioImages[index] || page.hero.image})` }" />
            <span class="scenario-card__number">{{ index + 1 }}</span>
            <div class="scenario-card__body">
              <h3><span>{{ point }}</span></h3>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--light catalog-preview">
      <div class="container">
        <div class="catalog-preview__head">
          <div>
            <p class="eyebrow">{{ page.cards.eyebrow }}</p>
            <h2 class="catalog-preview__title">
              <strong>{{ page.cards.title }}</strong>
            </h2>
          </div>

          <p class="catalog-preview__lead">{{ page.cards.description }}</p>
        </div>

        <div class="catalog-wall">
          <NuxtLink
            v-for="tile in showTiles"
            :key="tile.id"
            :to="tile.href"
            class="catalog-wall__card"
            :class="`catalog-wall__card--${tile.size}`"
          >
            <div class="catalog-wall__media" :style="{ backgroundImage: `url(${tile.image})` }" />
            <div class="catalog-wall__overlay" />
            <div class="catalog-wall__content">
              <h3>{{ tile.title }}</h3>
              <p>{{ tile.kicker }}</p>
            </div>
            <span class="catalog-wall__arrow">&#8599;</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section section--cream catalog-preview">
      <div class="container">
        <div class="catalog-preview__head">
          <div>
            <p class="eyebrow">{{ page.workshops.eyebrow }}</p>
            <h2 class="catalog-preview__title">
              <strong>{{ page.workshops.title }}</strong>
            </h2>
          </div>

          <p class="catalog-preview__lead">{{ page.workshops.description }}</p>
        </div>

        <div class="catalog-wall">
          <NuxtLink
            v-for="tile in workshopTiles"
            :key="tile.id"
            :to="tile.href"
            class="catalog-wall__card"
            :class="`catalog-wall__card--${tile.size}`"
          >
            <div class="catalog-wall__media" :style="{ backgroundImage: `url(${tile.image})` }" />
            <div class="catalog-wall__overlay" />
            <div class="catalog-wall__content">
              <h3>{{ tile.title }}</h3>
              <p>{{ tile.count }} форматов</p>
            </div>
            <span class="catalog-wall__arrow">&#8599;</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section about-section">
      <div class="container about-section__intro">
        <p class="eyebrow">{{ page.about.eyebrow }}</p>
      </div>

      <div class="container">
        <div class="about-section__body">
          <p class="about-section__lead">{{ page.about.lead }}</p>

          <div class="about-section__text">
            <h3 class="about-section__title">{{ page.about.title }}</h3>
            <p v-for="paragraph in page.about.paragraphs" :key="paragraph">
              {{ paragraph }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <CollectionContactSection
      :eyebrow="page.cta.eyebrow"
      :title="page.cta.title"
      :text="page.cta.text"
      :image="page.cta.image"
      :image-alt="page.cta.imageAlt"
    />
  </div>
</template>

<style scoped>
.scenario-card__photo {
  background-image: linear-gradient(135deg, rgba(177, 95, 54, 0.18), rgba(33, 22, 17, 0.08));
}
</style>
