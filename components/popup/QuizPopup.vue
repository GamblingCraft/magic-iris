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
              <span>Шаг {{ Math.min(step + 1, totalSteps) }} из {{ totalSteps }}</span>
              <span>{{ progressWidth }}%</span>
            </div>
            <div class="quiz-popup__progress-bar">
              <div class="quiz-popup__progress-fill" :style="{ width: `${progressWidth}%` }" />
            </div>
          </div>

          <form class="quiz-popup__form" @submit.prevent="submitForm">
            <div v-if="step === 0" class="quiz-popup__step">
              <p class="quiz-popup__step-title">Выберите подарок</p>
              <div class="quiz-popup__options">
                <label v-for="gift in gifts" :key="gift" class="quiz-popup__option">
                  <input v-model="form.gift" type="radio" name="gift" :value="gift">
                  <span>{{ gift }}</span>
                </label>
              </div>
            </div>

            <div v-else-if="step === 1" class="quiz-popup__step">
              <p class="quiz-popup__step-title">Какое мероприятие планируете?</p>
              <div class="quiz-popup__options">
                <label v-for="event in events" :key="event" class="quiz-popup__option">
                  <input v-model="form.event" type="radio" name="event" :value="event">
                  <span>{{ event }}</span>
                </label>
                <label class="quiz-popup__option quiz-popup__option--stacked">
                  <input v-model="form.event" type="radio" name="event" value="Другое">
                  <span>Другое</span>
                  <input
                    v-if="form.event === 'Другое'"
                    v-model="form.eventOther"
                    type="text"
                    class="quiz-popup__input"
                    placeholder="Напишите ваш формат"
                  >
                </label>
              </div>
            </div>

            <div v-else-if="step === 2" class="quiz-popup__step quiz-popup__step--fields">
              <label class="quiz-popup__field">
                <span>Дата мероприятия</span>
                <input v-model="form.date" type="date" class="quiz-popup__input">
              </label>
              <label class="quiz-popup__field">
                <span>Город</span>
                <input
                  v-model="form.city"
                  type="text"
                  class="quiz-popup__input"
                  placeholder="Например, Иркутск"
                >
              </label>
            </div>

            <div v-else-if="step === 3" class="quiz-popup__step">
              <p class="quiz-popup__step-title">Сколько гостей ожидается?</p>
              <div class="quiz-popup__options">
                <label v-for="count in guestsCounts" :key="count" class="quiz-popup__option">
                  <input v-model="form.guestsCount" type="radio" name="guests" :value="count">
                  <span>{{ count }}</span>
                </label>
              </div>
            </div>

            <div v-else-if="step === 4" class="quiz-popup__step quiz-popup__step--fields">
              <label class="quiz-popup__field">
                <span>Ваше имя</span>
                <input
                  v-model="form.name"
                  type="text"
                  class="quiz-popup__input"
                  placeholder="Как к вам обращаться?"
                >
              </label>
              <label class="quiz-popup__field">
                <span>Телефон</span>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="quiz-popup__input"
                  placeholder="+7 (999) 999-99-99"
                >
              </label>
              <div class="quiz-popup__field">
                <span>Как с вами удобнее связаться?</span>
                <div class="quiz-popup__options quiz-popup__options--compact">
                  <label v-for="contact in contacts" :key="contact" class="quiz-popup__option">
                    <input v-model="form.contactMethod" type="radio" name="contact" :value="contact">
                    <span>{{ contact }}</span>
                  </label>
                </div>
              </div>
              <label class="quiz-popup__checkbox">
                <input v-model="form.agree" type="checkbox">
                <span>Даю согласие на обработку персональных данных</span>
              </label>
            </div>

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

            <div v-if="step < totalSteps" class="quiz-popup__actions">
              <button
                v-if="step > 0"
                type="button"
                class="quiz-popup__action quiz-popup__action--ghost"
                @click="prevStep"
              >
                Назад
              </button>
              <div class="quiz-popup__actions-spacer" />
              <button
                v-if="step < totalSteps - 1"
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
              >
                Отправить заявку
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

type QuizForm = {
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
  autoOpen: false,        // ← по умолчанию выключено
  openDelay: 700
})

const emit = defineEmits<{
  (e: 'closed'): void
}>()

