import servicePagesContent from './cms/service-pages.json'
import type { CatalogCardItem } from '~/types/public-catalog'

export type ServicePageFact = {
  label: string
  value: string
}

export type ServicePageAction = {
  label: string
  href: string
}

export type ServiceScenarioItem = {
  title: string
  text: string
  image: string
}

export type ServiceAboutBlock = {
  title: string
  items: string[]
}

export type ServiceLandingPage = {
  seo: {
    title: string
    description: string
  }
  breadcrumbLabel: string
  hero: {
    eyebrow: string
    title: string
    lead: string
    description: string
    image: string
    tags: string[]
    facts: ServicePageFact[]
  }
  scenario: {
    eyebrow: string
    title: string
    text: string
    items: ServiceScenarioItem[]
  }
  cards: {
    eyebrow: string
    title: string
    description: string
    items: CatalogCardItem[]
  }
  about: {
    eyebrow: string
    title: string
    lead: string
    blocks: ServiceAboutBlock[]
  }
  cta: {
    eyebrow: string
    title: string
    text: string
    image: string
    imageAlt: string
    primary: ServicePageAction
    secondary: ServicePageAction
  }
}

export type ServicePageSlug = 'pod-klyuch' | 'corporate'

export const servicePageSlugs: ServicePageSlug[] = ['pod-klyuch', 'corporate']

export const servicePages = servicePagesContent as Record<ServicePageSlug, ServiceLandingPage>

export const getServicePage = (slug: string) => servicePages[slug as ServicePageSlug] || null

export const normalizeServicePage = (page: ServiceLandingPage): ServiceLandingPage => ({
  ...page,
  hero: {
    ...page.hero,
    tags: Array.from(new Set(page.hero.tags.map((item) => item.trim()).filter(Boolean))).slice(0, 4),
    facts: page.hero.facts
      .map((item) => ({
        label: item.label.trim(),
        value: item.value.trim()
      }))
      .filter((item) => item.label && item.value)
      .slice(0, 3)
  },
  scenario: {
    ...page.scenario,
    items: page.scenario.items
      .map((item) => ({
        title: item.title.trim(),
        text: item.text.trim(),
        image: item.image.trim()
      }))
      .filter((item) => item.title || item.text || item.image)
      .slice(0, 3)
  },
  cards: {
    ...page.cards,
    items: page.cards.items
      .map((item) => ({
        ...item,
        id: item.id.trim(),
        href: item.href.trim(),
        image: item.image.trim(),
        imageAlt: item.imageAlt.trim(),
        kicker: item.kicker.trim(),
        title: item.title.trim(),
        description: item.description.trim(),
        metaPrimary: item.metaPrimary?.trim(),
        metaLabel: item.metaLabel?.trim(),
        buttonLabel: item.buttonLabel.trim()
      }))
      .filter((item) => item.id && item.title && item.href)
      .slice(0, 3)
  },
  about: {
    ...page.about,
    blocks: page.about.blocks
      .map((block) => ({
        title: block.title.trim(),
        items: block.items.map((item) => item.trim()).filter(Boolean).slice(0, 4)
      }))
      .filter((block) => block.title || block.items.length)
      .slice(0, 2)
  },
  cta: {
    ...page.cta,
    image: page.cta.image.trim(),
    imageAlt: page.cta.imageAlt.trim(),
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
