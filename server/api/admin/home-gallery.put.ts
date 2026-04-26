import type { HomeGalleryContent } from '~/data/home-gallery'

import { saveHomeGalleryContent } from '../../utils/admin-content'

export default defineEventHandler(async (event) => {
  const body = await readBody<HomeGalleryContent>(event)

  if (
    !body ||
    typeof body.eyebrow !== 'string' ||
    typeof body.title !== 'string' ||
    typeof body.description !== 'string' ||
    !Array.isArray(body.items)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ожидался объект галереи с текстами и массивом items'
    })
  }

  await saveHomeGalleryContent(body)

  return {
    ok: true
  }
})
