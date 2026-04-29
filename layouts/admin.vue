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
    title: '\u041e\u0431\u0437\u043e\u0440',
    href: '/admin',
    icon: 'lucide:layout-dashboard'
  }
]

const groupedNavigation: AdminNavGroup[] = [
  {
    title: '\u041a\u043e\u043d\u0442\u0435\u043d\u0442',
    icon: 'lucide:images',
    items: [
      {
        title: 'Hero \u0441\u0435\u043a\u0446\u0438\u044f',
        href: '/admin/slider',
        icon: 'lucide:image-up'
      },
      {
        title: '\u041f\u043e\u0441\u0430\u0434\u043e\u0447\u043d\u044b\u0435 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b',
        href: '/admin/landing-pages',
        icon: 'lucide:panels-top-left'
      },
      {
        title: '\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u0443\u0441\u043b\u0443\u0433',
        href: '/admin/service-pages',
        icon: 'lucide:layout-template'
      },
      {
        title: '\u0413\u0430\u043b\u0435\u0440\u0435\u044f \u0433\u043b\u0430\u0432\u043d\u043e\u0439',
        href: '/admin/gallery',
        icon: 'lucide:image'
      }
    ]
  },
  {
    title: '\u041a\u0430\u0442\u0430\u043b\u043e\u0433',
    icon: 'lucide:folders',
    items: [
      {
        title: '\u0428\u043e\u0443',
        href: '/admin/shows',
        icon: 'lucide:clapperboard'
      },
      {
        title: '\u041c\u0430\u0441\u0442\u0435\u0440-\u043a\u043b\u0430\u0441\u0441\u044b',
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
        title: '\u0421\u0447\u0451\u0442\u0447\u0438\u043a\u0438',
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

const pageTitle = computed(() => currentSection.value?.title || '\u0410\u0434\u043c\u0438\u043d\u043a\u0430')
const pageEyebrow = computed(() => currentSection.value?.group || '\u041f\u0430\u043d\u0435\u043b\u044c \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f')

const formattedDate = computed(() =>
  new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(new Date())
)

const logout = async () => {
  await $fetch('/api/admin/auth/logout', {
    method: 'POST'
  }).catch(() => null)

  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="admin-shell">
    <div class="admin-shell__layout">
      <aside class="admin-sidebar">
        <div class="admin-brand">
          <h1 class="admin-brand__title">Magic Iris Admin</h1>
        </div>

        <nav class="admin-nav" aria-label="&#1053;&#1072;&#1074;&#1080;&#1075;&#1072;&#1094;&#1080;&#1103; &#1072;&#1076;&#1084;&#1080;&#1085;&#1082;&#1080;">
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
          <NuxtLink to="/" class="admin-link-button">&#1054;&#1090;&#1082;&#1088;&#1099;&#1090;&#1100; &#1089;&#1072;&#1081;&#1090;</NuxtLink>
          <button type="button" class="admin-link-button admin-link-button--muted" @click="logout">
            &#1042;&#1099;&#1081;&#1090;&#1080;
          </button>
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
