<script setup lang="ts">
import type { ShowCollectionPage, ShowCollectionSlug } from '~/data/show-collections'

import {
  fromShowCollectionDraft,
  toShowCollectionDraft,
  type ShowCollectionDraft
} from '~/utils/admin-editor'

definePageMeta({
  layout: 'admin'
})

type LandingPagesPayload = Record<ShowCollectionSlug, ShowCollectionPage>
type CatalogInfo = {
  shows: Array<{ slug: string; title: string }>
  masterClassCategories: Array<{ slug: string; title: string }>
}

const cloneLandingPages = (value: LandingPagesPayload): LandingPagesPayload =>
  JSON.parse(JSON.stringify(value)) as LandingPagesPayload

const route = useRoute()
const slug = computed(() => String(route.params.slug || '') as ShowCollectionSlug)

const pageMeta: Record<ShowCollectionSlug, { title: string; path: string }> = {
  svadebnoe: { title: '\u0421\u0432\u0430\u0434\u044c\u0431\u044b', path: '/shows/svadebnoe' },
  'den-rozdenia': { title: '\u0414\u043d\u0438 \u0440\u043e\u0436\u0434\u0435\u043d\u0438\u044f', path: '/shows/den-rozdenia' },
  corporative: { title: '\u041a\u043e\u0440\u043f\u043e\u0440\u0430\u0442\u0438\u0432\u044b', path: '/shows/corporative' }
}

const { data, refresh } = await useFetch<LandingPagesPayload>('/api/admin/landing-pages', {
  key: `admin-landing-page-${slug.value}`
})

const { data: catalog } = await useFetch<CatalogInfo>('/api/admin/catalog', {
  key: `admin-landing-page-catalog-${slug.value}`,
  transform: (value: any) => ({
    shows: (value.shows || []).map((item: any) => ({ slug: item.slug, title: item.title })),
    masterClassCategories: (value.masterClassCategories || []).map((item: any) => ({
      slug: item.slug,
      title: item.title
    }))
  })
})

const pagesDraft = ref<LandingPagesPayload | null>(null)
const draft = ref<ShowCollectionDraft | null>(null)
const isSaving = ref(false)
const saveError = ref('')
const saveSuccess = ref('')

watch(
  data,
  (value) => {
    if (!value) {
      return
    }

    pagesDraft.value = cloneLandingPages(value)
    const selected = value[slug.value]
    draft.value = selected ? toShowCollectionDraft(selected) : null
  },
  { immediate: true }
)

const helperShowLines = computed(() =>
  (catalog.value?.shows || []).map((item) => `${item.slug} - ${item.title}`).join('\n')
)

const helperCategoryLines = computed(() =>
  (catalog.value?.masterClassCategories || []).map((item) => `${item.slug} - ${item.title}`).join('\n')
)

