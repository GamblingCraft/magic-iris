<script setup lang="ts">
import type { MasterClassCategory, ShowProgram, WorkshopItem } from '~/data/catalog'

import { createEmptyMasterClassCategory } from '~/utils/admin-editor'

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
  key: 'admin-master-class-categories-list'
})

const search = ref('')
const isCreating = ref(false)
const deletingId = ref('')

const categories = computed(() => data.value?.masterClassCategories || [])

const categoryRows = computed(() => {
  const query = search.value.trim().toLowerCase()

  return categories.value
    .map((category) => {
      const workshops = (data.value?.workshops || []).filter((item) =>
        item.categorySlugs.includes(category.slug)
      )

      return {
        ...category,
        workshopsCount: workshops.length
      }
    })
    .filter((category) => {
      if (!query) {
        return true
      }

      return `${category.title} ${category.slug}`.toLowerCase().includes(query)
    })
})

const createCategory = async () => {
  if (!data.value) {
    return
  }

  isCreating.value = true

  try {
    const draft = createEmptyMasterClassCategory()
    draft.title = 'Новая категория'
    draft.slug = `new-category-${Date.now().toString(36)}`

    await $fetch('/api/admin/catalog', {
      method: 'PUT',
      body: {
        ...data.value,
        masterClassCategories: [draft, ...data.value.masterClassCategories]
      }
    })

    await refresh()
    await router.push(`/admin/master-classes/category/${draft.id}`)
  }
  finally {
    isCreating.value = false
  }
}

const removeCategory = async (id: string) => {
  if (!data.value) {
    return
  }

  const category = data.value.masterClassCategories.find((item) => item.id === id)

  if (!category) {
    return
  }

  deletingId.value = id

  try {
    const nextCategories = data.value.masterClassCategories.filter((item) => item.id !== id)
    const nextWorkshops = data.value.workshops.map((workshop) => {
      const nextCategorySlugs = workshop.categorySlugs.filter((slug) => slug !== category.slug)
      const nextPrimaryCategorySlug =
        workshop.primaryCategorySlug === category.slug
          ? nextCategorySlugs[0] || ''
          : workshop.primaryCategorySlug

      return {
        ...workshop,
        categorySlugs: nextCategorySlugs,
        primaryCategorySlug: nextPrimaryCategorySlug
      }
    })

    await $fetch('/api/admin/catalog', {
      method: 'PUT',
      body: {
        ...data.value,
        masterClassCategories: nextCategories,
        workshops: nextWorkshops
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
          <h3 class="admin-card__title">Категории мастер-классов</h3>
          <p class="admin-card__descr">Сначала выбирайте подборку, а уже внутри неё открывайте и редактируйте карточки мастер-классов.</p>
        </div>
      </div>

      <div class="admin-toolbar">
        <input v-model="search" class="admin-input admin-search" type="search" placeholder="Поиск по названию или slug">
      </div>

      <div class="admin-actions">
        <button type="button" class="admin-button admin-button--sand" :disabled="isCreating" @click="createCategory">
          {{ isCreating ? 'Создание...' : 'Добавить категорию' }}
        </button>
      </div>
    </div>

    <div class="admin-rows">
      <article v-for="item in categoryRows" :key="item.id" class="admin-row">
        <img class="admin-row__thumb" :src="item.image || 'https://placehold.co/800x520?text=Category'" :alt="item.title || 'Category'">

        <div class="admin-row__meta">
          <h3>{{ item.title || 'Без названия' }}</h3>
          <p>{{ item.workshopsCount }} мастер-классов в подборке</p>
        </div>

        <div class="admin-row__slug">
          <span>Slug</span>
          <strong>{{ item.slug || 'без slug' }}</strong>
        </div>

        <div class="admin-row__actions">
          <NuxtLink :to="`/admin/master-classes/category/${item.id}`" class="admin-button">Открыть</NuxtLink>
          <button
            type="button"
            class="admin-button admin-button--danger"
            :disabled="deletingId === item.id"
            @click="removeCategory(item.id)"
          >
            {{ deletingId === item.id ? 'Удаление...' : 'Удалить' }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
