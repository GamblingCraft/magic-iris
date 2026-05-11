import type { CatalogPagesContent } from '~/data/catalog-pages'

import { saveCatalogPagesContent } from '../../utils/admin-content'

export default defineEventHandler(async (event) => {
  const body = await readBody<CatalogPagesContent>(event)

  if (!body?.shows || !body?.masterClasses) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Нужно передать разделы для шоу и мастер-классов'
    })
  }

  await saveCatalogPagesContent(body)

  return {
    ok: true
  }
})
