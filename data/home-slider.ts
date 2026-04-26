import homeSliderContent from './cms/home-slider.json'

export type HomeHeroSlide = {
  id: string
  eyebrow: string
  title: string
  script?: string
  summary?: string
  buttonLabel: string
  buttonHref: string
  image: string
  imageAlt?: string
  active?: boolean
}

export const homeHeroSlides = (homeSliderContent as HomeHeroSlide[]).filter((slide) => slide.active !== false)
