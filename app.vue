<script setup lang="ts">
import type { SiteHeadSettings } from '~/data/site-seo'
import { resolveCompanyJsonLd, resolveYandexMetrikaHead } from '~/data/site-seo'

const { data: headSettings } = await useFetch<SiteHeadSettings>('/api/site/head-settings', {
  key: 'site-head-settings'
})

const isMetrikaReady = ref(false)
const metrikaHead = computed(() =>
  resolveYandexMetrikaHead(headSettings.value?.yandexMetrikaCounter || '')
)
const companyJsonLd = computed(() =>
  resolveCompanyJsonLd(headSettings.value?.companyJsonLd || '')
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

  const script = [
    {
      key: 'company-json-ld',
      type: 'application/ld+json',
      innerHTML: companyJsonLd.value
    }
  ]

  if (isMetrikaReady.value && metrikaHead.value.script) {
    script.push({
      key: 'yandex-metrika',
      innerHTML: metrikaHead.value.script
    })
  }

  return {
    meta,
    script,
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
