import type {
  CatalogFact,
  CatalogImage,
  MasterClassCategory,
  PricePoint,
  ShowProgram,
  WorkshopItem
} from '~/data/catalog'

export type CatalogCardItem = {
  id: string
  href: string
  image: string
  imageAlt?: string
  kicker: string
  title: string
  description: string
  metaPrimary?: string
  metaSecondary?: string
  metaLabel?: string
  priceValue?: string
  buttonLabel?: string
  productMicrodata?: boolean
}

export type HomeShowTile = Pick<ShowProgram, 'id' | 'title' | 'kicker' | 'image'> & {
  href: string
  size: 'wide' | 'tall' | 'small'
}

export type HomeWorkshopTile = Pick<MasterClassCategory, 'id' | 'title' | 'image' | 'count'> & {
  href: string
  size: 'wide' | 'tall' | 'small'
}

export type HomeCatalogPayload = {
  showTiles: HomeShowTile[]
  workshopTiles: HomeWorkshopTile[]
}

export type ShowsIndexPayload = {
  heroImage: string
  cards: CatalogCardItem[]
}

export type PublicShowDetail = Pick<
  ShowProgram,
  | 'id'
  | 'slug'
  | 'title'
  | 'kicker'
  | 'description'
  | 'lead'
  | 'image'
  | 'heroImage'
  | 'features'
  | 'suitableFor'
> & {
  gallery: CatalogImage[]
  facts: CatalogFact[]
  pricing: PricePoint[]
}

export type ShowDetailPayload = {
  program: PublicShowDetail | null
}

export type MasterClassCategoryPreview = Pick<
  MasterClassCategory,
  'id' | 'slug' | 'title' | 'count' | 'description' | 'lead' | 'image'
> & {
  href: string
  card: CatalogCardItem
}

export type WorkshopPreviewItem = Pick<
  WorkshopItem,
  'id' | 'slug' | 'primaryCategorySlug' | 'categorySlugs' | 'audienceLabel' | 'title' | 'summary' | 'priceFrom' | 'image'
> & {
  href: string
  card: CatalogCardItem
}

export type MasterClassesIndexPayload = {
  heroImage: string
  categories: MasterClassCategoryPreview[]
  workshops: WorkshopPreviewItem[]
}

export type MasterClassCategoryPagePayload = {
  category: MasterClassCategoryPreview | null
  workshopCards: CatalogCardItem[]
}

export type PublicWorkshopDetail = Pick<
  WorkshopItem,
  | 'id'
  | 'slug'
  | 'title'
  | 'primaryCategorySlug'
  | 'categorySlugs'
  | 'audienceLabel'
  | 'summary'
  | 'description'
  | 'priceFrom'
  | 'priceNote'
  | 'image'
  | 'duration'
  | 'participants'
  | 'formats'
  | 'includes'
> & {
  gallery: CatalogImage[]
  pricing: PricePoint[]
}

export type WorkshopDetailPayload = {
  category: MasterClassCategoryPreview | null
  workshop: PublicWorkshopDetail | null
  relatedCards: CatalogCardItem[]
}
