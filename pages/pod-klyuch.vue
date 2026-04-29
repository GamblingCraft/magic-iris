<script setup lang="ts">
import type { ServiceLandingPage } from '~/data/service-pages'

import { buildAbsoluteUrl } from '~/data/site-seo'

const route = useRoute()
const { data: pageData } = await useFetch<ServiceLandingPage>('/api/site/service-pages/pod-klyuch', {
  key: 'pod-klyuch-service-page'
})

const page = computed(() => pageData.value as ServiceLandingPage)
const pageUrl = computed(() => buildAbsoluteUrl(route.path))

usePageSeo(page.value.seo)

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: buildAbsoluteUrl('/') },
            { '@type': 'ListItem', position: 2, name: page.value.breadcrumbLabel, item: pageUrl.value }
          ]
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: page.value.hero.title,
          description: `${page.value.hero.lead} ${page.value.hero.description}`.trim(),
          areaServed: 'Иркутск',
          serviceType: 'Организация праздника под ключ',
          provider: {
            '@type': 'Organization',
            name: 'Magic Iris',
            url: buildAbsoluteUrl('/')
          },
          url: pageUrl.value
        }
      ])
    }
  ]
})
</script>

<template>
  <ServiceLandingTemplate
    :page="page"
    :breadcrumbs="[
      { label: 'Главная', href: '/' },
      { label: page.breadcrumbLabel }
    ]"
  />
</template>
