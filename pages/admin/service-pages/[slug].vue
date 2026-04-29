<script setup lang="ts">
import type { ServiceLandingPage, ServicePageSlug } from '~/data/service-pages'

import {
  fromServiceLandingDraft,
  toServiceLandingDraft,
  type ServiceLandingDraft
} from '~/utils/admin-editor'

definePageMeta({
  layout: 'admin'
})

type ServicePagesPayload = Record<ServicePageSlug, ServiceLandingPage>

const route = useRoute()
const slug = computed(() => String(route.params.slug || '') as ServicePageSlug)

const pageMeta: Record<ServicePageSlug, { title: string; path: string }> = {
  'pod-klyuch': { title: 'Под ключ', path: '/pod-klyuch' },
  corporate: { title: 'Корпоративным клиентам', path: '/corporate' }
}

const { data, refresh } = await useFetch<ServicePagesPayload>('/api/admin/service-pages', {
  key: `admin-service-page-${slug.value}`
})

const pagesDraft = ref<ServicePagesPayload | null>(null)
const draft = ref<ServiceLandingDraft | null>(null)
const isSaving = ref(false)

watch(
  data,
  (value) => {
    if (!value) {
      return
    }

    pagesDraft.value = structuredClone(value)
    const selected = value[slug.value]
    draft.value = selected ? toServiceLandingDraft(selected) : null
  },
  { immediate: true }
)

