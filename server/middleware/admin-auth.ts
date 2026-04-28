import { createError } from 'h3'

import { isAdminAuthenticated } from '../utils/admin-auth'

export default defineEventHandler((event) => {
  const path = event.path || ''

  if (!path.startsWith('/api/admin')) {
    return
  }

  if (path.startsWith('/api/admin/auth/')) {
    return
  }

  if (!isAdminAuthenticated(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Требуется авторизация'
    })
  }
})
