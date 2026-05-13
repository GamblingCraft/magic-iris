import {
  createMasterClassCategoryHref,
  createMasterClassHref,
  createShowHref,
  getMasterClassCategoryBySlug,
  getShowBySlug,
  getWorkshopBySlugs,
  getWorkshopsByCategorySlug,
  masterClassCategories,
  masterClassesHeroImage,
  shows,
  workshopItems
} from '~/data/catalog'
import { getCatalogContent } from '~/server/utils/admin-content'
import { formatDisplayPrice } from '~/utils/format-price'
import type { MasterClassCategory, ShowProgram, WorkshopItem } from '~/data/catalog'
import type {
  CatalogCardItem,
  HomeCatalogPayload,
  MasterClassCategoryPagePayload,
  MasterClassCategoryPreview,
  MasterClassesIndexPayload,
  PublicShowDetail,
  PublicWorkshopDetail,
  ShowDetailPayload,
  ShowsIndexPayload,
  WorkshopDetailPayload,
  WorkshopPreviewItem
} from '~/types/public-catalog'

const showTileConfigs = [
  { slug: 'pesochnoe-shou', size: 'wide' as const },
  { slug: 'svetovoe-shou', size: 'tall' as const },
  { slug: 'shou-portrety', size: 'small' as const },
  { slug: 'krutyashchiysya-portret', size: 'small' as const }
]

const getHomeWorkshopTileSizes = (count: number) => {
  if (count >= 6) {
    return ['small', 'small', 'small', 'small', 'small', 'small'] as const
  }

  if (count === 5) {
    return ['wide', 'small', 'small', 'small', 'small'] as const
  }

  return ['wide', 'tall', 'small', 'small'] as const
}

const toShowCard = (program: ShowProgram): CatalogCardItem => ({
  id: program.id,
  href: createShowHref(program.slug),
  image: program.image,
  imageAlt: program.title,
  kicker: program.kicker,
  title: program.title,
  description: program.description,
  metaPrimary: program.pricing[0]?.value ?? 'По запросу',
  metaLabel: 'Стоимость',
  buttonLabel: 'Открыть',
  priceValue: program.pricing[0]?.value,
  productMicrodata: true
})

const toCategoryCard = (category: MasterClassCategory): CatalogCardItem => ({
  id: category.id,
  href: createMasterClassCategoryHref(category.slug),
  image: category.image,
  imageAlt: category.title,
  kicker: 'Подборка',
  title: category.title,
  description: category.description,
  metaPrimary: `${category.count}`,
  metaLabel: 'Мастер-классов',
  buttonLabel: 'Открыть',
  productMicrodata: false
})

const parseWorkshopPriceAmounts = (value?: string) =>
  (value || '')
    .match(/\d[\d\s]{0,14}(?=\s*(?:₽|руб\.?))/giu)
    ?.map((match) => Number.parseInt(match.replace(/\s+/g, ''), 10))
    .filter((amount) => Number.isFinite(amount) && amount >= 1000) || []

const formatWorkshopPriceAmount = (amount: number) =>
  amount.toLocaleString('ru-RU').replace(/ /g, ' ')

const resolveWorkshopPrice = (workshop: WorkshopItem) => {
  const legacySources = [
    workshop.legacyLayout?.whatPrice || '',
    ...(workshop.legacyLayout?.formatCards || []).flatMap((card) => [card.details || '', card.price || ''])
  ]

  const amounts = [
    ...parseWorkshopPriceAmounts(workshop.priceFrom),
    ...legacySources.flatMap((source) => parseWorkshopPriceAmounts(source))
  ]

  if (amounts.length) {
    return `от ${formatWorkshopPriceAmount(Math.min(...amounts))} ₽`
  }

  return formatDisplayPrice(workshop.priceFrom || 'По запросу') || 'По запросу'
}

const resolveWorkshopLead = (workshop: WorkshopItem) =>
  workshop.legacyLayout?.whatIntro?.trim()
  || workshop.summary?.trim()
  || workshop.description?.trim()
  || ''

const toWorkshopCard = (workshop: WorkshopItem): CatalogCardItem => ({
  id: workshop.id,
  href: createMasterClassHref(workshop.primaryCategorySlug, workshop.slug),
  image: workshop.image,
  imageAlt: workshop.title,
  kicker: workshop.audienceLabel,
  title: workshop.title,
  description: resolveWorkshopLead(workshop),
  metaPrimary: resolveWorkshopPrice(workshop),
  metaLabel: 'Стоимость',
  buttonLabel: 'Открыть',
  priceValue: resolveWorkshopPrice(workshop),
  productMicrodata: true
})

const toCategoryPreview = (category: MasterClassCategory): MasterClassCategoryPreview => ({
  id: category.id,
  slug: category.slug,
  title: category.title,
  count: category.count,
  description: category.description,
  lead: category.lead,
  image: category.image,
  href: createMasterClassCategoryHref(category.slug),
  card: toCategoryCard(category)
})

