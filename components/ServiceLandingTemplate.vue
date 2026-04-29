<script setup lang="ts">
import type { ServiceLandingPage } from '~/data/service-pages'

defineProps<{
  page: ServiceLandingPage
  breadcrumbs: Array<{ label: string; href?: string }>
}>()
</script>

<template>
  <div class="landing-page collection-landing service-landing">
    <section class="hero intro hero--reference">
      <div class="hero__scene">
        <img :src="page.hero.image" :alt="page.hero.title">
      </div>

      <div class="hero__overlay" />

      <div class="container hero__inner">
        <div class="hero__copy">
          <CatalogBreadcrumbs :items="breadcrumbs" />

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
            v-for="(item, index) in page.scenario.items"
            :key="`${index}-${item.title}`"
            class="scenario-card"
          >
            <div class="scenario-card__photo" :style="{ backgroundImage: `url(${item.image || page.hero.image})` }" />
            <span class="scenario-card__number">{{ index + 1 }}</span>
            <div class="scenario-card__body">
              <h3><span>{{ item.title }}</span></h3>
              <p>{{ item.text }}</p>
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

        <div class="service-card-grid">
          <NuxtLink
            v-for="card in page.cards.items"
            :key="card.id"
            :to="card.href"
            class="service-card"
          >
            <div class="service-card__media" :style="{ backgroundImage: `url(${card.image})` }" />
            <div class="service-card__overlay" />

            <div class="service-card__body">
              <p class="service-card__kicker">{{ card.kicker }}</p>
              <h3>{{ card.title }}</h3>
              <p class="service-card__text">{{ card.description }}</p>
            </div>

            <div class="service-card__meta">
              <span>{{ card.metaPrimary }}</span>
              <small>{{ card.metaLabel }}</small>
            </div>
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

            <div class="service-about-grid">
              <article
                v-for="(block, index) in page.about.blocks"
                :key="`${index}-${block.title}`"
                class="service-about-card"
              >
                <h4>{{ block.title }}</h4>

                <ul>
                  <li v-for="item in block.items" :key="item">
                    {{ item }}
                  </li>
                </ul>
              </article>
            </div>
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
