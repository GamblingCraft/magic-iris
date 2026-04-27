import type { SiteSeoSettings } from '~/data/site-seo'

import { saveSiteSeoContent } from '../../utils/admin-content'

export default defineEventHandler(async (event) => {
  const body = await readBody<SiteSeoSettings>(event)

  if (!body || !body.siteUrl || !body.home || !body.showsIndex || !body.masterClassesIndex) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ожидались SEO-настройки сайта'
    })
  }

  await saveSiteSeoContent(body)

  return {
    ok: true
  }
})
