<script setup lang="ts">
import { getShowsIndexSeo } from '~/data/site-seo'
import type { ShowsIndexPayload } from '~/types/public-catalog'

const { data: showsPayload } = await useFetch<ShowsIndexPayload>('/api/site/shows', {
  key: 'site-shows-index'
})

const showCards = computed(() => showsPayload.value?.cards || [])
const heroImage = computed(() => showsPayload.value?.heroImage || '')
const showsCount = computed(() => showCards.value.length)

const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Шоу' }
]

usePageSeo(getShowsIndexSeo())
</script>

<template>
  <div class="catalog-shell">
    <section class="section catalog-shell__section catalog-shell__section--hero">
      <div class="container">
        <CatalogBreadcrumbs :items="breadcrumbs" />

        <CatalogHeroPanel
          eyebrow="Шоу"
          title="Сценические форматы, где эмоция, свет и сильный первый кадр решают всё"
          lead="Подберём программу под свадьбу, день рождения, корпоратив или городское событие. Соберём подачу так, чтобы она смотрелась цельно, дорого и запоминалась."
          description="Песочная анимация, световые номера, шоу-портреты и крутящийся портрет — для тех, кто хочет удивить гостей и оставить яркое впечатление."
          :image="heroImage"
          :facts="[
            { label: 'Форматов', value: `${showsCount}` },
            { label: 'Сценарий', value: 'под ваше событие' },
            { label: 'Выезд', value: 'по Иркутску и области' }
          ]"
          :tags="['свадьба', 'день рождения', 'корпоратив', 'городское событие']"
          :actions="[
            { label: 'Оставить заявку', href: '/#contacts' },
            { label: 'Посмотреть мастер-классы', href: '/master-classes', kind: 'ghost' }
          ]"
        />
      </div>
    </section>

    <section class="section catalog-shell__section">
      <div class="container">
        <CatalogCardsSection
          eyebrow="Каталог шоу"
          title="Выберите программу под ваш праздник"
          description="Фото, короткое описание, ориентир по стоимости и страница с деталями — всё понятно, без лишнего."
          :columns="2"
          :items="showCards"
        />
      </div>
    </section>
  </div>
</template>