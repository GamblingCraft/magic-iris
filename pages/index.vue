<script setup lang="ts">
import { homeHeroSlides } from '~/data/home-slider'
import { getHomeSeo } from '~/data/site-seo'
import type { HomeCatalogPayload } from '~/types/public-catalog'
import type { HomeContent } from '~/data/home-content'
import type { CatalogPagesContent } from '~/data/catalog-pages'

const { data: homeCatalog } = await useFetch<HomeCatalogPayload>('/api/site/home-catalog', {
  key: 'site-home-catalog'
})

const { data: homeContent } = await useFetch<HomeContent>('/api/site/home-content', {
  key: 'site-home-content'
})

const { data: catalogPages } = await useFetch<CatalogPagesContent>('/api/site/catalog-pages', {
  key: 'site-catalog-pages-home'
})

const showTiles = computed(() => homeCatalog.value?.showTiles || [])
const workshopTiles = computed(() => homeCatalog.value?.workshopTiles || [])
const scenarioContent = computed(() => homeContent.value?.scenario || null)
const shortsContent = computed(() => homeContent.value?.shorts || null)
const masterClassesShortsContent = computed(() => catalogPages.value?.masterClasses?.shorts || null)
const faqContent = computed(() => homeContent.value?.faq || null)
const aboutContent = computed(() => homeContent.value?.about || null)
const heroOgImage = computed(() => homeHeroSlides[0]?.image || '/images/hero.webp')

usePageSeo(
  computed(() => ({
    ...getHomeSeo(),
    image: heroOgImage.value
  }))
)

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
    <LazyHomeServiceHighlightsSection :content="scenarioContent" hydrate-on-visible />
    <LazyHomeShowsSection :tiles="showTiles" hydrate-on-visible />
    <LazyHomeWorkshopsSection :tiles="workshopTiles" hydrate-on-visible />

    <LazyHomeStepsSection hydrate-on-visible />
    <LazyHomeAboutSection :content="aboutContent" hydrate-on-visible />

    <LazyHomeShortsSection :content="shortsContent" hydrate-on-visible />
    <LazyHomeShortsSection v-if="masterClassesShortsContent" :content="masterClassesShortsContent" hydrate-on-visible />
    <LazyHomeGallerySection hydrate-on-visible />
    <LazyHomeFaqSection :content="faqContent" hydrate-on-visible />
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
