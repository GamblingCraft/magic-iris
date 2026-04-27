<script setup lang="ts">
import type { MasterClassCategory, ShowProgram, WorkshopItem } from '~/data/catalog'

import { fromShowDraft, toShowDraft, type ShowDraft } from '~/utils/admin-editor'

definePageMeta({
  layout: 'admin'
})

type CatalogPayload = {
  shows: ShowProgram[]
  masterClassCategories: MasterClassCategory[]
  workshops: WorkshopItem[]
}

const route = useRoute()
const router = useRouter()
const showId = computed(() => String(route.params.id || ''))

const { data, refresh } = await useFetch<CatalogPayload>('/api/admin/catalog', {
  key: `admin-show-${showId.value}`
})

const catalog = ref<CatalogPayload | null>(null)
const showDrafts = ref<ShowDraft[]>([])
const isSaving = ref(false)

watch(
  data,
  (value) => {
    if (!value) {
      return
    }

    catalog.value = structuredClone(value)
    showDrafts.value = value.shows.map((item) => toShowDraft(item))
  },
  { immediate: true }
)

const selectedShow = computed(() =>
  showDrafts.value.find((item) => item.id === showId.value) || null
)

const saveShow = async () => {
  if (!catalog.value) {
    return
  }

  isSaving.value = true

  try {
    await $fetch('/api/admin/catalog', {
      method: 'PUT',
      body: {
        ...catalog.value,
        shows: showDrafts.value.map((item) => fromShowDraft(item))
      }
    })

    await refresh()
  }
  finally {
    isSaving.value = false
  }
}

const removeShow = async () => {
  if (!catalog.value || !selectedShow.value) {
    return
  }

  await $fetch('/api/admin/catalog', {
    method: 'PUT',
    body: {
      ...catalog.value,
      shows: showDrafts.value
        .filter((item) => item.id !== selectedShow.value?.id)
        .map((item) => fromShowDraft(item))
    }
  })

  await router.push('/admin/shows')
}
</script>

<template>
  <section v-if="selectedShow" class="admin-grid">
    <div class="admin-card admin-card--editor">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">Редактор шоу</h3>
          <p class="admin-card__descr">Основные поля карточки, hero-блок, факты, цены и внутренняя галерея.</p>
        </div>
      </div>

      <div class="admin-actions">
        <NuxtLink to="/admin/shows" class="admin-button">К списку</NuxtLink>
        <button type="button" class="admin-button admin-button--danger" @click="removeShow">
          Удалить
        </button>
        <button
          type="button"
          class="admin-button admin-button--accent"
          :disabled="isSaving"
          @click="saveShow"
        >
          {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
        </button>
      </div>

      <div class="admin-editor__grid">
        <label class="admin-field">
          <span class="admin-label">ID</span>
          <input v-model="selectedShow.id" class="admin-input" type="text">
        </label>

        <label class="admin-field">
          <span class="admin-label">Slug</span>
          <input v-model="selectedShow.slug" class="admin-input" type="text">
        </label>
      </div>

      <div class="admin-editor__grid">
        <label class="admin-field">
          <span class="admin-label">Название</span>
          <input v-model="selectedShow.title" class="admin-input" type="text">
        </label>

        <label class="admin-field">
          <span class="admin-label">Kicker</span>
          <input v-model="selectedShow.kicker" class="admin-input" type="text">
        </label>
      </div>

      <label class="admin-field">
        <span class="admin-label">Lead</span>
        <textarea v-model="selectedShow.lead" class="admin-textarea" />
      </label>

      <label class="admin-field">
        <span class="admin-label">Описание</span>
        <textarea v-model="selectedShow.description" class="admin-textarea" />
      </label>

      <div class="admin-editor__grid">
        <AdminImageUploadField
          v-model="selectedShow.image"
          label="Основное изображение"
          folder="show"
          preview-alt="Превью шоу"
        />

        <AdminImageUploadField
          v-model="selectedShow.heroImage"
          label="Hero изображение"
          folder="show"
          preview-alt="Hero шоу"
        />
      </div>

      <div class="admin-editor__grid">
        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">Факты</span>
          <textarea v-model="selectedShow.factsText" class="admin-textarea" />
          <span class="admin-inline-note">Одна строка: `Лейбл|Значение`</span>
        </label>

        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">Цены</span>
          <textarea v-model="selectedShow.pricingText" class="admin-textarea" />
          <span class="admin-inline-note">Одна строка: `Лейбл|Цена|Примечание`</span>
        </label>
      </div>

      <div class="admin-editor__grid">
        <AdminGalleryEditorField
          v-model="selectedShow.gallery"
          label="Галерея"
          folder="show"
          note="Загрузите фото для внутренней галереи карточки шоу, настройте порядок и подписи."
        />

        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">Списки</span>
          <textarea v-model="selectedShow.featuresText" class="admin-textarea" />
          <span class="admin-inline-note">Features: по одной строке</span>
          <textarea v-model="selectedShow.suitableForText" class="admin-textarea" />
          <span class="admin-inline-note">Suitable for: по одной строке</span>
        </label>
      </div>
    </div>
  </section>

  <div v-else class="admin-empty">
    <p>Шоу не найдено.</p>
  </div>
</template>
