<script setup lang="ts">
import { contactInfo } from '~/data/site'

usePageSeo({
  title: 'Контакты | Magic Iris',
  description:
    'Контакты творческой студии Magic Iris в Иркутске: адрес, режим работы, телефон и удобные способы связаться по вашему событию.'
})

const contactCards = [
  {
    title: 'Телефон',
    value: '+7 950 052-48-92',
    href: 'tel:+79500524892'
  },
  {
    title: 'Адрес',
    value: 'Иркутск, улица Дзержинского, 8а',
    href: 'https://yandex.ru/maps/?text=%D0%98%D1%80%D0%BA%D1%83%D1%82%D1%81%D0%BA%2C%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%94%D0%B7%D0%B5%D1%80%D0%B6%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%B3%D0%BE%2C%208%D0%B0'
  },
  {
    title: 'Режим работы',
    value: 'Ежедневно с 08:00 до 23:00 по предварительной записи',
    href: null
  }
]

const yandexMapSrc =
  'https://yandex.ru/map-widget/v1/?text=%D0%98%D1%80%D0%BA%D1%83%D1%82%D1%81%D0%BA%2C%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%94%D0%B7%D0%B5%D1%80%D0%B6%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%B3%D0%BE%2C%208%D0%B0&z=17'
</script>

<template>
  <main class="contacts-page">
    <section class="section contacts-page__hero-wrap">
      <div class="container">
        <nav class="catalog-breadcrumbs" aria-label="Хлебные крошки">
          <NuxtLink to="/" class="catalog-breadcrumbs__link">Главная</NuxtLink>
          <span class="catalog-breadcrumbs__sep">/</span>
          <span class="catalog-breadcrumbs__current">Контакты</span>
        </nav>

        <div class="contacts-page__hero">
          <div class="contacts-page__hero-copy">
            <p class="eyebrow">Контакты</p>
            <h1>Приезжайте, звоните или напишите нам по вашему событию</h1>
            <p class="contacts-page__lead">
              Подскажем по формату шоу, мастер-классам, таймингу и организации площадки. Можно
              быстро обсудить задачу в мессенджере или договориться о встрече по предварительной
              записи.
            </p>

            <div class="contacts-page__actions">
              <a :href="contactInfo.telegram" class="button button--accent" target="_blank" rel="noreferrer">
                Telegram
              </a>
              <a :href="contactInfo.max || contactInfo.whatsapp" class="button button--ghost" target="_blank" rel="noreferrer">
                MAX
              </a>
            </div>
          </div>

          <div class="contacts-page__hero-cards">
            <component
              :is="item.href ? 'a' : 'div'"
              v-for="item in contactCards"
              :key="item.title"
              class="contacts-page__contact-card"
              :href="item.href || undefined"
              :target="item.href?.startsWith('http') ? '_blank' : undefined"
              :rel="item.href?.startsWith('http') ? 'noreferrer' : undefined"
            >
              <span>{{ item.title }}</span>
              <strong>{{ item.value }}</strong>
            </component>
          </div>
        </div>
      </div>
    </section>

    <section class="section contacts-page__map-section">
      <div class="container">
          <div class="contacts-page__map-frame">
            <iframe
              :src="yandexMapSrc"
              title="Карта Magic Iris"
              loading="lazy"
              allowfullscreen
            />
      </div>
            </div>
    </section>
  </main>
</template>
