<script setup lang="ts">
import type { HomeHeroSlide } from '~/data/home-slider'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const slideId = computed(() => String(route.params.id || ''))

const { data, refresh } = await useFetch<HomeHeroSlide[]>('/api/admin/home-slider', {
  key: `admin-home-slider-${slideId.value}`
})

const slides = ref<HomeHeroSlide[]>([])
const isSaving = ref(false)

watch(
  data,
  (value) => {
    slides.value = value ? structuredClone(value) : []
  },
  { immediate: true }
)

const selectedSlide = computed(() =>
  slides.value.find((item) => item.id === slideId.value) || null
)

const moveSlide = (direction: -1 | 1) => {
  const index = slides.value.findIndex((item) => item.id === slideId.value)

  if (index < 0) {
    return
  }

  const nextIndex = index + direction

  if (nextIndex < 0 || nextIndex >= slides.value.length) {
    return
  }

  const cloned = [...slides.value]
  const [moved] = cloned.splice(index, 1)
  cloned.splice(nextIndex, 0, moved)
  slides.value = cloned
}

const saveSlide = async () => {
  if (!selectedSlide.value) {
    return
  }

  isSaving.value = true

  try {
    await $fetch('/api/admin/home-slider', {
      method: 'PUT',
      body: slides.value
    })

    await refresh()
  }
  finally {
    isSaving.value = false
  }
}

const removeSlide = async () => {
  if (!selectedSlide.value) {
    return
  }

  const nextSlides = slides.value.filter((item) => item.id !== selectedSlide.value?.id)

  await $fetch('/api/admin/home-slider', {
    method: 'PUT',
    body: nextSlides
  })

  await router.push('/admin/slider')
}
</script>

<template>
  <section v-if="selectedSlide" class="admin-grid">
    <div class="admin-card admin-card--editor">
      <div class="admin-card__head">
        <div>
          <h3 class="admin-card__title">Hero секция</h3>
          <p class="admin-card__descr">
            Меняйте изображение, заголовок, акцентную строку, описание и кнопку текущего экрана
            Hero.
          </p>
        </div>
      </div>

      <div class="admin-actions">
        <NuxtLink to="/admin/slider" class="admin-button">К списку</NuxtLink>
        <button type="button" class="admin-button" @click="moveSlide(-1)">Выше</button>
        <button type="button" class="admin-button" @click="moveSlide(1)">Ниже</button>
        <button type="button" class="admin-button admin-button--danger" @click="removeSlide">Удалить</button>
        <button type="button" class="admin-button admin-button--accent" :disabled="isSaving" @click="saveSlide">
          {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
        </button>
      </div>

      <div class="admin-editor__grid">
        <label class="admin-field">
          <span class="admin-label">ID</span>
          <input v-model="selectedSlide.id" class="admin-input" type="text">
        </label>

        <label class="admin-field">
          <span class="admin-label">Активен</span>
          <select v-model="selectedSlide.active" class="admin-select">
            <option :value="true">Да</option>
            <option :value="false">Нет</option>
          </select>
        </label>
      </div>

      <label class="admin-field">
        <span class="admin-label">Eyebrow</span>
        <input v-model="selectedSlide.eyebrow" class="admin-input" type="text">
      </label>

      <label class="admin-field">
        <span class="admin-label">Заголовок</span>
        <textarea v-model="selectedSlide.title" class="admin-textarea" />
      </label>

      <div class="admin-editor__grid">
        <label class="admin-field">
          <span class="admin-label">Script line</span>
          <input v-model="selectedSlide.script" class="admin-input" type="text">
        </label>

        <label class="admin-field">
          <span class="admin-label">Текст кнопки</span>
          <input v-model="selectedSlide.buttonLabel" class="admin-input" type="text">
        </label>
      </div>

      <label class="admin-field">
        <span class="admin-label">Краткое описание</span>
        <textarea v-model="selectedSlide.summary" class="admin-textarea" />
      </label>

      <div class="admin-editor__grid">
        <AdminImageUploadField
          v-model="selectedSlide.image"
          label="Изображение"
          folder="slider"
          preview-alt="Hero секция"
        />

        <label class="admin-field">
          <span class="admin-label">Alt</span>
          <input v-model="selectedSlide.imageAlt" class="admin-input" type="text">
        </label>
      </div>

      <label class="admin-field">
        <span class="admin-label">Ссылка кнопки</span>
        <input v-model="selectedSlide.buttonHref" class="admin-input" type="text">
      </label>
    </div>
  </section>

  <div v-else class="admin-empty">
    <p>Экран Hero не найден.</p>
  </div>
</template>
