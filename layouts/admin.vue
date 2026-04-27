<script setup lang="ts">
type AdminNavItem = {
  title: string
  href: string
  icon: string
  group?: string
}

type AdminNavGroup = {
  title: string
  icon: string
  items: AdminNavItem[]
}

const route = useRoute()

const directNavigation: AdminNavItem[] = [
  {
    title: 'Обзор',
    href: '/admin',
    icon: 'lucide:layout-dashboard'
  }
]

const groupedNavigation: AdminNavGroup[] = [
  {
    title: 'Контент',
    icon: 'lucide:images',
    items: [
      {
        title: 'Hero секция',
        href: '/admin/slider',
        icon: 'lucide:image-up'
      },
      {
        title: 'Галерея главной',
        href: '/admin/gallery',
        icon: 'lucide:image'
      }
    ]
  },
  {
    title: 'Каталог',
    icon: 'lucide:folders',
    items: [
      {
        title: 'Шоу',
        href: '/admin/shows',
        icon: 'lucide:clapperboard'
      },
      {
        title: 'Мастер-классы',
        href: '/admin/master-classes',
        icon: 'lucide:palette'
      }
    ]
  },
  {
    title: 'SEO',
    icon: 'lucide:search',
    items: [
      {
        title: 'Meta',
        href: '/admin/seo',
        icon: 'lucide:file-text'
      },
      {
        title: 'Robots',
        href: '/admin/robots',
        icon: 'lucide:bot'
      },
      {
        title: 'Sitemap',
        href: '/admin/sitemap',
        icon: 'lucide:map'
      },
      {
        title: 'Счётчики',
        href: '/admin/counters',
        icon: 'lucide:badge-check'
      }
    ]
  }
]

const allNavigationItems = computed(() => [
  ...directNavigation,
  ...groupedNavigation.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      group: group.title
    }))
  )
])

const isItemActive = (item: AdminNavItem) =>
  item.href === '/admin'
    ? route.path === item.href
    : route.path === item.href || route.path.startsWith(`${item.href}/`)

const isGroupActive = (group: AdminNavGroup) => group.items.some(isItemActive)

const openGroups = ref<Record<string, boolean>>(
  Object.fromEntries(groupedNavigation.map((group) => [group.title, true]))
)

watchEffect(() => {
  groupedNavigation.forEach((group) => {
    if (isGroupActive(group)) {
      openGroups.value[group.title] = true
    }
  })
})

const toggleGroup = (title: string) => {
  openGroups.value[title] = !openGroups.value[title]
}

const currentSection = computed(() => {
  return [...allNavigationItems.value]
    .sort((left, right) => right.href.length - left.href.length)
    .find((item) => isItemActive(item))
})

const pageTitle = computed(() => currentSection.value?.title || 'Админка')

const pageEyebrow = computed(() => currentSection.value?.group || 'Панель управления')

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
          <h1 class="admin-brand__title">Magic Iris Admin</h1>
        </div>

        <nav class="admin-nav" aria-label="Навигация админки">
          <NuxtLink
            v-for="item in directNavigation"
            :key="item.href"
            :to="item.href"
            :class="['admin-nav__link', { 'is-active': isItemActive(item) }]"
          >
            <span class="admin-nav__link-inner">
              <Icon :name="item.icon" class="admin-nav__icon" />
              <span class="admin-nav__title">{{ item.title }}</span>
            </span>
          </NuxtLink>

          <div
            v-for="group in groupedNavigation"
            :key="group.title"
            :class="['admin-nav-group', { 'is-open': openGroups[group.title], 'is-active': isGroupActive(group) }]"
          >
            <button
              type="button"
              class="admin-nav-group__toggle"
              :aria-expanded="openGroups[group.title] ? 'true' : 'false'"
              @click="toggleGroup(group.title)"
            >
              <span class="admin-nav__link-inner">
                <Icon :name="group.icon" class="admin-nav__icon" />
                <span class="admin-nav__title">{{ group.title }}</span>
              </span>
              <Icon name="lucide:chevron-down" class="admin-nav-group__chevron" />
            </button>

            <div v-if="openGroups[group.title]" class="admin-nav-group__panel">
              <NuxtLink
                v-for="item in group.items"
                :key="item.href"
                :to="item.href"
                :class="['admin-nav__link admin-nav__link--child', { 'is-active': isItemActive(item) }]"
              >
                <span class="admin-nav__link-inner">
                  <Icon :name="item.icon" class="admin-nav__icon admin-nav__icon--child" />
                  <span class="admin-nav__title">{{ item.title }}</span>
                </span>
              </NuxtLink>
            </div>
          </div>
        </nav>

        <div class="admin-sidebar__footer">
          <NuxtLink to="/" class="admin-link-button">Открыть сайт</NuxtLink>
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