const toWorkshopPreview = (workshop: WorkshopItem): WorkshopPreviewItem => ({
  id: workshop.id,
  slug: workshop.slug,
  primaryCategorySlug: workshop.primaryCategorySlug,
  categorySlugs: workshop.categorySlugs,
  audienceLabel: workshop.audienceLabel,
  title: workshop.title,
  summary: resolveWorkshopLead(workshop),
  priceFrom: resolveWorkshopPrice(workshop),
  image: workshop.image,
  href: createMasterClassHref(workshop.primaryCategorySlug, workshop.slug),
  card: toWorkshopCard(workshop)
})

const toPublicShowDetail = (program: ShowProgram): PublicShowDetail => ({
  id: program.id,
  slug: program.slug,
  title: program.title,
  kicker: program.kicker,
  description: program.description,
  lead: program.lead,
  image: program.image,
  heroImage: program.heroImage,
  gallery: program.gallery,
  facts: program.facts,
  pricing: program.pricing,
  features: program.features,
  suitableFor: program.suitableFor
})

const toPublicWorkshopDetail = (workshop: WorkshopItem): PublicWorkshopDetail => ({
  id: workshop.id,
  slug: workshop.slug,
  title: workshop.title,
  primaryCategorySlug: workshop.primaryCategorySlug,
  categorySlugs: workshop.categorySlugs,
  audienceLabel: workshop.audienceLabel,
  summary: workshop.summary,
  description: workshop.description,
  priceFrom: workshop.priceFrom,
  priceNote: workshop.priceNote,
  image: workshop.image,
  gallery: workshop.gallery,
  duration: workshop.duration,
  participants: workshop.participants,
  formats: workshop.formats,
  includes: workshop.includes,
  pricing: workshop.pricing,
  legacyLayout: workshop.legacyLayout
})

export const getHomeCatalogPayload = async (): Promise<HomeCatalogPayload> => {
  const catalog = await getCatalogContent()
  const homeShows = catalog.shows
  const homeCategories = catalog.masterClassCategories

  return {
    showTiles: showTileConfigs
      .map((config) => {
        const program = homeShows.find((item) => item.slug === config.slug)

        if (!program) {
          return null
        }

        return {
          id: program.id,
          title: program.title,
          kicker: program.kicker,
          description: program.description,
          image: program.image,
          href: createShowHref(program.slug),
          size: config.size
        }
      })
      .filter(Boolean) as HomeCatalogPayload['showTiles'],
    workshopTiles: (() => {
      const categories = homeCategories.filter((category) => category.count > 0)
      const sizes = getHomeWorkshopTileSizes(categories.length)

      return categories
        .slice(0, sizes.length)
        .map((category, index) => ({
          id: category.id,
          title: category.title,
          description: category.description,
          image: category.image,
          count: category.count,
          href: createMasterClassCategoryHref(category.slug),
          size: sizes[index] || 'small'
        })) as HomeCatalogPayload['workshopTiles']
    })()
  }
}

export const getShowsIndexPayload = (): ShowsIndexPayload => ({
  heroImage: shows[1]?.heroImage || shows[0]?.heroImage || '',
  cards: shows.map(toShowCard)
})

export const getShowDetailPayload = (slug: string): ShowDetailPayload => {
  const program = getShowBySlug(slug)

  return {
    program: program ? toPublicShowDetail(program) : null
  }
}

export const getMasterClassesIndexPayload = (): MasterClassesIndexPayload => ({
  heroImage: masterClassesHeroImage || masterClassCategories[0]?.image || workshopItems[0]?.image || '',
  categories: masterClassCategories.map(toCategoryPreview),
  workshops: workshopItems.map(toWorkshopPreview)
})

export const getMasterClassCategoryPagePayload = (
  slug: string
): MasterClassCategoryPagePayload => {
  const category = getMasterClassCategoryBySlug(slug)

  return {
    category: category ? toCategoryPreview(category) : null,
    workshopCards: category ? getWorkshopsByCategorySlug(slug).map(toWorkshopCard) : []
  }
}

export const getWorkshopDetailPayload = (
  categorySlug: string,
  workshopSlug: string
): WorkshopDetailPayload => {
  const category = getMasterClassCategoryBySlug(categorySlug)
  const workshop = getWorkshopBySlugs(categorySlug, workshopSlug)

  return {
    category: category ? toCategoryPreview(category) : null,
    workshop: workshop ? toPublicWorkshopDetail(workshop) : null,
    relatedCards: category
      ? getWorkshopsByCategorySlug(categorySlug)
          .filter((item) => item.slug !== workshopSlug)
          .slice(0, 6)
          .map(toWorkshopCard)
      : []
  }
}
