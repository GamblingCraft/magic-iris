import catalogPagesRaw from './cms/catalog-pages.json'

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
  text: CatalogPageTextSection
  faq: CatalogPageFaqSection
}

export type CatalogPagesContent = {
  shows: CatalogPageSectionContent
  masterClasses: CatalogPageSectionContent
}

export const catalogPagesContent = catalogPagesRaw as CatalogPagesContent
