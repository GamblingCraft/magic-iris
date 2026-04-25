<script setup lang="ts">
import { homeFaqItems } from '~/data/home-conversion'

const openIndex = ref(0)

const toggleItem = (index: number) => {
  openIndex.value = openIndex.value === index ? -1 : index
}
</script>

<template>
  <section class="section faq-section">
    <div class="container">
      <div class="sec-title-double faq-section__head">
        <div>
          <p class="eyebrow">FAQ</p>
          <div class="h2">
            Частые <strong>вопросы</strong>
          </div>
        </div>
        <div class="text-3">
          Собрали короткие ответы на вопросы, которые чаще всего появляются перед заказом шоу или мастер-класса.
        </div>
      </div>

      <div class="faq-list">
        <article
          v-for="(item, index) in homeFaqItems"
          :key="item.question"
          class="faq-item"
          :class="{ 'faq-item--open': openIndex === index }"
        >
          <button type="button" class="faq-item__button" @click="toggleItem(index)">
            <span>{{ item.question }}</span>
            <span class="faq-item__icon">{{ openIndex === index ? '−' : '+' }}</span>
          </button>

          <div v-if="openIndex === index" class="faq-item__answer">
            <p>{{ item.answer }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
