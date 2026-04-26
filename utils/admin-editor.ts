import type {
  CatalogFact,
  CatalogImage,
  MasterClassCategory,
  PricePoint,
  ShowProgram,
  WorkshopItem
} from '~/data/catalog'
import type { HomeHeroSlide } from '~/data/home-slider'

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

export const createId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`

export const linesToText = (items: string[]) => items.join('\n')

export const textToLines = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

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

export const fromShowDraft = (item: ShowDraft): ShowProgram => ({
  id: item.id,
  slug: item.slug,
  title: item.title,
  kicker: item.kicker,
  description: item.description,
  lead: item.lead,
  image: item.image,
  heroImage: item.heroImage,
  gallery: textToLines(item.galleryText).map(parseImageLine).filter(Boolean) as CatalogImage[],
  facts: textToLines(item.factsText).map(parseFactLine).filter(Boolean) as CatalogFact[],
  pricing: textToLines(item.pricingText).map(parsePriceLine).filter(Boolean) as PricePoint[],
  features: textToLines(item.featuresText),
  suitableFor: textToLines(item.suitableForText)
})

export const toWorkshopDraft = (item: WorkshopItem): WorkshopDraft => ({
  ...structuredClone(item),
  galleryText: item.gallery.map(formatImageLine).join('\n'),
  pricingText: item.pricing.map(formatPriceLine).join('\n'),
  formatsText: linesToText(item.formats),
  includesText: linesToText(item.includes)
})

export const fromWorkshopDraft = (item: WorkshopDraft): WorkshopItem => ({
  id: item.id,
  slug: item.slug,
  title: item.title,
  primaryCategorySlug: item.primaryCategorySlug,
  categorySlugs: Array.from(new Set(item.categorySlugs.filter(Boolean))),
  audienceLabel: item.audienceLabel,
  summary: item.summary,
  description: item.description,
  priceFrom: item.priceFrom,
  priceNote: item.priceNote,
  image: item.image,
  gallery: textToLines(item.galleryText).map(parseImageLine).filter(Boolean) as CatalogImage[],
  duration: item.duration,
  participants: item.participants,
  formats: textToLines(item.formatsText),
  includes: textToLines(item.includesText),
  pricing: textToLines(item.pricingText).map(parsePriceLine).filter(Boolean) as PricePoint[]
})

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
  audienceLabel: categories[0]?.title || '',
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
