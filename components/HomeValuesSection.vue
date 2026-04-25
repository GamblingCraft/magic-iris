<script setup lang="ts">
import { valueCards, valueKeywords } from '~/data/site'

const repeatedKeywords = computed(() => [...valueKeywords, ...valueKeywords, ...valueKeywords, ...valueKeywords])
</script>

<template>
  <section class="section section--muted">
    <div class="container">
      <div class="keyword-ribbon">
        <span v-for="(keyword, index) in repeatedKeywords" :key="`${keyword}-${index}`">
          {{ keyword }}
        </span>
      </div>

      <div class="value-grid">
        <article v-for="card in valueCards" :key="card.title" class="value-card">
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
