<script setup lang="ts">
import { getHomeSeo } from '~/data/site-seo'
import { contactInfo } from '~/data/site'
import type { HomeCatalogPayload } from '~/types/public-catalog'

defineRouteRules({
  prerender: true,
  swr: 3600
})

const { data: homeCatalog } = await useFetch<HomeCatalogPayload>('/api/site/home-catalog', {
  key: 'site-home-catalog'
})

const showTiles = computed(() => (homeCatalog.value?.showTiles || []).slice(0, 4))
const workshopTiles = computed(() => (homeCatalog.value?.workshopTiles || []).slice(0, 4))

usePageSeo(getHomeSeo())
</script>

<template>
  <div class="home-safe-page">
    <section class="home-safe-hero">
      <div class="container home-safe-hero__inner">
        <p class="eyebrow">Творческая студия в Иркутске</p>
        <h1 class="home-safe-hero__title">
          Шоу и мастер-классы для событий,
          <span>которые запоминаются</span>
        </h1>
        <p class="home-safe-hero__lead">
          Подбираем формат под свадьбу, день рождения, корпоратив и камерный праздник:
          песочное шоу, световое шоу, шоу-портреты и выездные мастер-классы.
        </p>

        <div class="home-safe-hero__actions">
          <a
            class="button button--accent btn"
            :href="contactInfo.max || contactInfo.whatsapp"
            target="_blank"
            rel="noreferrer"
          >
            Обсудить событие
          </a>

          <NuxtLink class="button button--ghost btn" to="/shows">
            Смотреть шоу
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section section--light home-safe-section">
      <div class="container">
        <div class="home-safe-head">
          <div>
            <p class="eyebrow">Шоу</p>
            <h2>Популярные шоу-программы</h2>
          </div>
          <p>Быстрый выбор форматов для главного момента праздника.</p>
        </div>

        <div class="home-safe-grid">
          <NuxtLink
            v-for="tile in showTiles"
            :key="tile.id"
            :to="tile.href"
            class="home-safe-card"
          >
            <div class="home-safe-card__media" :style="{ backgroundImage: `url(${tile.image})` }" />
            <div class="home-safe-card__body">
              <h3>{{ tile.title }}</h3>
              <p>{{ tile.description }}</p>
              <span>Открыть</span>
            </div>
          </NuxtLink>
        </div>

        <div class="home-safe-more">
          <NuxtLink class="button button--ghost btn" to="/shows">
            Все шоу
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section home-safe-section">
      <div class="container">
        <div class="home-safe-head">
          <div>
            <p class="eyebrow">Мастер-классы</p>
            <h2>Форматы для взрослых и детей</h2>
          </div>
          <p>Подборка творческих программ, которые легко адаптировать под площадку и гостей.</p>
        </div>

        <div class="home-safe-grid">
          <NuxtLink
            v-for="tile in workshopTiles"
            :key="tile.id"
            :to="tile.href"
            class="home-safe-card"
          >
            <div class="home-safe-card__media" :style="{ backgroundImage: `url(${tile.image})` }" />
            <div class="home-safe-card__body">
              <h3>{{ tile.title }}</h3>
              <p>{{ tile.description }}</p>
              <span>Открыть</span>
            </div>
          </NuxtLink>
        </div>

        <div class="home-safe-more">
          <NuxtLink class="button button--ghost btn" to="/master-classes">
            Все мастер-классы
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section section--light home-safe-cta">
      <div class="container home-safe-cta__inner">
        <div>
          <p class="eyebrow">Контакты</p>
          <h2>Давайте соберём формат под ваше событие</h2>
          <p>
            Напишите нам в MAX, WhatsApp или Telegram — обсудим площадку, гостей,
            тайминг и предложим подходящее решение.
          </p>
        </div>

        <div class="home-safe-cta__actions">
          <a
            class="button button--accent btn"
            :href="contactInfo.max || contactInfo.whatsapp"
            target="_blank"
            rel="noreferrer"
          >
            Написать в MAX
          </a>

          <a
            class="button button--ghost btn"
            :href="contactInfo.telegram"
            target="_blank"
            rel="noreferrer"
          >
            Telegram
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-safe-page {
  background: linear-gradient(180deg, #fff 0%, #f7f7fb 100%);
}

.home-safe-hero {
  padding: clamp(132px, 16vw, 188px) 0 clamp(64px, 8vw, 96px);
  background:
    radial-gradient(circle at top left, rgba(242, 236, 255, 0.95), transparent 40%),
    linear-gradient(180deg, #fff 0%, #f7f7fb 100%);
}

.home-safe-hero__inner {
  display: grid;
  gap: 24px;
  max-width: 980px;
}

.home-safe-hero__title {
  margin: 0;
  color: #171327;
  font-size: clamp(40px, 6vw, 82px);
  line-height: 0.96;
  letter-spacing: -0.06em;
}

.home-safe-hero__title span {
  color: #522f74;
}

.home-safe-hero__lead {
  max-width: 780px;
  margin: 0;
  color: rgba(23, 19, 39, 0.78);
  font-size: clamp(18px, 2vw, 24px);
  line-height: 1.6;
}

.home-safe-hero__actions,
.home-safe-cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.home-safe-section {
  padding-top: clamp(54px, 8vw, 92px);
  padding-bottom: clamp(54px, 8vw, 92px);
}

.home-safe-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
  gap: 24px;
  align-items: end;
  margin-bottom: 28px;
}

.home-safe-head h2,
.home-safe-head p {
  margin: 0;
}

.home-safe-head h2 {
  color: #171327;
  font-size: clamp(32px, 4vw, 56px);
  line-height: 0.98;
}

.home-safe-head p {
  color: rgba(23, 19, 39, 0.72);
  font-size: 17px;
  line-height: 1.6;
}

.home-safe-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.home-safe-card {
  display: grid;
  gap: 0;
  overflow: hidden;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 22px 48px rgba(18, 12, 30, 0.08);
  text-decoration: none;
  color: inherit;
}

.home-safe-card__media {
  aspect-ratio: 1.08;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.home-safe-card__body {
  display: grid;
  gap: 12px;
  padding: 20px;
}

.home-safe-card__body h3,
.home-safe-card__body p {
  margin: 0;
}

.home-safe-card__body h3 {
  color: #171327;
  font-size: 22px;
  line-height: 1.08;
}

.home-safe-card__body p {
  color: rgba(23, 19, 39, 0.7);
  font-size: 15px;
  line-height: 1.55;
}

.home-safe-card__body span {
  color: #522f74;
  font-family: var(--font-title);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.home-safe-more {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}

.home-safe-cta__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 28px;
  align-items: center;
}

.home-safe-cta__inner h2,
.home-safe-cta__inner p {
  margin: 0;
}

.home-safe-cta__inner h2 {
  margin-bottom: 12px;
  color: #171327;
  font-size: clamp(30px, 4vw, 52px);
  line-height: 1;
}

.home-safe-cta__inner p {
  max-width: 760px;
  color: rgba(23, 19, 39, 0.72);
  font-size: 17px;
  line-height: 1.65;
}

@media (max-width: 1100px) {
  .home-safe-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .home-safe-head,
  .home-safe-cta__inner {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 680px) {
  .home-safe-hero {
    padding-top: 124px;
  }

  .home-safe-grid {
    grid-template-columns: 1fr;
  }

  .home-safe-card {
    border-radius: 22px;
  }

  .home-safe-card__body {
    padding: 18px;
  }
}
</style>
