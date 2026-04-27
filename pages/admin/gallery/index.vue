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
const deletingId = ref('')

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

const removeItem = async (id: string) => {
  if (!gallery.value) {
    return
  }

  deletingId.value = id

  try {
    await $fetch('/api/admin/home-gallery', {
      method: 'PUT',
      body: {
        ...gallery.value,
        items: gallery.value.items.filter((item) => item.id !== id)
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

    <div class="admin-rows">
      <article class="admin-row">
        <img class="admin-row__thumb" src="https://placehold.co/800x520?text=Gallery+Settings" alt="Настройки галереи">

        <div class="admin-row__meta">
          <h3>Настройки HomeGallerySection</h3>
          <p>Eyebrow, заголовок и описание блока на главной</p>
        </div>

        <div class="admin-row__slug">
          <span>Тип</span>
          <strong>settings</strong>
        </div>

        <div class="admin-row__actions">
          <NuxtLink to="/admin/gallery/settings" class="admin-button">Редактировать</NuxtLink>
        </div>
      </article>

      <article v-for="item in gallery?.items || []" :key="item.id" class="admin-row">
        <img class="admin-row__thumb" :src="item.src || 'https://placehold.co/800x520?text=Gallery'" :alt="item.alt || 'Gallery item'">

        <div class="admin-row__meta">
          <h3>{{ item.alt || 'Новый кадр' }}</h3>
          <p>Фото для HomeGallerySection</p>
        </div>

        <div class="admin-row__slug">
          <span>ID</span>
          <strong>{{ item.id }}</strong>
        </div>

        <div class="admin-row__actions">
          <NuxtLink :to="`/admin/gallery/${item.id}`" class="admin-button">Редактировать</NuxtLink>
          <button
            type="button"
            class="admin-button admin-button--danger"
            :disabled="deletingId === item.id"
            @click="removeItem(item.id)"
          >
            {{ deletingId === item.id ? 'Удаление...' : 'Удалить' }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
