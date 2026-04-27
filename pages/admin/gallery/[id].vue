<script setup lang="ts">
import type { HomeGalleryContent } from '~/data/home-gallery'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const itemId = computed(() => String(route.params.id || ''))

const { data, refresh } = await useFetch<HomeGalleryContent>('/api/admin/home-gallery', {
  key: `admin-home-gallery-item-${itemId.value}`
})

const gallery = ref<HomeGalleryContent>({
  eyebrow: '',
  title: '',
  description: '',
  items: []
})
const isSaving = ref(false)

watch(
  data,
  (value) => {
    if (value) {
      gallery.value = structuredClone(value)
    }
  },
  { immediate: true }
)

const selectedItem = computed(() =>
  gallery.value.items.find((item) => item.id === itemId.value) || null
)

const moveItem = (direction: -1 | 1) => {
  const index = gallery.value.items.findIndex((item) => item.id === itemId.value)

  if (index < 0) {
    return
  }

  const nextIndex = index + direction

  if (nextIndex < 0 || nextIndex >= gallery.value.items.length) {
    return
  }

  const cloned = [...gallery.value.items]
  const [moved] = cloned.splice(index, 1)
  cloned.splice(nextIndex, 0, moved)
  gallery.value.items = cloned
}

const saveItem = async () => {
  isSaving.value = true

  try {
    await $fetch('/api/admin/home-gallery', {
      method: 'PUT',
      body: gallery.value
    })

    await refresh()
  }
  finally {
    isSaving.value = false
  }
}

const removeItem = async () => {
  if (!selectedItem.value) {
    return
  }

  await $fetch('/api/admin/home-gallery', {
    method: 'PUT',
    body: {
      ...gallery.value,
      items: gallery.value.items.filter((item) => item.id !== selectedItem.value?.id)
    }
  })

  await router.push('/admin/gallery')
}
</script>

<template>
  <section v-if="selectedItem" class="admin-grid">
    <div class="admin-card admin-card--editor">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">Редактор фото HomeGallerySection</h3>
          <p class="admin-card__descr">Меняйте изображение, alt и порядок кадра именно для блока галереи на главной.</p>
        </div>
      </div>

      <div class="admin-actions">
        <NuxtLink to="/admin/gallery" class="admin-button">К списку</NuxtLink>
        <button type="button" class="admin-button" @click="moveItem(-1)">Выше</button>
        <button type="button" class="admin-button" @click="moveItem(1)">Ниже</button>
        <button type="button" class="admin-button admin-button--danger" @click="removeItem">Удалить</button>
        <button type="button" class="admin-button admin-button--accent" :disabled="isSaving" @click="saveItem">
          {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
        </button>
      </div>

      <div class="admin-editor__grid">
        <label class="admin-field">
          <span class="admin-label">ID</span>
          <input v-model="selectedItem.id" class="admin-input" type="text">
        </label>

        <AdminImageUploadField
          v-model="selectedItem.src"
          label="Изображение"
          folder="gallery"
          preview-alt="Фото галереи"
        />
      </div>

      <label class="admin-field">
        <span class="admin-label">Alt</span>
        <textarea v-model="selectedItem.alt" class="admin-textarea" />
      </label>
    </div>
  </section>

  <div v-else class="admin-empty">
    <p>Фото не найдено.</p>
  </div>
</template>
