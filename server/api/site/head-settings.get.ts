import { getSiteSeoContent } from '../../utils/admin-content'

export default defineEventHandler(async () => {
  const seoSettings = await getSiteSeoContent()

  return {
    yandexVerification: seoSettings.yandexVerification || '',
    googleVerification: seoSettings.googleVerification || '',
    yandexMetrikaCounter: seoSettings.yandexMetrikaCounter || ''
  }
})
