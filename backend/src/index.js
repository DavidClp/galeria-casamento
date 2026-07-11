import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { createR2Client } from './r2.js'
import { listMedia, uploadMedia, MAX_SIZE_BYTES } from './media.js'

const app = express()
const port = Number(process.env.PORT) || 4000
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES, files: 20 },
})

let r2
try {
  r2 = createR2Client()
} catch (err) {
  console.warn(`[startup] R2 client not ready: ${err.message}`)
  console.warn('[startup] Fill backend/.env from .env.example before uploading.')
}

app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'OPTIONS'],
  }),
)

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/media', async (_req, res) => {
  try {
    if (!r2) r2 = createR2Client()
    const items = await listMedia(r2)
    res.json({ items })
  } catch (err) {
    console.error('[GET /api/media]', err)
    res.status(500).json({ error: 'Falha ao listar mídia.' })
  }
})

app.post('/api/media', upload.array('files'), async (req, res) => {
  try {
    if (!r2) r2 = createR2Client()
    const items = await uploadMedia(r2, {
      files: req.files,
      guest: req.body?.guest,
    })
    res.status(201).json({ items })
  } catch (err) {
    console.error('[POST /api/media]', err)
    res.status(err.status || 500).json({
      error: err.status ? err.message : 'Falha ao enviar mídia.',
    })
  }
})

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Arquivo excede o limite de 50MB.' })
    }
    return res.status(400).json({ error: err.message })
  }
  console.error('[unhandled]', err)
  res.status(500).json({ error: 'Erro interno.' })
})

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`)
  console.log(`CORS origin: ${corsOrigin}`)
})
