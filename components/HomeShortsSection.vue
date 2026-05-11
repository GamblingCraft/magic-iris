<script setup lang="ts">
import type { HomeShortsContent } from '~/data/home-content'
import { homeShortsContent } from '~/data/home-content'

const props = defineProps<{
  content?: HomeShortsContent | null
}>()

const sectionRef = ref<HTMLElement | null>(null)
const shortsContent = computed(() => props.content || homeShortsContent)
const activeVideo = ref<(typeof shortsContent.value.items)[number] | null>(null)

const openVideo = (video: (typeof shortsContent.value.items)[number]) => {
  activeVideo.value = video
}

const closeVideo = () => {
  activeVideo.value = null
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeVideo()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

useGsapReveal(sectionRef, ['.eyebrow', '.shorts-section__head > *', '.about-reel-card'], {
  start: 'top 88%',
  stagger: 0.12,
  y: 36,
  blur: 8
})
</script>

<template>
  <section ref="sectionRef" class="section shorts-section">
    <div class="container">
      <p class="eyebrow">{{ shortsContent.eyebrow }}</p>
      <div class="about-media__head shorts-section__head">
        <div>
          <h2>{{ shortsContent.title }}</h2>
        </div>

        <p>
          {{ shortsContent.description }}
        </p>
      </div>

      <div class="about-reels">
        <button
          v-for="video in shortsContent.items"
          :key="video.id"
          type="button"
          class="about-reel-card"
          @click="openVideo(video)"
        >
          <img :src="video.poster" :alt="video.title" loading="lazy">
          <span class="about-reel-card__overlay"></span>
          <span class="about-reel-card__play">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 6.5v11l9-5.5-9-5.5Z" fill="currentColor" />
            </svg>
          </span>
          <span class="about-reel-card__title">{{ video.title }}</span>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="activeVideo" class="about-video-modal">
        <button type="button" class="about-video-modal__backdrop" aria-label="Закрыть видео" @click="closeVideo" />

        <div class="about-video-modal__dialog" role="dialog" aria-modal="true" :aria-label="activeVideo.title">
          <button type="button" class="about-video-modal__close" aria-label="Закрыть" @click="closeVideo">
            ×
          </button>

          <div class="about-video-modal__frame">
            <iframe
              :src="`https://kinescope.io/embed/${activeVideo.videoId}`"
              :title="activeVideo.title"
              loading="lazy"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowfullscreen
            />
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
