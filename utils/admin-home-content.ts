import type { HomeContent } from '~/data/home-content'

export const createEmptyScenarioCard = () => ({
  title: '',
  description: '',
  image: ''
})

export const createEmptyShort = () => ({
  id: `short-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  title: '',
  videoId: '',
  poster: ''
})

export const createEmptyFaqItem = () => ({
  question: '',
  answer: ''
})

export const createEmptyHomeContent = (): HomeContent => ({
  scenario: {
    eyebrow: '',
    titleStrong: '',
    titleAccent: '',
    lead: '',
    cards: [createEmptyScenarioCard(), createEmptyScenarioCard(), createEmptyScenarioCard()]
  },
  shorts: {
    eyebrow: 'Shorts',
    title: '',
    description: '',
    items: [createEmptyShort(), createEmptyShort(), createEmptyShort(), createEmptyShort()]
  },
  faq: {
    eyebrow: 'FAQ',
    title: '',
    titleAccent: '',
    description: '',
    items: [createEmptyFaqItem(), createEmptyFaqItem(), createEmptyFaqItem()]
  },
  about: {
    eyebrow: 'О нас',
    headline: '',
    lead: '',
    subheadingShows: '',
    subheadingMasterclasses: '',
    subheadingForWhom: '',
    paragraphs: ['', '', '', '', '', '', ''],
    portrait: {
      src: '',
      alt: ''
    },
    tags: []
  }
})
