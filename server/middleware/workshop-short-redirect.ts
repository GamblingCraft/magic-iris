import { getRequestURL, sendRedirect } from 'h3'

import { getCatalogContent } from '~/server/utils/admin-content'

const shortWorkshopPathPattern = /^\/(\d{1,3})\/?$/
const minShortWorkshopId = 2
const maxShortWorkshopId = 103

const resolveShortWorkshopNumber = (pathname: string) => {
  const match = pathname.match(shortWorkshopPathPattern)

  if (!match) {
    return null
  }

  const value = Number.parseInt(match[1], 10)

  if (!Number.isInteger(value) || value < minShortWorkshopId || value > maxShortWorkshopId) {
    return null
  }

  return value
}

export default defineEventHandler(async (event) => {
  const requestUrl = getRequestURL(event)
  const shortWorkshopNumber = resolveShortWorkshopNumber(requestUrl.pathname)

  if (shortWorkshopNumber === null) {
    return
  }

  const workshopId = `workshop-${String(shortWorkshopNumber).padStart(3, '0')}`
  const catalog = await getCatalogContent()
  const workshop = catalog.workshops.find((item) => item.id === workshopId)

  if (!workshop?.primaryCategorySlug || !workshop.slug) {
    return
  }

  const targetPath = `/master-classes/${workshop.primaryCategorySlug}/${workshop.slug}`
  const targetUrl = `${targetPath}${requestUrl.search || ''}`

  return sendRedirect(event, targetUrl, 301)
})
