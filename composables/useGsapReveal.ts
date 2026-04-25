import type { Ref } from 'vue'

type RevealOptions = {
  start?: string
  stagger?: number
  duration?: number
  once?: boolean
  y?: number
  x?: number
  scale?: number
  ease?: string
  blur?: number
  groupDelay?: number
}

export const useGsapReveal = (
  rootRef: Ref<HTMLElement | null>,
  selectors: string | string[],
  options: RevealOptions = {}
) => {
  let animationContext: { revert: () => void } | null = null

  onMounted(async () => {
    if (!rootRef.value) {
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
      const selectorGroups = (Array.isArray(selectors) ? selectors : [selectors])
        .map((selector) => Array.from(rootRef.value?.querySelectorAll<HTMLElement>(selector) || []))
        .filter((group) => group.length > 0)

      if (!selectorGroups.length) {
        return
      }

      const triggerTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.value,
          start: options.start ?? 'top 82%',
          once: options.once ?? true
        }
      })

      selectorGroups.forEach((targets, index) => {
        gsap.set(targets, {
          autoAlpha: 0,
          x: options.x ?? 0,
          y: options.y ?? 42,
          scale: options.scale ?? 0.985,
          filter: `blur(${options.blur ?? 10}px)`,
          willChange: 'transform, opacity, filter'
        })

        triggerTimeline.to(targets, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: options.duration ?? 0.72,
          stagger: options.stagger ?? 0.08,
          ease: options.ease ?? 'power3.out',
          clearProps: 'willChange'
        }, index === 0 ? 0 : `+=${options.groupDelay ?? 0.08}`)
      })
    }, rootRef.value)
  })

  onBeforeUnmount(() => {
    animationContext?.revert()
  })
}
