<script setup lang="ts">
import {
  deriveWorkshopAudienceLabel,
  type MasterClassCategory,
  type ShowProgram,
  type WorkshopItem
} from '~/data/catalog'
import {
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
const workshopId = computed(() => String(route.params.id || ''))

const { data, refresh } = await useFetch<CatalogPayload>('/api/admin/catalog', {
  key: `admin-workshop-${workshopId.value}`
})

const catalog = ref<CatalogPayload | null>(null)
const workshopDrafts = ref<WorkshopDraft[]>([])
const isSaving = ref(false)

watch(
  data,
  (value) => {
    if (!value) {
      return
    }

    catalog.value = structuredClone(value)
    workshopDrafts.value = value.workshops.map((item) => toWorkshopDraft(item))
  },
  { immediate: true }
)

const categories = computed(() => catalog.value?.masterClassCategories || [])

const selectedWorkshop = computed(() =>
  workshopDrafts.value.find((item) => item.id === workshopId.value) || null
)

const audiencePreview = computed(() => {
  if (!selectedWorkshop.value) {
    return ''
  }

  return deriveWorkshopAudienceLabel(selectedWorkshop.value.categorySlugs, categories.value)
})

const primaryCategoryAdminHref = computed(() => {
  if (!selectedWorkshop.value) {
    return '/admin/master-classes'
  }

  const category = categories.value.find(
    (item) => item.slug === selectedWorkshop.value?.primaryCategorySlug
  )

  return category ? `/admin/master-classes/category/${category.id}` : '/admin/master-classes'
})

const syncAudience = () => {
  if (!selectedWorkshop.value) {
    return
  }

  selectedWorkshop.value.audienceLabel = deriveWorkshopAudienceLabel(
    selectedWorkshop.value.categorySlugs,
    categories.value
  )
}

const ensurePrimaryCategoryIncluded = () => {
  if (!selectedWorkshop.value || !selectedWorkshop.value.primaryCategorySlug) {
    return
  }

  if (!selectedWorkshop.value.categorySlugs.includes(selectedWorkshop.value.primaryCategorySlug)) {
    selectedWorkshop.value.categorySlugs.push(selectedWorkshop.value.primaryCategorySlug)
  }

  syncAudience()
}

const toggleCategory = (slug: string, checked: boolean) => {
  if (!selectedWorkshop.value) {
    return
  }

  if (checked) {
    if (!selectedWorkshop.value.categorySlugs.includes(slug)) {
      selectedWorkshop.value.categorySlugs.push(slug)
    }

    syncAudience()
    return
  }

  selectedWorkshop.value.categorySlugs = selectedWorkshop.value.categorySlugs.filter((item) => item !== slug)

  if (selectedWorkshop.value.primaryCategorySlug === slug) {
    selectedWorkshop.value.primaryCategorySlug = selectedWorkshop.value.categorySlugs[0] || ''
  }

  syncAudience()
}

const handleCategoryToggle = (slug: string, event: Event) => {
  const target = event.target as HTMLInputElement | null
  toggleCategory(slug, Boolean(target?.checked))
}

const saveWorkshop = async () => {
  if (!catalog.value) {
    return
  }

  isSaving.value = true

  try {
    await $fetch('/api/admin/catalog', {
      method: 'PUT',
      body: {
        ...catalog.value,
        workshops: workshopDrafts.value.map((item) => fromWorkshopDraft(item, categories.value))
      }
    })

    await refresh()
  }
  finally {
    isSaving.value = false
  }
}

const removeWorkshop = async () => {
  if (!catalog.value || !selectedWorkshop.value) {
    return
  }

  await $fetch('/api/admin/catalog', {
    method: 'PUT',
    body: {
      ...catalog.value,
      workshops: workshopDrafts.value
        .filter((item) => item.id !== selectedWorkshop.value?.id)
        .map((item) => fromWorkshopDraft(item, categories.value))
    }
  })

  await router.push(primaryCategoryAdminHref.value)
}
</script>

<template>
  <section v-if="selectedWorkshop" class="admin-grid">
    <div class="admin-card admin-card--editor">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">Редактор мастер-класса</h3>
          <p class="admin-card__descr">Карточка, категории, описание, цены и внутренняя галерея.</p>
        </div>
      </div>

      <div class="admin-actions">
        <NuxtLink :to="primaryCategoryAdminHref" class="admin-button">К категории</NuxtLink>
        <button type="button" class="admin-button admin-button--danger" @click="removeWorkshop">
          Удалить
        </button>
        <button
          type="button"
          class="admin-button admin-button--accent"
          :disabled="isSaving"
          @click="saveWorkshop"
        >
          {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
        </button>
      </div>

      <div class="admin-editor__grid">
        <label class="admin-field">
          <span class="admin-label">ID</span>
          <input v-model="selectedWorkshop.id" class="admin-input" type="text">
        </label>

        <label class="admin-field">
          <span class="admin-label">Slug</span>
          <input v-model="selectedWorkshop.slug" class="admin-input" type="text">
        </label>
      </div>

      <div class="admin-editor__grid">
        <label class="admin-field">
          <span class="admin-label">Название</span>
          <input v-model="selectedWorkshop.title" class="admin-input" type="text">
        </label>

        <label class="admin-field">
          <span class="admin-label">Аудитория</span>
          <input :value="audiencePreview" class="admin-input" type="text" readonly>
        </label>
      </div>

      <div class="admin-editor__grid">
        <label class="admin-field">
          <span class="admin-label">Основная категория</span>
          <select
            v-model="selectedWorkshop.primaryCategorySlug"
            class="admin-select"
            @change="ensurePrimaryCategoryIncluded"
          >
            <option v-for="category in categories" :key="category.slug" :value="category.slug">
              {{ category.title }}
            </option>
          </select>
        </label>

        <label class="admin-field">
          <span class="admin-label">Участники</span>
          <input v-model="selectedWorkshop.participants" class="admin-input" type="text">
        </label>
      </div>

      <fieldset class="admin-fieldset">
        <p class="admin-fieldset__legend">Категории</p>
        <div class="admin-checkbox-grid">
          <label v-for="category in categories" :key="category.slug" class="admin-check">
            <input
              :checked="selectedWorkshop.categorySlugs.includes(category.slug)"
              type="checkbox"
              @change="handleCategoryToggle(category.slug, $event)"
            >
            <span>{{ category.title }}</span>
          </label>
        </div>
      </fieldset>

      <label class="admin-field">
        <span class="admin-label">Краткое описание</span>
        <textarea v-model="selectedWorkshop.summary" class="admin-textarea" />
      </label>

      <label class="admin-field">
        <span class="admin-label">Описание</span>
        <textarea v-model="selectedWorkshop.description" class="admin-textarea" />
      </label>

      <div class="admin-editor__grid">
        <AdminImageUploadField
          v-model="selectedWorkshop.image"
          label="Основное изображение"
          folder="master-classes"
          preview-alt="Превью мастер-класса"
        />

        <label class="admin-field">
          <span class="admin-label">Длительность</span>
          <input v-model="selectedWorkshop.duration" class="admin-input" type="text">
        </label>
      </div>

      <div class="admin-editor__grid">
        <label class="admin-field">
          <span class="admin-label">Цена от</span>
          <input v-model="selectedWorkshop.priceFrom" class="admin-input" type="text">
        </label>

        <label class="admin-field">
          <span class="admin-label">Примечание к цене</span>
          <input v-model="selectedWorkshop.priceNote" class="admin-input" type="text">
        </label>
      </div>

      <div class="admin-editor__grid">
        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">Форматы</span>
          <textarea v-model="selectedWorkshop.formatsText" class="admin-textarea" />
          <span class="admin-inline-note">По одной строке</span>
        </label>

        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">Что входит</span>
          <textarea v-model="selectedWorkshop.includesText" class="admin-textarea" />
          <span class="admin-inline-note">По одной строке</span>
        </label>
      </div>

      <div class="admin-editor__grid">
        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">Цены</span>
          <textarea v-model="selectedWorkshop.pricingText" class="admin-textarea" />
          <span class="admin-inline-note">Одна строка: `Лейбл|Цена|Примечание`</span>
        </label>

        <AdminGalleryEditorField
          v-model="selectedWorkshop.gallery"
          label="Галерея"
          folder="master-classes"
          note="Загрузите фото для внутренней галереи карточки мастер-класса, настройте порядок и подписи."
        />
      </div>
    </div>
  </section>

  <div v-else class="admin-empty">
    <p>Мастер-класс не найден.</p>
  </div>
</template>
