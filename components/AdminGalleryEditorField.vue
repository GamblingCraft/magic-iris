<script setup lang="ts">
import type { CatalogImage } from '~/data/catalog'

import { createId } from '~/utils/admin-editor'

const props = defineProps<{
  modelValue: CatalogImage[]
  label: string
  folder: 'show' | 'master-classes' | 'gallery' | 'slider'
  note?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CatalogImage[]]
}>()

const items = ref<CatalogImage[]>([])

const cloneItems = (value: CatalogImage[]) =>
  value.map((item) => ({
    id: item.id || createId('image'),
    src: item.src || '',
    alt: item.alt || ''
  }))

watch(
  () => props.modelValue,
  (value) => {
    items.value = cloneItems(value || [])
  },
  { immediate: true, deep: true }
)

watch(
  items,
  (value) => {
    emit('update:modelValue', cloneItems(value))
  },
  { deep: true }
)

const addItem = () => {
  items.value.push({
    id: createId('image'),
    src: '',
    alt: ''
  })
}

const removeItem = (index: number) => {
  items.value.splice(index, 1)
}

const moveItem = (index: number, direction: -1 | 1) => {
  const nextIndex = index + direction

  if (nextIndex < 0 || nextIndex >= items.value.length) {
    return
  }

  const nextItems = [...items.value]
  const [current] = nextItems.splice(index, 1)
  nextItems.splice(nextIndex, 0, current)
  items.value = nextItems
}
</script>

<template>
  <div class="admin-fieldset admin-gallery-editor">
    <div class="admin-gallery-editor__head">
      <div>
        <p class="admin-fieldset__legend">{{ label }}</p>
        <p v-if="note" class="admin-inline-note">{{ note }}</p>
      </div>

      <button type="button" class="admin-button admin-button--sand" @click="addItem">
        Добавить фото
      </button>
    </div>

    <div v-if="items.length" class="admin-gallery-editor__list">
      <article
        v-for="(item, index) in items"
        :key="item.id"
        class="admin-gallery-card"
      >
        <div class="admin-gallery-card__head">
          <strong>Фото {{ index + 1 }}</strong>

          <div class="admin-gallery-card__actions">
            <button
              type="button"
              class="admin-button"
              :disabled="index === 0"
              @click="moveItem(index, -1)"
            >
              Вверх
            </button>

            <button
              type="button"
              class="admin-button"
              :disabled="index === items.length - 1"
              @click="moveItem(index, 1)"
            >
              Вниз
            </button>

            <button
              type="button"
              class="admin-button admin-button--danger"
              @click="removeItem(index)"
            >
              Удалить
            </button>
          </div>
        </div>

        <div class="admin-gallery-card__grid">
          <AdminImageUploadField
            v-model="item.src"
            label="Изображение"
            :folder="folder"
            preview-alt="Изображение галереи"
          />

          <div class="admin-gallery-card__meta">
            <label class="admin-field">
              <span class="admin-label">ID</span>
              <input v-model="item.id" class="admin-input" type="text">
            </label>

            <label class="admin-field">
              <span class="admin-label">Alt</span>
              <input v-model="item.alt" class="admin-input" type="text">
            </label>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="admin-empty admin-empty--compact">
      <p>Пока нет изображений. Добавьте первое фото для внутренней галереи.</p>
    </div>
  </div>
</template>
