<script setup lang="ts">
import { contactInfo, showPrograms } from '~/data/site'
</script>

<template>
  <section class="section section--statement">
    <div class="container statement-panel">
      <div class="statement-panel__content">
        <p class="eyebrow eyebrow--light">Magic Iris</p>
        <h2>Сценический визуал для событий, где важно впечатлить с первого взгляда</h2>
        <p>
          Песочные и световые шоу, шоу-портреты и выездные творческие форматы для свадеб,
          корпоративов, городских событий и камерных праздников.
        </p>

        <div class="statement-panel__actions">
          <NuxtLink to="/shows" class="button button--accent btn">
            <span>Смотреть шоу</span>
          </NuxtLink>

          <a
            class="button button--ghost-light btn btn--ghost-ref"
            :href="contactInfo.telegram"
            target="_blank"
            rel="noreferrer"
          >
            <span>Сценарий под событие</span>
          </a>
        </div>
      </div>

      <div class="statement-panel__media">
        <img :src="showPrograms[1]?.image" alt="Magic Iris на сцене">
      </div>
    </div>
  </section>
</template>
