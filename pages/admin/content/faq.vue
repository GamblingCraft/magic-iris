<script setup lang="ts">
import type { HomeContent } from '~/data/home-content'
import {
  createEmptyFaqItem,
  createEmptyHomeContent
} from '~/utils/admin-home-content'

definePageMeta({
  layout: 'admin'
})

const { data, refresh } = await useFetch<HomeContent>('/api/admin/home-content', {
  key: 'admin-home-content-faq'
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

const addFaqItem = () => {
  content.value.faq.items.push(createEmptyFaqItem())
}

const removeFaqItem = (index: number) => {
  content.value.faq.items.splice(index, 1)
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
          <h3 class="admin-card__title">FAQ</h3>
          <p class="admin-card__descr">
            Редактируйте заголовки, описание и вопросы для FAQ-блока на главной.
          </p>
        </div>
        <button type="button" class="admin-button admin-button--sand" @click="addFaqItem">
          Добавить вопрос
        </button>
      </div>

      <div class="admin-actions">
        <button type="button" class="admin-button admin-button--accent" :disabled="isSaving" @click="saveContent">
          {{ isSaving ? 'Сохраняем...' : 'Сохранить FAQ' }}
        </button>
      </div>

      <label class="admin-field">
        <span class="admin-label">Eyebrow</span>
        <input v-model="content.faq.eyebrow" class="admin-input" type="text">
      </label>

      <label class="admin-field">
        <span class="admin-label">Первая часть заголовка</span>
        <input v-model="content.faq.title" class="admin-input" type="text">
      </label>

      <label class="admin-field">
        <span class="admin-label">Акцентная часть</span>
        <input v-model="content.faq.titleAccent" class="admin-input" type="text">
      </label>

      <label class="admin-field">
        <span class="admin-label">Описание</span>
        <textarea v-model="content.faq.description" class="admin-textarea" />
      </label>

      <div
        v-for="(item, index) in content.faq.items"
        :key="`faq-item-${index}`"
        class="admin-inline-group admin-inline-group--stack"
      >
        <div class="admin-card__head">
          <div>
            <h5 class="admin-card__title">Вопрос {{ index + 1 }}</h5>
          </div>
          <button
            v-if="content.faq.items.length > 1"
            type="button"
            class="admin-button admin-button--ghost"
            @click="removeFaqItem(index)"
          >
            Удалить
          </button>
        </div>

        <label class="admin-field">
          <span class="admin-label">Вопрос</span>
          <textarea v-model="item.question" class="admin-textarea" />
        </label>

        <label class="admin-field">
          <span class="admin-label">Ответ</span>
          <textarea v-model="item.answer" class="admin-textarea" />
        </label>
      </div>
    </div>
  </section>
</template>