const savePage = async () => {
  if (!pagesDraft.value || !draft.value) {
    return
  }

  isSaving.value = true
  saveError.value = ''
  saveSuccess.value = ''

  try {
    pagesDraft.value[slug.value] = fromShowCollectionDraft(draft.value)

    await $fetch('/api/admin/landing-pages', {
      method: 'PUT',
      body: pagesDraft.value
    })

    await refresh()
    saveSuccess.value = 'Изменения сохранены'
  }
  catch (error) {
    saveError.value =
      error instanceof Error && error.message
        ? error.message
        : 'Не удалось сохранить страницу'
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
          <h3 class="admin-card__title">&#1056;&#1077;&#1076;&#1072;&#1082;&#1090;&#1086;&#1088; &#1087;&#1086;&#1089;&#1072;&#1076;&#1086;&#1095;&#1085;&#1086;&#1081;: {{ pageMeta[slug]?.title }}</h3>
          <p class="admin-card__descr">
            &#1055;&#1086;&#1083;&#1085;&#1086;&#1077; &#1088;&#1077;&#1076;&#1072;&#1082;&#1090;&#1080;&#1088;&#1086;&#1074;&#1072;&#1085;&#1080;&#1077; &#1089;&#1090;&#1088;&#1072;&#1085;&#1080;&#1094;&#1099;: SEO, hero, &#1089;&#1094;&#1077;&#1085;&#1072;&#1088;&#1080;&#1081;, &#1087;&#1086;&#1076;&#1073;&#1086;&#1088;&#1082;&#1072; &#1096;&#1086;&#1091; &#1080; &#1084;&#1072;&#1089;&#1090;&#1077;&#1088;-&#1082;&#1083;&#1072;&#1089;&#1089;&#1086;&#1074;,
            &#1090;&#1077;&#1082;&#1089;&#1090;&#1086;&#1074;&#1099;&#1081; &#1073;&#1083;&#1086;&#1082; &#1080; CTA.
          </p>
        </div>
      </div>

      <div class="admin-actions">
        <NuxtLink to="/admin/landing-pages" class="admin-button">&#1050; &#1089;&#1087;&#1080;&#1089;&#1082;&#1091;</NuxtLink>
        <NuxtLink :to="pageMeta[slug]?.path" class="admin-button admin-button--sand">&#1054;&#1090;&#1082;&#1088;&#1099;&#1090;&#1100; &#1089;&#1090;&#1088;&#1072;&#1085;&#1080;&#1094;&#1091;</NuxtLink>
        <button
          type="button"
          class="admin-button admin-button--accent"
          :disabled="isSaving"
          @click="savePage"
        >
          {{ isSaving ? '\u0421\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u0435...' : '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443' }}
        </button>
      </div>

      <p v-if="saveSuccess" class="admin-inline-note">{{ saveSuccess }}</p>
      <p v-if="saveError" class="admin-inline-note admin-inline-note--danger">{{ saveError }}</p>

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

        <label class="admin-field">
          <span class="admin-label">Keywords</span>
          <textarea v-model="draft.seo.keywords" class="admin-textarea" />
        </label>
      </div>

      <div class="admin-subsection">
        <h4 class="admin-subsection__title">Hero</h4>

        <div class="admin-editor__grid">
          <label class="admin-field">
            <span class="admin-label">&#1061;&#1083;&#1077;&#1073;&#1085;&#1072;&#1103; &#1082;&#1088;&#1086;&#1096;&#1082;&#1072;</span>
            <input v-model="draft.breadcrumbLabel" class="admin-input" type="text">
          </label>

          <label class="admin-field">
            <span class="admin-label">Eyebrow</span>
            <input v-model="draft.hero.eyebrow" class="admin-input" type="text">
          </label>
        </div>

        <label class="admin-field">
            <span class="admin-label">&#1047;&#1072;&#1075;&#1086;&#1083;&#1086;&#1074;&#1086;&#1082;</span>
          <textarea v-model="draft.hero.title" class="admin-textarea" />
        </label>

        <label class="admin-field">
          <span class="admin-label">Lead</span>
          <textarea v-model="draft.hero.lead" class="admin-textarea" />
        </label>

        <label class="admin-field">
            <span class="admin-label">&#1054;&#1087;&#1080;&#1089;&#1072;&#1085;&#1080;&#1077;</span>
          <textarea v-model="draft.hero.description" class="admin-textarea" />
        </label>

        <div class="admin-editor__grid">
          <AdminImageUploadField
            v-model="draft.hero.image"
            label="&#1060;&#1086;&#1090;&#1086; hero"
            folder="landing-pages"
            preview-alt="Hero landing page"
          />

          <label class="admin-fieldset">
            <span class="admin-fieldset__legend">&#1058;&#1077;&#1075;&#1080; hero</span>
            <textarea v-model="draft.heroTagsText" class="admin-textarea" />
            <span class="admin-inline-note">&#1055;&#1086; &#1086;&#1076;&#1085;&#1086;&#1081; &#1089;&#1090;&#1088;&#1086;&#1082;&#1077; &#1085;&#1072; &#1082;&#1072;&#1078;&#1076;&#1099;&#1081; &#1090;&#1077;&#1075;</span>
          </label>
        </div>

        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">&#1060;&#1072;&#1082;&#1090;&#1099; hero</span>
          <textarea v-model="draft.heroFactsText" class="admin-textarea" />
          <span class="admin-inline-note">&#1060;&#1086;&#1088;&#1084;&#1072;&#1090; &#1089;&#1090;&#1088;&#1086;&#1082;&#1080;: `&#1052;&#1077;&#1090;&#1082;&#1072;|&#1047;&#1085;&#1072;&#1095;&#1077;&#1085;&#1080;&#1077;`</span>
        </label>
      </div>

      <div class="admin-subsection">
        <h4 class="admin-subsection__title">&#1057;&#1094;&#1077;&#1085;&#1072;&#1088;&#1080;&#1081;</h4>

        <label class="admin-field">
          <span class="admin-label">Eyebrow</span>
          <input v-model="draft.scenario.eyebrow" class="admin-input" type="text">
        </label>

        <label class="admin-field">
            <span class="admin-label">&#1047;&#1072;&#1075;&#1086;&#1083;&#1086;&#1074;&#1086;&#1082;</span>
          <textarea v-model="draft.scenario.title" class="admin-textarea" />
        </label>

        <label class="admin-field">
            <span class="admin-label">Lead &#1073;&#1083;&#1086;&#1082;&#1072;</span>
          <textarea v-model="draft.scenario.text" class="admin-textarea" />
        </label>

        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">3 &#1096;&#1072;&#1075;&#1072; &#1089;&#1094;&#1077;&#1085;&#1072;&#1088;&#1080;&#1103;</span>
          <textarea v-model="draft.scenarioPointsText" class="admin-textarea" />
          <span class="admin-inline-note">&#1056;&#1086;&#1074;&#1085;&#1086; 3 &#1089;&#1090;&#1088;&#1086;&#1082;&#1080;. &#1050;&#1072;&#1078;&#1076;&#1072;&#1103; &#1089;&#1090;&#1088;&#1086;&#1082;&#1072; &#1089;&#1090;&#1072;&#1085;&#1077;&#1090; &#1086;&#1090;&#1076;&#1077;&#1083;&#1100;&#1085;&#1086;&#1081; &#1082;&#1072;&#1088;&#1090;&#1086;&#1095;&#1082;&#1086;&#1081;.</span>
        </label>
        <div class="admin-editor__grid">
          <AdminImageUploadField
            v-model="draft.scenario.images[0]"
            label="&#1050;&#1072;&#1088;&#1090;&#1080;&#1085;&#1082;&#1072; &#1089;&#1094;&#1077;&#1085;&#1072;&#1088;&#1080;&#1103; 1"
            folder="landing-pages"
            preview-alt="Scenario image 1"
          />
          <AdminImageUploadField
            v-model="draft.scenario.images[1]"
            label="&#1050;&#1072;&#1088;&#1090;&#1080;&#1085;&#1082;&#1072; &#1089;&#1094;&#1077;&#1085;&#1072;&#1088;&#1080;&#1103; 2"
            folder="landing-pages"
            preview-alt="Scenario image 2"
          />
          <AdminImageUploadField
            v-model="draft.scenario.images[2]"
            label="&#1050;&#1072;&#1088;&#1090;&#1080;&#1085;&#1082;&#1072; &#1089;&#1094;&#1077;&#1085;&#1072;&#1088;&#1080;&#1103; 3"
            folder="landing-pages"
            preview-alt="Scenario image 3"
          />
        </div>
      </div>

      <div class="admin-subsection">
        <h4 class="admin-subsection__title">&#1064;&#1086;&#1091;</h4>

        <label class="admin-field">
          <span class="admin-label">Eyebrow</span>
          <input v-model="draft.cards.eyebrow" class="admin-input" type="text">
        </label>

        <label class="admin-field">
            <span class="admin-label">&#1047;&#1072;&#1075;&#1086;&#1083;&#1086;&#1074;&#1086;&#1082;</span>
          <textarea v-model="draft.cards.title" class="admin-textarea" />
        </label>

        <label class="admin-field">
            <span class="admin-label">Lead &#1073;&#1083;&#1086;&#1082;&#1072;</span>
          <textarea v-model="draft.cards.description" class="admin-textarea" />
        </label>

        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">4 slug &#1096;&#1086;&#1091;</span>
          <textarea v-model="draft.cardsShowSlugsText" class="admin-textarea" />
          <span class="admin-inline-note">&#1052;&#1072;&#1082;&#1089;&#1080;&#1084;&#1091;&#1084; 4 &#1089;&#1090;&#1088;&#1086;&#1082;&#1080;. &#1048;&#1089;&#1087;&#1086;&#1083;&#1100;&#1079;&#1091;&#1081;&#1090;&#1077; slug &#1096;&#1086;&#1091;.</span>
        </label>

        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">&#1044;&#1086;&#1089;&#1090;&#1091;&#1087;&#1085;&#1099;&#1077; &#1096;&#1086;&#1091;</span>
          <textarea :value="helperShowLines" class="admin-textarea" readonly />
        </label>
      </div>

      <div class="admin-subsection">
        <h4 class="admin-subsection__title">&#1052;&#1072;&#1089;&#1090;&#1077;&#1088;-&#1082;&#1083;&#1072;&#1089;&#1089;&#1099;</h4>

        <label class="admin-field">
          <span class="admin-label">Eyebrow</span>
          <input v-model="draft.workshops.eyebrow" class="admin-input" type="text">
        </label>

        <label class="admin-field">
            <span class="admin-label">&#1047;&#1072;&#1075;&#1086;&#1083;&#1086;&#1074;&#1086;&#1082;</span>
          <textarea v-model="draft.workshops.title" class="admin-textarea" />
        </label>

        <label class="admin-field">
            <span class="admin-label">Lead &#1073;&#1083;&#1086;&#1082;&#1072;</span>
          <textarea v-model="draft.workshops.description" class="admin-textarea" />
        </label>

        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">4 slug &#1082;&#1072;&#1090;&#1077;&#1075;&#1086;&#1088;&#1080;&#1081;</span>
          <textarea v-model="draft.workshopsCategorySlugsText" class="admin-textarea" />
          <span class="admin-inline-note">&#1052;&#1072;&#1082;&#1089;&#1080;&#1084;&#1091;&#1084; 4 &#1089;&#1090;&#1088;&#1086;&#1082;&#1080;. &#1048;&#1089;&#1087;&#1086;&#1083;&#1100;&#1079;&#1091;&#1081;&#1090;&#1077; slug &#1082;&#1072;&#1090;&#1077;&#1075;&#1086;&#1088;&#1080;&#1080;.</span>
        </label>

        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">&#1044;&#1086;&#1089;&#1090;&#1091;&#1087;&#1085;&#1099;&#1077; &#1082;&#1072;&#1090;&#1077;&#1075;&#1086;&#1088;&#1080;&#1080;</span>
          <textarea :value="helperCategoryLines" class="admin-textarea" readonly />
        </label>
      </div>

      <div class="admin-subsection">
        <h4 class="admin-subsection__title">&#1058;&#1077;&#1082;&#1089;&#1090;&#1086;&#1074;&#1099;&#1081; &#1073;&#1083;&#1086;&#1082;</h4>

        <label class="admin-field">
          <span class="admin-label">Eyebrow</span>
          <input v-model="draft.about.eyebrow" class="admin-input" type="text">
        </label>

        <label class="admin-field">
            <span class="admin-label">&#1047;&#1072;&#1075;&#1086;&#1083;&#1086;&#1074;&#1086;&#1082;</span>
          <textarea v-model="draft.about.title" class="admin-textarea" />
        </label>

        <label class="admin-field">
            <span class="admin-label">Lead &#1073;&#1083;&#1086;&#1082;&#1072;</span>
          <textarea v-model="draft.about.lead" class="admin-textarea" />
        </label>

        <label class="admin-fieldset">
          <span class="admin-fieldset__legend">&#1040;&#1073;&#1079;&#1072;&#1094;&#1099;</span>
          <textarea v-model="draft.aboutParagraphsText" class="admin-textarea" />
          <span class="admin-inline-note">&#1055;&#1086; &#1086;&#1076;&#1085;&#1086;&#1084;&#1091; &#1072;&#1073;&#1079;&#1072;&#1094;&#1091; &#1085;&#1072; &#1089;&#1090;&#1088;&#1086;&#1082;&#1091;</span>
        </label>
      </div>

      <div class="admin-subsection">
        <h4 class="admin-subsection__title">CTA</h4>

        <label class="admin-field">
          <span class="admin-label">Eyebrow</span>
          <input v-model="draft.cta.eyebrow" class="admin-input" type="text">
        </label>

        <label class="admin-field">
            <span class="admin-label">&#1047;&#1072;&#1075;&#1086;&#1083;&#1086;&#1074;&#1086;&#1082; CTA</span>
          <textarea v-model="draft.cta.title" class="admin-textarea" />
        </label>

        <label class="admin-field">
            <span class="admin-label">&#1058;&#1077;&#1082;&#1089;&#1090; CTA</span>
          <textarea v-model="draft.cta.text" class="admin-textarea" />
        </label>

        <div class="admin-editor__grid">
          <AdminImageUploadField
            v-model="draft.cta.image"
            label="&#1060;&#1086;&#1090;&#1086; CTA"
            folder="landing-pages"
            preview-alt="CTA landing page"
          />

          <label class="admin-field">
            <span class="admin-label">Alt &#1076;&#1083;&#1103; CTA &#1092;&#1086;&#1090;&#1086;</span>
            <input v-model="draft.cta.imageAlt" class="admin-input" type="text">
          </label>
        </div>

        <div class="admin-editor__grid">
          <label class="admin-field">
            <span class="admin-label">&#1043;&#1083;&#1072;&#1074;&#1085;&#1072;&#1103; &#1082;&#1085;&#1086;&#1087;&#1082;&#1072;: &#1090;&#1077;&#1082;&#1089;&#1090;</span>
            <input v-model="draft.cta.primary.label" class="admin-input" type="text">
          </label>

          <label class="admin-field">
            <span class="admin-label">&#1043;&#1083;&#1072;&#1074;&#1085;&#1072;&#1103; &#1082;&#1085;&#1086;&#1087;&#1082;&#1072;: &#1089;&#1089;&#1099;&#1083;&#1082;&#1072;</span>
            <input v-model="draft.cta.primary.href" class="admin-input" type="text">
          </label>
        </div>
      </div>
    </div>
  </section>

  <div v-else class="admin-empty">
    <p>&#1055;&#1086;&#1089;&#1072;&#1076;&#1086;&#1095;&#1085;&#1072;&#1103; &#1089;&#1090;&#1088;&#1072;&#1085;&#1080;&#1094;&#1072; &#1085;&#1077; &#1085;&#1072;&#1081;&#1076;&#1077;&#1085;&#1072;.</p>
  </div>
</template>
