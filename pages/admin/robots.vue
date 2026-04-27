<script setup lang="ts">
import type { SiteSeoSettings } from '~/data/site-seo'

definePageMeta({
  layout: 'admin'
})

const { data, refresh } = await useFetch<SiteSeoSettings>('/api/admin/seo-settings', {
  key: 'admin-robots-settings'
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

const robotsPreview = computed(() => {
  if (!seoSettings.value) {
    return ''
  }

  const normalizedUrl = seoSettings.value.siteUrl.replace(/\/+$/u, '')

  return seoSettings.value.robotsContent
    .replace(/\{siteUrl\}/gu, normalizedUrl)
    .replace(/\{sitemapUrl\}/gu, `${normalizedUrl}/sitemap.xml`)
})

const saveRobots = async () => {
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
    <div class="admin-card">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">Robots.txt</h3>
          <p class="admin-card__descr">
            Управляйте содержимым robots.txt через шаблон. Поддерживаются переменные {siteUrl} и {sitemapUrl}.
          </p>
        </div>
      </div>

      <div class="admin-actions">
        <a href="/robots.txt" target="_blank" rel="noreferrer" class="admin-button">Открыть robots.txt</a>
        <button type="button" class="admin-button admin-button--accent" :disabled="isSaving" @click="saveRobots">
          {{ isSaving ? 'Сохранение...' : 'Сохранить robots' }}
        </button>
      </div>

      <div class="admin-editor__grid">
        <label class="admin-field">
          <span class="admin-label">Базовый URL сайта</span>
          <input v-model="seoSettings.siteUrl" class="admin-input" type="text">
        </label>

        <div class="admin-note-card">
          <strong>Подсказка</strong>
          <p>Изменение базового URL сразу влияет на canonical, robots.txt и sitemap.xml.</p>
        </div>
      </div>

      <label class="admin-field">
        <span class="admin-label">Шаблон robots.txt</span>
        <textarea v-model="seoSettings.robotsContent" class="admin-textarea admin-textarea--code" />
      </label>

      <div class="admin-code-preview">
        <div class="admin-code-preview__head">
          <strong>Предпросмотр</strong>
        </div>
        <pre>{{ robotsPreview }}</pre>
      </div>
    </div>
  </section>
</template>
