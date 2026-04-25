<script setup lang="ts">
import { createMasterClassCategoryHref, masterClassCategories } from '~/data/catalog'

const sectionRef = ref<HTMLElement | null>(null)

const tiles = computed(() => [
  { ...masterClassCategories[0], href: createMasterClassCategoryHref(masterClassCategories[0].slug), size: 'wide' },
  { ...masterClassCategories[1], href: createMasterClassCategoryHref(masterClassCategories[1].slug), size: 'tall' },
  { ...masterClassCategories[2], href: createMasterClassCategoryHref(masterClassCategories[2].slug), size: 'small' },
  { ...masterClassCategories[3], href: createMasterClassCategoryHref(masterClassCategories[3].slug), size: 'small' }
])

useGsapReveal(sectionRef, ['.catalog-preview__head > div > *', '.catalog-preview__lead', '.catalog-wall__card'], {
  start: 'top 88%',
  stagger: 0.1,
  y: 34,
  blur: 8
})
</script>

<template>
  <section id="master-classes" ref="sectionRef" class="section section--cream catalog-preview">
    <div class="container">
      <div class="catalog-preview__head">
        <div>
          <p class="eyebrow">Мастер-классы</p>
          <h2 class="catalog-preview__title">
            <strong>Все мастер-классы</strong>
            <em>для творческой части события</em>
          </h2>
        </div>

        <p class="catalog-preview__lead">
          Подберите направление для корпоратива, школьного события, женской компании или сезонного праздника.
        </p>
      </div>

      <div class="catalog-wall">
        <NuxtLink
          v-for="tile in tiles"
          :key="tile.id"
          :to="tile.href"
          class="catalog-wall__card"
          :class="`catalog-wall__card--${tile.size}`"
        >
          <div class="catalog-wall__media" :style="{ backgroundImage: `url(${tile.image})` }" />

          <div class="catalog-wall__overlay" />

          <div class="catalog-wall__content">
            <h3>{{ tile.title }}</h3>
            <p>{{ tile.count }} форматов</p>
          </div>

          <span class="catalog-wall__arrow">↗</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
