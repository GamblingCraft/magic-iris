<script setup lang="ts">
import type { SiteHeadSettings } from '~/data/site-seo'
import { resolveYandexMetrikaHead } from '~/data/site-seo'

const { data: headSettings } = await useFetch<SiteHeadSettings>('/api/site/head-settings', {
  key: 'site-head-settings'
})

const isMetrikaReady = ref(false)
const metrikaHead = computed(() =>
  resolveYandexMetrikaHead(headSettings.value?.yandexMetrikaCounter || '')
)

onMounted(() => {
  if (import.meta.dev || !metrikaHead.value.script) {
    return
  }

  const activateMetrika = () => {
    isMetrikaReady.value = true
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(activateMetrika, { timeout: 4000 })
    return
  }

  window.setTimeout(activateMetrika, 2500)
})

useHead(() => {
  const meta = []

  if (headSettings.value?.yandexVerification) {
    meta.push({
      key: 'yandex-verification',
      name: 'yandex-verification',
      content: headSettings.value.yandexVerification
    })
  }

  if (headSettings.value?.googleVerification) {
    meta.push({
      key: 'google-site-verification',
      name: 'google-site-verification',
      content: headSettings.value.googleVerification
    })
  }

  return {
    meta,
    script: isMetrikaReady.value && metrikaHead.value.script
      ? [
          {
            key: 'yandex-metrika',
            innerHTML: metrikaHead.value.script
          }
        ]
      : [],
    noscript: isMetrikaReady.value && metrikaHead.value.noscript
      ? [
          {
            key: 'yandex-metrika-noscript',
            innerHTML: metrikaHead.value.noscript
          }
        ]
      : []
  }
})
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="#f0ef4d" />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
