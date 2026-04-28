<script setup lang="ts">
import { turnkeyLandingPage } from '~/data/landing-pages'

usePageSeo(turnkeyLandingPage.seo)
</script>

<template>
  <LandingPageTemplate :content="turnkeyLandingPage" />
</template>
