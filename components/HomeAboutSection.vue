<script setup lang="ts">
import { aboutPortrait, aboutSeoParagraphs, aboutSeoTags } from '~/data/home-about'

const headline = 'Творческая студия в Иркутске для событий, которые хочется переживать снова'
const subheadingShows = 'Что мы создаём'
const subheadingMasterclasses = 'Авторские мастер-классы и арт-форматы'
const subheadingForWhom = 'Для кого и как мы работаем'

const lead =
  'Создаём песочное шоу, световое шоу, шоу-портреты и выездные мастер-классы для свадеб, дней рождения, корпоративов и камерных праздников, где важны атмосфера, подача и сильная эмоция.'

const keywordRowPrimary = [...aboutSeoTags, ...aboutSeoTags]
const keywordRowSecondary = [...[...aboutSeoTags].reverse(), ...[...aboutSeoTags].reverse()]
</script>

<template>
  <section id="about" class="section about-section">
    <div class="container about-section__intro">
      <p class="eyebrow">О нас</p>
    </div>

    <div class="container about-section__stage">
      <div class="about-section__sticky">
        <figure class="about-section__card">
          <img :src="aboutPortrait.src" :alt="aboutPortrait.alt" loading="lazy">
          <div class="about-section__card-overlay" />

          <figcaption class="about-section__card-content">
            <h2 class="about-section__card-title">{{ headline }}</h2>
          </figcaption>
        </figure>
      </div>
    </div>

    <div class="container">
      <div class="about-section__body">
        <p class="about-section__lead">{{ lead }}</p>

        <div class="about-section__text">
          <p>{{ aboutSeoParagraphs[0] }}</p>
          <p>{{ aboutSeoParagraphs[1] }}</p>

          <h3 class="about-section__subheading">{{ subheadingShows }}</h3>
          <p>{{ aboutSeoParagraphs[2] }}</p>

          <h3 class="about-section__subheading">{{ subheadingMasterclasses }}</h3>
          <p>{{ aboutSeoParagraphs[3] }}</p>

          <h3 class="about-section__subheading">{{ subheadingForWhom }}</h3>
          <p>{{ aboutSeoParagraphs[4] }}</p>
          <p>{{ aboutSeoParagraphs[5] }}</p>

          <p class="about-section__conclusion">{{ aboutSeoParagraphs[6] }}</p>
        </div>
      </div>
    </div>

    <div class="about-section__keywords">
      <div class="about-section__keywords-mask">
        <div class="about-section__keywords-track about-section__keywords-track--primary">
          <span v-for="(tag, index) in keywordRowPrimary" :key="`about-primary-${index}`">{{ tag }}</span>
        </div>
      </div>

      <div class="about-section__keywords-mask">
        <div class="about-section__keywords-track about-section__keywords-track--secondary">
          <span v-for="(tag, index) in keywordRowSecondary" :key="`about-secondary-${index}`">{{ tag }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
