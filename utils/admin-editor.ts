import {
  deriveWorkshopAudienceLabel,
  type CatalogFact,
  type CatalogImage,
  type MasterClassCategory,
  type PricePoint,
  type ShowProgram,
  type WorkshopItem
} from '~/data/catalog'
import type { HomeHeroSlide } from '~/data/home-slider'
import type { ServiceLandingPage, ServiceScenarioItem } from '~/data/service-pages'
import type { ShowCollectionPage } from '~/data/show-collections'
import type { CatalogCardItem } from '~/types/public-catalog'

export type ShowDraft = ShowProgram & {
  galleryText: string
  factsText: string
  pricingText: string
  featuresText: string
  suitableForText: string
}

export type WorkshopDraft = WorkshopItem & {
  galleryText: string
  pricingText: string
  formatsText: string
  includesText: string
}

export type ShowCollectionDraft = ShowCollectionPage & {
  heroTagsText: string
  heroFactsText: string
  cardsShowSlugsText: string
  scenarioPointsText: string
  workshopsCategorySlugsText: string
  aboutParagraphsText: string
}

export type ServiceLandingDraft = ServiceLandingPage & {
  heroTagsText: string
  heroFactsText: string
  aboutBlocks: Array<{
    title: string
    itemsText: string
  }>
}

