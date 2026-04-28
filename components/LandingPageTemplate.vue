<script setup lang="ts">
import type { LandingContent } from '~/data/landing-pages'

defineProps<{
  content: LandingContent
}>()
</script>

<template>
  <div class="catalog-shell landing-page">
    <section class="section catalog-shell__section catalog-shell__section--hero">
      <div class="container">
        <CatalogBreadcrumbs
          :items="[
            { label: 'Главная', href: '/' },
            { label: content.breadcrumbLabel }
          ]"
        />

        <CatalogHeroPanel
          :eyebrow="content.hero.eyebrow"
          :title="content.hero.title"
          :lead="content.hero.lead"
          :description="content.hero.description"
          :image="content.hero.image"
          :facts="content.hero.facts"
          :tags="content.hero.tags"
          :actions="[
            { label: content.cta.primary.label, href: content.cta.primary.href },
            { label: content.cta.secondary.label, href: content.cta.secondary.href, kind: 'ghost' }
          ]"
        />
      </div>
    </section>

    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <div class="catalog-section-head">
          <div>
            <p class="eyebrow">Подход</p>
            <h2>Что получает заказчик, когда мы собираем проект целиком</h2>
          </div>
        </div>

        <div class="catalog-pricing-grid landing-feature-grid">
          <article v-for="feature in content.features" :key="feature.label" class="catalog-price-card">
            <p>{{ feature.label }}</p>
            <h3>{{ feature.title }}</h3>
            <span>{{ feature.text }}</span>
          </article>
        </div>
      </div>
    </section>

    <section class="section catalog-shell__section">
      <div class="container">
        <CatalogCardsSection
          :eyebrow="content.cards.eyebrow"
          :title="content.cards.title"
          :description="content.cards.description"
          :items="content.cards.items"
        />
      </div>
    </section>

    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <div class="catalog-detail-grid">
          <article
            v-for="checklist in content.checklists"
            :key="checklist.title"
            class="catalog-panel"
          >
            <p class="eyebrow">{{ checklist.eyebrow }}</p>
            <h3>{{ checklist.title }}</h3>

            <ul class="catalog-list">
              <li v-for="item in checklist.items" :key="item">{{ item }}</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <article class="catalog-panel landing-cta-panel">
          <div class="landing-cta-panel__copy">
            <p class="eyebrow">{{ content.cta.eyebrow }}</p>
            <h2>{{ content.cta.title }}</h2>
            <p>{{ content.cta.text }}</p>
          </div>

          <div class="landing-cta-panel__actions">
            <NuxtLink :to="content.cta.primary.href" class="button button--accent">
              {{ content.cta.primary.label }}
            </NuxtLink>

            <NuxtLink :to="content.cta.secondary.href" class="button button--ghost">
              {{ content.cta.secondary.label }}
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
