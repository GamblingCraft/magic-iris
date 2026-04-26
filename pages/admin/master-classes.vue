<script setup lang="ts">
import type { MasterClassCategory, ShowProgram, WorkshopItem } from '~/data/catalog'

import { createEmptyWorkshopDraft, fromWorkshopDraft } from '~/utils/admin-editor'

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
  key: 'admin-catalog-workshops-list'
})

const search = ref('')
const categoryFilter = ref('all')
const isCreating = ref(false)
const deletingId = ref('')

const categories = computed(() => data.value?.masterClassCategories || [])
const workshops = computed(() => data.value?.workshops || [])

const filteredWorkshops = computed(() => {
  const query = search.value.trim().toLowerCase()

  return workshops.value.filter((item) => {
    const matchesCategory =
      categoryFilter.value === 'all' || item.categorySlugs.includes(categoryFilter.value)

    const haystack = `${item.title} ${item.slug}`.toLowerCase()
    const matchesSearch = !query || haystack.includes(query)

    return matchesCategory && matchesSearch
  })
})

const createWorkshop = async () => {
  if (!data.value) {
    return
  }

  isCreating.value = true

  try {
    const nextDraft = createEmptyWorkshopDraft(categories.value)
    nextDraft.title = 'Новый мастер-класс'
    nextDraft.slug = `new-master-class-${Date.now().toString(36)}`
    const nextWorkshop = fromWorkshopDraft(nextDraft)

    await $fetch('/api/admin/catalog', {
      method: 'PUT',
      body: {
        ...data.value,
        workshops: [nextWorkshop, ...data.value.workshops]
      }
    })

    await refresh()
    await router.push(`/admin/master-classes/${nextWorkshop.id}`)
  }
  finally {
    isCreating.value = false
  }
}

const removeWorkshop = async (id: string) => {
  if (!data.value) {
    return
  }

  deletingId.value = id

  try {
    await $fetch('/api/admin/catalog', {
      method: 'PUT',
      body: {
        ...data.value,
        workshops: data.value.workshops.filter((item) => item.id !== id)
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
          <h3 class="admin-card__title">Каталог мастер-классов</h3>
          <p class="admin-card__descr">Список всех мастер-классов: мини фото, название, slug и быстрые действия.</p>
        </div>
      </div>

      <div class="admin-toolbar">
        <input v-model="search" class="admin-input admin-search" type="search" placeholder="Поиск по названию или slug">

        <select v-model="categoryFilter" class="admin-select admin-search">
          <option value="all">Все категории</option>
          <option v-for="category in categories" :key="category.slug" :value="category.slug">
            {{ category.title }}
          </option>
        </select>
      </div>

      <div class="admin-actions">
        <button type="button" class="admin-button admin-button--sand" :disabled="isCreating" @click="createWorkshop">
          {{ isCreating ? 'Создание...' : 'Добавить мастер-класс' }}
        </button>
      </div>
    </div>

    <div class="admin-rows">
      <article v-for="item in filteredWorkshops" :key="item.id" class="admin-row">
        <img class="admin-row__thumb" :src="item.image || 'https://placehold.co/800x520?text=Workshop'" :alt="item.title || 'Workshop'">

        <div class="admin-row__meta">
          <h3>{{ item.title || 'Без названия' }}</h3>
          <p>{{ item.audienceLabel || 'Без метки' }}</p>
        </div>

        <div class="admin-row__slug">
          <span>Slug</span>
          <strong>{{ item.slug || 'без slug' }}</strong>
        </div>

        <div class="admin-row__actions">
          <NuxtLink :to="`/admin/master-classes/${item.id}`" class="admin-button">Редактировать</NuxtLink>
          <button
            type="button"
            class="admin-button admin-button--danger"
            :disabled="deletingId === item.id"
            @click="removeWorkshop(item.id)"
          >
            {{ deletingId === item.id ? 'Удаление...' : 'Удалить' }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
