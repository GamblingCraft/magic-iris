<script setup lang="ts">
import { computed, ref } from 'vue'

import { contactInfo } from '~/data/site'

const props = defineProps<{
  eyebrow: string
  title: string
  text: string
  image: string
  imageAlt: string
}>()

const phoneInput = ref('')
const consentAccepted = ref(false)

const formatPhone = (rawValue: string) => {
  let digits = rawValue.replace(/\D/g, '')

  if (digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`
  }

  if (digits.startsWith('9')) {
    digits = `7${digits}`
  }

  if (!digits.startsWith('7')) {
    digits = `7${digits}`
  }

  digits = digits.slice(0, 11)

  const country = digits[0] ?? '7'
  const area = digits.slice(1, 4)
  const first = digits.slice(4, 7)
  const second = digits.slice(7, 9)
  const third = digits.slice(9, 11)

  let result = `+${country}`

  if (area) {
    result += ` (${area}`
  }

  if (area.length === 3) {
    result += ')'
  }

  if (first) {
    result += ` ${first}`
  }

  if (second) {
    result += `-${second}`
  }

  if (third) {
    result += `-${third}`
  }

  return result
}

const onPhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  phoneInput.value = formatPhone(target.value)
}

const phoneDigits = computed(() => phoneInput.value.replace(/\D/g, '').slice(0, 11))
const canSend = computed(() => consentAccepted.value && phoneDigits.value.length === 11)
const submitHref = computed(() => {
  const message = encodeURIComponent(
    `Здравствуйте! Хочу обсудить мероприятие в Magic Iris. Мой телефон: ${phoneInput.value || 'не указан'}.`
  )

  return `${contactInfo.whatsapp}?text=${message}`
})

const openSubmit = () => {
  if (!canSend.value || !import.meta.client) {
    return
  }

  window.open(submitHref.value, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <section class="section cta-section">
    <div class="container">
      <p class="eyebrow">{{ props.eyebrow }}</p>
      <div class="cta-ref">
        <div class="cta-ref__media">
          <img :src="props.image" :alt="props.imageAlt" loading="lazy">
        </div>

        <div class="cta-ref__content">
          <h2 class="cta-ref__title">{{ props.title }}</h2>

          <p class="cta-ref__descr">{{ props.text }}</p>

          <form class="cta-ref__form" @submit.prevent="openSubmit">
            <label class="cta-ref__field">
              <span>Ваш телефон</span>
              <input
                type="tel"
                name="phone"
                placeholder="+7 (999) 123-45-67"
                :value="phoneInput"
                autocomplete="tel"
                @input="onPhoneInput"
              >
            </label>

            <button type="submit" class="cta-ref__submit" :disabled="!canSend">
              Оставить заявку
            </button>

            <div class="cta-ref__messengers">
              <a
                class="cta-ref__messenger"
                :href="contactInfo.max || contactInfo.whatsapp"
                target="_blank"
                rel="noreferrer"
                aria-label="MAX"
              >
                <svg width="20" height="20" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path
                    d="M41.6748 20.8374C41.6748 9.32922 32.3456 0 20.8374 0C9.32922 0 0 9.32922 0 20.8374C0 32.3456 9.32922 41.6748 20.8374 41.6748C32.3456 41.6748 41.6748 32.3456 41.6748 20.8374Z"
                    fill="url(#paint0_linear_cta_max_collection)"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M21.0498 30.6693C19.1091 30.6693 18.2071 30.3847 16.6393 29.2465C15.6477 30.527 12.5074 31.5278 12.3704 29.8156C12.3704 28.5303 12.0871 27.4443 11.766 26.2586C11.3835 24.7978 10.949 23.1711 10.949 20.814C10.949 15.1843 15.5485 10.949 20.998 10.949C26.452 10.949 30.7257 15.393 30.7257 20.866C30.744 26.2546 26.415 30.6406 21.0498 30.6693ZM21.1302 15.8151C18.4763 15.6775 16.4079 17.5224 15.9499 20.4156C15.572 22.8106 16.2426 25.7274 16.8141 25.8791C17.088 25.9456 17.7774 25.3859 18.2071 24.9543C18.9176 25.4473 19.7451 25.7434 20.606 25.8127C23.3559 25.9456 25.7055 23.8431 25.8901 21.0843C25.9976 18.3196 23.8804 15.978 21.1302 15.8199V15.8151Z"
                    fill="white"
                  />
                  <defs>
                    <linearGradient id="paint0_linear_cta_max_collection" x1="0" y1="20.8374" x2="40.7013" y2="23.7031" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#4757F9" />
                      <stop offset="1" stop-color="#9261EA" />
                    </linearGradient>
                  </defs>
                </svg>
              </a>

              <a
                class="cta-ref__messenger"
                :href="contactInfo.telegram"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 33 32" fill="none" aria-hidden="true">
                  <g clip-path="url(#clip0_cta_telegram_collection)">
                    <path d="M16.5 0C12.2575 0 8.185 1.68675 5.1875 4.68625C2.18693 7.68696 0.500859 11.7565 0.5 16C0.5 20.2417 2.1875 24.3142 5.1875 27.3137C8.185 30.3132 12.2575 32 16.5 32C20.7425 32 24.815 30.3132 27.8125 27.3137C30.8125 24.3142 32.5 20.2417 32.5 16C32.5 11.7583 30.8125 7.68575 27.8125 4.68625C24.815 1.68675 20.7425 0 16.5 0Z" fill="url(#paint0_linear_cta_telegram_collection)" />
                    <path d="M7.7425 15.832C12.4075 13.8 15.5175 12.4604 17.0725 11.813C21.5175 9.96478 22.44 9.64378 23.0425 9.63291C23.175 9.63078 23.47 9.66353 23.6625 9.81916C23.8225 9.95041 23.8675 10.1279 23.89 10.2525C23.91 10.377 23.9375 10.6608 23.915 10.8823C23.675 13.4123 22.6325 19.5518 22.1025 22.3855C21.88 23.5845 21.4375 23.9865 21.01 24.0258C20.08 24.1113 19.375 23.4118 18.475 22.822C17.0675 21.8988 16.2725 21.3243 14.905 20.4235C13.325 19.3825 14.35 18.8103 15.25 17.8753C15.485 17.6305 19.58 13.9068 19.6575 13.569C19.6675 13.5268 19.6775 13.3693 19.5825 13.2863C19.49 13.203 19.3525 13.2315 19.2525 13.254C19.11 13.286 16.8625 14.773 12.5025 17.7148C11.865 18.1533 11.2875 18.367 10.7675 18.3558C10.1975 18.3435 9.0975 18.0328 8.28 17.7673C7.28 17.4415 6.4825 17.2693 6.5525 16.716C6.5875 16.428 6.985 16.1333 7.7425 15.832Z" fill="white" />
                  </g>
                  <defs>
                    <linearGradient id="paint0_linear_cta_telegram_collection" x1="1600.5" y1="0" x2="1600.5" y2="3200" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#2AABEE" />
                      <stop offset="1" stop-color="#229ED9" />
                    </linearGradient>
                    <clipPath id="clip0_cta_telegram_collection">
                      <rect width="32" height="32" fill="white" transform="translate(0.5)" />
                    </clipPath>
                  </defs>
                </svg>
              </a>
            </div>
          </form>

          <label class="cta-ref__consent">
            <input v-model="consentAccepted" type="checkbox" name="consent">
            <span>Нажимая кнопку, вы соглашаетесь на обработку персональных данных и принимаете условия политики конфиденциальности.</span>
          </label>
        </div>
      </div>
    </div>
  </section>
</template>
