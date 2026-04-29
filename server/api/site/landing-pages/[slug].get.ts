import { getShowCollectionPage, normalizeShowCollectionPage } from '~/data/show-collections'

import { getShowCollectionsContent } from '../../../utils/admin-content'

export default defineEventHandler(async (event) => {
  const slug = String(getRouterParam(event, 'slug') || '')
  const pages = await getShowCollectionsContent()
  const page = pages[slug as keyof typeof pages] || getShowCollectionPage(slug)

  if (!page) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Посадочная страница не найдена'
    })
  }

  return normalizeShowCollectionPage(page)
})
