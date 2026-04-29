import catalogContent from './cms/catalog-content.json'

export type CatalogImage = {
  id: string
  src: string
  alt: string
}

export type CatalogFact = {
  label: string
  value: string
}

export type PricePoint = {
  label: string
  value: string
  note?: string
}

export type ShowProgram = {
  id: string
  slug: string
  title: string
  kicker: string
  description: string
  lead: string
  image: string
  heroImage: string
  gallery: CatalogImage[]
  facts: CatalogFact[]
  pricing: PricePoint[]
  features: string[]
  suitableFor: string[]
}

export type MasterClassCategory = {
  id: string
  slug: string
  title: string
  count: number
  description: string
  lead: string
  image: string
}

export type WorkshopItem = {
  id: string
  slug: string
  title: string
  primaryCategorySlug: string
  categorySlugs: string[]
  audienceLabel: string
  summary: string
  description: string
  priceFrom: string
  priceNote: string
  image: string
  gallery: CatalogImage[]
  duration: string
  participants: string
  formats: string[]
  includes: string[]
  pricing: PricePoint[]
}

export type HomeCatalogTile = {
  id: string
  title: string
  subtitle: string
  href: string
  image: string
  size: 'wide' | 'tall' | 'small' | 'medium'
}

type RawCatalogContent = {
  masterClassesHeroImage?: string
  shows: ShowProgram[]
  masterClassCategories: MasterClassCategory[]
  workshops: WorkshopItem[]
}

const cmsCatalog = catalogContent as RawCatalogContent

export const masterClassesHeroImage = cmsCatalog.masterClassesHeroImage || ''

export const createShowHref = (slug: string) => `/shows/${slug}`
export const createMasterClassCategoryHref = (slug: string) => `/master-classes/${slug}`
export const createMasterClassHref = (categorySlug: string, slug: string) =>
  `/master-classes/${categorySlug}/${slug}`

export const deriveWorkshopAudienceLabel = (
  categorySlugs: string[],
  categories: Array<Pick<MasterClassCategory, 'slug' | 'title'>>
) =>
  categorySlugs
    .map((slug) => categories.find((category) => category.slug === slug)?.title || '')
    .filter(Boolean)
    .join(' · ')

