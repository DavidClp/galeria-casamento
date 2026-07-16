'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { UploadCloud, X, FileImage, FileVideo, Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useGallery } from '@/components/gallery-provider'
import { API_URL, type MediaItem } from '@/lib/gallery-data'

const MAX_SIZE_MB = 100
const ACCEPTED = 'image/*,video/*'

type PendingFile = {
  id: string
  file: File
  url: string
  type: 'photo' | 'video'
}

type UploadResponse = {
  items: MediaItem[]
  errors: { file: string; reason: string }[]
}

function uploadWithProgress(
  formData: FormData,
  onProgress: (pct: number) => void,
): Promise<UploadResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${API_URL}/api/media`)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
    xhr.onload = () => {
      let body: {
        items?: MediaItem[]
        errors?: { file: string; reason: string }[]
        error?: string
      } = {}
      try {
        body = JSON.parse(xhr.responseText)
      } catch {
        /* ignore */
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ items: body.items ?? [], errors: body.errors ?? [] })
      } else {
        reject(new Error(body.error || 'Falha ao enviar arquivos.'))
      }
    }
    xhr.onerror = () => reject(new Error('Erro de rede ao enviar arquivos.'))
    xhr.send(formData)
  })
}

export function UploadSection() {
  const { addMedia } = useGallery()
  const [dragging, setDragging] = React.useState(false)
  const [pending, setPending] = React.useState<PendingFile[]>([])
  const [guest, setGuest] = React.useState('')
  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const addFiles = React.useCallback((files: FileList | File[]) => {
    const next: PendingFile[] = []
    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      if (!isImage && !isVideo) {
        toast.error(`"${file.name}" não é uma imagem ou vídeo.`)
        return
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`"${file.name}" excede o limite de ${MAX_SIZE_MB}MB.`)
        return
      }
      next.push({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        file,
        url: URL.createObjectURL(file),
        type: isVideo ? 'video' : 'photo',
      })
    })
    if (next.length) setPending((prev) => [...prev, ...next])
  }, [])

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
  }

  function removePending(id: string) {
    setPending((prev) => {
      const target = prev.find((p) => p.id === id)
      if (target) URL.revokeObjectURL(target.url)
      return prev.filter((p) => p.id !== id)
    })
  }

  async function handleSend() {
    if (!pending.length) return
    setUploading(true)
    setProgress(0)

    const formData = new FormData()
    formData.append('guest', guest.trim())
    pending.forEach((p) => formData.append('files', p.file))

    try {
      const { items, errors } = await uploadWithProgress(formData, setProgress)
      pending.forEach((p) => URL.revokeObjectURL(p.url))
      addMedia(items)
      toast.success(
        `${items.length} ${items.length === 1 ? 'arquivo enviado' : 'arquivos enviados'} com sucesso! Obrigado por compartilhar ❤️`,
      )
      if (errors.length) {
        const failed = errors.length
        const total = items.length + failed
        toast.warning(
          `${failed} de ${total} ${failed === 1 ? 'arquivo falhou' : 'arquivos falharam'}: ${errors
            .map((e) => `"${e.file}" (${e.reason})`)
            .join('; ')}`,
        )
      }
      setPending([])
      setGuest('')
      setProgress(100)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Falha ao enviar arquivos.')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <section id="upload" className="scroll-mt-20 px-4 py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-3xl text-balance text-foreground md:text-4xl">
            Envie suas lembranças
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            Selecione os arquivos do seu dispositivo. Aceitamos fotos e
            vídeos.
          </p>
        </div>

        <Card className="rounded-4xl border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm md:p-7">
          <div className="mb-5">
            <label
              htmlFor="guest-name"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Seu nome
            </label>
            <input
              id="guest-name"
              value={guest}
              onChange={(e) => setGuest(e.target.value)}
              placeholder="Como devemos creditar você?"
              className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
            }}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-12 text-center transition-colors ${dragging
                ? 'border-primary bg-primary/8'
                : 'border-border bg-muted/40 hover:border-primary/50 hover:bg-primary/5'
              }`}
          >
            <motion.span
              animate={{ y: dragging ? -6 : 0 }}
              className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/12 text-primary"
            >
              <UploadCloud className="size-7" />
            </motion.span>
            <p className="font-serif text-xl text-foreground">
              Arraste e solte aqui
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              ou <span className="font-medium text-primary">clique para selecionar</span>
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              JPG, PNG, HEIC, MP4, MOV · até {MAX_SIZE_MB}MB por arquivo
            </p>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED}
              multiple
              hidden
              onChange={(e) => {
                if (e.target.files?.length) addFiles(e.target.files)
                e.target.value = ''
              }}
            />
          </div>

          <AnimatePresence>
            {pending.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  <AnimatePresence>
                    {pending.map((p) => (
                      <motion.div
                        key={p.id}
                        layout
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        className="group relative aspect-square overflow-hidden rounded-2xl ring-1 ring-border"
                      >
                        {p.type === 'photo' ? (
                          <img
                            src={p.url}
                            alt={p.file.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <video src={p.url} className="size-full object-cover" muted />
                        )}
                        <span className="absolute left-1.5 top-1.5 flex items-center rounded-full bg-background/80 p-1 text-primary backdrop-blur">
                          {p.type === 'photo' ? (
                            <FileImage className="size-3.5" />
                          ) : (
                            <FileVideo className="size-3.5" />
                          )}
                        </span>
                        {!uploading && (
                          <button
                            type="button"
                            onClick={() => removePending(p.id)}
                            aria-label="Remover arquivo"
                            className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-background/85 text-foreground opacity-0 backdrop-blur transition-opacity hover:text-destructive group-hover:opacity-100"
                          >
                            <X className="size-3.5" />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {uploading && (
                  <div className="mt-5">
                    <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                      <span>Enviando...</span>
                      <span className="tabular-nums">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <Button
                  onClick={handleSend}
                  disabled={uploading}
                  className="mt-6 h-12 w-full gap-2 rounded-full text-base shadow-sm"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Enviando arquivos
                    </>
                  ) : (
                    <>
                      <Send className="size-5" />
                      Enviar {pending.length}{' '}
                      {pending.length === 1 ? 'arquivo' : 'arquivos'}
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </section>
  )
}
