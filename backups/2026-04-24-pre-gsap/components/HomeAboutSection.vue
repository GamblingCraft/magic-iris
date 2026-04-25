<script setup lang="ts">
import { aboutPortrait, aboutSeoParagraphs, aboutSeoTags } from '~/data/home-about'
</script>

<template>
  <section id="about" class="section about-section">
    <div class="container">
      <div class="about-section__hero">
        <div class="about-section__copy">
          <p class="eyebrow">О нас</p>
          <h2>Творческая студия в Иркутске для событий, которые хочется переживать снова</h2>

          <p class="about-section__lead">
            Создаём песочное шоу, световое шоу, шоу-портреты и выездные мастер-классы для свадеб, дней рождения,
            корпоративов и камерных праздников, где важны атмосфера, подача и сильная эмоция.
          </p>

          <div class="about-section__text">
            <p v-for="paragraph in aboutSeoParagraphs" :key="paragraph">
              {{ paragraph }}
            </p>
          </div>

          <div class="about-section__tags">
            <span v-for="tag in aboutSeoTags" :key="tag">{{ tag }}</span>
          </div>
        </div>

        <figure class="about-section__portrait">
          <img :src="aboutPortrait.src" :alt="aboutPortrait.alt" loading="lazy">
        </figure>
      </div>
    </div>
  </section>
</template>
