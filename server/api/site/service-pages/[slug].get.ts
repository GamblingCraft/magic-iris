import { getServicePage, normalizeServicePage, type ServicePageSlug } from '~/data/service-pages'

export default defineEventHandler((event) => {
  const slug = String(event.context.params?.slug || '') as ServicePageSlug
  const page = getServicePage(slug)

  if (!page) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Service page not found'
    })
  }

  return normalizeServicePage(page)
})
