<script setup lang="ts">
import { aboutPortrait, aboutSeoParagraphs, aboutSeoTags } from '~/data/home-about'

const sectionRef = ref<HTMLElement | null>(null)
const introRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const cardRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)
const stageContentRef = ref<HTMLElement | null>(null)
const bodyRef = ref<HTMLElement | null>(null)
const keywordsRef = ref<HTMLElement | null>(null)
const keywordsRowPrimaryRef = ref<HTMLElement | null>(null)
const keywordsRowSecondaryRef = ref<HTMLElement | null>(null)

const headline = 'Творческая студия в Иркутске для событий, которые хочется переживать снова'
const lead =
  'Создаём песочное шоу, световое шоу, шоу-портреты и выездные мастер-классы для свадеб, дней рождения, корпоративов и камерных праздников, где важны атмосфера, подача и сильная эмоция.'

const keywordRowPrimary = [...aboutSeoTags, ...aboutSeoTags, ...aboutSeoTags]
const keywordRowSecondary = [...[...aboutSeoTags].reverse(), ...[...aboutSeoTags].reverse(), ...[...aboutSeoTags].reverse()]

let animationContext: { revert: () => void } | null = null
let mediaMatcher: { revert: () => void } | null = null

onMounted(async () => {
  if (
    !sectionRef.value ||
    !introRef.value ||
    !stageRef.value ||
    !cardRef.value ||
    !imageRef.value ||
    !overlayRef.value ||
    !stageContentRef.value ||
    !bodyRef.value ||
    !keywordsRef.value ||
    !keywordsRowPrimaryRef.value ||
    !keywordsRowSecondaryRef.value
  ) {
    return
  }

  const gsapModule = await import('gsap')
  const scrollTriggerModule = await import('gsap/ScrollTrigger')
  const gsap = gsapModule.gsap || gsapModule.default || gsapModule
  const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default

  if (!ScrollTrigger) {
    return
  }

  gsap.registerPlugin(ScrollTrigger)

  animationContext = gsap.context(() => {
    mediaMatcher = gsap.matchMedia()

    const introTargets = Array.from(introRef.value?.querySelectorAll<HTMLElement>(':scope > *') || [])
    const stageTargets = Array.from(stageContentRef.value?.querySelectorAll<HTMLElement>(':scope > *') || [])
    const bodyTargets = Array.from(bodyRef.value?.querySelectorAll<HTMLElement>(':scope > *') || [])

    const revealConfig = {
      autoAlpha: 0,
      y: 30,
      filter: 'blur(10px)',
      willChange: 'transform, opacity, filter'
    }

    gsap.set(introTargets, revealConfig)
    gsap.set(bodyTargets, revealConfig)
    gsap.set(keywordsRef.value, {
      autoAlpha: 0,
      y: 20,
      filter: 'blur(10px)',
      willChange: 'transform, opacity, filter'
    })

    gsap.to(introTargets, {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.82,
      stagger: 0.08,
      ease: 'power3.out',
      clearProps: 'willChange',
      scrollTrigger: {
        trigger: introRef.value,
        start: 'top 84%',
        once: true
      }
    })

    gsap.to(bodyTargets, {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.84,
      stagger: 0.08,
      ease: 'power3.out',
      clearProps: 'willChange',
      scrollTrigger: {
        trigger: bodyRef.value,
        start: 'top 82%',
        once: true
      }
    })

    gsap.to(keywordsRef.value, {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.84,
      ease: 'power3.out',
      clearProps: 'willChange',
      scrollTrigger: {
        trigger: keywordsRef.value,
        start: 'top 88%',
        once: true
      }
    })

    mediaMatcher.add('(min-width: 901px)', () => {
      gsap.set(cardRef.value, {
        y: 64,
        scale: 0.88,
        borderRadius: 44,
        transformOrigin: 'center center',
        willChange: 'transform, border-radius'
      })

      gsap.set(imageRef.value, {
        scale: 1.1,
        yPercent: -4,
        transformOrigin: 'center center',
        willChange: 'transform'
      })

      gsap.set(overlayRef.value, {
        opacity: 0.12,
        willChange: 'opacity'
      })

      gsap.set(stageTargets, {
        autoAlpha: 0,
        y: 28,
        filter: 'blur(10px)',
        willChange: 'transform, opacity, filter'
      })

      gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.value,
          start: 'top 82%',
          end: 'bottom 24%',
          scrub: 0.78
        }
      })
        .to(cardRef.value, {
          y: 0,
          scale: 1,
          borderRadius: 34,
          ease: 'none',
          duration: 1
        }, 0)
        .to(imageRef.value, {
          scale: 1.14,
          yPercent: 2,
          ease: 'none',
          duration: 1
        }, 0)
        .to(overlayRef.value, {
          opacity: 1,
          ease: 'none',
          duration: 0.86
        }, 0.06)
        .to(stageTargets, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.44,
          stagger: 0.08,
          ease: 'power2.out'
        }, 0.2)

      const getKeywordTravel = () => Math.min(window.innerWidth * 0.24, 320)

      gsap.fromTo(
        keywordsRowPrimaryRef.value,
        { x: 0 },
        {
          x: () => -getKeywordTravel(),
          ease: 'none',
          scrollTrigger: {
            trigger: keywordsRef.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1,
            invalidateOnRefresh: true
          }
        }
      )

      gsap.fromTo(
        keywordsRowSecondaryRef.value,
        { x: () => -getKeywordTravel() * 0.45 },
        {
          x: () => getKeywordTravel() * 0.8,
          ease: 'none',
          scrollTrigger: {
            trigger: keywordsRef.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1,
            invalidateOnRefresh: true
          }
        }
      )
    })

    mediaMatcher.add('(max-width: 900px)', () => {
      gsap.set(stageTargets, {
        autoAlpha: 0,
        y: 24,
        filter: 'blur(8px)',
        willChange: 'transform, opacity, filter'
      })

      gsap.fromTo(
        cardRef.value,
        {
          autoAlpha: 0,
          y: 28,
          scale: 0.97,
          filter: 'blur(10px)'
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.86,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: stageRef.value,
            start: 'top 88%',
            once: true
          }
        }
      )

      gsap.fromTo(
        stageTargets,
        {
          autoAlpha: 0,
          y: 22,
          filter: 'blur(8px)'
        },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.74,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: stageRef.value,
            start: 'top 82%',
            once: true
          }
        }
      )

      gsap.fromTo(
        keywordsRowPrimaryRef.value,
        { x: -30 },
        {
          x: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: keywordsRef.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.15
          }
        }
      )

      gsap.fromTo(
        keywordsRowSecondaryRef.value,
        { x: 18 },
        {
          x: -28,
          ease: 'none',
          scrollTrigger: {
            trigger: keywordsRef.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.15
          }
        }
      )
    })
  }, sectionRef.value)
})

