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
  _rootRef: Ref<HTMLElement | null>,
  _selectors: string | string[],
  _options: RevealOptions = {}
) => {
  // Временно отключено для теста клиентского out of memory.
  // Компоненты могут продолжать вызывать useGsapReveal, но анимация не запускается.
}