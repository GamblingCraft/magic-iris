import {
  deriveWorkshopAudienceLabel,
  type MasterClassCategory,
  type ShowProgram,
  type WorkshopItem
} from '~/data/catalog'

import { saveCatalogContent } from '../../utils/admin-content'

type CatalogPayload = {
  shows: ShowProgram[]
  masterClassCategories: MasterClassCategory[]
  workshops: WorkshopItem[]
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CatalogPayload>(event)

  if (!body || !Array.isArray(body.shows) || !Array.isArray(body.masterClassCategories) || !Array.isArray(body.workshops)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ожидалось тело с shows, masterClassCategories и workshops'
    })
  }

  const normalizedWorkshops = body.workshops.map((workshop) => ({
    ...workshop,
    audienceLabel:
      deriveWorkshopAudienceLabel(workshop.categorySlugs, body.masterClassCategories) ||
      workshop.audienceLabel
  }))

  await saveCatalogContent({
    ...body,
    workshops: normalizedWorkshops
  })

  return {
    ok: true
  }
})
