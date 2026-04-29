import { getCatalogContent, getSiteSeoContent } from './admin-content'

type RuntimeSitemapEntry = {
  url: string
  path: string
  priority: string
  changefreq: string
}

const normalizeSiteUrl = (value: string) => value.replace(/\/+$/u, '')

const buildAbsoluteUrl = (siteUrl: string, path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizeSiteUrl(siteUrl)}${normalizedPath}`
}

const replaceTemplateVars = (template: string, vars: Record<string, string>) =>
  template.replace(/\{(\w+)\}/gu, (_, key: string) => vars[key] ?? '')

export const getRuntimeRobotsTxt = async () => {
  const seo = await getSiteSeoContent()
  const siteUrl = normalizeSiteUrl(seo.siteUrl)

  return replaceTemplateVars(seo.robotsContent, {
    siteUrl,
    sitemapUrl: `${siteUrl}/sitemap.xml`
  }).trim()
}

export const getRuntimeSitemapEntries = async (): Promise<RuntimeSitemapEntry[]> => {
  const [seo, catalog] = await Promise.all([getSiteSeoContent(), getCatalogContent()])
  const siteUrl = normalizeSiteUrl(seo.siteUrl)

  return [
    { url: buildAbsoluteUrl(siteUrl, '/'), path: '/', priority: '1.0', changefreq: 'weekly' },
    {
      url: buildAbsoluteUrl(siteUrl, '/pod-klyuch'),
      path: '/pod-klyuch',
      priority: '0.8',
      changefreq: 'monthly'
    },
    {
      url: buildAbsoluteUrl(siteUrl, '/corporate'),
      path: '/corporate',
      priority: '0.8',
      changefreq: 'monthly'
    },
    {
      url: buildAbsoluteUrl(siteUrl, '/shows/svadebnoe'),
      path: '/shows/svadebnoe',
      priority: '0.8',
      changefreq: 'monthly'
    },
    {
      url: buildAbsoluteUrl(siteUrl, '/shows/den-rozdenia'),
      path: '/shows/den-rozdenia',
      priority: '0.8',
      changefreq: 'monthly'
    },
    {
      url: buildAbsoluteUrl(siteUrl, '/shows/corporative'),
      path: '/shows/corporative',
      priority: '0.8',
      changefreq: 'monthly'
    },
    { url: buildAbsoluteUrl(siteUrl, '/shows'), path: '/shows', priority: '0.9', changefreq: 'weekly' },
    {
      url: buildAbsoluteUrl(siteUrl, '/master-classes'),
      path: '/master-classes',
      priority: '0.9',
      changefreq: 'weekly'
    },
    ...catalog.shows.map((show) => ({
      url: buildAbsoluteUrl(siteUrl, `/shows/${show.slug}`),
      path: `/shows/${show.slug}`,
      priority: '0.8',
      changefreq: 'monthly'
    })),
    ...catalog.masterClassCategories.map((category) => ({
      url: buildAbsoluteUrl(siteUrl, `/master-classes/${category.slug}`),
      path: `/master-classes/${category.slug}`,
      priority: '0.8',
      changefreq: 'weekly'
    })),
    ...catalog.workshops.map((workshop) => ({
      url: buildAbsoluteUrl(siteUrl, `/master-classes/${workshop.primaryCategorySlug}/${workshop.slug}`),
      path: `/master-classes/${workshop.primaryCategorySlug}/${workshop.slug}`,
      priority: '0.7',
      changefreq: 'monthly'
    }))
  ]
}

export const getRuntimeSitemapXml = async () => {
  const today = new Date().toISOString().slice(0, 10)
  const entries = await getRuntimeSitemapEntries()
  const urls = entries
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
