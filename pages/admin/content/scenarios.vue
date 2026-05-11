<script setup lang="ts">
import type { HomeContent } from '~/data/home-content'
import {
  createEmptyHomeContent,
  createEmptyScenarioCard
} from '~/utils/admin-home-content'

definePageMeta({
  layout: 'admin'
})

const { data, refresh } = await useFetch<HomeContent>('/api/admin/home-content', {
  key: 'admin-home-content-scenarios'
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

const addScenarioCard = () => {
  content.value.scenario.cards.push(createEmptyScenarioCard())
}

const removeScenarioCard = (index: number) => {
  content.value.scenario.cards.splice(index, 1)
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
          <h3 class="admin-card__title">Сценарии</h3>
          <p class="admin-card__descr">
            Редактируйте шапку и карточки сценариев для блока на главной.
          </p>
        </div>
        <button type="button" class="admin-button admin-button--sand" @click="addScenarioCard">
          Добавить карточку
        </button>
      </div>

      <div class="admin-actions">
        <button type="button" class="admin-button admin-button--accent" :disabled="isSaving" @click="saveContent">
          {{ isSaving ? 'Сохраняем...' : 'Сохранить сценарии' }}
        </button>
      </div>

      <label class="admin-field">
        <span class="admin-label">Eyebrow</span>
        <input v-model="content.scenario.eyebrow" class="admin-input" type="text">
      </label>

      <label class="admin-field">
        <span class="admin-label">Заголовок в тёмной части</span>
        <input v-model="content.scenario.titleStrong" class="admin-input" type="text">
      </label>

      <label class="admin-field">
        <span class="admin-label">Заголовок в акценте</span>
        <input v-model="content.scenario.titleAccent" class="admin-input" type="text">
      </label>

      <label class="admin-field">
        <span class="admin-label">Описание</span>
        <textarea v-model="content.scenario.lead" class="admin-textarea" />
      </label>

      <div
        v-for="(card, index) in content.scenario.cards"
        :key="`scenario-card-${index}`"
        class="admin-inline-group admin-inline-group--stack"
      >
        <div class="admin-card__head">
          <div>
            <h5 class="admin-card__title">Карточка {{ index + 1 }}</h5>
          </div>
          <button
            v-if="content.scenario.cards.length > 1"
            type="button"
            class="admin-button admin-button--ghost"
            @click="removeScenarioCard(index)"
          >
            Удалить
          </button>
        </div>

        <label class="admin-field">
          <span class="admin-label">Заголовок</span>
          <input v-model="card.title" class="admin-input" type="text">
        </label>

        <label class="admin-field">
          <span class="admin-label">Описание</span>
          <textarea v-model="card.description" class="admin-textarea" />
        </label>

        <AdminImageUploadField
          v-model="card.image"
          label="Фото карточки"
          folder="home-content"
          preview-alt="Scenario card image"
        />
      </div>
    </div>
  </section>
</template>
