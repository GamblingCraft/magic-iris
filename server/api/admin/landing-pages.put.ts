import type { ShowCollectionPage, ShowCollectionSlug } from '~/data/show-collections'

import { normalizeShowCollectionPage, showCollectionSlugs } from '~/data/show-collections'

import { saveShowCollectionsContent } from '../../utils/admin-content'

type LandingPagesPayload = Record<ShowCollectionSlug, ShowCollectionPage>

export default defineEventHandler(async (event) => {
  const body = await readBody<LandingPagesPayload>(event)

  if (!body || typeof body !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ожидалось тело с посадочными страницами'
    })
  }

  const normalized = Object.fromEntries(
    showCollectionSlugs.map((slug) => {
      const page = body[slug]

      if (!page) {
        throw createError({
          statusCode: 400,
          statusMessage: `Не найдены данные посадочной страницы ${slug}`
        })
      }

      return [slug, normalizeShowCollectionPage(page)]
    })
  ) as LandingPagesPayload

  await saveShowCollectionsContent(normalized)

  return {
    ok: true
  }
})
