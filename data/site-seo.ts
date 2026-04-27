import siteSeoContent from './cms/site-seo.json'
import {
  createMasterClassCategoryHref,
  createMasterClassHref,
  createShowHref,
  masterClassCategories,
  shows,
  workshopItems,
  type MasterClassCategory,
  type ShowProgram,
  type WorkshopItem
} from './catalog'

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
  robotsContent: string
}

export type SiteHeadSettings = Pick<
  SiteSeoSettings,
  'yandexVerification' | 'googleVerification' | 'yandexMetrikaCounter'
>

export type SitemapEntry = {
  url: string
  path: string
  priority: string
  changefreq: string
}

type SeoVars = Record<string, string | number | undefined | null>

export const siteSeoSettings = siteSeoContent as SiteSeoSettings

export const normalizeSiteUrl = (value: string) => value.replace(/\/+$/u, '')

export const buildAbsoluteUrl = (path: string) => {
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

export const getShowSeo = (show: ShowProgram) => {
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

export const getMasterClassCategorySeo = (category: MasterClassCategory) => {
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
  workshop: WorkshopItem,
  category?: MasterClassCategory | null
) => {
  const vars = {
    title: workshop.title,
    category: category?.title || workshop.audienceLabel,
    summary: workshop.summary,
    description: workshop.description,
    audience: workshop.audienceLabel,
    priceFrom: workshop.priceFrom,
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

export const getSitemapEntries = (): SitemapEntry[] => [
  {
    url: buildAbsoluteUrl('/'),
    path: '/',
    priority: '1.0',
    changefreq: 'weekly'
  },
  {
    url: buildAbsoluteUrl('/shows'),
    path: '/shows',
    priority: '0.9',
    changefreq: 'weekly'
  },
  {
    url: buildAbsoluteUrl('/master-classes'),
    path: '/master-classes',
    priority: '0.9',
    changefreq: 'weekly'
  },
  ...shows.map((show) => ({
    url: buildAbsoluteUrl(createShowHref(show.slug)),
    path: createShowHref(show.slug),
    priority: '0.8',
    changefreq: 'monthly'
  })),
  ...masterClassCategories.map((category) => ({
    url: buildAbsoluteUrl(createMasterClassCategoryHref(category.slug)),
    path: createMasterClassCategoryHref(category.slug),
    priority: '0.8',
    changefreq: 'weekly'
  })),
  ...workshopItems.map((workshop) => ({
    url: buildAbsoluteUrl(createMasterClassHref(workshop.primaryCategorySlug, workshop.slug)),
    path: createMasterClassHref(workshop.primaryCategorySlug, workshop.slug),
    priority: '0.7',
    changefreq: 'monthly'
  }))
]

export const generateSitemapXml = () => {
  const today = new Date().toISOString().slice(0, 10)
  const urls = getSitemapEntries()
    .map(
      (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}
