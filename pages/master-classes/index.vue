<script setup lang="ts">
import { getMasterClassesIndexSeo } from '~/data/site-seo'
import type { MasterClassesIndexPayload } from '~/types/public-catalog'

const { data: masterClassesPayload } = await useFetch<MasterClassesIndexPayload>(
  '/api/site/master-classes',
  {
    key: 'site-master-classes-index'
  }
)

const categoryPreviews = computed(() => masterClassesPayload.value?.categories || [])
const workshopPreviews = computed(() => masterClassesPayload.value?.workshops || [])
const heroImage = computed(() => masterClassesPayload.value?.heroImage || '')

const selectedTag = ref('all')
const openIndex = ref(0)

const toggleItem = (index: number) => {
  openIndex.value = openIndex.value === index ? -1 : index
}

const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Мастер-классы' }
]

const filterTags = computed(() => [
  { slug: 'all', title: 'Все мастер-классы' },
  ...categoryPreviews.value.map((category) => ({
    slug: category.slug,
    title: category.title
  }))
])

const categoryCards = computed(() =>
  categoryPreviews.value.map((category) => category.card)
)

const uniqueById = <T extends { id: string }>(items: T[]) => {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

const filteredWorkshopItems = computed(() => {
  if (selectedTag.value === 'all') return workshopPreviews.value
  return workshopPreviews.value.filter((workshop) =>
    workshop.categorySlugs.includes(selectedTag.value)
  )
})

const filteredWorkshopCards = computed(() =>
  filteredWorkshopItems.value.slice(0, 8).map((w) => w.card)
)

const popularWorkshopCards = computed(() => {
  const popular = [
    ...workshopPreviews.value.filter((w) => w.categorySlugs.length >= 4),
    ...workshopPreviews.value.filter((w) => w.categorySlugs.includes('v-shkolu')),
    ...workshopPreviews.value
  ]
  return uniqueById(popular).slice(0, 8).map((w) => w.card)
})

const recommendedWorkshopCards = computed(() => {
  const recommended = [
    ...workshopPreviews.value.filter((w) => w.categorySlugs.includes('dlya-zhenshchin')),
    ...workshopPreviews.value.filter((w) => w.categorySlugs.includes('letnie')),
    ...workshopPreviews.value.filter((w) => w.categorySlugs.includes('novogodnie')),
    ...workshopPreviews.value
  ]
  return uniqueById(recommended).slice(0, 8).map((w) => w.card)
})

const activeCategory = computed(() =>
  categoryPreviews.value.find((c) => c.slug === selectedTag.value)
)

const activeTagTitle = computed(() =>
  selectedTag.value === 'all'
    ? 'Все мастер-классы'
    : activeCategory.value?.title ?? 'Подборка'
)

const activeTagDescription = computed(() => {
  if (selectedTag.value === 'all') {
    return 'Посмотрите разные форматы и почувствуйте, какой ритм, материал и подача ближе вашему празднику.'
  }
  return (
    activeCategory.value?.lead ||
    activeCategory.value?.description ||
    'Мастер-классы для выбранного направления.'
  )
})

const activeTagHref = computed(() =>
  selectedTag.value === 'all'
    ? '/master-classes'
    : activeCategory.value?.href || '/master-classes'
)

const featuredWorkshopCards = computed(() =>
  workshopPreviews.value.slice(0, 8).map((w) => w.card)
)

//* FAQ */
const faqItems = [
  {
    question: 'Какие мастер-классы вы предлагаете?',
    answer: 'Мы проводим мастер-классы по рисованию акрилом, росписи шопперов, плетению браслетов, росписи тарелок, картинам цветным песком, росписи значков и множеству других творческих занятий. Мы можем адаптировать программу под ваши пожелания.'
  },
  {
    question: 'Для каких мероприятий подходят ваши мастер-классы?',
    answer: 'Наши мастер-классы идеальны для корпоративов, свадеб, дней рождения, юбилеев, детских праздников и других мероприятий. Мы подбираем программу, которая будет соответствовать формату вашего события.'
  },
  {
    question: 'Сколько человек могут участвовать в мастер-классе?',
    answer: 'Мы можем организовать мастер-класс для любых групп. Программу подбираем в зависимости от количества участников и особенностей мероприятия.'
  },
  {
    question: 'Как выбрать программу для моего мероприятия?',
    answer: 'Вы можете выбрать одну из наших стандартных программ, или мы можем подготовить индивидуальную программу, учитывая особенности вашего мероприятия и предпочтения участников.'
  },
  {
    question: 'Что включено в стоимость мастер-класса?',
    answer: 'В стоимость входят все материалы, инструменты и необходимые расходные материалы для творчества, а также услуги опытного ведущего мастер-класса.'
  },
  {
    question: 'Нужно ли мне приносить какие-то материалы?',
    answer: 'Нет, все материалы для мастер-класса предоставляем мы. Вам нужно только прийти с хорошим настроением!'
  },
  {
    question: 'Как я могу забронировать мастер-класс?',
    answer: 'Для бронирования достаточно оставить заявку на сайте или позвонить нам. Мы обсудим детали, выберем удобное время и программу.'
  },
  {
    question: 'Можно ли провести мастер-класс на открытом воздухе?',
    answer: 'Да, мы можем организовать мастер-классы на открытых площадках, таких как парки, пляжи или загородные локации, если позволяет погода.'
  },
  {
    question: 'Вы проводите мастер-классы на детских праздниках?',
    answer: 'Да, мы проводим увлекательные мастер-классы для детей. Программы адаптированы для разных возрастных групп, и все материалы безопасны для малышей.'
  },
  {
    question: 'Какая длительность мастер-классов?',
    answer: 'Обычно мастер-классы длятся от 1 до 2 часов, но мы можем подстроиться под ваше время и организовать как короткие, так и более продолжительные занятия.'
  },
  {
    question: 'Я никогда не рисовал(а), смогу ли я справиться?',
    answer: 'Конечно! Наши мастер-классы подходят как для новичков, так и для опытных участников. Мы всегда поддерживаем и подсказываем на каждом этапе, чтобы результат был успешным.'
  },
  {
    question: 'Можно ли заказать мастер-класс с индивидуальной темой?',
    answer: 'Да, мы можем подготовить мастер-класс с уникальной темой, например, рисование по мотивам вашей любимой картины или создание индивидуальных подарков.'
  }
]

/* JSON-LD FAQ */
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      })
    }
  ]
})

