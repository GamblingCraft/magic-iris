import siteSeoContent from './cms/site-seo.json'
import type { MasterClassCategory, ShowProgram, WorkshopItem } from './catalog'
import { extractPriceAmount, formatDisplayPrice } from '~/utils/format-price'

type SeoBlock = {
  title: string
  description: string
}

type SeoTemplateBlock = {
  titleTemplate: string
  descriptionTemplate: string
}

export type SiteSeoSettings = {
  siteName: string
  city: string
  siteUrl: string
  defaultDescription: string
  home: SeoBlock
  showsIndex: SeoBlock
  show: SeoTemplateBlock
  masterClassesIndex: SeoBlock
  masterClassCategory: SeoTemplateBlock
  workshop: SeoTemplateBlock
  yandexVerification: string
  googleVerification: string
  yandexMetrikaCounter: string
  companyJsonLd: string
  robotsContent: string
}

export type SiteHeadSettings = Pick<
  SiteSeoSettings,
  'yandexVerification' | 'googleVerification' | 'yandexMetrikaCounter' | 'companyJsonLd'
>

type SeoVars = Record<string, string | number | undefined | null>

export const siteSeoSettings = siteSeoContent as SiteSeoSettings

export const normalizeSiteUrl = (value: string) => value.replace(/\/+$/u, '')

export const buildAbsoluteUrl = (path: string) => {
  if (/^https?:\/\//iu.test(path)) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizeSiteUrl(siteSeoSettings.siteUrl)}${normalizedPath}`
}

const replaceSeoVars = (template: string, vars: SeoVars) =>
  template.replace(/\{(\w+)\}/gu, (_, key: string) => String(vars[key] ?? ''))

const cleanSeoText = (value: string) => value.replace(/\s+/gu, ' ').trim()

const resolveSeoBlock = (title: string, description: string) => ({
  title: cleanSeoText(title),
  description: cleanSeoText(description || siteSeoSettings.defaultDescription)
})

export const getHomeSeo = () =>
  resolveSeoBlock(siteSeoSettings.home.title, siteSeoSettings.home.description)

export const getShowsIndexSeo = () =>
  resolveSeoBlock(siteSeoSettings.showsIndex.title, siteSeoSettings.showsIndex.description)

type ShowSeoSource = Pick<ShowProgram, 'title' | 'kicker' | 'lead' | 'description'>
type MasterClassCategorySeoSource = Pick<
  MasterClassCategory,
  'title' | 'count' | 'description' | 'lead'
>
type WorkshopSeoSource = Pick<
  WorkshopItem,
  'title' | 'audienceLabel' | 'summary' | 'description' | 'priceFrom' | 'pricing' | 'legacyLayout'
>

const parseSeoPriceAmounts = (value?: string) =>
  (value || '')
    .match(/\d[\d\s]{0,14}(?=\s*(?:₽|руб\.?))/giu)
    ?.map((match) => Number.parseInt(match.replace(/\s+/g, ''), 10))
    .filter((amount) => Number.isFinite(amount) && amount >= 1000) || []

const formatSeoPriceAmount = (amount: number) =>
  amount.toLocaleString('ru-RU').replace(/\u00A0/g, ' ')

const resolveWorkshopSeoPrice = (workshop: WorkshopSeoSource) => {
  const pricingSources = (workshop.pricing || []).flatMap((point) => [
    point.value || '',
    point.note || ''
  ])

  const legacySources = [
    workshop.legacyLayout?.whatPrice || '',
    ...(workshop.legacyLayout?.formatCards || []).flatMap((card) => [
      card.details || '',
      card.price || ''
    ])
  ]

  const amounts = [
    ...parseSeoPriceAmounts(workshop.priceFrom),
    ...pricingSources.flatMap((source) => parseSeoPriceAmounts(source)),
    ...legacySources.flatMap((source) => parseSeoPriceAmounts(source))
  ]

  if (amounts.length) {
    const minAmount = Math.min(...amounts)

    return {
      priceFrom: `от ${formatSeoPriceAmount(minAmount)} ₽`,
      price: String(minAmount)
    }
  }

  const fallbackPriceFrom = formatDisplayPrice(workshop.priceFrom || '') || workshop.priceFrom || ''

  return {
    priceFrom: fallbackPriceFrom,
    price: extractPriceAmount(fallbackPriceFrom)
  }
}

export const getShowSeo = (show: ShowSeoSource) => {
  const vars = {
    title: show.title,
    kicker: show.kicker,
    lead: show.lead,
    description: show.description,
    city: siteSeoSettings.city,
    brand: siteSeoSettings.siteName
  }

  return resolveSeoBlock(
    replaceSeoVars(siteSeoSettings.show.titleTemplate, vars),
    replaceSeoVars(siteSeoSettings.show.descriptionTemplate, vars)
  )
}

export const getMasterClassesIndexSeo = () =>
  resolveSeoBlock(
    siteSeoSettings.masterClassesIndex.title,
    siteSeoSettings.masterClassesIndex.description
  )

export const getMasterClassCategorySeo = (category: MasterClassCategorySeoSource) => {
  const vars = {
    category: category.title,
    count: category.count,
    description: category.description,
    lead: category.lead,
    city: siteSeoSettings.city,
    brand: siteSeoSettings.siteName
  }

  return resolveSeoBlock(
    replaceSeoVars(siteSeoSettings.masterClassCategory.titleTemplate, vars),
    replaceSeoVars(siteSeoSettings.masterClassCategory.descriptionTemplate, vars)
  )
}

export const getWorkshopSeo = (
  workshop: WorkshopSeoSource,
  category?: MasterClassCategorySeoSource | null
) => {
  const workshopPrice = resolveWorkshopSeoPrice(workshop)

  const vars = {
    title: workshop.title,
    category: category?.title || workshop.audienceLabel,
    summary: workshop.summary,
    description: workshop.description,
    audience: workshop.audienceLabel,
    priceFrom: workshopPrice.priceFrom,
    price: workshopPrice.price,
    pricefrom: workshopPrice.priceFrom,
    city: siteSeoSettings.city,
    brand: siteSeoSettings.siteName
  }

  return resolveSeoBlock(
    replaceSeoVars(siteSeoSettings.workshop.titleTemplate, vars),
    replaceSeoVars(siteSeoSettings.workshop.descriptionTemplate, vars)
  )
}

export const getResolvedRobotsTxt = () =>
  replaceSeoVars(siteSeoSettings.robotsContent, {
    siteUrl: normalizeSiteUrl(siteSeoSettings.siteUrl),
    sitemapUrl: buildAbsoluteUrl('/sitemap.xml')
  }).trim()

const extractTagInnerHtml = (snippet: string, tagName: 'script' | 'noscript') => {
  const match = snippet.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'iu'))
  return match?.[1]?.trim() || ''
}

const buildDefaultCompanyJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteSeoSettings.siteName,
  url: normalizeSiteUrl(siteSeoSettings.siteUrl)
})

const normalizeJsonLdSnippet = (snippet: string) => {
  const normalizedSnippet = snippet.trim()

  if (!normalizedSnippet) {
    return ''
  }

  if (/<script\b/iu.test(normalizedSnippet)) {
    return extractTagInnerHtml(normalizedSnippet, 'script')
  }

  return normalizedSnippet
}

export const resolveCompanyJsonLd = (snippet: string) => {
  const normalizedSnippet = normalizeJsonLdSnippet(snippet)

  if (!normalizedSnippet) {
    return JSON.stringify(buildDefaultCompanyJsonLd())
  }

  try {
    const parsed = JSON.parse(normalizedSnippet) as unknown

    if (typeof parsed === 'object' && parsed !== null) {
      return JSON.stringify(parsed)
    }
  }
  catch {
    // fallback to default Organization JSON-LD when editor content is invalid
  }

  return JSON.stringify(buildDefaultCompanyJsonLd())
}

export const resolveYandexMetrikaHead = (snippet: string) => {
  const normalizedSnippet = snippet.trim()

  if (!normalizedSnippet) {
    return {
      script: '',
      noscript: ''
    }
  }

  const hasHtmlTags = /<(script|noscript)\b/iu.test(normalizedSnippet)

  if (!hasHtmlTags) {
    return {
      script: normalizedSnippet,
      noscript: ''
    }
  }

  return {
    script: extractTagInnerHtml(normalizedSnippet, 'script'),
    noscript: extractTagInnerHtml(normalizedSnippet, 'noscript')
  }
}
