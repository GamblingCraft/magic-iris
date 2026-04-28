import { getAdminSession } from '~/server/utils/admin-auth'

export default defineEventHandler((event) => {
  const session = getAdminSession(event)

  return {
    authenticated: Boolean(session),
    login: session?.login || ''
  }
})
