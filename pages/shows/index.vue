<script setup lang="ts">
import { createShowHref, shows } from '~/data/catalog'

const showCards = computed(() =>
  shows.map((program) => ({
    id: program.id,
    href: createShowHref(program.slug),
    image: program.image,
    imageAlt: program.title,
    kicker: program.kicker,
    title: program.title,
    description: program.description,
    metaPrimary: program.pricing[0]?.value ?? 'По запросу',
    metaLabel: 'Стоимость',
    metaSecondary: 'Открыть шоу',
    buttonLabel: 'Открыть шоу',
    priceValue: program.pricing[0]?.value,
    productMicrodata: true
  }))
)

const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Шоу' }
]

useSeoMeta({
  title: 'Шоу',
  description: 'Каталог песочного шоу, светового шоу, шоу-портретов и визуальных форматов Magic Iris.'
})
</script>

<template>
  <div class="catalog-shell">
    <section class="section catalog-shell__section catalog-shell__section--hero">
      <div class="container">
        <CatalogBreadcrumbs :items="breadcrumbs" />

        <CatalogHeroPanel
          eyebrow="Шоу"
          title="Сценические форматы для событий, где важны эмоция, свет и сильный первый кадр"
          lead="Подберём программу под свадьбу, день рождения, корпоратив или городское событие и соберём подачу так, чтобы она смотрелась цельно и дорого."
          description="В каталоге собраны все шоу-форматы Magic Iris: песочное шоу, световой номер, шоу-портреты и крутящийся портрет. У каждого формата есть отдельная страница со стоимостью, фото и структурой подачи."
          :image="shows[1]?.heroImage || shows[0]?.heroImage"
          :facts="[
            { label: 'Форматы', value: `${shows.length}` },
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
          title="Выберите программу под формат вашего события"
          description="Собрали карточки в более понятный формат: фото, краткое описание, стартовая стоимость и быстрый переход на детальную страницу шоу."
          :columns="2"
          :items="showCards"
        />
      </div>
    </section>
  </div>
</template>