const totalSteps = 5
const storageKey = 'magic-iris-quiz-popup-closed'
const isOpen = ref(false)
const step = ref(0)
const openTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const form = reactive<QuizForm>({
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

const gifts = ['Скидка 1500 ₽ при заказе двух шоу', 'Бесплатный мастер-класс после шоу', 'Подарок не нужен']
const events = ['Свадьба', 'Корпоратив', 'Юбилей', 'Выпускной']
const guestsCounts = ['10-30 гостей', '30-50 гостей', '50-100 гостей', '100+ гостей']
const contacts = ['Telegram', 'WhatsApp', 'ВКонтакте', 'MAX', 'Звонок']

const progressWidth = computed(() => Math.round((step.value / totalSteps) * 100))

const resetForm = () => {
  step.value = 0
  Object.assign(form, {
    gift: '', event: '', eventOther: '', date: '', city: '',
    guestsCount: '', name: '', phone: '', contactMethod: '', agree: false
  })
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

  if (step.value >= totalSteps) {
    resetForm()
  } else {
    step.value = 0
  }
}

const nextStep = () => { if (step.value < totalSteps) step.value++ }
const prevStep = () => { if (step.value > 0) step.value-- }

const submitForm = () => {
  console.log('✅ Quiz form submitted:', { ...form })
  // Здесь позже можно добавить отправку на сервер
  step.value = totalSteps
}

// ============== expose для вызова из родителя ==============
defineExpose({ openPopup })

// ... (весь остальной код watch, onMounted, onBeforeUnmount остаётся без изменений)
watch(isOpen, (value) => {
  if (!process.client) return
  document.documentElement.style.overflow = value ? 'hidden' : ''
  document.body.style.overflow = value ? 'hidden' : ''
})

onMounted(() => {
  if (!props.autoOpen || !process.client) return

  const isClosedInSession = window.sessionStorage.getItem(storageKey) === '1'
  if (isClosedInSession) return

  openTimer.value = window.setTimeout(openPopup, props.openDelay)
})

onBeforeUnmount(() => {
  if (openTimer.value) clearTimeout(openTimer.value)
  if (process.client) {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.quiz-popup {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: 24px;
}

.quiz-popup__backdrop {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(16, 11, 21, 0.76), rgba(16, 11, 21, 0.88)),
    radial-gradient(circle at top right, rgba(247, 209, 118, 0.24), transparent 28%);
  backdrop-filter: blur(12px);
}

.quiz-popup__dialog {
  position: relative;
  z-index: 1;
  width: min(100%, 760px);
  max-height: min(92vh, 940px);
  overflow: auto;
  padding: clamp(24px, 3vw, 38px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(246, 246, 249, 0.96));
  box-shadow: var(--shadow-soft);
}

.quiz-popup__close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 46px;
  height: 46px;
  border: 1px solid rgba(38, 38, 38, 0.08);
  border-radius: 14px;
  background: rgba(38, 38, 38, 0.04);
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.quiz-popup__close:hover {
  background: rgba(102, 95, 169, 0.1);
  transform: rotate(90deg);
}

.quiz-popup__close span {
  position: absolute;
  top: 22px;
  left: 11px;
  width: 22px;
  height: 2px;
  background: var(--color-text);
}

.quiz-popup__close span:first-child {
  transform: rotate(45deg);
}

.quiz-popup__close span:last-child {
  transform: rotate(-45deg);
}

.quiz-popup__eyebrow {
  margin-bottom: 12px;
  color: var(--color-primary);
  font-family: var(--font-title);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.quiz-popup__title {
  max-width: 12ch;
  margin: 0;
  color: var(--color-text);
  font-size: clamp(34px, 4vw, 54px);
}

.quiz-popup__lead {
  max-width: 56ch;
  margin: 18px 0 0;
  color: var(--color-text-soft);
  font-size: 17px;
  line-height: 1.55;
}

.quiz-popup__progress {
  display: grid;
  gap: 10px;
  margin-top: 28px;
}

.quiz-popup__progress-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--color-text-soft);
  font-family: var(--font-title);
  font-size: 13px;
  font-weight: 600;
}

.quiz-popup__progress-bar {
  overflow: hidden;
  height: 10px;
  border-radius: 999px;
  background: rgba(102, 95, 169, 0.12);
}

.quiz-popup__progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--color-accent), #f2bf42);
  transition: width 0.28s ease;
}

.quiz-popup__form {
  margin-top: 26px;
}

.quiz-popup__step,
.quiz-popup__success {
  display: grid;
  gap: 18px;
}

.quiz-popup__step--fields {
  gap: 16px;
}

.quiz-popup__step-title {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-title);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.15;
}

