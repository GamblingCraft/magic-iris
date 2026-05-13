<script setup lang="ts">
import type { CatalogPagesContent } from '~/data/catalog-pages'
import { createEmptyHomeContent, createEmptyShort } from '~/utils/admin-home-content'
import { createEmptyCatalogPagesContent } from '~/utils/admin-catalog-pages'

definePageMeta({
  layout: 'admin'
})

const { data, refresh } = await useFetch<CatalogPagesContent>('/api/admin/catalog-pages', {
  key: 'admin-catalog-pages-shorts2'
})

const content = ref<CatalogPagesContent>(createEmptyCatalogPagesContent())
const isSaving = ref(false)

watch(
  data,
  (value) => {
    if (value) {
      content.value = structuredClone(value)
    }

    if (!content.value.masterClasses.shorts) {
      content.value.masterClasses.shorts = createEmptyCatalogPagesContent().masterClasses.shorts || createEmptyHomeContent().shorts
    }
  },
  { immediate: true }
)

const shorts = computed(() => {
  if (!content.value.masterClasses.shorts) {
    content.value.masterClasses.shorts = createEmptyCatalogPagesContent().masterClasses.shorts || createEmptyHomeContent().shorts
  }

  return content.value.masterClasses.shorts
})

const addShort = () => {
  shorts.value?.items.push(createEmptyShort())
}

const removeShort = (index: number) => {
  shorts.value?.items.splice(index, 1)
}

const saveContent = async () => {
  isSaving.value = true

  try {
    await $fetch('/api/admin/catalog-pages', {
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
          <h3 class="admin-card__title">Shorts2</h3>
          <p class="admin-card__descr">
            Редактируйте второй блок Shorts на главной, который показывает видео по мастер-классам.
          </p>
        </div>
        <button type="button" class="admin-button admin-button--sand" @click="addShort">
          Добавить Shorts
        </button>
      </div>

      <div class="admin-actions">
        <button type="button" class="admin-button admin-button--accent" :disabled="isSaving" @click="saveContent">
          {{ isSaving ? 'Сохраняем...' : 'Сохранить Shorts2' }}
        </button>
      </div>

      <label class="admin-field">
        <span class="admin-label">Eyebrow</span>
        <input v-model="shorts.eyebrow" class="admin-input" type="text">
      </label>

      <label class="admin-field">
        <span class="admin-label">Заголовок</span>
        <textarea v-model="shorts.title" class="admin-textarea" />
      </label>

      <label class="admin-field">
        <span class="admin-label">Описание</span>
        <textarea v-model="shorts.description" class="admin-textarea" />
      </label>

      <div
        v-for="(item, index) in shorts.items"
        :key="item.id"
        class="admin-inline-group admin-inline-group--stack"
      >
        <div class="admin-card__head">
          <div>
            <h5 class="admin-card__title">Видео {{ index + 1 }}</h5>
          </div>
          <button
            v-if="shorts.items.length > 1"
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
          folder="master-classes"
          preview-alt="Shorts2 poster"
        />
      </div>
    </div>
  </section>
</template>
