import type { HomeShortsContent } from './home-content'

import catalogPagesRaw from './cms/catalog-pages.json'

export type CatalogPageHeroFact = {
  label: string
  value: string
}

export type CatalogPageHeroAction = {
  label: string
  href: string
  kind?: 'primary' | 'ghost'
}

export type CatalogPageHeroSection = {
  eyebrow: string
  title: string
  description: string
  image: string
  facts?: CatalogPageHeroFact[]
  tags?: string[]
  actions?: CatalogPageHeroAction[]
}

export type CatalogPageTextSection = {
  eyebrow: string
  title: string
  lead: string
  paragraphs: string[]
}

export type CatalogPageFaqItem = {
  question: string
  answer: string
}

export type CatalogPageFaqSection = {
  eyebrow: string
  title: string
  titleAccent: string
  description: string
  items: CatalogPageFaqItem[]
}

export type CatalogPageSectionContent = {
  hero: CatalogPageHeroSection
  text: CatalogPageTextSection
  shorts?: HomeShortsContent
  faq: CatalogPageFaqSection
}

export type CatalogPagesContent = {
  shows: CatalogPageSectionContent
  masterClasses: CatalogPageSectionContent
}

export const catalogPagesContent = catalogPagesRaw as CatalogPagesContent