onBeforeUnmount(() => {
  mediaMatcher?.revert()
  animationContext?.revert()
})
</script>

<template>
  <section id="about" ref="sectionRef" class="section about-section">
    <div ref="introRef" class="container about-section__intro">
      <p class="eyebrow">О нас</p>
    </div>

    <div ref="stageRef" class="container about-section__stage">
      <div class="about-section__sticky">
        <figure ref="cardRef" class="about-section__card">
          <img ref="imageRef" :src="aboutPortrait.src" :alt="aboutPortrait.alt" loading="lazy">
          <div ref="overlayRef" class="about-section__card-overlay" />

          <figcaption ref="stageContentRef" class="about-section__card-content">
            <h3 class="about-section__card-title">{{ headline }}</h3>
          </figcaption>
        </figure>
      </div>
    </div>

    <div class="container">
      <div ref="bodyRef" class="about-section__body">
        <p class="about-section__lead">{{ lead }}</p>

        <div class="about-section__text">
          <p v-for="paragraph in aboutSeoParagraphs" :key="paragraph">
            {{ paragraph }}
          </p>
        </div>
      </div>
    </div>

    <div ref="keywordsRef" class="about-section__keywords">
      <div class="about-section__keywords-mask">
        <div ref="keywordsRowPrimaryRef" class="about-section__keywords-track about-section__keywords-track--primary">
          <span v-for="(tag, index) in keywordRowPrimary" :key="`about-primary-${index}`">{{ tag }}</span>
        </div>
      </div>

      <div class="about-section__keywords-mask">
        <div ref="keywordsRowSecondaryRef" class="about-section__keywords-track about-section__keywords-track--secondary">
          <span v-for="(tag, index) in keywordRowSecondary" :key="`about-secondary-${index}`">{{ tag }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
