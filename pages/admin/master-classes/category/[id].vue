<script setup lang="ts">
import type { MasterClassCategory, ShowProgram, WorkshopItem } from '~/data/catalog'

import {
  createEmptyWorkshopDraft,
  fromWorkshopDraft,
  toWorkshopDraft,
  type WorkshopDraft
} from '~/utils/admin-editor'

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
const categoryId = computed(() => String(route.params.id || ''))

const { data, refresh } = await useFetch<CatalogPayload>('/api/admin/catalog', {
  key: `admin-master-class-category-${categoryId.value}`
})

const catalog = ref<CatalogPayload | null>(null)
const categoryDrafts = ref<MasterClassCategory[]>([])
const workshopDrafts = ref<WorkshopDraft[]>([])
const isSaving = ref(false)
const isCreatingWorkshop = ref(false)
const deletingWorkshopId = ref('')

watch(
  data,
  (value) => {
    if (!value) {
      return
    }

    catalog.value = structuredClone(value)
    categoryDrafts.value = structuredClone(value.masterClassCategories)
    workshopDrafts.value = value.workshops.map((item) => toWorkshopDraft(item))
  },
  { immediate: true }
)

const selectedCategory = computed(() =>
  categoryDrafts.value.find((item) => item.id === categoryId.value) || null
)

const categoryWorkshops = computed(() => {
  if (!selectedCategory.value) {
    return []
  }

  return workshopDrafts.value.filter((item) =>
    item.categorySlugs.includes(selectedCategory.value?.slug || '')
  )
})

const workshopsCount = computed(() => categoryWorkshops.value.length)

const saveCategory = async () => {
  if (!catalog.value || !selectedCategory.value) {
    return
  }

  isSaving.value = true

  try {
    const originalCategory = (data.value?.masterClassCategories || []).find(
      (item) => item.id === selectedCategory.value?.id
    )
    const originalSlug = originalCategory?.slug || ''
    const nextSlug = selectedCategory.value.slug

    const nextWorkshops = workshopDrafts.value.map((item) => {
      if (!originalSlug || originalSlug === nextSlug) {
        return fromWorkshopDraft(item)
      }

      const nextCategorySlugs = item.categorySlugs.map((slug) =>
        slug === originalSlug ? nextSlug : slug
      )

      return fromWorkshopDraft({
        ...item,
        primaryCategorySlug:
          item.primaryCategorySlug === originalSlug ? nextSlug : item.primaryCategorySlug,
        categorySlugs: nextCategorySlugs
      })
    })

    await $fetch('/api/admin/catalog', {
      method: 'PUT',
      body: {
        ...catalog.value,
        masterClassCategories: categoryDrafts.value,
        workshops: nextWorkshops
      }
    })

    await refresh()
  }
  finally {
    isSaving.value = false
  }
}

const createWorkshop = async () => {
  if (!catalog.value || !selectedCategory.value) {
    return
  }

  isCreatingWorkshop.value = true

  try {
    const nextDraft = createEmptyWorkshopDraft(categoryDrafts.value)
    nextDraft.title = 'Новый мастер-класс'
    nextDraft.slug = `new-master-class-${Date.now().toString(36)}`
    nextDraft.primaryCategorySlug = selectedCategory.value.slug
    nextDraft.categorySlugs = [selectedCategory.value.slug]
    nextDraft.audienceLabel = selectedCategory.value.title

    const nextWorkshop = fromWorkshopDraft(nextDraft)

    await $fetch('/api/admin/catalog', {
      method: 'PUT',
      body: {
        ...catalog.value,
        workshops: [nextWorkshop, ...catalog.value.workshops]
      }
    })

    await refresh()
    await router.push(`/admin/master-classes/${nextWorkshop.id}`)
  }
  finally {
    isCreatingWorkshop.value = false
  }
}

const removeWorkshop = async (id: string) => {
  if (!catalog.value) {
    return
  }

  deletingWorkshopId.value = id

  try {
    await $fetch('/api/admin/catalog', {
      method: 'PUT',
      body: {
        ...catalog.value,
        workshops: catalog.value.workshops.filter((item) => item.id !== id)
      }
    })

    await refresh()
  }
  finally {
    deletingWorkshopId.value = ''
  }
}
</script>

<template>
  <section v-if="selectedCategory" class="admin-grid">
    <div class="admin-card admin-card--editor">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">Категория мастер-классов</h3>
          <p class="admin-card__descr">Редактируйте тексты и изображение подборки, а ниже управляйте карточками, которые в неё входят.</p>
        </div>
      </div>

      <div class="admin-actions">
        <NuxtLink to="/admin/master-classes" class="admin-button">К категориям</NuxtLink>
        <button
          type="button"
          class="admin-button admin-button--accent"
          :disabled="isSaving"
          @click="saveCategory"
        >
          {{ isSaving ? 'Сохранение...' : 'Сохранить категорию' }}
        </button>
      </div>

      <div class="admin-editor__grid">
        <label class="admin-field">
          <span class="admin-label">ID</span>
          <input v-model="selectedCategory.id" class="admin-input" type="text">
        </label>

        <label class="admin-field">
          <span class="admin-label">Slug</span>
          <input v-model="selectedCategory.slug" class="admin-input" type="text">
        </label>
      </div>

      <label class="admin-field">
        <span class="admin-label">Название</span>
        <input v-model="selectedCategory.title" class="admin-input" type="text">
      </label>

      <label class="admin-field">
        <span class="admin-label">Lead</span>
        <textarea v-model="selectedCategory.lead" class="admin-textarea" />
      </label>

      <label class="admin-field">
        <span class="admin-label">Описание</span>
        <textarea v-model="selectedCategory.description" class="admin-textarea" />
      </label>

      <AdminImageUploadField
        v-model="selectedCategory.image"
        label="Изображение категории"
        folder="master-classes"
        preview-alt="Категория мастер-классов"
      />

      <div class="admin-note-card">
        <strong>Мастер-классов в подборке: {{ workshopsCount }}</strong>
      </div>
    </div>

    <div class="admin-card">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">Карточки внутри категории</h3>
        </div>
      </div>

      <div class="admin-actions">
        <button
          type="button"
          class="admin-button admin-button--sand"
          :disabled="isCreatingWorkshop"
          @click="createWorkshop"
        >
          {{ isCreatingWorkshop ? 'Создание...' : 'Добавить мастер-класс' }}
        </button>
      </div>

      <div class="admin-rows">
        <article v-for="item in categoryWorkshops" :key="item.id" class="admin-row">
          <img class="admin-row__thumb" :src="item.image || 'https://placehold.co/800x520?text=Workshop'" :alt="item.title || 'Workshop'">

          <div class="admin-row__meta">
            <h3>{{ item.title || 'Без названия' }}</h3>
            <p>{{ item.audienceLabel || selectedCategory.title }}</p>
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
              :disabled="deletingWorkshopId === item.id"
              @click="removeWorkshop(item.id)"
            >
              {{ deletingWorkshopId === item.id ? 'Удаление...' : 'Удалить' }}
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>

  <div v-else class="admin-empty">
    <p>Категория не найдена.</p>
  </div>
</template>
