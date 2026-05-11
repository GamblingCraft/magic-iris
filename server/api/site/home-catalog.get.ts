import { getHomeCatalogPayload } from '~/server/utils/public-catalog'

export default defineEventHandler(async () => await getHomeCatalogPayload())
