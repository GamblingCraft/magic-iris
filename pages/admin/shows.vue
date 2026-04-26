<script setup lang="ts">
import type { MasterClassCategory, ShowProgram, WorkshopItem } from '~/data/catalog'

import { createEmptyShowDraft, fromShowDraft } from '~/utils/admin-editor'

definePageMeta({
  layout: 'admin'
})

type CatalogPayload = {
  shows: ShowProgram[]
  masterClassCategories: MasterClassCategory[]
  workshops: WorkshopItem[]
}

const router = useRouter()

const { data, refresh } = await useFetch<CatalogPayload>('/api/admin/catalog', {
  key: 'admin-catalog-shows-list'
})

const catalog = computed(() => data.value)
const isCreating = ref(false)
const deletingId = ref('')

const createShow = async () => {
  if (!catalog.value) {
    return
  }

  isCreating.value = true

  try {
    const nextDraft = createEmptyShowDraft()
    nextDraft.title = 'Новое шоу'
    nextDraft.slug = `new-show-${Date.now().toString(36)}`
    const nextShow = fromShowDraft(nextDraft)

    await $fetch('/api/admin/catalog', {
      method: 'PUT',
      body: {
        ...catalog.value,
        shows: [nextShow, ...catalog.value.shows]
      }
    })

    await refresh()
    await router.push(`/admin/shows/${nextShow.id}`)
  }
  finally {
    isCreating.value = false
  }
}

const removeShow = async (id: string) => {
  if (!catalog.value) {
    return
  }

  deletingId.value = id

  try {
    await $fetch('/api/admin/catalog', {
      method: 'PUT',
      body: {
        ...catalog.value,
        shows: catalog.value.shows.filter((item) => item.id !== id)
      }
    })

    await refresh()
  }
  finally {
    deletingId.value = ''
  }
}
</script>

<template>
  <section class="admin-grid">
    <div class="admin-card">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">Шоу-программы</h3>
          <p class="admin-card__descr">Список всех шоу: мини фото, название, slug и быстрые действия.</p>
        </div>
      </div>

      <div class="admin-actions">
        <button type="button" class="admin-button admin-button--sand" :disabled="isCreating" @click="createShow">
          {{ isCreating ? 'Создание...' : 'Добавить шоу' }}
        </button>
      </div>
    </div>

    <div class="admin-rows">
      <article v-for="item in catalog?.shows || []" :key="item.id" class="admin-row">
        <img class="admin-row__thumb" :src="item.image || 'https://placehold.co/800x520?text=Show'" :alt="item.title || 'Show'">

        <div class="admin-row__meta">
          <h3>{{ item.title || 'Без названия' }}</h3>
          <p>{{ item.kicker || 'Без подзаголовка' }}</p>
        </div>

        <div class="admin-row__slug">
          <span>Slug</span>
          <strong>{{ item.slug || 'без slug' }}</strong>
        </div>

        <div class="admin-row__actions">
          <NuxtLink :to="`/admin/shows/${item.id}`" class="admin-button">Редактировать</NuxtLink>
          <button
            type="button"
            class="admin-button admin-button--danger"
            :disabled="deletingId === item.id"
            @click="removeShow(item.id)"
          >
            {{ deletingId === item.id ? 'Удаление...' : 'Удалить' }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
