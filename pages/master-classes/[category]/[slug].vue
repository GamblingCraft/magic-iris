<script setup lang="ts">
import { computed } from 'vue'
import { getWorkshopSeo } from '~/data/site-seo'
import type { CatalogImage } from '~/data/catalog'
import type { WorkshopDetailPayload } from '~/types/public-catalog'
import { formatDisplayPrice } from '~/utils/format-price'

const route = useRoute()
const categorySlug = String(route.params.category)
const workshopSlug = String(route.params.slug)

const { data: workshopPayload } = await useFetch<WorkshopDetailPayload>(
  `/api/site/workshops/${categorySlug}/${workshopSlug}`,
  {
    key: `site-workshop-${categorySlug}-${workshopSlug}`
  }
)

const currentCategory = computed(() => workshopPayload.value?.category || null)
const currentWorkshop = computed(() => workshopPayload.value?.workshop || null)
const relatedWorkshops = computed(() => workshopPayload.value?.relatedCards || [])
const legacyLayout = computed(() => currentWorkshop.value?.legacyLayout || null)

const formatLegacyMultiline = (value: string) =>
  (value || '')
    .replace(/\s+(?=Стоимость:)/g, '\n')
    .replace(/\s+(?=Продолжительность)/g, '\n')
    .replace(/\s+(?=Время создания)/g, '\n')
    .replace(/\s+(?=Время изготовления)/g, '\n')
    .replace(/\s+(?=Пропускная способность)/g, '\n')
    .replace(/\s+(?=Общее количество участников)/g, '\n')
    .replace(/\s+(?=Идеально для)/g, '\n')
    .replace(/\s+(?=Формат подходит)/g, '\n')
    .replace(/\s+(?=Возможно изготовление)/g, '\n')
    .replace(/\s+(?=Формы на выбор:)/g, '\n')
    .replace(/\s+(?=Результат:)/g, '\n')
    .replace(/\s+(?=В результате)/g, '\n')
    .replace(/\s+(?=30 человек)/g, '\n')
    .replace(/\s+(?=50 человек)/g, '\n')
    .replace(/\s+(?=100 человек)/g, '\n')
    .replace(/\s+(?=Создание )/g, '\n')
    .replace(/\s+(?=Выбор )/g, '\n')
    .replace(/\s+(?=Работа с )/g, '\n')
    .replace(/\s+(?=Декор)/g, '\n')
    .replace(/\s+(?=Украшение )/g, '\n')
    .replace(/\s+(?=Крепление )/g, '\n')
    .replace(/\s+(?=Упаковка )/g, '\n')
    .replace(/\s+(?=Финальный этап)/g, '\n')
    .trim()

const toLegacyListItems = (value?: string) =>
  formatLegacyMultiline(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

const toProcessListItems = (value?: string) => {
  const source = (value || '').trim()

  if (!source) {
    return []
  }

  const normalized = formatLegacyMultiline(source)

  // For old Tilda blocks where list items were flattened into one line,
  // split by typical process-step starters.
  const withStepBreaks = normalized.replace(
    /\s+(?=(Обзор|Сборка|Работа|Подбор|Оформление|Знакомство|Готовые|Тематика|Пошаговое|Создание|Выбор|Декор|Результат|В результате|Финальный этап|Крепление|Упаковка|Роспись|Лепка|Плетение|Изготовление)\b)/g,
    '\n'
  )

  const primaryItems = withStepBreaks
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

  if (primaryItems.length >= 3) {
    return primaryItems
  }

  // Fallback: some legacy lines were flattened without delimiters.
  // Split by capitalized phrase starters for process lists only.
  const capsSplit = withStepBreaks
    .replace(/\s+(?=[А-ЯЁ][а-яё]{2,}(?:\s+[а-яё]{2,}){0,6})/g, '\n')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

  return capsSplit.length > primaryItems.length ? capsSplit : primaryItems
}

const parseCurrencyAmounts = (value?: string) =>
  (formatDisplayPrice(value) || '')
    .match(/\d[\d\s]{0,14}(?=\s*(?:₽|руб\.?))/giu)
    ?.map((match) => Number.parseInt(match.replace(/\s+/g, ''), 10))
    .filter((amount) => Number.isFinite(amount) && amount >= 1000) || []

const formatCurrencyAmount = (amount: number) =>
  amount.toLocaleString('ru-RU').replace(/ /g, ' ')

const extractHeroPrice = (value?: string, sources: string[] = []) => {
  const amounts = [
    ...parseCurrencyAmounts(value),
    ...sources.flatMap((source) => parseCurrencyAmounts(source))
  ]

  if (amounts.length) {
    const minAmount = Math.min(...amounts)
    return `от ${formatCurrencyAmount(minAmount)} ₽`
  }

  return formatDisplayPrice(value || '')
}

const heroPrice = computed(() => {
  const sources = [
    legacyLayout.value?.whatPrice || '',
    ...(legacyLayout.value?.formatCards || []).flatMap((card) => [card.details || '', card.price || ''])
  ]

  return extractHeroPrice(currentWorkshop.value?.priceFrom, sources)
})

const breadcrumbs = computed(() => [
  { label: 'Главная', href: '/' },
  { label: 'Мастер-классы', href: '/master-classes' },
  { label: currentCategory.value?.title || 'Подборка', href: `/master-classes/${categorySlug}` },
  { label: currentWorkshop.value?.title || 'Мастер-класс' }
])

if (!currentCategory.value || !currentWorkshop.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Мастер-класс не найден'
  })
}

const experienceImages = computed<CatalogImage[]>(() => {
  const title = currentWorkshop.value?.title || 'Мастер-класс'
  const legacyImages = (legacyLayout.value?.whatImages || [])
    .filter(Boolean)
    .map((src, index) => ({
      id: `legacy-${index + 1}`,
      src,
      alt: `${title} — фото ${index + 1}`
    }))

  if (legacyImages.length) {
    return legacyImages
  }

  return (currentWorkshop.value?.gallery || []).slice(0, 5)
})

