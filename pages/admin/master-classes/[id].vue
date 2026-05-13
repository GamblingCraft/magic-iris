<script setup lang="ts">
import {
  deriveWorkshopAudienceLabel,
  type CatalogImage,
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

    for (const draft of workshopDrafts.value) {
      const lead = draft.legacyLayout?.whatIntro?.trim()

      if (lead) {
        draft.summary = lead
        draft.description = lead
      }
    }
  },
  { immediate: true }
)

const categories = computed(() => catalog.value?.masterClassCategories || [])

const selectedWorkshop = computed(() =>
  workshopDrafts.value.find((item) => item.id === workshopId.value) || null
)

const ensureLegacyLayout = () => {
  if (!selectedWorkshop.value) {
    return null
  }

  if (!selectedWorkshop.value.legacyLayout) {
    selectedWorkshop.value.legacyLayout = {
      whatTitle: 'ЧТО БУДЕТ НА МАСТЕР-КЛАССЕ?',
      whatIntro: selectedWorkshop.value.summary || '',
      whatProcess: '',
      whatMeta: '',
      whatPrice: '',
      whatImages: [],
      formatsTitle: 'ФОРМАТЫ ПРОВЕДЕНИЯ',
      formatCards: [
        { title: '????', details: '', price: '' },
        { title: '????', details: '', price: '' }
      ]
    }
  }

  if (!selectedWorkshop.value.legacyLayout.formatCards?.length) {
    selectedWorkshop.value.legacyLayout.formatCards = [
      { title: '????', details: '', price: '' },
      { title: '????', details: '', price: '' }
    ]
  }

  while (selectedWorkshop.value.legacyLayout.formatCards.length < 2) {
    selectedWorkshop.value.legacyLayout.formatCards.push({ title: '', details: '', price: '' })
  }

  if (!selectedWorkshop.value.legacyLayout.whatIntro?.trim()) {
    selectedWorkshop.value.legacyLayout.whatIntro =
      selectedWorkshop.value.summary?.trim() ||
      selectedWorkshop.value.description?.trim() ||
      ''
  }

  const lead = selectedWorkshop.value.legacyLayout.whatIntro?.trim() || ''

  if (lead) {
    selectedWorkshop.value.summary = lead
    selectedWorkshop.value.description = lead
  }

  return selectedWorkshop.value.legacyLayout
}

const legacyLayoutDraft = computed(() => ensureLegacyLayout())

watch(
  () => legacyLayoutDraft.value?.whatIntro,
  (value) => {
    if (!selectedWorkshop.value) {
      return
    }

    const lead = (value || '').trim()
    selectedWorkshop.value.summary = lead
    selectedWorkshop.value.description = lead
  },
  { immediate: true }
)

const setLegacyImagesFromText = (value: string) => {
  const layout = ensureLegacyLayout()

  if (!layout || !selectedWorkshop.value) {
    return
  }

  selectedWorkshop.value.legacyImagesText = value
  layout.whatImages = value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

const legacyGalleryItems = computed<CatalogImage[]>({
  get() {
    const layout = ensureLegacyLayout()

    if (!layout) {
      return []
    }

    return (layout.whatImages || []).map((src, index) => ({
      id: `legacy-${index + 1}`,
      src,
      alt: `${selectedWorkshop.value?.title || 'Мастер-класс'} — фото ${index + 1}`
    }))
  },
  set(value) {
    const layout = ensureLegacyLayout()

    if (!layout || !selectedWorkshop.value) {
      return
    }

    const urls = (value || [])
      .map((item) => item.src?.trim() || '')
      .filter(Boolean)

    layout.whatImages = urls
    selectedWorkshop.value.legacyImagesText = urls.join('\n')
  }
})


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
      <label v-if="legacyLayoutDraft" class="admin-field">
        <span class="admin-label">описание</span>
        <textarea v-model="legacyLayoutDraft.whatIntro" class="admin-textarea"></textarea>
      </label>

      <div v-if="legacyLayoutDraft" class="admin-editor__grid">
        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">Что будет на мастер-классе</span>
          <textarea v-model="legacyLayoutDraft.whatProcess" class="admin-textarea"></textarea>
        </label>

        <AdminGalleryEditorField
          v-model="legacyGalleryItems"
          label="Фото секции"
          folder="master-classes"
          note="Можно добавлять любое количество фото: они попадут в блок «Как мастер-класс выглядит на площадке»."
        />
      </div>

      <div v-if="legacyLayoutDraft" class="admin-editor__grid">
        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">ГРУППОВОЙ — описание</span>
          <textarea v-model="legacyLayoutDraft.formatCards[0].details" class="admin-textarea"></textarea>
        </label>

        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">ГРУППОВОЙ — стоимость</span>
          <textarea v-model="legacyLayoutDraft.formatCards[0].price" class="admin-textarea"></textarea>
        </label>
      </div>

      <div v-if="legacyLayoutDraft" class="admin-editor__grid">
        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">ПОТОКОВЫЙ — описание</span>
          <textarea v-model="legacyLayoutDraft.formatCards[1].details" class="admin-textarea"></textarea>
        </label>

        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">ПОТОКОВЫЙ — стоимость</span>
          <textarea v-model="legacyLayoutDraft.formatCards[1].price" class="admin-textarea"></textarea>
        </label>
      </div>

      <div class="admin-editor__grid">
        <AdminImageUploadField
          v-model="selectedWorkshop.image"
          label="Основное изображение"
          folder="master-classes"
          preview-alt="Превью мастер-класса"
        />
      </div>
      </div>
    </div>
  </section>

  <div v-else class="admin-empty">
    <p>Мастер-класс не найден.</p>
  </div>
</template>
