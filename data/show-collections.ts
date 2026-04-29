import {
  createMasterClassCategoryHref,
  createShowHref,
  getMasterClassCategoryBySlug,
  getShowBySlug
} from './catalog'
import showCollectionsContent from './cms/show-collections.json'
import type { HomeShowTile, HomeWorkshopTile } from '~/types/public-catalog'

export type CollectionFact = {
  label: string
  value: string
}

export type CollectionCta = {
  eyebrow: string
  title: string
  text: string
  image: string
  imageAlt: string
  primary: {
    label: string
    href: string
  }
  secondary: {
    label: string
    href: string
  }
}

export type ShowCollectionPage = {
  seo: {
    title: string
    description: string
    keywords: string
  }
  breadcrumbLabel: string
  hero: {
    eyebrow: string
    title: string
    lead: string
    description: string
    image: string
    tags: string[]
    facts: CollectionFact[]
  }
  cards: {
    eyebrow: string
    title: string
    description: string
    showSlugs: string[]
  }
  scenario: {
    eyebrow: string
    title: string
    text: string
    points: string[]
    images: string[]
  }
  workshops: {
    eyebrow: string
    title: string
    description: string
    categorySlugs: string[]
  }
  about: {
    eyebrow: string
    title: string
    lead: string
    paragraphs: string[]
  }
  cta: CollectionCta
}

export type ShowCollectionSlug = 'svadebnoe' | 'den-rozdenia' | 'corporative'

export const showCollectionSlugs: ShowCollectionSlug[] = [
  'svadebnoe',
  'den-rozdenia',
  'corporative'
]

export const showCollections = showCollectionsContent as Record<ShowCollectionSlug, ShowCollectionPage>

export const weddingShowsPage = showCollections.svadebnoe
export const birthdayShowsPage = showCollections['den-rozdenia']
export const corporateShowsPage = showCollections.corporative

export const getShowCollectionPage = (slug: string) =>
  showCollections[slug as ShowCollectionSlug] || null

export const normalizeShowCollectionPage = (page: ShowCollectionPage): ShowCollectionPage => ({
  ...page,
  hero: {
    ...page.hero,
    tags: Array.from(new Set(page.hero.tags.map((item) => item.trim()).filter(Boolean))),
    facts: page.hero.facts
      .map((item) => ({
        label: item.label.trim(),
        value: item.value.trim()
      }))
      .filter((item) => item.label && item.value)
  },
  cards: {
    ...page.cards,
    showSlugs: Array.from(new Set(page.cards.showSlugs.map((item) => item.trim()).filter(Boolean))).slice(0, 4)
  },
  scenario: {
    ...page.scenario,
    points: Array.from(new Set(page.scenario.points.map((item) => item.trim()).filter(Boolean))).slice(0, 3),
    images: page.scenario.images
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 3)
  },
  workshops: {
    ...page.workshops,
    categorySlugs: Array.from(
      new Set(page.workshops.categorySlugs.map((item) => item.trim()).filter(Boolean))
    ).slice(0, 4)
  },
  about: {
    ...page.about,
    paragraphs: page.about.paragraphs.map((item) => item.trim()).filter(Boolean)
  },
  cta: {
    ...page.cta,
    primary: {
      label: page.cta.primary.label.trim(),
      href: page.cta.primary.href.trim()
    },
    secondary: {
      label: page.cta.secondary.label.trim(),
      href: page.cta.secondary.href.trim()
    }
  }
})

export const resolveShowCollectionTiles = (slugs: string[]): HomeShowTile[] => {
  const sizeMap = new Map([
    [slugs[0], 'wide'],
    [slugs[1], 'tall'],
    [slugs[2], 'small'],
    [slugs[3], 'small']
  ]) as Map<string, HomeShowTile['size']>

  return slugs
    .map((slug) => {
      const program = getShowBySlug(slug)

      if (!program) {
        return null
      }

      return {
        id: program.id,
        title: program.title,
        kicker: program.kicker,
        image: program.image,
        href: createShowHref(program.slug),
        size: sizeMap.get(slug) || 'small'
      }
    })
    .filter(Boolean) as HomeShowTile[]
}

export const resolveWorkshopCollectionTiles = (slugs: string[]): HomeWorkshopTile[] => {
  const sizeMap = new Map([
    [slugs[0], 'wide'],
    [slugs[1], 'tall'],
    [slugs[2], 'small'],
    [slugs[3], 'small']
  ]) as Map<string, HomeWorkshopTile['size']>

  return slugs
    .map((slug) => {
      const category = getMasterClassCategoryBySlug(slug)

      if (!category) {
        return null
      }

      return {
        id: category.id,
        title: category.title,
        image: category.image,
        count: category.count,
        href: createMasterClassCategoryHref(category.slug),
        size: sizeMap.get(slug) || 'small'
      }
    })
    .filter(Boolean) as HomeWorkshopTile[]
}
