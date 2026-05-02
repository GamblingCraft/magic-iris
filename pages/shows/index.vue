<script setup lang="ts">
import { getShowsIndexSeo } from '~/data/site-seo'
import type { ShowsIndexPayload } from '~/types/public-catalog'

const { data: showsPayload } = await useFetch<ShowsIndexPayload>('/api/site/shows', {
  key: 'site-shows-index'
})

const showCards = computed(() => showsPayload.value?.cards || [])
const heroImage = computed(() => showsPayload.value?.heroImage || '')
const showsCount = computed(() => showCards.value.length)

const openIndex = ref(0)

const toggleItem = (index: number) => {
  openIndex.value = openIndex.value === index ? -1 : index
}

const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Шоу' }
]

//* FAQ */
const faqItems = [
  {
    question: 'Что нужно для заказа шоу?',
    answer: 'Выбрать шоу, написать дату, время и место, отправить необходимую информацию (историю или фото), утвердить сценарий или макет фото, а затем — насладиться нашим выступлением на мероприятии.'
  },
  {
    question: 'Можно ли провести 2 шоу на мероприятии?',
    answer: 'Да, конечно! После песочной или световой истории сделать портрет именинника или молодожёнов, который навсегда останется у виновника торжества — прекрасная идея.'
  },
  {
    question: 'Можно ли провести шоу на улице?',
    answer: 'Да, при хороших погодных условиях. Шоу-портреты можно провести без проблем. Для песочного шоу нужен доступ к розетке и тёмное время суток. Для светового шоу требуется полная темнота и отсутствие вблизи фонарей.'
  },
  {
    question: 'Можно ли заказать портрет без шоу?',
    answer: 'Да, набор для самостоятельного создания портрета можно отправить в любую точку мира. Всё необходимое для создания входит в набор.'
  },
  {
    question: 'Вы делаете видеоролик песочной анимации без выезда?',
    answer: 'Если вы находитесь в другом городе или стране, песочная видео-открытка может стать прекрасным подарком! В ролике можно нарисовать портрет человека песком. В записанном ролике можно более тщательно прорисовать детали, а пересматривать его в семейном кругу — одно удовольствие.'
  },
  {
    question: 'За сколько дней до мероприятия нужно сделать заказ?',
    answer: 'Срочные заказы мы принимаем и в день мероприятия. Однако для проработки деталей сценария и подготовки уникальных макетов рекомендуем обращаться за 1-2 недели.'
  },
  {
    question: 'На какой праздник можно заказать ваши шоу?',
    answer: 'Широкий выбор шоу-программ подходит для любого мероприятия: детский день рождения, юбилей, свадьба, корпоратив, Новый год, выездные мероприятия, 8 Марта, 23 февраля и т.д.'
  },
  {
    question: 'Что есть для детей?',
    answer: 'Для детей мы можем провести песочную или световую сказку на любую тему с интерактивом или мастер-классом после выступления.'
  },
  {
    question: 'Выезжаете ли вы за город?',
    answer: 'Да, мы работаем по Иркутску и его области. Стоимость выезда рассчитывается индивидуально.'
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

usePageSeo(getShowsIndexSeo())
</script>

<template>
  <div class="catalog-shell">
    <!-- HERO -->
    <section class="section catalog-shell__section catalog-shell__section--hero">
      <div class="container">
        <CatalogBreadcrumbs :items="breadcrumbs" />

        <CatalogHeroPanel
          eyebrow="Шоу"
          title="Сценические форматы, где эмоция, свет и сильный первый кадр решают всё"
          title-tag="h2"
          lead=""
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

    <!-- КАТАЛОГ ШОУ -->
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

    <!-- SEO БЛОК -->
    <section class="section catalog-shell__section catalog-shell__section--tight">
      <div class="container">
        <div class="sec-title-double catalog-text-head">
          <div>
            <h1 class="h2">Шоу на праздник в Иркутске</h1>
          </div>
          <p class="catalog-preview__lead">
            Песочное шоу, световое шоу, шоу-портреты и крутящийся портрет
          </p>
        </div>

        <div class="catalog-text-block">
          <p>Творческая студия "Magic Iris" создаёт шоу, которые дарят эмоции — а значит, остаются в сердце. Песочное шоу, световое шоу и шоу-портреты — это не просто выступления, а волшебные истории, которые оживают прямо на глазах.</p>
          
          <p>Мы работаем на мероприятиях разного уровня в Иркутске и области — от камерных свадеб до масштабных корпоративов, подстраиваясь под формат и создавая атмосферу, которую гости запомнят надолго. Рисуем любовь, воспоминания и мечты, превращая их в яркий и трогательный момент.</p>
          
          <p>Наши шоу — это незабываемый подарок, который удивит гостей и станет настоящим украшением любого события. Потому что лучший подарок — это эмоции, которые хочется переживать снова и снова.</p>
          
          <p>В команде студии — опытные художники и постановщики. Мы предлагаем несколько форматов: песочная анимация под живую музыку или фонограмму, световое шоу в полной темноте, создание портрета на глазах у зрителей, а также эффектный крутящийся портрет на большом холсте. Каждое выступление создаётся с учётом вашего сценария и пожеланий.</p>
        </div>
      </div>
    </section>

    <!-- FAQ БЛОК -->
    <section class="section faq-section">
      <div class="container">
        <p class="eyebrow">FAQ</p>

        <div class="sec-title-double faq-section__head">
          <div>
            <h2 class="h2">Частые <span style="color: #f7d176;">вопросы</span></h2>
          </div>
          <p class="catalog-preview__lead">
            Ответы по организации шоу на мероприятии
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