export const createId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`

export const linesToText = (items: string[]) => items.join('\n')

export const textToLines = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

const clonePlain = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

const formatImageLine = (item: CatalogImage) => `${item.id}|${item.src}|${item.alt}`
const parseImageLine = (line: string): CatalogImage | null => {
  const [id, src, alt] = line.split('|').map((part) => part.trim())

  if (!src) {
    return null
  }

  return {
    id: id || createId('image'),
    src,
    alt: alt || ''
  }
}

const formatFactLine = (item: CatalogFact) => `${item.label}|${item.value}`
const parseFactLine = (line: string): CatalogFact | null => {
  const [label, value] = line.split('|').map((part) => part.trim())

  if (!label || !value) {
    return null
  }

  return { label, value }
}

const formatPriceLine = (item: PricePoint) =>
  [item.label, item.value, item.note || ''].join('|')

const parsePriceLine = (line: string): PricePoint | null => {
  const [label, value, note] = line.split('|').map((part) => part.trim())

  if (!label || !value) {
    return null
  }

  return {
    label,
    value,
    note: note || undefined
  }
}

export const toShowDraft = (item: ShowProgram): ShowDraft => ({
  ...structuredClone(item),
  galleryText: item.gallery.map(formatImageLine).join('\n'),
  factsText: item.facts.map(formatFactLine).join('\n'),
  pricingText: item.pricing.map(formatPriceLine).join('\n'),
  featuresText: linesToText(item.features),
  suitableForText: linesToText(item.suitableFor)
})

export const fromShowDraft = (item: ShowDraft): ShowProgram => {
  const galleryFromText = textToLines(item.galleryText).map(parseImageLine).filter(Boolean) as CatalogImage[]
  const gallery =
    item.gallery
      .map((image) => ({
        id: image.id || createId('image'),
        src: image.src?.trim() || '',
        alt: image.alt?.trim() || ''
      }))
      .filter((image) => image.src) || []

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    kicker: item.kicker,
    description: item.description,
    lead: item.lead,
    image: item.image,
    heroImage: item.heroImage,
    gallery: gallery.length ? gallery : galleryFromText,
    facts: textToLines(item.factsText).map(parseFactLine).filter(Boolean) as CatalogFact[],
    pricing: textToLines(item.pricingText).map(parsePriceLine).filter(Boolean) as PricePoint[],
    features: textToLines(item.featuresText),
    suitableFor: textToLines(item.suitableForText)
  }
}

export const toWorkshopDraft = (item: WorkshopItem): WorkshopDraft => ({
  ...structuredClone(item),
  galleryText: item.gallery.map(formatImageLine).join('\n'),
  pricingText: item.pricing.map(formatPriceLine).join('\n'),
  formatsText: linesToText(item.formats),
  includesText: linesToText(item.includes)
})

export const fromWorkshopDraft = (
  item: WorkshopDraft,
  categories: MasterClassCategory[] = []
): WorkshopItem => {
  const galleryFromText = textToLines(item.galleryText).map(parseImageLine).filter(Boolean) as CatalogImage[]
  const gallery =
    item.gallery
      .map((image) => ({
        id: image.id || createId('image'),
        src: image.src?.trim() || '',
        alt: image.alt?.trim() || ''
      }))
      .filter((image) => image.src) || []

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    primaryCategorySlug: item.primaryCategorySlug,
    categorySlugs: Array.from(new Set(item.categorySlugs.filter(Boolean))),
    audienceLabel: deriveWorkshopAudienceLabel(
      Array.from(new Set(item.categorySlugs.filter(Boolean))),
      categories
    ) || item.audienceLabel,
    summary: item.summary,
    description: item.description,
    priceFrom: item.priceFrom,
    priceNote: item.priceNote,
    image: item.image,
    gallery: gallery.length ? gallery : galleryFromText,
    duration: item.duration,
    participants: item.participants,
    formats: textToLines(item.formatsText),
    includes: textToLines(item.includesText),
    pricing: textToLines(item.pricingText).map(parsePriceLine).filter(Boolean) as PricePoint[]
  }
}

export const createEmptySlide = (): HomeHeroSlide => ({
  id: createId('slide'),
  eyebrow: '',
  title: '',
  script: '',
  summary: '',
  buttonLabel: 'Открыть',
  buttonHref: '',
  image: '',
  imageAlt: '',
  active: true
})

export const createEmptyShowDraft = (): ShowDraft => ({
  id: createId('show'),
  slug: '',
  title: '',
  kicker: '',
  description: '',
  lead: '',
  image: '',
  heroImage: '',
  gallery: [],
  facts: [],
  pricing: [],
  features: [],
  suitableFor: [],
  galleryText: '',
  factsText: '',
  pricingText: '',
  featuresText: '',
  suitableForText: ''
})

export const createEmptyWorkshopDraft = (categories: MasterClassCategory[]): WorkshopDraft => ({
  id: createId('workshop'),
  slug: '',
  title: '',
  primaryCategorySlug: categories[0]?.slug || '',
  categorySlugs: categories[0] ? [categories[0].slug] : [],
  audienceLabel: deriveWorkshopAudienceLabel(categories[0] ? [categories[0].slug] : [], categories),
  summary: '',
  description: '',
  priceFrom: '',
  priceNote: '',
  image: '',
  gallery: [],
  duration: '',
  participants: '',
  formats: [],
  includes: [],
  pricing: [],
  galleryText: '',
  pricingText: '',
  formatsText: '',
  includesText: ''
})

export const createEmptyMasterClassCategory = (): MasterClassCategory => ({
  id: createId('category'),
  slug: '',
  title: '',
  count: 0,
  description: '',
  lead: '',
  image: ''
})

export const toShowCollectionDraft = (item: ShowCollectionPage): ShowCollectionDraft => ({
  ...clonePlain(item),
  scenario: {
    ...clonePlain(item.scenario),
    images: Array.from({ length: 3 }, (_, index) => item.scenario.images[index]?.trim() || '')
  },
  heroTagsText: linesToText(item.hero.tags),
  heroFactsText: item.hero.facts.map(formatFactLine).join('\n'),
  cardsShowSlugsText: linesToText(item.cards.showSlugs),
  scenarioPointsText: linesToText(item.scenario.points),
  workshopsCategorySlugsText: linesToText(item.workshops.categorySlugs),
  aboutParagraphsText: linesToText(item.about.paragraphs)
})

export const fromShowCollectionDraft = (item: ShowCollectionDraft): ShowCollectionPage => ({
  seo: clonePlain(item.seo),
  breadcrumbLabel: item.breadcrumbLabel,
  hero: {
    ...clonePlain(item.hero),
    tags: textToLines(item.heroTagsText),
    facts: textToLines(item.heroFactsText).map(parseFactLine).filter(Boolean) as CatalogFact[]
  },
  cards: {
    ...clonePlain(item.cards),
    showSlugs: textToLines(item.cardsShowSlugsText)
  },
  scenario: {
    ...clonePlain(item.scenario),
    points: textToLines(item.scenarioPointsText),
    images: Array.from({ length: 3 }, (_, index) => item.scenario.images[index]?.trim() || '')
  },
  workshops: {
    ...clonePlain(item.workshops),
    categorySlugs: textToLines(item.workshopsCategorySlugsText)
  },
  about: {
    ...clonePlain(item.about),
    paragraphs: textToLines(item.aboutParagraphsText)
  },
  cta: clonePlain(item.cta)
})

const createEmptyServiceScenarioItem = (): ServiceScenarioItem => ({
  title: '',
  text: '',
  image: ''
})

const createEmptyServiceCard = (): CatalogCardItem => ({
  id: createId('service-card'),
  href: '',
  image: '',
  imageAlt: '',
  kicker: '',
  title: '',
  description: '',
  metaPrimary: '',
  metaLabel: '',
  buttonLabel: 'Открыть'
})

export const toServiceLandingDraft = (item: ServiceLandingPage): ServiceLandingDraft => ({
  ...structuredClone(item),
  scenario: {
    ...structuredClone(item.scenario),
    items: Array.from({ length: 3 }, (_, index) => item.scenario.items[index] || createEmptyServiceScenarioItem())
  },
  cards: {
    ...structuredClone(item.cards),
    items: Array.from({ length: 3 }, (_, index) => item.cards.items[index] || createEmptyServiceCard())
  },
  aboutBlocks: Array.from({ length: 2 }, (_, index) => {
    const block = item.about.blocks[index]

    return {
      title: block?.title || '',
      itemsText: linesToText(block?.items || [])
    }
  }),
  heroTagsText: linesToText(item.hero.tags),
  heroFactsText: item.hero.facts.map(formatFactLine).join('\n')
})

export const fromServiceLandingDraft = (item: ServiceLandingDraft): ServiceLandingPage => ({
  seo: structuredClone(item.seo),
  breadcrumbLabel: item.breadcrumbLabel,
  hero: {
    ...structuredClone(item.hero),
    tags: textToLines(item.heroTagsText),
    facts: textToLines(item.heroFactsText).map(parseFactLine).filter(Boolean) as CatalogFact[]
  },
  scenario: {
    ...structuredClone(item.scenario),
    items: item.scenario.items.map((scenarioItem) => ({
      title: scenarioItem.title.trim(),
      text: scenarioItem.text.trim(),
      image: scenarioItem.image.trim()
    }))
  },
  cards: {
    ...structuredClone(item.cards),
    items: item.cards.items.map((card) => ({
      ...structuredClone(card),
      metaPrimary: card.metaPrimary?.trim() || '',
      metaLabel: card.metaLabel?.trim() || ''
    }))
  },
  about: {
    ...structuredClone(item.about),
    blocks: item.aboutBlocks.map((block) => ({
      title: block.title.trim(),
      items: textToLines(block.itemsText)
    }))
  },
  cta: structuredClone(item.cta)
})
