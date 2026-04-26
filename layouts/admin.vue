<script setup lang="ts">
const route = useRoute()

const navigation = [
  {
    title: 'Обзор',
    description: 'Сводка по контенту и быстрые переходы',
    href: '/admin'
  },
  {
    title: 'Фото для Hero',
    description: 'Изображения и тексты первого экрана',
    href: '/admin/slider'
  },
  {
    title: 'Шоу',
    description: 'Карточки и детальные страницы шоу-программ',
    href: '/admin/shows'
  },
  {
    title: 'Мастер-классы',
    description: 'Каталог, описания, цены и категории',
    href: '/admin/master-classes'
  },
  {
    title: 'Галерея главной',
    description: 'Редактирование блока HomeGallerySection на главной странице',
    href: '/admin/gallery'
  }
]

const currentSection = computed(() => {
  return [...navigation]
    .sort((left, right) => right.href.length - left.href.length)
    .find((item) => route.path === item.href || route.path.startsWith(`${item.href}/`))
})

const pageTitle = computed(() => currentSection.value?.title || 'Админка')

const pageEyebrow = computed(() => currentSection.value?.description || 'Панель управления контентом')

const formattedDate = computed(() =>
  new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(new Date())
)
</script>

<template>
  <div class="admin-shell">
    <div class="admin-shell__layout">
      <aside class="admin-sidebar">
        <div class="admin-brand">
          <p class="admin-brand__eyebrow">Nuxt CMS</p>
          <h1 class="admin-brand__title">Magic Iris Admin</h1>
        </div>

        <nav class="admin-nav" aria-label="Навигация админки">
          <NuxtLink
            v-for="item in navigation"
            :key="item.href"
            :to="item.href"
            :class="['admin-nav__link', { 'is-active': route.path === item.href }]"
          >
            <span class="admin-nav__title">{{ item.title }}</span>
            <span class="admin-nav__descr">{{ item.description }}</span>
          </NuxtLink>
        </nav>

        <div class="admin-sidebar__footer">
          <NuxtLink to="/" class="admin-link-button">Открыть сайт</NuxtLink>
          <a href="/#contacts" class="admin-link-button admin-link-button--ghost">Перейти к CTA</a>
        </div>
      </aside>

      <div class="admin-main">
        <header class="admin-topbar">
          <div class="admin-topbar__meta">
            <p class="admin-topbar__eyebrow">{{ pageEyebrow }}</p>
            <h2 class="admin-topbar__title">{{ pageTitle }}</h2>
          </div>

          <span class="admin-topbar__date">{{ formattedDate }}</span>
        </header>

        <main class="admin-page">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
