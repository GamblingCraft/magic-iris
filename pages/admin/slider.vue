<script setup lang="ts">
import type { HomeHeroSlide } from '~/data/home-slider'

import { createEmptySlide } from '~/utils/admin-editor'

definePageMeta({
  layout: 'admin'
})

const router = useRouter()

const { data, refresh } = await useFetch<HomeHeroSlide[]>('/api/admin/home-slider', {
  key: 'admin-home-slider-list'
})

const slides = computed(() => data.value || [])
const isCreating = ref(false)
const deletingId = ref('')

const createSlide = async () => {
  isCreating.value = true

  try {
    const nextSlide = createEmptySlide()
    nextSlide.title = 'Новый слайд Hero'
    nextSlide.eyebrow = 'Новый блок'

    await $fetch('/api/admin/home-slider', {
      method: 'PUT',
      body: [nextSlide, ...slides.value]
    })

    await refresh()
    await router.push(`/admin/slider/${nextSlide.id}`)
  }
  finally {
    isCreating.value = false
  }
}

const removeSlide = async (id: string) => {
  deletingId.value = id

  try {
    await $fetch('/api/admin/home-slider', {
      method: 'PUT',
      body: slides.value.filter((item) => item.id !== id)
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
          <h3 class="admin-card__title">Фото для Hero</h3>
          <p class="admin-card__descr">Здесь хранятся изображения и тексты hero-блока на главной странице.</p>
        </div>
      </div>

      <div class="admin-actions">
        <button type="button" class="admin-button admin-button--sand" :disabled="isCreating" @click="createSlide">
          {{ isCreating ? 'Создание...' : 'Добавить слайд' }}
        </button>
      </div>
    </div>

    <div class="admin-rows">
      <article v-for="slide in slides" :key="slide.id" class="admin-row">
        <img class="admin-row__thumb" :src="slide.image || 'https://placehold.co/800x520?text=Hero'" :alt="slide.title || 'Hero slide'">

        <div class="admin-row__meta">
          <h3>{{ slide.title || 'Без названия' }}</h3>
          <p>{{ slide.eyebrow || 'Без подзаголовка' }}</p>
        </div>

        <div class="admin-row__slug">
          <span>ID</span>
          <strong>{{ slide.id }}</strong>
        </div>

        <div class="admin-row__actions">
          <NuxtLink :to="`/admin/slider/${slide.id}`" class="admin-button">Редактировать</NuxtLink>
          <button
            type="button"
            class="admin-button admin-button--danger"
            :disabled="deletingId === slide.id"
            @click="removeSlide(slide.id)"
          >
            {{ deletingId === slide.id ? 'Удаление...' : 'Удалить' }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
