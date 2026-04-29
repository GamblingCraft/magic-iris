<script setup lang="ts">
import type { ServiceLandingPage, ServicePageSlug } from '~/data/service-pages'

definePageMeta({
  layout: 'admin'
})

type ServicePagesPayload = Record<ServicePageSlug, ServiceLandingPage>
type ServicePageListItem = {
  slug: ServicePageSlug
  title: string
  path: string
  heroTitle: string
  heroImage: string
}

const pageMeta: Record<ServicePageSlug, { title: string; path: string }> = {
  'pod-klyuch': {
    title: 'Под ключ',
    path: '/pod-klyuch'
  },
  corporate: {
    title: 'Корпоративным клиентам',
    path: '/corporate'
  }
}

const { data } = await useFetch<ServicePagesPayload>('/api/admin/service-pages', {
  key: 'admin-service-pages-list'
})

const serviceItems = computed<ServicePageListItem[]>(() =>
  Object.entries(data.value || {}).map(([slug, item]) => ({
    slug: slug as ServicePageSlug,
    title: pageMeta[slug as ServicePageSlug]?.title || slug,
    path: pageMeta[slug as ServicePageSlug]?.path || '#',
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
          <h3 class="admin-card__title">Страницы услуг</h3>
          <p class="admin-card__descr">
            Полный редактор для hero, сценария, карточек, текстовых блоков и CTA на страницах
            `/pod-klyuch` и `/corporate`.
          </p>
        </div>
      </div>
    </div>

    <div class="admin-rows">
      <article v-for="item in serviceItems" :key="item.slug" class="admin-row">
        <img
          class="admin-row__thumb"
          :src="item.heroImage || 'https://placehold.co/800x520?text=Service+Page'"
          :alt="item.heroTitle || 'Service page'"
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
          <NuxtLink :to="`/admin/service-pages/${item.slug}`" class="admin-button">Редактировать</NuxtLink>
          <NuxtLink :to="item.path" class="admin-button admin-button--sand">Открыть</NuxtLink>
        </div>
      </article>
    </div>
  </section>
</template>
