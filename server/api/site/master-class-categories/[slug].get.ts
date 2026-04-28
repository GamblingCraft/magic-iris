import { getRouterParam } from 'h3'

import { getMasterClassCategoryPagePayload } from '~/server/utils/public-catalog'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') || ''
  return getMasterClassCategoryPagePayload(slug)
})
