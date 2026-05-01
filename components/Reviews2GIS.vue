<template>
  <section id="reviews" class="reviews-section section">
    <div class="container">
      <!-- Заголовок -->
      <div class="sec-title-double reviews-section__head">
        <div>
          <p class="eyebrow">Отзывы</p>
          <div class="h2 reviews-section__title">
            <strong>Нас рекомендуют</strong> 
          </div>
        </div>

        <div class="text-3 reviews-section__lead">
          Реальные впечатления наших гостей о шоу и мастер-классах
        </div>
      </div>

      <!-- Загрузка -->
      <div v-if="pending" class="reviews-loading">
        <div class="loading-spinner"></div>
        <span>Загрузка отзывов...</span>
      </div>

      <!-- Карусель -->
      <div v-else-if="allReviewsList.length" class="reviews-carousel-wrapper">
        <div
          ref="viewportRef"
          class="reviews-carousel"
          @touchstart.passive="handleTouchStart"
          @touchmove.passive="handleTouchMove"
          @touchend="handleTouchEnd"
          @touchcancel="handleTouchCancel"
        >
          <div ref="trackRef" class="reviews-track">
            <div
              v-for="item in renderedReviews"
              :key="`${item.review.id}-${item.position}`"
              class="review-card"
              :class="[
                `review-card--position-${item.position}`,
                {
                  'review-card--center': item.position === 0,
                  'review-card--side': Math.abs(item.position) === 1,
                  'review-card--outer': Math.abs(item.position) === 2
                }
              ]"
            >
              <div class="review-card__inner">
                <!-- Звезды -->
                <div class="review-stars">
                  <span
                    v-for="star in 5"
                    :key="star"
                    class="star"
                    :class="{ filled: star <= item.review.rating }"
                  >
                    ★
                  </span>
                </div>

                <!-- Текст отзыва -->
                <p class="review-card__text">
                  {{ truncateText(item.review.text, item.position === 0 ? 520 : 420) }}
                </p>

                <!-- Фото -->
                <div v-if="item.review.photos?.length" class="review-photos">
                  <img
                    v-for="photo in item.review.photos.slice(0, item.position === 0 ? 3 : 2)"
                    :key="photo.id"
                    :src="photo.preview_urls?.['320x']"
                    alt="Фото отзыва"
                    loading="lazy"
                  />
                </div>

                <div v-else class="review-photos review-photos--empty"></div>

                <!-- Автор -->
                <div class="review-card__footer">
                  <div class="review-author">
                    <div class="author-avatar" :style="getAvatarStyle(item.review.user)">
                      <span v-if="!item.review.user?.photo_preview_urls?.['64x64']">
                        {{ getInitials(item.review.user?.name) }}
                      </span>
                    </div>

                    <div class="author-info">
                      <strong>{{ truncateText(item.review.user?.name || 'Гость', 25) }}</strong>
                      <span class="reviews-count">
                        {{ item.review.user?.reviews_count || 0 }} отзывов
                      </span>
                    </div>
                  </div>

                  <span class="review-date">
                    {{ formatDate(item.review.date_created) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Стрелки: на мобильных скрываются -->
        <button
          v-if="allReviewsList.length > 1"
          class="carousel-nav carousel-prev"
          type="button"
          aria-label="Предыдущий отзыв"
          :disabled="isAnimating"
          @click="prevSlide"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          v-if="allReviewsList.length > 1"
          class="carousel-nav carousel-next"
          type="button"
          aria-label="Следующий отзыв"
          :disabled="isAnimating"
          @click="nextSlide"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <!-- Индикатор прогресса -->
        <div v-if="allReviewsList.length > 1" class="reviews-progress">
          <div
            class="progress-bar"
            :style="{ width: `${((currentIndex + 1) / allReviewsList.length) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Ошибка / нет отзывов -->
      <div v-else class="reviews-error">
        <p>Не удалось загрузить отзывы.</p>

        <a
          :href="dgisUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="button button--small button--ghost"
        >
          Читать отзывы на 2ГИС →
        </a>
      </div>

      <!-- Ссылка -->
      <div class="reviews-footer-link">
        <a
          :href="dgisUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="link-all"
        >
          <span>Все отзывы на 2ГИС</span>
          <span class="link-arrow">↗</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { gsap } from 'gsap'

const dgisUrl = 'https://2gis.ru/irkutsk/firm/70000001112913476/tab/reviews'

const viewportRef = ref(null)
const trackRef = ref(null)

const currentIndex = ref(0)
const isAnimating = ref(false)

const baseX = ref(0)
const slideStep = ref(0)

const touchStartX = ref(0)
const touchStartY = ref(0)
const touchCurrentX = ref(0)
const isTouching = ref(false)
const isHorizontalSwipe = ref(false)

let resizeObserver = null

const fetchAllReviews = async () => {
  const allReviewsList = []

  let url =
    'https://public-api.reviews.2gis.com/2.0/branches/70000001112913476/reviews?key=6e7e1929-4ea9-4a5d-8c05-d601860389bd&locale=ru_RU&rated=true&sort_by=friends&limit=50'

  try {
    while (url) {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Ошибка загрузки отзывов: ${response.status}`)
      }

      const data = await response.json()

      allReviewsList.push(...(data.reviews || []))
      url = data.meta?.next_link || null
    }

    return allReviewsList
  } catch (error) {
    console.error(error)
    return []
  }
}

const { data: allReviews, pending } = await useAsyncData(
  '2gis-reviews',
  () => fetchAllReviews(),
  {
    default: () => []
  }
)

const allReviewsList = computed(() => allReviews.value || [])

const getReviewByOffset = (offset) => {
  const reviews = allReviewsList.value
  const length = reviews.length

  if (!length) return null

  const index = (currentIndex.value + offset + length) % length

  return reviews[index]
}

const renderedReviews = computed(() => {
  const reviews = allReviewsList.value

  if (!reviews.length) return []

  if (reviews.length === 1) {
    return [
      {
        review: reviews[0],
        position: 0
      }
    ]
  }

  const positions = reviews.length === 2 ? [-1, 0, 1] : [-2, -1, 0, 1, 2]

  return positions
    .map((position) => ({
      review: getReviewByOffset(position),
      position
    }))
    .filter((item) => item.review)
})

const getCards = () => {
  if (!trackRef.value) return []

  return Array.from(trackRef.value.querySelectorAll('.review-card'))
}

const updateCarouselMeasurements = async () => {
  await nextTick()

  const viewport = viewportRef.value
  const track = trackRef.value
  const cards = getCards()

  if (!viewport || !track || !cards.length) return

  const centerCard = cards.find((card) => card.classList.contains('review-card--center')) || cards[0]
  const cardWidth = centerCard.offsetWidth

  const styles = window.getComputedStyle(track)
  const gap = parseFloat(styles.columnGap || styles.gap || 0) || 0

  slideStep.value = cardWidth + gap

  const centerCardIndex = cards.indexOf(centerCard)

  baseX.value = viewport.offsetWidth / 2 - cardWidth / 2 - centerCardIndex * slideStep.value

  gsap.set(track, {
    x: baseX.value
  })
}

const getCardVisualState = (position) => {
  if (position === 0) {
    return {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)'
    }
  }

  if (Math.abs(position) === 1) {
    return {
      scale: 0.92,
      opacity: 0.48,
      filter: 'blur(2px)'
    }
  }

  return {
    scale: 0.86,
    opacity: 0.2,
    filter: 'blur(4px)'
  }
}

const animateCardStates = (direction) => {
  const cards = getCards()

  if (!cards.length) return

  const duration = 0.62
  const ease = 'power3.inOut'

  cards.forEach((card) => {
    const positionClass = Array.from(card.classList).find((className) =>
      className.startsWith('review-card--position-')
    )

    const currentPosition = Number(positionClass?.replace('review-card--position-', ''))

    let nextPosition = currentPosition

    if (direction === 'next') {
      nextPosition = currentPosition - 1
    }

    if (direction === 'prev') {
      nextPosition = currentPosition + 1
    }

    const target = getCardVisualState(nextPosition)

    gsap.to(card, {
      scale: target.scale,
      opacity: target.opacity,
      filter: target.filter,
      duration,
      ease
    })
  })
}

const resetCardStates = () => {
  const cards = getCards()

  cards.forEach((card) => {
    gsap.set(card, {
      clearProps: 'transform,opacity,filter'
    })
  })
}

const switchSlide = async (direction) => {
  const reviewsLength = allReviewsList.value.length
  const track = trackRef.value

  if (reviewsLength <= 1 || isAnimating.value || !track) return

  isAnimating.value = true

  const moveTo = direction === 'next'
    ? baseX.value - slideStep.value
    : baseX.value + slideStep.value

  animateCardStates(direction)

  await new Promise((resolve) => {
    gsap.to(track, {
      x: moveTo,
      duration: 0.62,
      ease: 'power3.inOut',
      onComplete: resolve
    })
  })

  if (direction === 'next') {
    currentIndex.value = (currentIndex.value + 1) % reviewsLength
  } else {
    currentIndex.value = (currentIndex.value - 1 + reviewsLength) % reviewsLength
  }

  await nextTick()

  resetCardStates()

  gsap.set(track, {
    x: baseX.value
  })

  isAnimating.value = false
}

const nextSlide = () => {
  switchSlide('next')
}

const prevSlide = () => {
  switchSlide('prev')
}

/* Свайп на мобильных */
const handleTouchStart = (event) => {
  if (allReviewsList.value.length <= 1 || isAnimating.value) return

  const touch = event.touches[0]

  touchStartX.value = touch.clientX
  touchStartY.value = touch.clientY
  touchCurrentX.value = touch.clientX
  isTouching.value = true
  isHorizontalSwipe.value = false

  if (trackRef.value) {
    gsap.killTweensOf(trackRef.value)
  }
}

const handleTouchMove = (event) => {
  if (!isTouching.value || isAnimating.value || !trackRef.value) return

  const touch = event.touches[0]

  touchCurrentX.value = touch.clientX

  const deltaX = touchCurrentX.value - touchStartX.value
  const deltaY = touch.clientY - touchStartY.value

  if (!isHorizontalSwipe.value && Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
    isHorizontalSwipe.value = true
  }

  if (!isHorizontalSwipe.value) return

  const limitedDelta = Math.max(Math.min(deltaX, 90), -90)

  gsap.set(trackRef.value, {
    x: baseX.value + limitedDelta
  })
}

const handleTouchEnd = () => {
  if (!isTouching.value || isAnimating.value || !trackRef.value) {
    resetTouchState()
    return
  }

  const deltaX = touchCurrentX.value - touchStartX.value
  const threshold = 48

  resetTouchState()

  if (Math.abs(deltaX) >= threshold) {
    if (deltaX < 0) {
      nextSlide()
    } else {
      prevSlide()
    }

    return
  }

  gsap.to(trackRef.value, {
    x: baseX.value,
    duration: 0.28,
    ease: 'power2.out'
  })
}

const handleTouchCancel = () => {
  if (trackRef.value) {
    gsap.to(trackRef.value, {
      x: baseX.value,
      duration: 0.28,
      ease: 'power2.out'
    })
  }

  resetTouchState()
}

const resetTouchState = () => {
  isTouching.value = false
  isHorizontalSwipe.value = false
  touchStartX.value = 0
  touchStartY.value = 0
  touchCurrentX.value = 0
}

watch(
  () => allReviewsList.value.length,
  async () => {
    await updateCarouselMeasurements()
  }
)

onMounted(async () => {
  await updateCarouselMeasurements()

  if (viewportRef.value) {
    resizeObserver = new ResizeObserver(() => {
      updateCarouselMeasurements()
    })

    resizeObserver.observe(viewportRef.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

const getInitials = (name) => {
  if (!name) return '✨'

  const parts = name.trim().split(' ')

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }

  return name.slice(0, 2).toUpperCase()
}

const getAvatarStyle = (user) => {
  if (user?.photo_preview_urls?.['64x64']) {
    return {
      backgroundImage: `url(${user.photo_preview_urls['64x64']})`
    }
  }

  return {
    backgroundColor: 'var(--salat)',
    backgroundImage: 'none'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)

  return date
    .toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    })
    .replace('г.', '')
    .trim()
}

const truncateText = (text, maxLength) => {
  if (!text) return ''

  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trim()}...`
}
</script>
