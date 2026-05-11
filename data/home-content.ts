import homeContentRaw from './cms/home-content.json'

export type HomeScenarioCard = {
  title: string
  description: string
  image: string
}

export type HomeScenarioContent = {
  eyebrow: string
  titleStrong: string
  titleAccent: string
  lead: string
  cards: HomeScenarioCard[]
}

export type HomeShortItem = {
  id: string
  title: string
  videoId: string
  poster: string
}

export type HomeShortsContent = {
  eyebrow: string
  title: string
  description: string
  items: HomeShortItem[]
}

export type HomeFaqItem = {
  question: string
  answer: string
}

export type HomeFaqContent = {
  eyebrow: string
  title: string
  titleAccent: string
  description: string
  items: HomeFaqItem[]
}

export type HomeAboutPortrait = {
  src: string
  alt: string
}

export type HomeAboutContent = {
  eyebrow: string
  headline: string
  lead: string
  subheadingShows: string
  subheadingMasterclasses: string
  subheadingForWhom: string
  paragraphs: string[]
  portrait: HomeAboutPortrait
  tags: string[]
}

export type HomeContent = {
  scenario: HomeScenarioContent
  shorts: HomeShortsContent
  faq: HomeFaqContent
  about: HomeAboutContent
}

export const homeContent = homeContentRaw as HomeContent
export const homeScenarioContent = homeContent.scenario
export const homeShortsContent = homeContent.shorts
export const homeFaqContent = homeContent.faq
export const homeAboutContent = homeContent.about
