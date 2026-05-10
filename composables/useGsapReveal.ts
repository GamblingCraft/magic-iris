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
  let observer: IntersectionObserver | null = null
  const route = useRoute()

  onMounted(() => {
    const root = rootRef.value

    if (!root || !import.meta.client) {
      return
    }

    // Safe mode for the homepage: render content immediately without reveal effects.
    if (route.path === '/') {
      return
    }

    const selectorGroups = (Array.isArray(selectors) ? selectors : [selectors])
      .map((selector) => Array.from(root.querySelectorAll<HTMLElement>(selector)))
      .filter((group) => group.length > 0)

    if (!selectorGroups.length) {
      return
    }

    const baseDuration = options.duration ?? 0.72
    const stagger = options.stagger ?? 0.08
    const groupDelay = options.groupDelay ?? 0.08
    const offsetX = options.x ?? 0
    const offsetY = options.y ?? 42
    const offsetScale = options.scale ?? 0.985
    const offsetBlur = options.blur ?? 10
    const once = options.once ?? true

    selectorGroups.forEach((targets) => {
      targets.forEach((target) => {
        target.style.opacity = '0'
        target.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${offsetScale})`
        target.style.filter = `blur(${offsetBlur}px)`
        target.style.willChange = 'transform, opacity, filter'
      })
    })

    const reveal = () => {
      selectorGroups.forEach((targets, groupIndex) => {
        targets.forEach((target, itemIndex) => {
          const delay = groupIndex * groupDelay + itemIndex * stagger

          target.style.transition =
            `opacity ${baseDuration}s ease, transform ${baseDuration}s ease, filter ${baseDuration}s ease`
          target.style.transitionDelay = `${delay}s`

          requestAnimationFrame(() => {
            target.style.opacity = '1'
            target.style.transform = 'translate3d(0, 0, 0) scale(1)'
            target.style.filter = 'blur(0px)'
          })

          window.setTimeout(() => {
            target.style.willChange = ''
          }, (delay + baseDuration) * 1000 + 60)
        })
      })
    }

    observer = new IntersectionObserver((entries) => {
      const entry = entries[0]

      if (!entry?.isIntersecting) {
        return
      }

      reveal()

      if (once) {
        observer?.disconnect()
        observer = null
      }
    }, {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.12
    })

    observer.observe(root)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })
}
