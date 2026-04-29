<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const { data: summary, pending, refresh } = await useFetch('/api/admin/summary', {
  key: 'admin-summary'
})
</script>

<template>
  <div class="admin-grid admin-grid--cards">
    <article class="admin-card">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">Контент проекта</h3>
          <p class="admin-card__descr">
            Управляйте первым экраном, шоу, каталогом мастер-классов и галереей главной страницы
            из одной панели без ручной правки файлов.
          </p>
        </div>
      </div>

      <div class="admin-actions">
        <NuxtLink to="/admin/slider" class="admin-button admin-button--sand">Hero секция</NuxtLink>
        <NuxtLink to="/admin/shows" class="admin-button">Шоу</NuxtLink>
        <NuxtLink to="/admin/master-classes" class="admin-button">Мастер-классы</NuxtLink>
        <NuxtLink to="/admin/landing-pages" class="admin-button">Landing pages</NuxtLink>
        <NuxtLink to="/admin/gallery" class="admin-button">Галерея главной</NuxtLink>
      </div>
    </article>

    <article class="admin-card">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">SEO и индексация</h3>
          <p class="admin-card__descr">
            Отдельно собраны мета-шаблоны, robots, sitemap и счётчики, чтобы всё важное для
            индексации хранилось в одном месте.
          </p>
        </div>
      </div>

      <div class="admin-actions">
        <NuxtLink to="/admin/seo" class="admin-button">Meta</NuxtLink>
        <NuxtLink to="/admin/robots" class="admin-button">Robots</NuxtLink>
        <NuxtLink to="/admin/sitemap" class="admin-button">Sitemap</NuxtLink>
        <NuxtLink to="/admin/counters" class="admin-button">Счётчики</NuxtLink>
        <button type="button" class="admin-button admin-button--accent" :disabled="pending" @click="refresh()">
          Обновить сводку
        </button>
        <span class="admin-status">Последняя проверка: {{ summary?.updatedAt || 'сейчас' }}</span>
      </div>
    </article>
  </div>
</template>
