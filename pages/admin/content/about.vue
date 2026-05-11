<script setup lang="ts">
import type { HomeContent } from '~/data/home-content'
import { createEmptyHomeContent } from '~/utils/admin-home-content'

definePageMeta({
  layout: 'admin'
})

const { data, refresh } = await useFetch<HomeContent>('/api/admin/home-content', {
  key: 'admin-home-content-about'
})

const content = ref<HomeContent>(createEmptyHomeContent())
const isSaving = ref(false)
const tagsText = computed({
  get: () => content.value.about.tags.join('\n'),
  set: (value: string) => {
    content.value.about.tags = value.split('\n').map((item) => item.trim()).filter(Boolean)
  }
})
const paragraphsText = computed({
  get: () => content.value.about.paragraphs.join('\n\n'),
  set: (value: string) => {
    content.value.about.paragraphs = value.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean)
  }
})

watch(
  data,
  (value) => {
    if (value) {
      content.value = structuredClone(value)
    }
  },
  { immediate: true }
)

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
          <h3 class="admin-card__title">О нас</h3>
          <p class="admin-card__descr">
            Редактируйте тексты, подзаголовки и образ секции «О нас» на главной.
          </p>
        </div>
      </div>

      <div class="admin-actions">
        <button type="button" class="admin-button admin-button--accent" :disabled="isSaving" @click="saveContent">
          {{ isSaving ? 'Сохраняем...' : 'Сохранить секцию' }}
        </button>
      </div>

      <label class="admin-field">
        <span class="admin-label">Eyebrow</span>
        <input v-model="content.about.eyebrow" class="admin-input" type="text">
      </label>

      <label class="admin-field">
        <span class="admin-label">Главный заголовок</span>
        <textarea v-model="content.about.headline" class="admin-textarea" />
      </label>

      <label class="admin-field">
        <span class="admin-label">Лид</span>
        <textarea v-model="content.about.lead" class="admin-textarea" />
      </label>

      <div class="admin-editor__grid">
        <label class="admin-field">
          <span class="admin-label">Подзаголовок: шоу</span>
          <input v-model="content.about.subheadingShows" class="admin-input" type="text">
        </label>

        <label class="admin-field">
          <span class="admin-label">Подзаголовок: мастер-классы</span>
          <input v-model="content.about.subheadingMasterclasses" class="admin-input" type="text">
        </label>
      </div>

      <label class="admin-field">
        <span class="admin-label">Подзаголовок: для кого и где мы работаем</span>
        <input v-model="content.about.subheadingForWhom" class="admin-input" type="text">
      </label>

      <AdminImageUploadField
        v-model="content.about.portrait.src"
        label="Фото секции"
        folder="home-content"
        preview-alt="About section image"
      />

      <label class="admin-field">
        <span class="admin-label">Alt для фото</span>
        <input v-model="content.about.portrait.alt" class="admin-input" type="text">
      </label>

      <label class="admin-fieldset">
        <span class="admin-fieldset__legend">Абзацы</span>
        <textarea v-model="paragraphsText" class="admin-textarea" />
        <span class="admin-inline-note">Разделяйте абзацы пустой строкой.</span>
      </label>

      <label class="admin-fieldset">
        <span class="admin-fieldset__legend">Теги бегущей строки</span>
        <textarea v-model="tagsText" class="admin-textarea" />
        <span class="admin-inline-note">По одному тегу на строку.</span>
      </label>
    </div>
  </section>
</template>
