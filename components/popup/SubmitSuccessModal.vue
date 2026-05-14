<script setup lang="ts">
const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  message?: string
  actionLabel?: string
}>(), {
  title: 'Успешно!',
  message: 'Мы свяжемся с вами в течение 15 минут.',
  actionLabel: 'Закрыть'
})

const emit = defineEmits<{
  (event: 'close'): void
}>()

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="submit-success-modal">
      <div
        v-if="props.open"
        class="submit-success-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Успешная отправка"
        @click.self="closeModal"
      >
        <div class="submit-success-modal__backdrop" />

        <div class="submit-success-modal__dialog">
          <button
            type="button"
            class="submit-success-modal__close"
            aria-label="Закрыть окно"
            @click="closeModal"
          >
            <span />
            <span />
          </button>
          <h3 class="submit-success-modal__title">{{ props.title }}</h3>
          <p class="submit-success-modal__text">{{ props.message }}</p>

          <button
            type="button"
            class="button button--accent btn submit-success-modal__action"
            @click="closeModal"
          >
            {{ props.actionLabel }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.submit-success-modal {
  position: fixed;
  inset: 0;
  z-index: 150;
  display: grid;
  place-items: center;
  padding: 20px;
}

.submit-success-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(10, 6, 16, 0.7);
  backdrop-filter: blur(4px);
}

.submit-success-modal__dialog {
  position: relative;
  z-index: 1;
  width: min(460px, calc(100vw - 32px));
  border-radius: 28px;
  padding: 30px 26px 24px;
  background: linear-gradient(148deg, rgba(255, 255, 255, 0.98), rgba(247, 241, 255, 0.96));
  border: 1px solid rgba(82, 47, 116, 0.18);
  box-shadow: 0 28px 54px rgba(14, 8, 26, 0.3);
  text-align: center;
}

.submit-success-modal__close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 12px;
  background: rgba(16, 10, 24, 0.08);
  cursor: pointer;
}

.submit-success-modal__close span {
  position: absolute;
  left: 9px;
  top: 17px;
  width: 18px;
  height: 2px;
  border-radius: 99px;
  background: rgba(20, 14, 30, 0.72);
}

.submit-success-modal__close span:first-child {
  transform: rotate(45deg);
}

.submit-success-modal__close span:last-child {
  transform: rotate(-45deg);
}

.submit-success-modal__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(247, 209, 118, 0.3);
  color: #4d2f6a;
  font-family: var(--font-title);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
}

.submit-success-modal__title {
  margin: 14px 0 8px;
  color: #181028;
  font-family: var(--font-title);
  font-size: clamp(30px, 5vw, 40px);
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

.submit-success-modal__text {
  margin: 0;
  color: rgba(24, 16, 40, 0.82);
  font-size: 18px;
  line-height: 1.5;
}

.submit-success-modal__action {
  margin-top: 22px;
}

.submit-success-modal-enter-active,
.submit-success-modal-leave-active {
  transition: opacity 0.2s ease;
}

.submit-success-modal-enter-active .submit-success-modal__dialog,
.submit-success-modal-leave-active .submit-success-modal__dialog {
  transition: transform 0.24s ease, opacity 0.24s ease;
}

.submit-success-modal-enter-from,
.submit-success-modal-leave-to {
  opacity: 0;
}

.submit-success-modal-enter-from .submit-success-modal__dialog,
.submit-success-modal-leave-to .submit-success-modal__dialog {
  opacity: 0;
  transform: translateY(14px) scale(0.98);
}

@media (max-width: 640px) {
  .submit-success-modal__dialog {
    border-radius: 22px;
    padding: 26px 18px 20px;
  }

  .submit-success-modal__title {
    font-size: 32px;
  }

  .submit-success-modal__text {
    font-size: 16px;
  }
}
</style>
