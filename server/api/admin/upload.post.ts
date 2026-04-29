import { mkdir, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'

const allowedFolders = new Set(['show', 'master-classes', 'gallery', 'slider', 'landing-pages'])
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg'])

const sanitizeFileName = (value: string) => {
  const normalized = value
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()

  return normalized || 'image'
}

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  const filePart = formData?.find((part) => part.name === 'file' && part.filename)
  const folderValue = formData?.find((part) => part.name === 'folder')?.data?.toString('utf8').trim() || ''

  if (!allowedFolders.has(folderValue)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Недопустимая папка загрузки'
    })
  }

  if (!filePart?.filename || !filePart.data?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Файл не был передан'
    })
  }

  const extension = (extname(filePart.filename).toLowerCase() || '.webp')

  if (!allowedExtensions.has(extension)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Поддерживаются только изображения'
    })
  }

  const baseName = sanitizeFileName(basename(filePart.filename, extension))
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${baseName}${extension}`
  const targetDir = join(process.cwd(), 'public', 'images', folderValue)
  const targetPath = join(targetDir, fileName)

  await mkdir(targetDir, { recursive: true })
  await writeFile(targetPath, filePart.data)

  return {
    ok: true,
    path: `/images/${folderValue}/${fileName}`
  }
})
