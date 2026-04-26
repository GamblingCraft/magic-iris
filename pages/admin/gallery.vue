<script setup lang="ts">
import type { HomeGalleryContent, HomeGalleryItem } from '~/data/home-gallery'

import { createId } from '~/utils/admin-editor'

definePageMeta({
  layout: 'admin'
})

const router = useRouter()

const { data, refresh } = await useFetch<HomeGalleryContent>('/api/admin/home-gallery', {
  key: 'admin-home-gallery-list'
})

const gallery = computed(() => data.value)
const isCreating = ref(false)

const createItem = async () => {
  if (!gallery.value) {
    return
  }

  isCreating.value = true

  try {
    const nextItem: HomeGalleryItem = {
      id: createId('gallery'),
      src: '',
      alt: 'Новый кадр'
    }

    await $fetch('/api/admin/home-gallery', {
      method: 'PUT',
      body: {
        ...gallery.value,
        items: [nextItem, ...gallery.value.items]
      }
    })

    await refresh()
    await router.push(`/admin/gallery/${nextItem.id}`)
  }
  finally {
    isCreating.value = false
  }
}
</script>

<template>
  <section class="admin-grid">
    <div class="admin-card">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">HomeGallerySection</h3>
          <p class="admin-card__descr">Это редактор блока галереи на главной странице: отдельно настройки секции и отдельно список фотографий.</p>
        </div>
      </div>

      <div class="admin-actions">
        <NuxtLink to="/admin/gallery/settings" class="admin-button">Настройки HomeGallerySection</NuxtLink>
        <button type="button" class="admin-button admin-button--sand" :disabled="isCreating" @click="createItem">
          {{ isCreating ? 'Создание...' : 'Добавить фото' }}
        </button>
      </div>
    </div>

    <div class="admin-list admin-list--page">
      <NuxtLink to="/admin/gallery/settings" class="admin-list__item">
        <img src="https://placehold.co/800x520?text=Gallery+Settings" alt="Настройки галереи">
        <h3>Настройки HomeGallerySection</h3>
        <p>Eyebrow, заголовок и описание блока на главной</p>
      </NuxtLink>

      <NuxtLink
        v-for="item in gallery?.items || []"
        :key="item.id"
        :to="`/admin/gallery/${item.id}`"
        class="admin-list__item"
      >
        <img :src="item.src || 'https://placehold.co/800x520?text=Gallery'" :alt="item.alt || 'Gallery item'">
        <h3>{{ item.alt || 'Новый кадр' }}</h3>
        <p>{{ item.id }}</p>
      </NuxtLink>
    </div>
  </section>
</template>
