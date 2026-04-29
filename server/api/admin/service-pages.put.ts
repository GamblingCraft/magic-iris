import { normalizeServicePage, servicePageSlugs, type ServiceLandingPage, type ServicePageSlug } from '~/data/service-pages'

import { saveServicePagesContent } from '../../utils/admin-content'

type ServicePagesPayload = Record<ServicePageSlug, ServiceLandingPage>

export default defineEventHandler(async (event) => {
  const body = await readBody<ServicePagesPayload>(event)

  const normalized = Object.fromEntries(
    servicePageSlugs.map((slug) => [slug, normalizeServicePage(body[slug])])
  ) as ServicePagesPayload

  await saveServicePagesContent(normalized)

  return normalized
})
