<script setup lang="ts">
import type { SiteSeoSettings } from '~/data/site-seo'
import type { ShowCollectionPage, ShowCollectionSlug } from '~/data/show-collections'

type LandingPagesPayload = Record<ShowCollectionSlug, ShowCollectionPage>

definePageMeta({
  layout: 'admin'
})

const { data, refresh } = await useFetch<SiteSeoSettings>('/api/admin/seo-settings', {
  key: 'admin-seo-settings'
})
const { data: landingPagesData, refresh: refreshLandingPages } = await useFetch<LandingPagesPayload>(
  '/api/admin/landing-pages',
  {
    key: 'admin-seo-landing-pages'
  }
)

const seoSettings = ref<SiteSeoSettings | null>(null)
const landingPagesSeoDraft = ref<LandingPagesPayload | null>(null)
const isSaving = ref(false)
const landingPageSeoOrder: ShowCollectionSlug[] = ['svadebnoe', 'den-rozdenia', 'corporative']
const landingPageMeta: Record<ShowCollectionSlug, { title: string; path: string }> = {
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

watch(
  data,
  (value) => {
    if (!value) {
      return
    }

    seoSettings.value = structuredClone(value)
  },
  { immediate: true }
)
watch(
  landingPagesData,
  (value) => {
    if (!value) {
      return
    }

    landingPagesSeoDraft.value = structuredClone(value)
  },
  { immediate: true }
)

const saveSeo = async () => {
  if (!seoSettings.value || !landingPagesSeoDraft.value) {
    return
  }

  isSaving.value = true

  try {
    await Promise.all([
      $fetch('/api/admin/seo-settings', {
        method: 'PUT',
        body: seoSettings.value
      }),
      $fetch('/api/admin/landing-pages', {
        method: 'PUT',
        body: landingPagesSeoDraft.value
      })
    ])

    await Promise.all([refresh(), refreshLandingPages()])
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <section v-if="seoSettings && landingPagesSeoDraft" class="admin-grid">
    <div class="admin-card">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">SEO-шаблоны страниц</h3>
          <p class="admin-card__descr">
            Здесь задаются title и description для главной, каталогов, категорий и детальных карточек.
          </p>
        </div>
      </div>

      <div class="admin-actions">
        <button type="button" class="admin-button admin-button--accent" :disabled="isSaving" @click="saveSeo">
          {{ isSaving ? 'Сохранение...' : 'Сохранить SEO' }}
        </button>
      </div>

      <div class="admin-editor__grid">
        <label class="admin-field">
          <span class="admin-label">URL сайта</span>
          <input v-model="seoSettings.siteUrl" class="admin-input" type="text">
        </label>

        <label class="admin-field">
          <span class="admin-label">Город</span>
          <input v-model="seoSettings.city" class="admin-input" type="text">
        </label>
      </div>

      <label class="admin-field">
        <span class="admin-label">Описание по умолчанию</span>
        <textarea v-model="seoSettings.defaultDescription" class="admin-textarea" />
      </label>

      <div class="admin-editor__grid">
        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">Главная</span>
          <label class="admin-field">
            <span class="admin-label">Title</span>
            <input v-model="seoSettings.home.title" class="admin-input" type="text">
          </label>
          <label class="admin-field">
            <span class="admin-label">Description</span>
            <textarea v-model="seoSettings.home.description" class="admin-textarea" />
          </label>
        </label>

        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">Страница шоу</span>
          <label class="admin-field">
            <span class="admin-label">Title</span>
            <input v-model="seoSettings.showsIndex.title" class="admin-input" type="text">
          </label>
          <label class="admin-field">
            <span class="admin-label">Description</span>
            <textarea v-model="seoSettings.showsIndex.description" class="admin-textarea" />
          </label>
        </label>
      </div>

      <div class="admin-editor__grid">
        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">Шаблон карточки шоу</span>
          <label class="admin-field">
            <span class="admin-label">Title template</span>
            <input v-model="seoSettings.show.titleTemplate" class="admin-input" type="text">
          </label>
          <label class="admin-field">
            <span class="admin-label">Description template</span>
            <textarea v-model="seoSettings.show.descriptionTemplate" class="admin-textarea" />
          </label>
          <span class="admin-inline-note">Доступно: {title}, {kicker}, {lead}, {description}, {priceFrom}, {price}, {city}, {brand}</span>
        </label>

        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">Страница мастер-классов</span>
          <label class="admin-field">
            <span class="admin-label">Title</span>
            <input v-model="seoSettings.masterClassesIndex.title" class="admin-input" type="text">
          </label>
          <label class="admin-field">
            <span class="admin-label">Description</span>
            <textarea v-model="seoSettings.masterClassesIndex.description" class="admin-textarea" />
          </label>
        </label>
      </div>

      <div class="admin-editor__grid">
        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">Шаблон категории мастер-классов</span>
          <label class="admin-field">
            <span class="admin-label">Title template</span>
            <input v-model="seoSettings.masterClassCategory.titleTemplate" class="admin-input" type="text">
          </label>
          <label class="admin-field">
            <span class="admin-label">Description template</span>
            <textarea v-model="seoSettings.masterClassCategory.descriptionTemplate" class="admin-textarea" />
          </label>
          <span class="admin-inline-note">Доступно: {category}, {count}, {description}, {lead}, {city}, {brand}</span>
        </label>

        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">Шаблон карточки мастер-класса</span>
          <label class="admin-field">
            <span class="admin-label">Title template</span>
            <input v-model="seoSettings.workshop.titleTemplate" class="admin-input" type="text">
          </label>
          <label class="admin-field">
            <span class="admin-label">Description template</span>
            <textarea v-model="seoSettings.workshop.descriptionTemplate" class="admin-textarea" />
          </label>
          <span class="admin-inline-note">Доступно: {title}, {category}, {summary}, {description}, {audience}, {priceFrom}, {price}, {city}, {brand}</span>
        </label>
      </div>

      <div class="admin-subsection">
        <h4 class="admin-subsection__title">Landing Pages SEO</h4>
        <p class="admin-inline-note">/shows/svadebnoe, /shows/den-rozdenia, /shows/corporative</p>

        <label
          v-for="slug in landingPageSeoOrder"
          :key="slug"
          class="admin-fieldset"
        >
          <span class="admin-fieldset__legend">{{ landingPageMeta[slug].title }} ({{ landingPageMeta[slug].path }})</span>

          <label class="admin-field">
            <span class="admin-label">Title</span>
            <input v-model="landingPagesSeoDraft[slug].seo.title" class="admin-input" type="text">
          </label>

          <label class="admin-field">
            <span class="admin-label">Description</span>
            <textarea v-model="landingPagesSeoDraft[slug].seo.description" class="admin-textarea" />
          </label>

          <label class="admin-field">
            <span class="admin-label">Keywords</span>
            <textarea v-model="landingPagesSeoDraft[slug].seo.keywords" class="admin-textarea" />
          </label>
        </label>
      </div>
    </div>
  </section>
</template>
