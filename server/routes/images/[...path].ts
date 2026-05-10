import { createReadStream } from 'node:fs'
import { access } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const contentTypes: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
}

export default defineEventHandler(async (event) => {
  const pathParam = getRouterParam(event, 'path') || ''
  const normalizedPath = normalize(pathParam).replace(/^(\.\.(\/|\\|$))+/, '')

  if (!normalizedPath || normalizedPath.includes('\0') || normalizedPath.startsWith('..')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid image path'
    })
  }

  const filePath = join(process.cwd(), 'public', 'images', normalizedPath)

  try {
    await access(filePath)
  }
  catch {
    throw createError({
      statusCode: 404,
      statusMessage: 'Image not found'
    })
  }

  const contentType = contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream'
  setHeader(event, 'Content-Type', contentType)
  setHeader(event, 'Cache-Control', 'public, max-age=60, stale-while-revalidate=300')

  return sendStream(event, createReadStream(filePath))
})