usePageSeo(getMasterClassesIndexSeo())
</script>

<template>
  <div class="catalog-shell">

    <!-- HERO -->
    <section class="section catalog-shell__section catalog-shell__section--hero">
      <div class="container">
        <CatalogBreadcrumbs :items="breadcrumbs" />

        <CatalogHeroPanel
          eyebrow="Мастер-классы"
          title="Выездные творческие форматы для праздников, школ, корпоративов и городских площадок"
          description="В каталоге собраны творческие мастер-классы для детей и взрослых."
          :image="heroImage"
          :actions="[
            { label: 'Оставить заявку', href: '/#contacts' },
            { label: 'Посмотреть шоу', href: '/shows', kind: 'ghost' }
          ]"
        />
      </div>
    </section>

    <!-- ПОДБОРКИ -->
    <section class="section catalog-shell__section">
      <div class="container">
        <CatalogCardsSection
          eyebrow="Подборки"
          title="Выберите направление"
          description="Подборки по аудитории и формату."
          :items="categoryCards"
        />
      </div>
    </section>

    <!-- ФИЛЬТР -->
    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <div class="catalog-filter-panel">
          <div class="catalog-cards-section__head">
            <div>
              <p class="eyebrow">Подберите формат</p>
              <h2>Мастер-классы под задачу события</h2>
            </div>
          </div>

          <div class="catalog-filter-panel__chips">
            <button
              v-for="tag in filterTags"
              :key="tag.slug"
              type="button"
              :class="['catalog-filter-chip', { 'catalog-filter-chip--active': selectedTag === tag.slug }]"
              @click="selectedTag = tag.slug"
            >
              {{ tag.title }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- КАРУСЕЛЬ -->
    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <CatalogCarouselSection
          :title="activeTagTitle"
          :description="activeTagDescription"
          :items="filteredWorkshopCards"
        />
      </div>
    </section>

    <!-- ПОПУЛЯРНЫЕ -->
    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <CatalogCarouselSection
          eyebrow="Популярные"
          title="Форматы, которые хорошо работают"
          description="Подходят для разных сценариев мероприятий."
          :items="popularWorkshopCards"
        />
      </div>
    </section>

    <!-- РЕКОМЕНДУЕМ -->
    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <CatalogCarouselSection
          eyebrow="Рекомендуем"
          title="Идеи для старта"
          description="Универсальные решения."
          :items="recommendedWorkshopCards"
        />
      </div>
    </section>

    <!-- ВСЕ -->
    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <CatalogCardsSection
          eyebrow="Все мастер-классы"
          title="Ещё форматы"
          description="Дополнительные идеи."
          :items="featuredWorkshopCards"
        />
      </div>
    </section>

   <!-- SEO -->
<section class="section catalog-shell__section catalog-shell__section--tight">
  <div class="container">

    <div class="sec-title-double catalog-text-head">
      <div>
        <h1 class="h2">Мастер-классы на мероприятия в Иркутске</h1>
      </div>
    </div>

    <div class="catalog-text-block">
      <p>Творческая студия "Magic Iris" — это организация незабываемых мастер-классов в Иркутске. Мы проводим творческие занятия для взрослых и детей на днях рождения, корпоративах, свадьбах, юбилеях и детских праздниках.</p>
      
      <p>Наши направления: рисование акрилом, роспись шопперов, плетение браслетов, роспись тарелок и значков, создание картин цветным песком и множество других творческих занятий. Мы можем адаптировать программу под ваши пожелания.</p>
      
      <p>Наши мастер-классы — это не просто занятия, а настоящее погружение в атмосферу творчества. Мы подготавливаем все необходимые материалы и помогаем на всех этапах, чтобы каждый мог создать что-то уникальное. Помогаем с выбором локации, чтобы ваше мероприятие стало максимально комфортным и запоминающимся.</p>
      
      <p>Если вы хотите творить, но у вас нет компании: мы проводим арт-вечера для всех желающих в Иркутске.</p>
    </div>

  </div>
</section>

    <!-- FAQ -->
    <section class="section faq-section">
      <div class="container">
        <p class="eyebrow">FAQ</p>

        <div class="sec-title-double faq-section__head">
          <div>
            <h2 class="h2">Частые <strong>вопросы</strong></h2>
          </div>
          <p class="catalog-preview__lead">
            Ответы по организации мастер-классов.
          </p>
        </div>

        <div class="faq-list">
          <article
            v-for="(item, index) in faqItems"
            :key="item.question"
            class="faq-item"
            :class="{ 'faq-item--open': openIndex === index }"
          >
            <button
              type="button"
              class="faq-item__button"
              @click="toggleItem(index)"
            >
              <span>{{ item.question }}</span>
              <span class="faq-item__icon">{{ openIndex === index ? '−' : '+' }}</span>
            </button>

            <div class="faq-item__content" :class="{ 'faq-item__content--open': openIndex === index }">
              <div class="faq-item__answer">
                <p>{{ item.answer }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

  </div>
</template>