const normalizeCatalogText = (value?: string) =>
  (value || '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim()

const capitalizeCatalogText = (value: string) =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value

const stripParticipantsPrefix = (value: string) =>
  value
    .replace(/^Общее количество участников\s*[—-]\s*/iu, '')
    .replace(/^Количество участников\s*[—-]\s*/iu, '')
    .trim()

const participantDetailMarkers = [
  ' Изготовление ',
  ' Большой выбор ',
  ' Работа с ',
  ' Работа ',
  ' Украшение ',
  ' Крепление ',
  ' Упаковка ',
  ' Мастер-класс ',
  ' Время создания ',
  ' Продолжительность ',
  ' Формат подходит ',
  ' Формат удобно ',
  ' Гости ',
  ' ЗАКАЗАТЬ ',
  ' ГРУППОВОЙ ФОРМАТ ',
  ' Главная '
]

const formatWorkshopDescriptionAppendix = (value: string) => {
  let formatted = normalizeCatalogText(value)

  if (!formatted) {
    return ''
  }

  for (const marker of participantDetailMarkers) {
    const normalizedMarker = marker.trim()

    if (!normalizedMarker) {
      continue
    }

    const escapedMarker = normalizedMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    formatted = formatted.replace(
      new RegExp(`(?<!^)(?<![.!?])\\s+${escapedMarker}`, 'gu'),
      `. ${normalizedMarker}`
    )
  }

  return formatted
}

const splitWorkshopParticipants = (rawValue: string) => {
  const value = normalizeCatalogText(rawValue)

  if (!value) {
    return { participants: '', descriptionAppendix: '' }
  }

  const explicitMatch = value.match(
    /^Общее количество участников\s*[—-]\s*(не ограничено|до\s*\d+\s*(?:участников|человек)(?:\s*на\s*одного\s*мастера)?)/iu
  )

  if (explicitMatch?.[0]) {
    return {
      participants: stripParticipantsPrefix(explicitMatch[0]),
      descriptionAppendix: normalizeCatalogText(value.slice(explicitMatch[0].length))
    }
  }

  const shortMatch = value.match(
    /^(не ограничено|до\s*\d+\s*(?:участников|человек)(?:\s*на\s*одного\s*мастера)?|под формат события)/iu
  )

  if (shortMatch?.[0]) {
    return {
      participants: normalizeCatalogText(shortMatch[0]),
      descriptionAppendix: normalizeCatalogText(value.slice(shortMatch[0].length))
    }
  }

  const markerIndex = participantDetailMarkers
    .map((marker) => value.indexOf(marker))
    .filter((index) => index > 0)
    .sort((left, right) => left - right)[0]

  if (typeof markerIndex === 'number') {
    return {
      participants: stripParticipantsPrefix(normalizeCatalogText(value.slice(0, markerIndex))),
      descriptionAppendix: normalizeCatalogText(value.slice(markerIndex))
    }
  }

  return {
    participants: stripParticipantsPrefix(value),
    descriptionAppendix: ''
  }
}

const appendWorkshopDescription = (baseDescription: string, appendix: string) => {
  const normalizedBase = normalizeCatalogText(baseDescription)
  const normalizedAppendix = formatWorkshopDescriptionAppendix(appendix)

  if (!normalizedAppendix) {
    return normalizedBase
  }

  if (!normalizedBase) {
    return normalizedAppendix
  }

  if (normalizedBase.includes(normalizedAppendix)) {
    return normalizedBase
  }

  const separator = /[.!?…]$/u.test(normalizedBase) ? ' ' : '. '
  return `${normalizedBase}${separator}${normalizedAppendix}`
}

const normalizeWorkshopItem = (
  item: WorkshopItem,
  categories: Array<Pick<MasterClassCategory, 'slug' | 'title'>>
): WorkshopItem => {
  const { participants, descriptionAppendix } = splitWorkshopParticipants(item.participants)

  return {
    ...item,
    audienceLabel: deriveWorkshopAudienceLabel(item.categorySlugs, categories) || item.audienceLabel,
    participants: capitalizeCatalogText(participants || item.participants),
    description: appendWorkshopDescription(item.description, descriptionAppendix)
  }
}

const normalizeCategory = (
  category: MasterClassCategory,
  workshops: WorkshopItem[]
): MasterClassCategory => ({
  ...category,
  count: workshops.filter((item) => item.categorySlugs.includes(category.slug)).length
})

export const shows: ShowProgram[] = cmsCatalog.shows

export const showPrograms = shows

export const workshopItems: WorkshopItem[] = cmsCatalog.workshops.map((item) =>
  normalizeWorkshopItem(item as WorkshopItem, cmsCatalog.masterClassCategories)
)

export const masterClassCategories: MasterClassCategory[] = cmsCatalog.masterClassCategories.map(
  (category) => normalizeCategory(category as MasterClassCategory, workshopItems)
)

export const featuredWorkshopFormats = workshopItems.slice(0, 6).map((workshop) => ({
  title: workshop.title,
  audience: workshop.audienceLabel,
  price: workshop.priceFrom,
  href: createMasterClassHref(workshop.primaryCategorySlug, workshop.slug)
}))

const showTileConfigs = [
  { id: 'tile-sand', slug: 'pesochnoe-shou', size: 'wide' as const },
  { id: 'tile-light', slug: 'svetovoe-shou', size: 'tall' as const },
  { id: 'tile-portraits', slug: 'shou-portrety', size: 'small' as const },
  { id: 'tile-rotating', slug: 'krutyashchiysya-portret', size: 'small' as const }
]

const categoryTileConfigs = [
  { id: 'tile-women', slug: 'dlya-zhenshchin', size: 'medium' as const },
  { id: 'tile-school', slug: 'v-shkolu', size: 'medium' as const },
  { id: 'tile-new-year', slug: 'novogodnie', size: 'medium' as const }
]

export const homeCatalogTiles: HomeCatalogTile[] = [
  ...showTileConfigs
    .map((config) => {
      const show = shows.find((item) => item.slug === config.slug)

      if (!show) {
        return null
      }

      return {
        id: config.id,
        title: show.title,
        subtitle: show.kicker,
        href: createShowHref(show.slug),
        image: show.image,
        size: config.size
      }
    })
    .filter(Boolean) as HomeCatalogTile[],
  ...categoryTileConfigs
    .map((config) => {
      const category = masterClassCategories.find((item) => item.slug === config.slug)

      if (!category) {
        return null
      }

      return {
        id: config.id,
        title: category.title,
        subtitle: `${category.count} форматов`,
        href: createMasterClassCategoryHref(category.slug),
        image: category.image,
        size: config.size
      }
    })
    .filter(Boolean) as HomeCatalogTile[]
]

export const getShowBySlug = (slug: string) => shows.find((item) => item.slug === slug)

export const getMasterClassCategoryBySlug = (slug: string) =>
  masterClassCategories.find((category) => category.slug === slug)

export const getWorkshopsByCategorySlug = (categorySlug: string) =>
  workshopItems.filter((item) => item.categorySlugs.includes(categorySlug))

export const getWorkshopBySlugs = (categorySlug: string, workshopSlug: string) =>
  workshopItems.find(
    (item) => item.slug === workshopSlug && item.categorySlugs.includes(categorySlug)
  )
