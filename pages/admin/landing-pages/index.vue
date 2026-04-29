<script setup lang="ts">
import type { ShowCollectionPage, ShowCollectionSlug } from '~/data/show-collections'

definePageMeta({
  layout: 'admin'
})

type LandingPagesPayload = Record<ShowCollectionSlug, ShowCollectionPage>
type LandingPageListItem = {
  slug: ShowCollectionSlug
  title: string
  path: string
  heroTitle: string
  heroImage: string
}

const pageMeta: Record<ShowCollectionSlug, { title: string; path: string }> = {
  svadebnoe: {
    title: '\u0421\u0432\u0430\u0434\u044c\u0431\u044b',
    path: '/shows/svadebnoe'
  },
  'den-rozdenia': {
    title: '\u0414\u043d\u0438 \u0440\u043e\u0436\u0434\u0435\u043d\u0438\u044f',
    path: '/shows/den-rozdenia'
  },
  corporative: {
    title: '\u041a\u043e\u0440\u043f\u043e\u0440\u0430\u0442\u0438\u0432\u044b',
    path: '/shows/corporative'
  }
}

const { data } = await useFetch<LandingPagesPayload>('/api/admin/landing-pages', {
  key: 'admin-landing-pages-list'
})

const landingItems = computed<LandingPageListItem[]>(() =>
  Object.entries(data.value || {}).map(([slug, item]) => ({
    slug: slug as ShowCollectionSlug,
    title: pageMeta[slug as ShowCollectionSlug]?.title || slug,
    path: pageMeta[slug as ShowCollectionSlug]?.path || '#',
    heroTitle: item.hero.title,
    heroImage: item.hero.image
  }))
)
</script>

<template>
  <section class="admin-grid">
    <div class="admin-card">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">&#1055;&#1086;&#1089;&#1072;&#1076;&#1086;&#1095;&#1085;&#1099;&#1077; &#1089;&#1090;&#1088;&#1072;&#1085;&#1080;&#1094;&#1099;</h3>
          <p class="admin-card__descr">
            &#1055;&#1086;&#1083;&#1085;&#1099;&#1081; &#1088;&#1077;&#1076;&#1072;&#1082;&#1090;&#1086;&#1088; &#1076;&#1083;&#1103; hero, &#1089;&#1094;&#1077;&#1085;&#1072;&#1088;&#1080;&#1103;, &#1087;&#1086;&#1076;&#1073;&#1086;&#1088;&#1082;&#1080; &#1096;&#1086;&#1091;, &#1082;&#1072;&#1090;&#1077;&#1075;&#1086;&#1088;&#1080;&#1081; &#1084;&#1072;&#1089;&#1090;&#1077;&#1088;-&#1082;&#1083;&#1072;&#1089;&#1089;&#1086;&#1074;,
            &#1090;&#1077;&#1082;&#1089;&#1090;&#1086;&#1074;&#1086;&#1075;&#1086; &#1073;&#1083;&#1086;&#1082;&#1072; &#1080; CTA.
          </p>
        </div>
      </div>
    </div>

    <div class="admin-rows">
      <article v-for="item in landingItems" :key="item.slug" class="admin-row">
        <img
          class="admin-row__thumb"
          :src="item.heroImage || 'https://placehold.co/800x520?text=Landing'"
          :alt="item.heroTitle || 'Landing'"
        >

        <div class="admin-row__meta">
          <h3>{{ item.title }}</h3>
          <p>{{ item.heroTitle }}</p>
        </div>

        <div class="admin-row__slug">
          <span>URL</span>
          <strong>{{ item.path }}</strong>
        </div>

        <div class="admin-row__actions">
          <NuxtLink :to="`/admin/landing-pages/${item.slug}`" class="admin-button">&#1056;&#1077;&#1076;&#1072;&#1082;&#1090;&#1080;&#1088;&#1086;&#1074;&#1072;&#1090;&#1100;</NuxtLink>
          <NuxtLink :to="item.path" class="admin-button admin-button--sand">&#1054;&#1090;&#1082;&#1088;&#1099;&#1090;&#1100;</NuxtLink>
        </div>
      </article>
    </div>
  </section>
</template>
