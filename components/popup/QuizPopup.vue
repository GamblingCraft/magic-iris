<template>
  <Teleport to="body">
    <Transition name="quiz-popup">
      <div
        v-if="isOpen"
        class="quiz-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-popup-title"
        @click.self="closePopup"
      >
        <div class="quiz-popup__backdrop" />
        <div class="quiz-popup__dialog">
          <button type="button" class="quiz-popup__close" aria-label="Закрыть окно" @click="closePopup">
            <span />
            <span />
          </button>

          <div class="quiz-popup__eyebrow">Подарок за заявку</div>
          <h2 id="quiz-popup-title" class="quiz-popup__title">
            Узнайте, свободна ли ваша дата, и получите подарок
          </h2>
          <p class="quiz-popup__lead">
            Ответьте на несколько коротких вопросов. Мы подберём формат шоу, проверим дату и свяжемся удобным способом.
          </p>

          <div class="quiz-popup__progress">
            <div class="quiz-popup__progress-meta">
              <span>Шаг {{ Math.min(stepIndex + 1, totalStepsCount) }} из {{ totalStepsCount }}</span>
              <span>{{ progressWidthPercent }}%</span>
            </div>
            <div class="quiz-popup__progress-bar">
              <div class="quiz-popup__progress-fill" :style="{ width: `${progressWidthPercent}%` }" />
            </div>
          </div>

          <form class="quiz-popup__form" @submit.prevent="submitForm">
            <!-- Шаг 0: Выбор подарка -->
            <div v-if="stepIndex === 0" class="quiz-popup__step">
              <p class="quiz-popup__step-title">Выберите подарок</p>
              <div class="quiz-popup__options">
                <label v-for="giftItem in giftsList" :key="giftItem" class="quiz-popup__option">
                  <input v-model="formData.gift" type="radio" name="gift" :value="giftItem">
                  <span>{{ giftItem }}</span>
                </label>
              </div>
            </div>

            <!-- Шаг 1: Тип мероприятия -->
            <div v-else-if="stepIndex === 1" class="quiz-popup__step">
              <p class="quiz-popup__step-title">Какое мероприятие планируете?</p>
              <div class="quiz-popup__options">
                <label v-for="eventItem in eventsList" :key="eventItem" class="quiz-popup__option">
                  <input v-model="formData.event" type="radio" name="event" :value="eventItem">
                  <span>{{ eventItem }}</span>
                </label>
                <label class="quiz-popup__option quiz-popup__option--stacked">
                  <input v-model="formData.event" type="radio" name="event" value="Другое">
                  <span>Другое</span>
                  <input
                    v-if="formData.event === 'Другое'"
                    v-model="formData.eventOther"
                    type="text"
                    class="quiz-popup__input"
                    placeholder="Напишите ваш формат"
                  >
                </label>
              </div>
            </div>

            <!-- Шаг 2: Дата и город -->
            <div v-else-if="stepIndex === 2" class="quiz-popup__step quiz-popup__step--fields">
              <label class="quiz-popup__field">
                <span>Дата мероприятия</span>
                <input v-model="formData.date" type="date" class="quiz-popup__input">
              </label>
              <label class="quiz-popup__field">
                <span>Город</span>
                <input
                  v-model="formData.city"
                  type="text"
                  class="quiz-popup__input"
                  placeholder="Введите город проведения"
                >
              </label>
            </div>

            <!-- Шаг 3: Количество гостей -->
            <div v-else-if="stepIndex === 3" class="quiz-popup__step">
              <p class="quiz-popup__step-title">Сколько гостей ожидается?</p>
              <div class="quiz-popup__options">
                <label v-for="count in guestsCountsList" :key="count" class="quiz-popup__option">
                  <input v-model="formData.guestsCount" type="radio" name="guests" :value="count">
                  <span>{{ count }}</span>
                </label>
              </div>
            </div>

            <!-- Шаг 4: Контактные данные -->
            <div v-else-if="stepIndex === 4" class="quiz-popup__step quiz-popup__step--fields">
              <label class="quiz-popup__field">
                <span>Ваше имя</span>
                <input
                  v-model="formData.name"
                  type="text"
                  class="quiz-popup__input"
                  placeholder="Как к вам обращаться?"
                >
              </label>
              <label class="quiz-popup__field">
                <span>Телефон</span>
                <input
                  ref="phoneInput"
                  v-model="phoneInputValue"
                  type="tel"
                  class="quiz-popup__input"
                  placeholder="+7 (999) 999-99-99"
                />
              </label>
              <div class="quiz-popup__field">
                <span>Как с вами удобнее связаться?</span>
                <div class="quiz-popup__options quiz-popup__options--compact">
                  <label v-for="contact in contactsList" :key="contact" class="quiz-popup__option">
                    <input v-model="formData.contactMethod" type="radio" name="contact" :value="contact">
                    <span>{{ contact }}</span>
                  </label>
                </div>
              </div>
              <label class="quiz-popup__checkbox">
                <input v-model="formData.agree" type="checkbox">
                <span>Даю согласие на обработку персональных данных</span>
              </label>
            </div>

            <!-- Success экран -->
            <div v-else class="quiz-popup__success">
              <div class="quiz-popup__success-badge">Готово</div>
              <h3>Спасибо за интерес к Magic Iris</h3>
              <p>
                Мы получили ваши ответы. Скоро проверим дату, подготовим предложение и свяжемся с вами.
              </p>
              <button type="button" class="quiz-popup__action quiz-popup__action--primary" @click="closePopup">
                Закрыть
              </button>
            </div>

            <!-- Кнопки навигации -->
            <div v-if="stepIndex < totalStepsCount" class="quiz-popup__actions">
              <button
                v-if="stepIndex > 0"
                type="button"
                class="quiz-popup__action quiz-popup__action--ghost"
                @click="prevStep"
              >
                Назад
              </button>
              <div class="quiz-popup__actions-spacer" />
              <button
                v-if="stepIndex < totalStepsCount - 1"
                type="button"
                class="quiz-popup__action quiz-popup__action--primary"
                @click="nextStep"
              >
                Следующий вопрос
              </button>
              <button
                v-else
                type="submit"
                class="quiz-popup__action quiz-popup__action--primary"
                :disabled="!canSend || isSubmitting"
              >
                <span v-if="isSubmitting">Отправка...</span>
                <span v-else>Отправить заявку</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch, nextTick } from 'vue'
