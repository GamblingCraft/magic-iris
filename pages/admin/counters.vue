<script setup lang="ts">
import type { SiteSeoSettings } from '~/data/site-seo'

definePageMeta({
  layout: 'admin'
})

const { data, refresh } = await useFetch<SiteSeoSettings>('/api/admin/seo-settings', {
  key: 'admin-counter-settings'
})

const seoSettings = ref<SiteSeoSettings | null>(null)
const isSaving = ref(false)

watch(
  data,
  (value) => {
    if (!value) {
      return
    }

    seoSettings.value = structuredClone(value)
  },
  { immediate: true }
)

const saveCounters = async () => {
  if (!seoSettings.value) {
    return
  }

  isSaving.value = true

  try {
    await $fetch('/api/admin/seo-settings', {
      method: 'PUT',
      body: seoSettings.value
    })

    await refresh()
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <section v-if="seoSettings" class="admin-grid">
    <div class="admin-card admin-card--editor">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">Счётчики и верификация</h3>
          <p class="admin-card__descr">
            Здесь хранятся мета-теги для подтверждения прав и код Яндекс.Метрики. После сохранения
            значения автоматически попадают в публичный head сайта.
          </p>
        </div>
      </div>

      <div class="admin-actions">
        <button
          type="button"
          class="admin-button admin-button--accent"
          :disabled="isSaving"
          @click="saveCounters"
        >
          {{ isSaving ? 'Сохранение...' : 'Сохранить счётчики' }}
        </button>
      </div>

      <label class="admin-field">
        <span class="admin-label">Yandex verification</span>
        <input
          v-model="seoSettings.yandexVerification"
          class="admin-input"
          type="text"
          placeholder="Например: 1234567890abcdef"
        >
      </label>

      <label class="admin-field">
        <span class="admin-label">Google verification</span>
        <input
          v-model="seoSettings.googleVerification"
          class="admin-input"
          type="text"
          placeholder="Например: abcdefghijklmnop"
        >
      </label>

      <label class="admin-field">
        <span class="admin-label">Яндекс.Метрика</span>
        <textarea
          v-model="seoSettings.yandexMetrikaCounter"
          class="admin-textarea admin-textarea--code"
          placeholder="Вставьте весь код счётчика или только содержимое script"
        />
        <span class="admin-inline-note">
          Можно вставить полный код Метрики со script и noscript. Система сама выделит нужный
          script для head.
        </span>
      </label>
    </div>
  </section>
</template>
