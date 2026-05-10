<script setup lang="ts">
import { getHomeSeo } from '~/data/site-seo'
import type { HomeCatalogPayload } from '~/types/public-catalog'

const { data: homeCatalog } = await useFetch<HomeCatalogPayload>('/api/site/home-catalog', {
  key: 'site-home-catalog'
})

const showTiles = computed(() => homeCatalog.value?.showTiles || [])
const workshopTiles = computed(() => homeCatalog.value?.workshopTiles || [])

usePageSeo(getHomeSeo())

const quizPopupRef = ref<InstanceType<typeof QuizPopup> | null>(null)
const isQuizMounted = ref(false)
const QuizPopup = defineAsyncComponent(() => import('~/components/popup/QuizPopup.vue'))

const openQuiz = async () => {
  if (!isQuizMounted.value) {
    isQuizMounted.value = true
  }

  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 100))

  if (quizPopupRef.value && typeof quizPopupRef.value.openPopup === 'function') {
    quizPopupRef.value.openPopup()
    return
  }

  setTimeout(() => {
    if (quizPopupRef.value && typeof quizPopupRef.value.openPopup === 'function') {
      quizPopupRef.value.openPopup()
    }
  }, 500)
}

onMounted(() => {
  isQuizMounted.value = true
})
</script>

<template>
  <div class="home-page">
    <HomeHeroSection />
    <LazyHomeServiceHighlightsSection hydrate-on-visible />
    <LazyHomeShowsSection :tiles="showTiles" hydrate-on-visible />
    <LazyHomeWorkshopsSection :tiles="workshopTiles" hydrate-on-visible />

    <LazyHomeStepsSection hydrate-on-visible />
    <LazyHomeAboutSection hydrate-on-visible />

    <LazyHomeShortsSection hydrate-on-visible />
    <LazyHomeGallerySection hydrate-on-visible />
    <LazyHomeFaqSection hydrate-on-visible />
    <LazyHomeContactSection hydrate-on-visible />
    <ClientOnly>
      <LazyReviews2GIS hydrate-on-visible />
    </ClientOnly>
    <ClientOnly>
    <button class="gift-button" @click="openQuiz">
      <Icon name="lucide:gift" size="32" />
    </button>

    <QuizPopup
      v-if="isQuizMounted"
      ref="quizPopupRef"
      :auto-open="false"
    />
    </ClientOnly>

  </div>
</template>