const galleryItems = computed<CatalogImage[]>(() =>
  experienceImages.value.length ? experienceImages.value : (currentWorkshop.value?.gallery || [])
)

const formatCards = computed(() =>
  (legacyLayout.value?.formatCards || []).filter(
    (card) => card.title || card.details || card.price
  )
)

const heroLead = computed(() =>
  legacyLayout.value?.whatIntro?.trim() || currentWorkshop.value?.summary || ''
)

const workshopProcessItems = computed(() =>
  toProcessListItems(legacyLayout.value?.whatProcess || '')
)

usePageSeo(
  computed(() => ({
    ...getWorkshopSeo(currentWorkshop.value!, currentCategory.value),
    image: currentWorkshop.value?.image || '/images/hero.webp'
  }))
)
</script>

<template>
  <div class="catalog-shell catalog-shell--detail">
    <section class="section catalog-shell__section catalog-shell__section--hero">
      <div class="container">
        <CatalogBreadcrumbs :items="breadcrumbs" />

        <CatalogHeroPanel
          :eyebrow="currentCategory?.title || 'Мастер-класс'"
          :title="currentWorkshop?.title || ''"
          :lead="heroLead"
          :image="currentWorkshop?.image || ''"
          :product="currentWorkshop ? {
            sku: currentWorkshop.id,
            category: currentCategory?.title || 'Мастер-класс',
            description: heroLead,
            price: heroPrice,
            url: route.fullPath
          } : undefined"
          :tags="[currentWorkshop?.audienceLabel || '', currentCategory?.title || ''].filter(Boolean)"
          :facts="[
            { label: 'Длительность', value: currentWorkshop?.duration || '' },
            { label: 'Участников', value: currentWorkshop?.participants || '' },
            { label: 'Стоимость', value: heroPrice }
          ]"
          :actions="[
            { label: 'Оставить заявку', href: '/#contacts' },
            { label: 'Назад к подборке', href: `/master-classes/${categorySlug}`, kind: 'ghost' }
          ]"
        />
      </div>
    </section>

    <section v-if="workshopProcessItems.length" class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <div class="catalog-section-head">
          <div>
            <p class="eyebrow">Как проходит</p>
            <h2>{{ legacyLayout?.whatTitle || 'Что будет на мастер-классе?' }}</h2>
          </div>
        </div>

        <article class="catalog-panel workshop-detail-panel">
          <ul class="workshop-detail-panel__list">
            <li v-for="item in workshopProcessItems" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>

    <section v-if="formatCards.length" class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <div class="catalog-section-head">
          <div>
            <p class="eyebrow">Стоимость и условия</p>
            <h2>{{ legacyLayout?.formatsTitle || 'ФОРМАТЫ ПРОВЕДЕНИЯ' }}</h2>
          </div>
        </div>

        <div class="workshop-detail-format-grid">
          <article v-for="card in formatCards" :key="card.title + card.price" class="catalog-panel workshop-format-card">
            <p class="workshop-format-card__title">{{ card.title.replace(' ФОРМАТ', '') }}</p>
            <ul v-if="toLegacyListItems(card.details).length" class="workshop-format-card__list">
              <li v-for="item in toLegacyListItems(card.details)" :key="item">{{ item }}</li>
            </ul>
            <ul v-if="toLegacyListItems(card.price).length" class="workshop-format-card__list workshop-format-card__list--price">
              <li v-for="item in toLegacyListItems(card.price)" :key="item">{{ item }}</li>
            </ul>
            <NuxtLink class="button button--accent btn workshop-format-card__button" to="/#contacts">
              ЗАКАЗАТЬ МАСТЕР-КЛАСС
            </NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <section v-if="galleryItems.length" class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <div class="catalog-section-head">
          <div>
            <p class="eyebrow">Фото</p>
            <h2>Как мастер-класс выглядит на площадке</h2>
          </div>
        </div>

        <CatalogGallerySection :items="galleryItems" />
      </div>
    </section>

    <section v-if="relatedWorkshops.length" class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <CatalogCarouselSection
          eyebrow="Вам может понравиться"
          title="Другие мастер-классы из подборки"
          description="Похожие форматы, которые легко добавить в программу события."
          :items="relatedWorkshops"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.workshop-detail-copy {
  display: grid;
  gap: 16px;
}

.workshop-detail-panel {
  height: 100%;
}

.workshop-detail-panel__text {
  margin: 0;
  white-space: pre-line;
  line-height: 1.7;
}

.workshop-detail-panel__list,
.workshop-format-card__list {
  margin: 0;
  padding-left: 1.2rem;
  color: rgba(22, 18, 40, 0.86);
  line-height: 1.7;
}

.workshop-detail-panel__list li,
.workshop-format-card__list li {
  margin-bottom: 0.55rem;
}

.workshop-detail-panel__list li:last-child,
.workshop-format-card__list li:last-child {
  margin-bottom: 0;
}

.workshop-detail-panel p:last-child {
  margin-bottom: 0;
}

.workshop-detail-format-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.workshop-format-card {
  display: grid;
  gap: 16px;
  align-content: start;
}

.workshop-format-card__title {
  margin: 0;
  color: #522f74;
  font-size: 24px;
  line-height: 1.2;
  font-weight: 600;
}

.workshop-format-card__list--price {
  font-weight: 500;
}

.workshop-format-card__button {
  width: fit-content;
  margin-top: 8px;
}

@media (max-width: 959px) {
  .workshop-detail-format-grid {
    grid-template-columns: 1fr;
  }
}
</style>



