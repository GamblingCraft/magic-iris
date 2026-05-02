<script setup lang="ts">
import { getHomeSeo } from '~/data/site-seo'
import type { HomeCatalogPayload } from '~/types/public-catalog'

const { data: homeCatalog } = await useFetch<HomeCatalogPayload>('/api/site/home-catalog', {
  key: 'site-home-catalog'
})

const showTiles = computed(() => homeCatalog.value?.showTiles || [])
const workshopTiles = computed(() => homeCatalog.value?.workshopTiles || [])

usePageSeo(getHomeSeo())

// Ref для попапа
const quizPopupRef = ref(null)

const openQuiz = () => {
  quizPopupRef.value?.openPopup()
}
</script>

<template>
  <div class="home-page">
    <HomeHeroSection />
    <HomeServiceHighlightsSection />
    <HomeShowsSection :tiles="showTiles" />
    <HomeWorkshopsSection :tiles="workshopTiles" />

    <!-- Ленивые компоненты -->
    <LazyHomeStepsSection />
    <LazyHomeAboutSection />
    <LazyHomeShortsSection />
    <LazyHomeGallerySection />
    <LazyHomeFaqSection />
    <LazyHomeContactSection />

    <!-- Отзывы -->
    <ClientOnly>
      <LazyReviews2GIS />
    </ClientOnly>

    <!-- Кнопка подарок (только иконка) -->
    <button class="gift-button" @click="openQuiz">
      <Icon name="lucide:gift" size="32" />
    </button>

    <!-- Попап -->
    <ClientOnly>
      <LazyQuizPopup ref="quizPopupRef" :auto-open="false" />
    </ClientOnly>
  </div>
</template>

<style scoped>
.gift-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 68px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f7d176, #e0b55f);
  color: #1c1628;
  border: none;
  border-radius: 50%;
  box-shadow: 0 12px 35px rgba(247, 209, 118, 0.45);
  z-index: 150;
  transition: all 0.3s ease;
  cursor: pointer;
}

.gift-button:hover {
  transform: scale(1.15) rotate(15deg);
  box-shadow: 0 20px 45px rgba(247, 209, 118, 0.55);
}
</style>