<script setup lang="ts">
import { getHomeSeo } from '~/data/site-seo'
import type { HomeCatalogPayload } from '~/types/public-catalog'

const { data: homeCatalog } = await useFetch<HomeCatalogPayload>('/api/site/home-catalog', {
  key: 'site-home-catalog'
})

const showTiles = computed(() => homeCatalog.value?.showTiles || [])
const workshopTiles = computed(() => homeCatalog.value?.workshopTiles || [])

usePageSeo(getHomeSeo())

// Убираем ClientOnly и используем обычный импорт
const quizPopupRef = ref<InstanceType<typeof QuizPopup> | null>(null)

// Импортируем компонент напрямую (не лениво)
const QuizPopup = defineAsyncComponent(() => import('~/components/popup/QuizPopup.vue'))

const openQuiz = async () => {
  console.log('Opening quiz...')
  
  // Даём время на полную инициализацию компонента
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 100))
  
  if (quizPopupRef.value && typeof quizPopupRef.value.openPopup === 'function') {
    quizPopupRef.value.openPopup()
    console.log('Quiz popup opened successfully')
  } else {
    console.error('Quiz popup method not available', quizPopupRef.value)
    // Повторная попытка через 500ms
    setTimeout(() => {
      if (quizPopupRef.value && typeof quizPopupRef.value.openPopup === 'function') {
        quizPopupRef.value.openPopup()
        console.log('Quiz popup opened successfully on retry')
      }
    }, 500)
  }
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

    <!-- Кнопка подарок -->
    <button class="gift-button" @click="openQuiz">
      <Icon name="lucide:gift" size="32" />
    </button>

    <!-- Убираем ClientOnly и v-if -->
    <QuizPopup ref="quizPopupRef" :auto-open="false" />
  </div>
</template>