const savePage = async () => {
  if (!pagesDraft.value || !draft.value) {
    return
  }

  isSaving.value = true

  try {
    pagesDraft.value[slug.value] = fromServiceLandingDraft(draft.value)

    await $fetch('/api/admin/service-pages', {
      method: 'PUT',
      body: pagesDraft.value
    })

    await refresh()
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <section v-if="draft" class="admin-grid">
    <div class="admin-card admin-card--editor">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">Редактор страницы: {{ pageMeta[slug]?.title }}</h3>
          <p class="admin-card__descr">
            Полное редактирование страницы: SEO, hero, сценарий, карточки, текстовые блоки и
            CTA.
          </p>
        </div>
      </div>

      <div class="admin-actions">
        <NuxtLink to="/admin/service-pages" class="admin-button">К списку</NuxtLink>
        <NuxtLink :to="pageMeta[slug]?.path" class="admin-button admin-button--sand">Открыть страницу</NuxtLink>
        <button
          type="button"
          class="admin-button admin-button--accent"
          :disabled="isSaving"
          @click="savePage"
        >
          {{ isSaving ? 'Сохранение...' : 'Сохранить страницу' }}
        </button>
      </div>

      <div class="admin-subsection">
        <h4 class="admin-subsection__title">SEO</h4>

        <label class="admin-field">
          <span class="admin-label">Title</span>
          <input v-model="draft.seo.title" class="admin-input" type="text">
        </label>

        <label class="admin-field">
          <span class="admin-label">Description</span>
          <textarea v-model="draft.seo.description" class="admin-textarea" />
        </label>
      </div>

      <div class="admin-subsection">
        <h4 class="admin-subsection__title">Hero</h4>

        <div class="admin-editor__grid">
          <label class="admin-field">
            <span class="admin-label">Хлебная крошка</span>
            <input v-model="draft.breadcrumbLabel" class="admin-input" type="text">
          </label>

          <label class="admin-field">
            <span class="admin-label">Eyebrow</span>
            <input v-model="draft.hero.eyebrow" class="admin-input" type="text">
          </label>
        </div>

        <label class="admin-field">
          <span class="admin-label">Заголовок</span>
          <textarea v-model="draft.hero.title" class="admin-textarea" />
        </label>

        <label class="admin-field">
          <span class="admin-label">Lead</span>
          <textarea v-model="draft.hero.lead" class="admin-textarea" />
        </label>

        <label class="admin-field">
          <span class="admin-label">Описание</span>
          <textarea v-model="draft.hero.description" class="admin-textarea" />
        </label>

        <div class="admin-editor__grid">
          <AdminImageUploadField
            v-model="draft.hero.image"
            label="Фото hero"
            folder="landing-pages"
            preview-alt="Hero service page"
          />

          <label class="admin-fieldset">
            <span class="admin-fieldset__legend">Теги hero</span>
            <textarea v-model="draft.heroTagsText" class="admin-textarea" />
            <span class="admin-inline-note">По одной строке на каждый тег</span>
          </label>
        </div>

        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">Факты hero</span>
          <textarea v-model="draft.heroFactsText" class="admin-textarea" />
          <span class="admin-inline-note">Формат строки: `Метка|Значение`</span>
        </label>
      </div>

      <div class="admin-subsection">
        <h4 class="admin-subsection__title">Сценарий</h4>

        <label class="admin-field">
          <span class="admin-label">Eyebrow</span>
          <input v-model="draft.scenario.eyebrow" class="admin-input" type="text">
        </label>

        <label class="admin-field">
          <span class="admin-label">Заголовок</span>
          <textarea v-model="draft.scenario.title" class="admin-textarea" />
        </label>

        <label class="admin-field">
          <span class="admin-label">Lead блока</span>
          <textarea v-model="draft.scenario.text" class="admin-textarea" />
        </label>

        <div
          v-for="(item, index) in draft.scenario.items"
          :key="`scenario-item-${index}`"
          class="admin-subsection admin-subsection--nested"
        >
          <h5 class="admin-subsection__title">Шаг {{ index + 1 }}</h5>

          <label class="admin-field">
            <span class="admin-label">Заголовок шага</span>
            <input v-model="item.title" class="admin-input" type="text">
          </label>

          <label class="admin-field">
            <span class="admin-label">Текст шага</span>
            <textarea v-model="item.text" class="admin-textarea" />
          </label>

          <AdminImageUploadField
            v-model="item.image"
            :label="`Картинка шага ${index + 1}`"
            folder="landing-pages"
            :preview-alt="`Scenario step ${index + 1}`"
          />
        </div>
      </div>

      <div class="admin-subsection">
        <h4 class="admin-subsection__title">Карточки</h4>

        <label class="admin-field">
          <span class="admin-label">Eyebrow</span>
          <input v-model="draft.cards.eyebrow" class="admin-input" type="text">
        </label>

        <label class="admin-field">
          <span class="admin-label">Заголовок</span>
          <textarea v-model="draft.cards.title" class="admin-textarea" />
        </label>

        <label class="admin-field">
          <span class="admin-label">Lead блока</span>
          <textarea v-model="draft.cards.description" class="admin-textarea" />
        </label>

        <div
          v-for="(card, index) in draft.cards.items"
          :key="card.id || `service-card-${index}`"
          class="admin-subsection admin-subsection--nested"
        >
          <h5 class="admin-subsection__title">Карточка {{ index + 1 }}</h5>

          <div class="admin-editor__grid">
            <label class="admin-field">
              <span class="admin-label">ID</span>
              <input v-model="card.id" class="admin-input" type="text">
            </label>

            <label class="admin-field">
              <span class="admin-label">Ссылка</span>
              <input v-model="card.href" class="admin-input" type="text">
            </label>
          </div>

          <div class="admin-editor__grid">
            <label class="admin-field">
              <span class="admin-label">Kicker</span>
              <input v-model="card.kicker" class="admin-input" type="text">
            </label>

            <label class="admin-field">
              <span class="admin-label">Заголовок</span>
              <input v-model="card.title" class="admin-input" type="text">
            </label>
          </div>

          <label class="admin-field">
            <span class="admin-label">Описание</span>
            <textarea v-model="card.description" class="admin-textarea" />
          </label>

          <div class="admin-editor__grid">
            <label class="admin-field">
              <span class="admin-label">Meta primary</span>
              <input v-model="card.metaPrimary" class="admin-input" type="text">
            </label>

            <label class="admin-field">
              <span class="admin-label">Meta label</span>
              <input v-model="card.metaLabel" class="admin-input" type="text">
            </label>
          </div>

          <div class="admin-editor__grid">
            <label class="admin-field">
              <span class="admin-label">Текст кнопки</span>
              <input v-model="card.buttonLabel" class="admin-input" type="text">
            </label>

            <label class="admin-field">
              <span class="admin-label">Alt картинки</span>
              <input v-model="card.imageAlt" class="admin-input" type="text">
            </label>
          </div>

          <AdminImageUploadField
            v-model="card.image"
            :label="`Картинка карточки ${index + 1}`"
            folder="landing-pages"
            :preview-alt="`Service card ${index + 1}`"
          />
        </div>
      </div>

      <div class="admin-subsection">
        <h4 class="admin-subsection__title">Текстовый блок</h4>

        <label class="admin-field">
          <span class="admin-label">Eyebrow</span>
          <input v-model="draft.about.eyebrow" class="admin-input" type="text">
        </label>

        <label class="admin-field">
          <span class="admin-label">Заголовок</span>
          <textarea v-model="draft.about.title" class="admin-textarea" />
        </label>

        <label class="admin-field">
          <span class="admin-label">Lead блока</span>
          <textarea v-model="draft.about.lead" class="admin-textarea" />
        </label>

        <div
          v-for="(block, index) in draft.aboutBlocks"
          :key="`about-block-${index}`"
          class="admin-subsection admin-subsection--nested"
        >
          <h5 class="admin-subsection__title">Карточка текста {{ index + 1 }}</h5>

          <label class="admin-field">
            <span class="admin-label">Заголовок карточки</span>
            <input v-model="block.title" class="admin-input" type="text">
          </label>

          <label class="admin-fieldset">
            <span class="admin-fieldset__legend">Список пунктов</span>
            <textarea v-model="block.itemsText" class="admin-textarea" />
            <span class="admin-inline-note">По одному пункту на строку</span>
          </label>
        </div>
      </div>

      <div class="admin-subsection">
        <h4 class="admin-subsection__title">CTA</h4>

        <label class="admin-field">
          <span class="admin-label">Eyebrow</span>
          <input v-model="draft.cta.eyebrow" class="admin-input" type="text">
        </label>

        <label class="admin-field">
          <span class="admin-label">Заголовок CTA</span>
          <textarea v-model="draft.cta.title" class="admin-textarea" />
        </label>

        <label class="admin-field">
          <span class="admin-label">Текст CTA</span>
          <textarea v-model="draft.cta.text" class="admin-textarea" />
        </label>

        <div class="admin-editor__grid">
          <AdminImageUploadField
            v-model="draft.cta.image"
            label="Фото CTA"
            folder="landing-pages"
            preview-alt="CTA service page"
          />

          <label class="admin-field">
            <span class="admin-label">Alt для CTA фото</span>
            <input v-model="draft.cta.imageAlt" class="admin-input" type="text">
          </label>
        </div>

        <div class="admin-editor__grid">
          <label class="admin-field">
            <span class="admin-label">Главная кнопка: текст</span>
            <input v-model="draft.cta.primary.label" class="admin-input" type="text">
          </label>

          <label class="admin-field">
            <span class="admin-label">Главная кнопка: ссылка</span>
            <input v-model="draft.cta.primary.href" class="admin-input" type="text">
          </label>
        </div>

        <div class="admin-editor__grid">
          <label class="admin-field">
            <span class="admin-label">Вторая кнопка: текст</span>
            <input v-model="draft.cta.secondary.label" class="admin-input" type="text">
          </label>

          <label class="admin-field">
            <span class="admin-label">Вторая кнопка: ссылка</span>
            <input v-model="draft.cta.secondary.href" class="admin-input" type="text">
          </label>
        </div>
      </div>
    </div>
  </section>

  <div v-else class="admin-empty">
    <p>Страница не найдена.</p>
  </div>
</template>
