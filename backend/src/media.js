import path from 'node:path'
import { v4 as uuidv4 } from 'uuid'
import { NoSuchKey } from '@aws-sdk/client-s3'
import { getObjectBuffer, putObject } from './r2.js'

export const INDEX_KEY = 'gallery/index.json'
export const MEDIA_PREFIX = 'gallery/media'
export const MAX_SIZE_BYTES = 50 * 1024 * 1024

const IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
])

const VIDEO_TYPES = new Set([
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-msvideo',
  'video/x-matroska',
])

export function mediaTypeFromMime(mime) {
  if (IMAGE_TYPES.has(mime) || mime?.startsWith('image/')) return 'photo'
  if (VIDEO_TYPES.has(mime) || mime?.startsWith('video/')) return 'video'
  return null
}

export function formatDatePtBr(date = new Date()) {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function extensionFromFile(file) {
  const fromName = path.extname(file.originalname || '').toLowerCase()
  if (fromName) return fromName
  const map = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/heic': '.heic',
    'image/heif': '.heif',
    'video/mp4': '.mp4',
    'video/quicktime': '.mov',
    'video/webm': '.webm',
    'video/x-msvideo': '.avi',
    'video/x-matroska': '.mkv',
  }
  return map[file.mimetype] || ''
}

export async function readIndex(client) {
  try {
    const buf = await getObjectBuffer(client, INDEX_KEY)
    const parsed = JSON.parse(buf.toString('utf8'))
    if (Array.isArray(parsed)) return parsed
    if (Array.isArray(parsed?.items)) return parsed.items
    return []
  } catch (err) {
    if (err instanceof NoSuchKey || err?.name === 'NoSuchKey' || err?.$metadata?.httpStatusCode === 404) {
      return []
    }
    throw err
  }
}

export async function writeIndex(client, items) {
  await putObject(client, {
    key: INDEX_KEY,
    body: Buffer.from(JSON.stringify({ items }, null, 2), 'utf8'),
    contentType: 'application/json',
  })
}

export async function listMedia(client) {
  const items = await readIndex(client)
  return items
}

export async function uploadMedia(client, { files, guest }) {
  if (!files?.length) {
    const error = new Error('Nenhum arquivo enviado.')
    error.status = 400
    throw error
  }

  const guestName = (guest || '').trim() || 'Convidado(a)'
  const date = formatDatePtBr()
  const created = []

  for (const file of files) {
    if (file.size > MAX_SIZE_BYTES) {
      const error = new Error(`"${file.originalname}" excede o limite de 50MB.`)
      error.status = 400
      throw error
    }

    const type = mediaTypeFromMime(file.mimetype)
    if (!type) {
      const error = new Error(`"${file.originalname}" não é uma imagem ou vídeo.`)
      error.status = 400
      throw error
    }

    const id = uuidv4()
    const ext = extensionFromFile(file)
    const key = `${MEDIA_PREFIX}/${id}${ext}`
    const src = await putObject(client, {
      key,
      body: file.buffer,
      contentType: file.mimetype,
    })

    created.push({ id, type, src, guest: guestName, date })
  }

  const existing = await readIndex(client)
  const items = [...created, ...existing]
  await writeIndex(client, items)

  return created
}
