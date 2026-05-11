<script setup lang="ts">
import type { CatalogPagesContent } from '~/data/catalog-pages'
import { createEmptyCatalogPagesContent } from '~/utils/admin-catalog-pages'

definePageMeta({
  layout: 'admin'
})

const sectionKey = 'shows' as const
const pageTitle = 'Шоу: hero, текстовый блок и FAQ'
const pageDescription = 'Редактируйте hero-секцию, SEO-текст и FAQ на странице /shows.'

const { data, refresh } = await useFetch<CatalogPagesContent>('/api/admin/catalog-pages', {
  key: `admin-catalog-pages-${sectionKey}`
})

const content = ref<CatalogPagesContent>(createEmptyCatalogPagesContent())
const isSaving = ref(false)
const isHeroOpen = ref(true)
const isTextOpen = ref(false)
const isFaqOpen = ref(false)

watch(
  data,
  (value) => {
    if (value) {
      content.value = structuredClone(value)
    }
  },
  { immediate: true }
)

const section = computed(() => content.value[sectionKey])
const hero = computed(() => section.value.hero)

const ensureHeroCollections = () => {
  while ((hero.value.facts?.length || 0) < 3) {
    hero.value.facts = [...(hero.value.facts || []), { label: '', value: '' }]
  }

  while ((hero.value.actions?.length || 0) < 2) {
    hero.value.actions = [
      ...(hero.value.actions || []),
      {
        label: '',
        href: hero.value.actions?.length ? '/master-classes' : '/#contacts',
        kind: hero.value.actions?.length ? 'ghost' : 'primary'
      }
    ]
  }
}

ensureHeroCollections()

const heroTagsText = computed({
  get: () => (hero.value.tags || []).join('\n'),
  set: (value: string) => {
    hero.value.tags = value.split('\n').map((item) => item.trim()).filter(Boolean)
  }
})

const paragraphsText = computed({
  get: () => section.value.text.paragraphs.join('\n\n'),
  set: (value: string) => {
    section.value.text.paragraphs = value.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean)
  }
})

const addFaqItem = () => {
  section.value.faq.items.push({ question: '', answer: '' })
}

const removeFaqItem = (index: number) => {
  section.value.faq.items.splice(index, 1)
}

