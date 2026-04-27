<script setup lang="ts">
import { getHomeSeo } from '~/data/site-seo'

usePageSeo(getHomeSeo())
</script>

<template>
  <div class="home-page">
    <HomeHeroSection />
    <HomeServiceHighlightsSection />
    <HomeShowsSection />
    <HomeWorkshopsSection />
    <HomeStepsSection />
    <HomeAboutSection />
    <HomeShortsSection />
    <HomeGallerySection />
    <HomeFaqSection />
    <HomeContactSection />
  </div>
</template>
