<script setup lang="ts">
import { getHomeSeo } from '~/data/site-seo'
import type { HomeCatalogPayload } from '~/types/public-catalog'

const { data: homeCatalog } = await useFetch<HomeCatalogPayload>('/api/site/home-catalog', {
  key: 'site-home-catalog'
})

const showTiles = computed(() => homeCatalog.value?.showTiles || [])
const workshopTiles = computed(() => homeCatalog.value?.workshopTiles || [])

usePageSeo(getHomeSeo())
</script>

<template>
  <div class="home-page">
    <HomeHeroSection />
    <HomeServiceHighlightsSection />
    <HomeShowsSection :tiles="showTiles" />
    <HomeWorkshopsSection :tiles="workshopTiles" />
    <HomeStepsSection />
    <HomeAboutSection />
    <HomeShortsSection />
    <HomeGallerySection />
    <HomeFaqSection />
    <HomeContactSection />
    <Reviews2GIS />
  </div>
</template>