import IMask from 'imask'

type QuizFormData = {
  gift: string
  event: string
  eventOther: string
  date: string
  city: string
  guestsCount: string
  name: string
  phone: string
  contactMethod: string
  agree: boolean
}

const props = withDefaults(defineProps<{
  autoOpen?: boolean
  openDelay?: number
}>(), {
  autoOpen: false,
  openDelay: 700
})

const emit = defineEmits<{
  (event: 'closed'): void
  (event: 'submitted', data: QuizFormData): void
}>()

const totalStepsCount = 5
const storageKey = 'magic-iris-quiz-popup-closed'

const giftsList = ['Скидка 1500 ₽ при заказе двух шоу', 'Бесплатный мастер-класс после шоу', 'Подарок не нужен']
const eventsList = ['Свадьба', 'Корпоратив', 'Юбилей', 'Выпускной']
const guestsCountsList = ['10-30 гостей', '30-50 гостей', '50-100 гостей', '100+ гостей']
const contactsList = ['Telegram', 'WhatsApp', 'ВКонтакте', 'MAX', 'Звонок']

const isOpen = ref(false)
const stepIndex = ref(0)
const openTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const isSubmitting = ref(false)

// маска телефона (как в CTA)
const phoneInput = ref<HTMLInputElement | null>(null)
const phoneInputValue = ref('')
let phoneMask: IMask.InputMask | null = null

// вычисления для валидации
const phoneDigits = computed(() =>
  phoneInputValue.value.replace(/\D/g, '')
)

const canSend = computed(() =>
  formData.agree && phoneDigits.value.length === 11
)

