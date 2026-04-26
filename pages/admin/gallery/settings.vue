<script setup lang="ts">
import type { HomeGalleryContent } from '~/data/home-gallery'

definePageMeta({
  layout: 'admin'
})

const { data, refresh } = await useFetch<HomeGalleryContent>('/api/admin/home-gallery', {
  key: 'admin-home-gallery-settings'
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

const saveSettings = async () => {
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
</script>

<template>
  <section class="admin-grid">
    <div class="admin-card">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">Настройки HomeGallerySection</h3>
          <p class="admin-card__descr">Редактируйте тексты шапки блока галереи на главной странице.</p>
        </div>
      </div>

      <div class="admin-actions">
        <NuxtLink to="/admin/gallery" class="admin-button">К списку</NuxtLink>
        <button type="button" class="admin-button admin-button--accent" :disabled="isSaving" @click="saveSettings">
          {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
        </button>
      </div>

      <label class="admin-field">
        <span class="admin-label">Eyebrow</span>
        <input v-model="gallery.eyebrow" class="admin-input" type="text">
      </label>

      <label class="admin-field">
        <span class="admin-label">Заголовок</span>
        <textarea v-model="gallery.title" class="admin-textarea" />
      </label>

      <label class="admin-field">
        <span class="admin-label">Описание</span>
        <textarea v-model="gallery.description" class="admin-textarea" />
      </label>
    </div>
  </section>
</template>
