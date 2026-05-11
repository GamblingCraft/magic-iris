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
    .replace(/^РћР±С‰РµРµ РєРѕР»РёС‡РµСЃС‚РІРѕ СѓС‡Р°СЃС‚РЅРёРєРѕРІ\s*[вЂ”-]\s*/iu, '')
    .replace(/^РљРѕР»РёС‡РµСЃС‚РІРѕ СѓС‡Р°СЃС‚РЅРёРєРѕРІ\s*[вЂ”-]\s*/iu, '')
    .trim()

const participantDetailMarkers = [
  ' РР·РіРѕС‚РѕРІР»РµРЅРёРµ ',
  ' Р‘РѕР»СЊС€РѕР№ РІС‹Р±РѕСЂ ',
  ' Р Р°Р±РѕС‚Р° СЃ ',
  ' Р Р°Р±РѕС‚Р° ',
  ' РЈРєСЂР°С€РµРЅРёРµ ',
  ' РљСЂРµРїР»РµРЅРёРµ ',
  ' РЈРїР°РєРѕРІРєР° ',
  ' РњР°СЃС‚РµСЂ-РєР»Р°СЃСЃ ',
  ' Р’СЂРµРјСЏ СЃРѕР·РґР°РЅРёСЏ ',
  ' РџСЂРѕРґРѕР»Р¶РёС‚РµР»СЊРЅРѕСЃС‚СЊ ',
  ' Р¤РѕСЂРјР°С‚ РїРѕРґС…РѕРґРёС‚ ',
  ' Р¤РѕСЂРјР°С‚ СѓРґРѕР±РЅРѕ ',
  ' Р“РѕСЃС‚Рё ',
  ' Р—РђРљРђР—РђРўР¬ ',
  ' Р“Р РЈРџРџРћР’РћР™ Р¤РћР РњРђРў ',
  ' Р“Р»Р°РІРЅР°СЏ '
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
    /^РћР±С‰РµРµ РєРѕР»РёС‡РµСЃС‚РІРѕ СѓС‡Р°СЃС‚РЅРёРєРѕРІ\s*[вЂ”-]\s*(РЅРµ РѕРіСЂР°РЅРёС‡РµРЅРѕ|РґРѕ\s*\d+\s*(?:СѓС‡Р°СЃС‚РЅРёРєРѕРІ|С‡РµР»РѕРІРµРє)(?:\s*РЅР°\s*РѕРґРЅРѕРіРѕ\s*РјР°СЃС‚РµСЂР°)?)/iu
  )

  if (explicitMatch?.[0]) {
    return {
      participants: stripParticipantsPrefix(explicitMatch[0]),
      descriptionAppendix: normalizeCatalogText(value.slice(explicitMatch[0].length))
    }
  }

  const shortMatch = value.match(
    /^(РЅРµ РѕРіСЂР°РЅРёС‡РµРЅРѕ|РґРѕ\s*\d+\s*(?:СѓС‡Р°СЃС‚РЅРёРєРѕРІ|С‡РµР»РѕРІРµРє)(?:\s*РЅР°\s*РѕРґРЅРѕРіРѕ\s*РјР°СЃС‚РµСЂР°)?|РїРѕРґ С„РѕСЂРјР°С‚ СЃРѕР±С‹С‚РёСЏ)/iu
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

  const separator = /[.!?вЂ¦]$/u.test(normalizedBase) ? ' ' : '. '
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

const getHomeCategoryTileSizes = (count: number) => {
  if (count >= 6) {
    return ['small', 'small', 'small', 'small', 'small', 'small'] as const
  }

  if (count === 5) {
    return ['wide', 'small', 'small', 'small', 'small'] as const
  }

  return ['wide', 'tall', 'small', 'small'] as const
}

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
  ...(() => {
    const categories = masterClassCategories.filter((category) => category.count > 0)
    const sizes = getHomeCategoryTileSizes(categories.length)

    return categories
      .slice(0, sizes.length)
      .map((category, index) => ({
        id: `tile-category-${category.id}`,
        title: category.title,
        subtitle: `${category.count} мастер-классов`,
        href: createMasterClassCategoryHref(category.slug),
        image: category.image,
        size: sizes[index] || 'small'
      }))
  })()
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
