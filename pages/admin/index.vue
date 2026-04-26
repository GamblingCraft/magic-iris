<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const { data: summary, pending, refresh } = await useFetch('/api/admin/summary', {
  key: 'admin-summary'
})

const cards = computed(() => [
  { label: 'Слайды', value: summary.value?.slides ?? 0 },
  { label: 'Шоу', value: summary.value?.shows ?? 0 },
  { label: 'Категории', value: summary.value?.categories ?? 0 },
  { label: 'Мастер-классы', value: summary.value?.workshops ?? 0 },
  { label: 'Фото галереи', value: summary.value?.galleryItems ?? 0 }
])
</script>

<template>
  <div class="admin-grid">
    <section class="admin-grid admin-grid--stats">
      <article v-for="card in cards" :key="card.label" class="admin-card admin-stat">
        <p class="admin-card__muted">{{ card.label }}</p>
        <div class="admin-stat__value">{{ card.value }}</div>
      </article>
    </section>

    <section class="admin-grid admin-grid--cards">
      <article class="admin-card">
        <div class="admin-card__head">
          <div>
            <h3 class="admin-card__title">Контент проекта</h3>
            <p class="admin-card__descr">
              Главный слайдер, шоу, мастер-классы и галерея теперь лежат в JSON-источниках и доступны для редактирования из админки.
            </p>
          </div>
        </div>

        <div class="admin-actions">
          <NuxtLink to="/admin/slider" class="admin-button admin-button--sand">Редактировать Hero</NuxtLink>
          <NuxtLink to="/admin/shows" class="admin-button">Управлять шоу</NuxtLink>
          <NuxtLink to="/admin/master-classes" class="admin-button">Управлять мастер-классами</NuxtLink>
          <NuxtLink to="/admin/gallery" class="admin-button">Редактировать галерею главной</NuxtLink>
        </div>
      </article>

      <article class="admin-card">
        <div class="admin-card__head">
          <div>
            <h3 class="admin-card__title">Статус</h3>
            <p class="admin-card__descr">
              Это файловая админка: изменения сохраняются в `data/cms/*.json`, а локальные изображения складываются в `public/images/...`.
            </p>
          </div>
        </div>

        <div class="admin-actions">
          <button type="button" class="admin-button admin-button--accent" :disabled="pending" @click="refresh()">
            Обновить сводку
          </button>
          <span class="admin-status">Последняя проверка: {{ summary?.updatedAt || 'сейчас' }}</span>
        </div>
      </article>
    </section>
  </div>
</template>