const saveContent = async () => {
  isSaving.value = true

  try {
    await $fetch('/api/admin/catalog-pages', {
      method: 'PUT',
      body: content.value
    })

    await refresh()
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <section class="admin-grid">
    <div class="admin-card admin-card--editor">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">{{ pageTitle }}</h3>
          <p class="admin-card__descr">{{ pageDescription }}</p>
        </div>
      </div>

      <div class="admin-actions">
        <button type="button" class="admin-button admin-button--accent" :disabled="isSaving" @click="saveContent">
          {{ isSaving ? 'Сохраняем...' : 'Сохранить изменения' }}
        </button>
      </div>

      <div class="admin-subsection">
        <div class="admin-card__head">
          <div>
            <h4 class="admin-subsection__title">Hero-секция</h4>
          </div>
          <button type="button" class="admin-button admin-button--ghost" @click="isHeroOpen = !isHeroOpen">
            {{ isHeroOpen ? 'Скрыть редактор' : 'Редактировать' }}
          </button>
        </div>

        <div v-if="isHeroOpen" class="admin-inline-group admin-inline-group--stack">
          <label class="admin-field">
            <span class="admin-label">Eyebrow</span>
            <input v-model="hero.eyebrow" class="admin-input" type="text">
          </label>

          <label class="admin-field">
            <span class="admin-label">Заголовок</span>
            <textarea v-model="hero.title" class="admin-textarea" />
          </label>

          <label class="admin-field">
            <span class="admin-label">Описание</span>
            <textarea v-model="hero.description" class="admin-textarea" />
          </label>

          <AdminImageUploadField
            v-model="hero.image"
            label="Изображение hero"
            folder="show"
            preview-alt="Shows hero image"
          />

          <div class="admin-editor__grid">
            <label v-for="(fact, index) in hero.facts" :key="`show-fact-label-${index}`" class="admin-field">
              <span class="admin-label">Факт {{ index + 1 }}: label</span>
              <input v-model="fact.label" class="admin-input" type="text">
            </label>

            <label v-for="(fact, index) in hero.facts" :key="`show-fact-value-${index}`" class="admin-field">
              <span class="admin-label">Факт {{ index + 1 }}: value</span>
              <input v-model="fact.value" class="admin-input" type="text">
            </label>
          </div>

          <label class="admin-fieldset">
            <span class="admin-fieldset__legend">Теги hero</span>
            <textarea v-model="heroTagsText" class="admin-textarea" />
            <span class="admin-inline-note">По одному тегу на строку.</span>
          </label>

          <div class="admin-editor__grid">
            <label class="admin-field">
              <span class="admin-label">Кнопка 1: текст</span>
              <input v-model="hero.actions[0].label" class="admin-input" type="text">
            </label>
            <label class="admin-field">
              <span class="admin-label">Кнопка 1: ссылка</span>
              <input v-model="hero.actions[0].href" class="admin-input" type="text">
            </label>
            <label class="admin-field">
              <span class="admin-label">Кнопка 2: текст</span>
              <input v-model="hero.actions[1].label" class="admin-input" type="text">
            </label>
            <label class="admin-field">
              <span class="admin-label">Кнопка 2: ссылка</span>
              <input v-model="hero.actions[1].href" class="admin-input" type="text">
            </label>
          </div>
        </div>
      </div>

      <div class="admin-subsection">
        <div class="admin-card__head">
          <div>
            <h4 class="admin-subsection__title">Текстовый блок</h4>
          </div>
          <button type="button" class="admin-button admin-button--ghost" @click="isTextOpen = !isTextOpen">
            {{ isTextOpen ? 'Скрыть редактор' : 'Редактировать' }}
          </button>
        </div>

        <div v-if="isTextOpen" class="admin-inline-group admin-inline-group--stack">
          <label class="admin-field">
            <span class="admin-label">Eyebrow</span>
            <input v-model="section.text.eyebrow" class="admin-input" type="text">
          </label>

          <label class="admin-field">
            <span class="admin-label">Заголовок</span>
            <textarea v-model="section.text.title" class="admin-textarea" />
          </label>

          <label class="admin-field">
            <span class="admin-label">Лид</span>
            <textarea v-model="section.text.lead" class="admin-textarea" />
          </label>

          <label class="admin-fieldset">
            <span class="admin-fieldset__legend">Абзацы</span>
            <textarea v-model="paragraphsText" class="admin-textarea" />
            <span class="admin-inline-note">Разделяйте абзацы пустой строкой.</span>
          </label>
        </div>
      </div>

      <div class="admin-subsection">
        <div class="admin-card__head">
          <div>
            <h4 class="admin-subsection__title">FAQ</h4>
          </div>
          <button type="button" class="admin-button admin-button--ghost" @click="isFaqOpen = !isFaqOpen">
            {{ isFaqOpen ? 'Скрыть редактор' : 'Редактировать' }}
          </button>
        </div>

        <div v-if="isFaqOpen" class="admin-inline-group admin-inline-group--stack">
          <label class="admin-field">
            <span class="admin-label">Eyebrow</span>
            <input v-model="section.faq.eyebrow" class="admin-input" type="text">
          </label>

          <div class="admin-editor__grid">
            <label class="admin-field">
              <span class="admin-label">Первая часть заголовка</span>
              <input v-model="section.faq.title" class="admin-input" type="text">
            </label>

            <label class="admin-field">
              <span class="admin-label">Акцентная часть</span>
              <input v-model="section.faq.titleAccent" class="admin-input" type="text">
            </label>
          </div>

          <label class="admin-field">
            <span class="admin-label">Описание</span>
            <textarea v-model="section.faq.description" class="admin-textarea" />
          </label>

          <div class="admin-card__head">
            <div>
              <h5 class="admin-card__title">Вопросы</h5>
            </div>
            <button type="button" class="admin-button admin-button--sand" @click="addFaqItem">Добавить вопрос</button>
          </div>

          <div
            v-for="(item, index) in section.faq.items"
            :key="`catalog-faq-${sectionKey}-${index}`"
            class="admin-inline-group admin-inline-group--stack"
          >
            <div class="admin-card__head">
              <div>
                <h5 class="admin-card__title">Вопрос {{ index + 1 }}</h5>
              </div>
              <button
                v-if="section.faq.items.length > 1"
                type="button"
                class="admin-button admin-button--ghost"
                @click="removeFaqItem(index)"
              >
                Удалить
              </button>
            </div>

            <label class="admin-field">
              <span class="admin-label">Вопрос</span>
              <textarea v-model="item.question" class="admin-textarea" />
            </label>

            <label class="admin-field">
              <span class="admin-label">Ответ</span>
              <textarea v-model="item.answer" class="admin-textarea" />
            </label>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