.quiz-popup__options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.quiz-popup__options--compact {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.quiz-popup__option {
  display: grid;
  gap: 10px;
  min-height: 92px;
  padding: 18px;
  border: 1px solid rgba(38, 38, 38, 0.08);
  border-radius: 22px;
  background: #fff;
  cursor: pointer;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    background-color 0.22s ease;
}

.quiz-popup__option:hover {
  transform: translateY(-2px);
  border-color: rgba(102, 95, 169, 0.24);
  box-shadow: 0 14px 28px rgba(18, 12, 30, 0.08);
}

.quiz-popup__option input[type='radio'] {
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: var(--color-primary);
}

.quiz-popup__option span {
  color: var(--color-text);
  font-family: var(--font-title);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
}

.quiz-popup__option:has(input:checked) {
  border-color: rgba(102, 95, 169, 0.34);
  background: linear-gradient(180deg, rgba(173, 170, 212, 0.12), rgba(247, 209, 118, 0.14));
  box-shadow: 0 18px 36px rgba(18, 12, 30, 0.08);
}

.quiz-popup__option--stacked {
  align-content: start;
}

.quiz-popup__field {
  display: grid;
  gap: 10px;
}

.quiz-popup__field span {
  color: var(--color-text);
  font-family: var(--font-title);
  font-size: 15px;
  font-weight: 600;
}

.quiz-popup__input {
  min-height: 56px;
  padding: 0 16px;
  border: 1px solid rgba(38, 38, 38, 0.12);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.96);
  color: var(--color-text);
  font: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.quiz-popup__input:focus {
  outline: none;
  border-color: rgba(102, 95, 169, 0.36);
  box-shadow: 0 0 0 4px rgba(173, 170, 212, 0.2);
}

.quiz-popup__checkbox {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: var(--color-text-soft);
  font-size: 14px;
  line-height: 1.45;
}

.quiz-popup__checkbox input {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: var(--color-primary);
}

.quiz-popup__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 26px;
}

.quiz-popup__actions-spacer {
  flex: 1 1 auto;
}

.quiz-popup__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  padding: 0 22px;
  border-radius: 16px;
  border: 1px solid transparent;
  font-family: var(--font-title);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease, background-color 0.22s ease;
}

.quiz-popup__action:hover {
  transform: translateY(-1px);
}

.quiz-popup__action--primary {
  background: var(--color-accent);
  color: var(--color-text);
  box-shadow: 0 14px 28px rgba(247, 209, 118, 0.28);
}

.quiz-popup__action--ghost {
  border-color: rgba(38, 38, 38, 0.08);
  background: rgba(38, 38, 38, 0.04);
  color: var(--color-text);
}

.quiz-popup__success {
  justify-items: start;
  padding: 18px 0 6px;
}

.quiz-popup__success-badge {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(247, 209, 118, 0.18);
  color: var(--color-primary);
  font-family: var(--font-title);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.quiz-popup__success h3 {
  margin: 0;
  color: var(--color-text);
}

.quiz-popup__success p {
  max-width: 44ch;
  margin: 0;
}

.quiz-popup-enter-active,
.quiz-popup-leave-active {
  transition: opacity 0.24s ease;
}

.quiz-popup-enter-active .quiz-popup__dialog,
.quiz-popup-leave-active .quiz-popup__dialog {
  transition: transform 0.28s ease, opacity 0.28s ease;
}

.quiz-popup-enter-from,
.quiz-popup-leave-to {
  opacity: 0;
}

.quiz-popup-enter-from .quiz-popup__dialog,
.quiz-popup-leave-to .quiz-popup__dialog {
  opacity: 0;
  transform: translateY(18px) scale(0.98);
}

@media (max-width: 760px) {
  .quiz-popup {
    padding: 12px;
  }

  .quiz-popup__dialog {
    width: 100%;
    max-height: 94vh;
    padding: 22px 18px 18px;
    border-radius: 24px;
  }

  .quiz-popup__close {
    top: 14px;
    right: 14px;
  }

  .quiz-popup__title {
    max-width: 100%;
    padding-right: 54px;
    font-size: clamp(28px, 9vw, 40px);
  }

  .quiz-popup__lead {
    font-size: 15px;
  }

  .quiz-popup__options,
  .quiz-popup__options--compact {
    grid-template-columns: 1fr;
  }

  .quiz-popup__option {
    min-height: auto;
  }

  .quiz-popup__actions {
    flex-wrap: wrap;
  }

  .quiz-popup__actions-spacer {
    display: none;
  }

  .quiz-popup__action {
    width: 100%;
  }
}
</style>
