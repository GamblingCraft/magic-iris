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
                <p class="eyebrow">FAQ</p>
      <div class="sec-title-double faq-section__head">
        <div>
          <h2 class="h2">
            Частые <strong>вопросы</strong>
          </h2>
        </div>
        <p class="catalog-preview__lead">
          Собрали короткие ответы на вопросы, которые чаще всего появляются перед заказом шоу или мастер-класса.
      </p>
      </div>
      <div class="faq-list">
        <article
          v-for="(item, index) in homeFaqItems"
          :key="item.question"
          class="faq-item"
          :class="{ 'faq-item--open': openIndex === index }"
        >
          <button
            type="button"
            class="faq-item__button"
            :aria-expanded="openIndex === index ? 'true' : 'false'"
            @click="toggleItem(index)"
          >
            <span>{{ item.question }}</span>
            <span class="faq-item__icon">{{ openIndex === index ? '−' : '+' }}</span>
          </button>

          <div class="faq-item__content" :class="{ 'faq-item__content--open': openIndex === index }">
            <div class="faq-item__answer">
              <p>{{ item.answer }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
