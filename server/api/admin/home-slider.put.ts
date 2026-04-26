import type { HomeHeroSlide } from '~/data/home-slider'

import { saveHomeSliderContent } from '../../utils/admin-content'

export default defineEventHandler(async (event) => {
  const body = await readBody<HomeHeroSlide[]>(event)

  if (!Array.isArray(body)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ожидался массив слайдов'
    })
  }

  await saveHomeSliderContent(body)

  return {
    ok: true
  }
})
