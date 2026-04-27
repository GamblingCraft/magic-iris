import { getSiteSeoContent } from '../../utils/admin-content'
import { getRuntimeSitemapEntries, getRuntimeSitemapXml } from '../../utils/site-discovery'

export default defineEventHandler(async () => {
  const seo = await getSiteSeoContent()
  const siteUrl = seo.siteUrl.replace(/\/+$/u, '')

  return {
    siteUrl,
    sitemapUrl: `${siteUrl}/sitemap.xml`,
    entries: await getRuntimeSitemapEntries(),
    xml: await getRuntimeSitemapXml()
  }
})
