<script setup lang="ts">
import { corporateLandingPage } from '~/data/landing-pages'

usePageSeo(corporateLandingPage.seo)
</script>

<template>
  <LandingPageTemplate :content="corporateLandingPage" />
</template>