const formData = reactive<QuizFormData>({
  gift: '',
  event: '',
  eventOther: '',
  date: '',
  city: '',
  guestsCount: '',
  name: '',
  phone: '',
  contactMethod: '',
  agree: false
})

const progressWidthPercent = computed(() =>
  Math.round((stepIndex.value / totalStepsCount) * 100)
)

// функция для инициализации маски
const initPhoneMask = () => {
  if (phoneInput.value && !phoneMask) {
    phoneMask = IMask(phoneInput.value, {
      mask: '+{7} (000) 000-00-00',
      lazy: false // сразу показывает +7
    })

    phoneMask.on('accept', () => {
      phoneInputValue.value = phoneMask?.value || ''
    })
  }
}

// следим за переходом на шаг с телефоном
watch(stepIndex, async (newStep) => {
  if (newStep === 4) {
    await nextTick()
    initPhoneMask()
    
    // если уже есть значение, обновляем маску
    if (phoneInputValue.value && phoneMask) {
      phoneMask.value = phoneInputValue.value
    }
  }
})

// синхронизация formData.phone с phoneInputValue
watch(phoneInputValue, (newValue) => {
  formData.phone = newValue
})

const resetForm = () => {
  stepIndex.value = 0
  formData.gift = ''
  formData.event = ''
  formData.eventOther = ''
  formData.date = ''
  formData.city = ''
  formData.guestsCount = ''
  formData.name = ''
  formData.phone = ''
  phoneInputValue.value = ''
  formData.contactMethod = ''
  formData.agree = false

  // пересоздаём маску при следующем показе
  if (phoneMask) {
    phoneMask.destroy()
    phoneMask = null
  }
}

const openPopup = () => {
  isOpen.value = true
}

const closePopup = () => {
  isOpen.value = false

  if (process.client) {
    window.sessionStorage.setItem(storageKey, '1')
  }

  emit('closed')

  if (stepIndex.value >= totalStepsCount) {
    resetForm()
  } else {
    stepIndex.value = 0
  }
}

const nextStep = () => {
  if (stepIndex.value < totalStepsCount) {
    stepIndex.value++
  }
}

const prevStep = () => {
  if (stepIndex.value > 0) {
    stepIndex.value--
  }
}

const sendToMaxApi = async (data: QuizFormData): Promise<boolean> => {
  try {
    await $fetch('/api/max-send', {
      method: 'POST',
      body: {
        type: 'quiz',
        data
      }
    })
    return true
  } catch {
    return false
  }
}

const submitForm = async () => {
  if (!canSend.value) return

  isSubmitting.value = true

  try {
    const success = await sendToMaxApi({ ...formData })

    if (success) {
      emit('submitted', { ...formData })
      stepIndex.value = totalStepsCount
    } else {
      alert('Ошибка отправки. Попробуйте снова.')
    }
  } finally {
    isSubmitting.value = false
  }
}

defineExpose({ openPopup, closePopup })

watch(isOpen, (val) => {
  if (!process.client) return

  document.documentElement.style.overflow = val ? 'hidden' : ''
  document.body.style.overflow = val ? 'hidden' : ''
  
  // при открытии попапа сбрасываем маску
  if (!val) {
    if (phoneMask) {
      phoneMask.destroy()
      phoneMask = null
    }
  } else {
    // если открыли попап и сразу на шаге с телефоном (маловероятно, но на всякий случай)
    if (stepIndex.value === 4) {
      nextTick(() => initPhoneMask())
    }
  }
})

onMounted(() => {
  // автооткрытие
  if (props.autoOpen && process.client) {
    const isClosed = window.sessionStorage.getItem(storageKey) === '1'
    if (!isClosed) {
      openTimer.value = window.setTimeout(openPopup, props.openDelay)
    }
  }
})

onBeforeUnmount(() => {
  if (openTimer.value) clearTimeout(openTimer.value)

  if (phoneMask) {
    phoneMask.destroy()
  }

  if (process.client) {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
  }
})
</script>
