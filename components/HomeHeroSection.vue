<script setup lang="ts">
import { contactInfo } from '~/data/site'

const heroBackdrop =
  'images/hero.webp'
</script>

<template>
  <section class="hero intro hero--reference">
    <div class="hero__scene">
      <img :src="heroBackdrop" alt="Magic Iris event show">
    </div>

    <div class="hero__overlay" />

    <div class="container hero__inner">
      <div class="hero__copy">
        <p class="hero__eyebrow">Творческая студия в Иркутске</p>
        <h1 class="hero__headline">Шоу и мастер-классы, созданные специально для вашего события</h1>
                <p class="hero__script">в Иркутске</p>

        <p class="hero__summary">
          Оставьте заявку и мы подберём песочное шоу, световой номер, шоу-портрет или выездной
          мастер-класс под формат вашего праздника.
        </p>

        <div class="hero__cta">
          <a class="button button--accent btn hero__button" :href="contactInfo.whatsapp" target="_blank" rel="noreferrer">
            <span>заказать шоу</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
