import { getRouterParam } from 'h3'

import { getWorkshopDetailPayload } from '~/server/utils/public-catalog'

export default defineEventHandler((event) => {
  const category = getRouterParam(event, 'category') || ''
  const slug = getRouterParam(event, 'slug') || ''

  return getWorkshopDetailPayload(category, slug)
})
