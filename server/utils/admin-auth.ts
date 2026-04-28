import { createHmac, timingSafeEqual } from 'node:crypto'

import {
  createError,
  deleteCookie,
  getCookie,
  getRequestURL,
  readBody,
  setCookie,
  type H3Event
} from 'h3'

const ADMIN_COOKIE_NAME = 'magic_iris_admin'
const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

type AdminSessionPayload = {
  login: string
  expiresAt: number
}

const toBase64Url = (value: string) => Buffer.from(value, 'utf8').toString('base64url')
const fromBase64Url = (value: string) => Buffer.from(value, 'base64url').toString('utf8')

const getSecret = () => useRuntimeConfig().adminSessionSecret

const signValue = (value: string) =>
  createHmac('sha256', getSecret()).update(value).digest('hex')

const serializePayload = (payload: AdminSessionPayload) => toBase64Url(JSON.stringify(payload))

const parsePayload = (value: string): AdminSessionPayload | null => {
  try {
    return JSON.parse(fromBase64Url(value)) as AdminSessionPayload
  }
  catch {
    return null
  }
}

const createSessionToken = (login: string) => {
  const payload: AdminSessionPayload = {
    login,
    expiresAt: Date.now() + ADMIN_COOKIE_MAX_AGE * 1000
  }
  const serialized = serializePayload(payload)
  const signature = signValue(serialized)

  return `${serialized}.${signature}`
}

const safeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

export const validateAdminSessionToken = (token?: string | null) => {
  if (!token) {
    return null
  }

  const [serialized, signature] = token.split('.')

  if (!serialized || !signature) {
    return null
  }

  const expectedSignature = signValue(serialized)

  if (!safeEqual(signature, expectedSignature)) {
    return null
  }

  const payload = parsePayload(serialized)

  if (!payload || payload.expiresAt <= Date.now()) {
    return null
  }

  return payload
}

export const getAdminSession = (event: H3Event) =>
  validateAdminSessionToken(getCookie(event, ADMIN_COOKIE_NAME))

export const isAdminAuthenticated = (event: H3Event) => Boolean(getAdminSession(event))

export const setAdminSession = (event: H3Event, login: string) => {
  const token = createSessionToken(login)
  const url = getRequestURL(event)

  setCookie(event, ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: url.protocol === 'https:',
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE
  })
}

export const clearAdminSession = (event: H3Event) => {
  deleteCookie(event, ADMIN_COOKIE_NAME, {
    path: '/'
  })
}

export const requireAdminAuth = (event: H3Event) => {
  if (!isAdminAuthenticated(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Требуется авторизация'
    })
  }
}

export const readAdminCredentials = async (event: H3Event) => {
  const body = await readBody<{ login?: string; password?: string }>(event)

  return {
    login: (body?.login || '').trim(),
    password: body?.password || ''
  }
}

