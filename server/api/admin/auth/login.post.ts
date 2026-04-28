import { createError } from 'h3'

import { readAdminCredentials, setAdminSession } from '~/server/utils/admin-auth'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { login, password } = await readAdminCredentials(event)

  if (!login || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Введите логин и пароль'
    })
  }

  if (login !== config.adminLogin || password !== config.adminPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Неверный логин или пароль'
    })
  }

  setAdminSession(event, login)

  return {
    ok: true
  }
})
