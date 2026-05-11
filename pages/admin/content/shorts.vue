<script setup lang="ts">
import type { HomeContent } from '~/data/home-content'
import {
  createEmptyHomeContent,
  createEmptyShort
} from '~/utils/admin-home-content'

definePageMeta({
  layout: 'admin'
})

const { data, refresh } = await useFetch<HomeContent>('/api/admin/home-content', {
  key: 'admin-home-content-shorts'
})

const content = ref<HomeContent>(createEmptyHomeContent())
const isSaving = ref(false)

watch(
  data,
  (value) => {
    if (value) {
      content.value = structuredClone(value)
    }
  },
  { immediate: true }
)

const addShort = () => {
  content.value.shorts.items.push(createEmptyShort())
}

const removeShort = (index: number) => {
  content.value.shorts.items.splice(index, 1)
}

const saveContent = async () => {
  isSaving.value = true

  try {
    await $fetch('/api/admin/home-content', {
      method: 'PUT',
      body: content.value
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
    <div class="admin-card admin-card--editor">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">Shorts</h3>
          <p class="admin-card__descr">
            Редактируйте заголовок, описание, карточки и `videoId` роликов для блока на главной.
          </p>
        </div>
        <button type="button" class="admin-button admin-button--sand" @click="addShort">
          Добавить Shorts
        </button>
      </div>

      <div class="admin-actions">
        <button type="button" class="admin-button admin-button--accent" :disabled="isSaving" @click="saveContent">
          {{ isSaving ? 'Сохраняем...' : 'Сохранить Shorts' }}
        </button>
      </div>

      <label class="admin-field">
        <span class="admin-label">Eyebrow</span>
        <input v-model="content.shorts.eyebrow" class="admin-input" type="text">
      </label>

      <label class="admin-field">
        <span class="admin-label">Заголовок</span>
        <textarea v-model="content.shorts.title" class="admin-textarea" />
      </label>

      <label class="admin-field">
        <span class="admin-label">Описание</span>
        <textarea v-model="content.shorts.description" class="admin-textarea" />
      </label>

      <div
        v-for="(item, index) in content.shorts.items"
        :key="item.id"
        class="admin-inline-group admin-inline-group--stack"
      >
        <div class="admin-card__head">
          <div>
            <h5 class="admin-card__title">Видео {{ index + 1 }}</h5>
          </div>
          <button
            v-if="content.shorts.items.length > 1"
            type="button"
            class="admin-button admin-button--ghost"
            @click="removeShort(index)"
          >
            Удалить
          </button>
        </div>

        <label class="admin-field">
          <span class="admin-label">ID</span>
          <input v-model="item.id" class="admin-input" type="text">
        </label>

        <label class="admin-field">
          <span class="admin-label">Название</span>
          <input v-model="item.title" class="admin-input" type="text">
        </label>

        <label class="admin-field">
          <span class="admin-label">Kinescope videoId</span>
          <input v-model="item.videoId" class="admin-input" type="text">
        </label>

        <AdminImageUploadField
          v-model="item.poster"
          label="Постер"
          folder="home-content"
          preview-alt="Short poster"
        />
      </div>
    </div>
  </section>
</template>
