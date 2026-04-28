import { getRouterParam } from 'h3'

import { getShowDetailPayload } from '~/server/utils/public-catalog'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') || ''
  return getShowDetailPayload(slug)
})
