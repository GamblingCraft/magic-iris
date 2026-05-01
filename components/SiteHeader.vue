<script setup lang="ts">
import { contactInfo, mainNavigation, showPrograms } from '~/data/site'

const menuOpen = ref(false)
const stickyHeaderVisible = ref(false)
const route = useRoute()

const isHome = computed(() => route.path === '/')

const utilityLinks = [
  { label: 'Свадьбы', href: '/shows/svadebnoe' },
  { label: 'Дни рождения', href: '/shows/den-rozdenia' },
  { label: 'Корпоративы', href: '/shows/corporative' }
]

const promoFigures = computed(() => [showPrograms[2]?.image, showPrograms[1]?.image])
const desktopNavigation = computed(() =>
  mainNavigation.flatMap((item) => (item.children?.length ? item.children : [item]))
)

const closeMenu = () => {
  menuOpen.value = false
}

const handleScroll = () => {
  if (!import.meta.client) {
    return
  }

  stickyHeaderVisible.value = window.scrollY > 110
}

watch(
  () => route.fullPath,
  () => {
    closeMenu()
    handleScroll()
  }
)

watch(menuOpen, (isOpen) => {
  if (!import.meta.client) {
    return
  }

  document.documentElement.style.overflow = isOpen ? 'hidden' : ''
})

onMounted(() => {
  if (!import.meta.client) {
    return
  }

  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  if (!import.meta.client) {
    return
  }

  document.documentElement.style.overflow = ''
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="site-header s-header" :class="{ 'site-header--overlay': isHome }">
    <div class="header-top">
      <div class="container">
        <nav class="header-top__nav" aria-label="Быстрые разделы">
          <NuxtLink
            v-for="item in utilityLinks"
            :key="item.href"
            :to="item.href"
            class="header-top__nav__link"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="header-top__right">
          <div class="header-top__messangers">
            <a
              :href="contactInfo.telegram"
              class="header-top__messanger"
              target="_blank"
              rel="noreferrer"
            >
              <span class="header-top__messanger-dot header-top__messanger-dot--telegram" />
              <span>Telegram</span>
            </a>

            <a
              :href="contactInfo.max || contactInfo.whatsapp"
              class="header-top__messanger"
              target="_blank"
              rel="noreferrer"
            >
              <span class="header-top__messanger-dot header-top__messanger-dot--max" />
              <span>MAX</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="header-bottom" :class="{ 'header-bottom--sticky': stickyHeaderVisible }">
      <div class="container">
        <NuxtLink to="/" class="header-bottom__logo brand-mark brand-mark--hero" aria-label="Magic Iris">
          <img
            v-if="!stickyHeaderVisible"
            src="assets/img/logo_dark.webp"
            alt="Magic Iris logo"
          >
          <img
            v-else
            src="assets/img/logo.png"
            alt="Magic Iris logo"
          >
        </NuxtLink>

        <nav class="header-bottom__nav desktop-nav" aria-label="Основная навигация">
          <div
            v-for="item in desktopNavigation"
            :key="item.href"
            class="header-bottom__nav__item"
          >
            <NuxtLink :to="item.href" class="header-bottom__nav__link">
              {{ item.label }}
            </NuxtLink>
          </div>
        </nav>

        <div class="header-bottom__right">
          <a class="header-bottom__phone" :href="`tel:${contactInfo.phoneRaw}`">
            {{ contactInfo.phoneDisplay }}
          </a>

          <button
            type="button"
            class="burger burger-button"
            :aria-expanded="menuOpen ? 'true' : 'false'"
            aria-controls="mobile-menu"
            @click="menuOpen = !menuOpen"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="mobile-menu">
        <div v-if="menuOpen" id="mobile-menu" class="mobile-menu">
          <button type="button" class="mobile-menu__backdrop" aria-label="Закрыть меню" @click="closeMenu" />

          <div class="mobile-menu__panel">
            <div class="mobile-menu__top">
              <NuxtLink to="/" class="brand-mark brand-mark--dark" @click="closeMenu" />

              <button type="button" class="mobile-menu__close" aria-label="Закрыть меню" @click="closeMenu">
                <span />
                <span />
              </button>
            </div>

            <div class="mobile-menu__body">
              <nav class="mobile-menu__nav" aria-label="Мобильная навигация">
                <div
                  v-for="item in mainNavigation"
                  :key="item.href"
                  class="mobile-menu__nav-group"
                >
                  <NuxtLink
                    :to="item.href"
                    class="mobile-menu__link"
                    @click="closeMenu"
                  >
                    {{ item.label }}
                  </NuxtLink>

                  <div v-if="item.children?.length" class="mobile-menu__sublinks">
                    <NuxtLink
                      v-for="child in item.children"
                      :key="child.href"
                      :to="child.href"
                      class="mobile-menu__sublink"
                      @click="closeMenu"
                    >
                      {{ child.label }}
                    </NuxtLink>
                  </div>
                </div>
              </nav>

              <div class="mobile-menu__footer">
                <a class="mobile-menu__phone" :href="`tel:${contactInfo.phoneRaw}`">
                  {{ contactInfo.phoneDisplay }}
                </a>

                <div class="mobile-menu__socials">
                  <a
                    :href="contactInfo.max || contactInfo.whatsapp"
                    class="mobile-menu__social"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="MAX"
                  >
                    <span class="header-top__messanger-dot header-top__messanger-dot--max" />
                    <span>MAX</span>
                  </a>

                  <a
                    :href="contactInfo.telegram"
                    class="mobile-menu__social"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Telegram"
                  >
                    <span class="header-top__messanger-dot header-top__messanger-dot--telegram" />
                    <span>Telegram</span>
                  </a>
                </div>

                <NuxtLink to="/#contacts" class="button button--accent btn mobile-menu__cta" @click="closeMenu">
                  <span>Заказать</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>
