<script setup lang="ts">
import type { SiteHeadSettings } from '~/data/site-seo'
import { resolveYandexMetrikaHead } from '~/data/site-seo'

const { data: headSettings } = await useFetch<SiteHeadSettings>('/api/site/head-settings', {
  key: 'site-head-settings'
})

const metrikaHead = computed(() =>
  resolveYandexMetrikaHead(headSettings.value?.yandexMetrikaCounter || '')
)

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
    script: metrikaHead.value.script
      ? [
          {
            key: 'yandex-metrika',
            innerHTML: metrikaHead.value.script
          }
        ]
      : [],
    noscript: metrikaHead.value.noscript
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
