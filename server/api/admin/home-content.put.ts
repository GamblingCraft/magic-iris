import type { HomeContent } from '~/data/home-content'

import { saveHomeContent } from '../../utils/admin-content'

export default defineEventHandler(async (event) => {
  const body = await readBody<HomeContent>(event)

  if (!body?.scenario || !body?.shorts || !body?.faq || !body?.about) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ожидался контент главной страницы'
    })
  }

  await saveHomeContent(body)

  return {
    ok: true
  }
})
