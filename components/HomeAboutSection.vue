<script setup lang="ts">
import { aboutPortrait, aboutSeoParagraphs, aboutSeoTags } from '~/data/home-about'

const headline = 'РўРІРѕСЂС‡РµСЃРєР°СЏ СЃС‚СѓРґРёСЏ РІ РСЂРєСѓС‚СЃРєРµ РґР»СЏ СЃРѕР±С‹С‚РёР№, РєРѕС‚РѕСЂС‹Рµ С…РѕС‡РµС‚СЃСЏ РїРµСЂРµР¶РёРІР°С‚СЊ СЃРЅРѕРІР°'
const subheadingShows = 'Р§С‚Рѕ РјС‹ СЃРѕР·РґР°С‘Рј'
const subheadingMasterclasses = 'РђРІС‚РѕСЂСЃРєРёРµ РјР°СЃС‚РµСЂ-РєР»Р°СЃСЃС‹ Рё Р°СЂС‚-С„РѕСЂРјР°С‚С‹'
const subheadingForWhom = 'Р”Р»СЏ РєРѕРіРѕ Рё РєР°Рє РјС‹ СЂР°Р±РѕС‚Р°РµРј'

const lead =
  'РЎРѕР·РґР°С‘Рј РїРµСЃРѕС‡РЅРѕРµ С€РѕСѓ, СЃРІРµС‚РѕРІРѕРµ С€РѕСѓ, С€РѕСѓ-РїРѕСЂС‚СЂРµС‚С‹ Рё РІС‹РµР·РґРЅС‹Рµ РјР°СЃС‚РµСЂ-РєР»Р°СЃСЃС‹ РґР»СЏ СЃРІР°РґРµР±, РґРЅРµР№ СЂРѕР¶РґРµРЅРёСЏ, РєРѕСЂРїРѕСЂР°С‚РёРІРѕРІ Рё РєР°РјРµСЂРЅС‹С… РїСЂР°Р·РґРЅРёРєРѕРІ, РіРґРµ РІР°Р¶РЅС‹ Р°С‚РјРѕСЃС„РµСЂР°, РїРѕРґР°С‡Р° Рё СЃРёР»СЊРЅР°СЏ СЌРјРѕС†РёСЏ.'

const keywordRowPrimary = [...aboutSeoTags, ...aboutSeoTags]
const keywordRowSecondary = [...[...aboutSeoTags].reverse(), ...[...aboutSeoTags].reverse()]
</script>

<template>
  <section id="about" class="section about-section">
    <div class="container about-section__intro">
      <p class="eyebrow">Рћ РЅР°СЃ</p>
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
