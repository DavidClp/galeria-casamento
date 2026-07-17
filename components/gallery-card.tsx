'use client'

import { motion } from 'motion/react'
import { Play, Download, User } from 'lucide-react'
import type { MediaItem } from '@/lib/gallery-data'
import { FallbackImg, downloadMedia } from '@/components/media-fallback'

export function GalleryCard({
  item,
  onOpen,
}: {
  item: MediaItem
  onOpen: () => void
}) {
  async function handleDownload(e: React.MouseEvent) {
    e.stopPropagation()
    await downloadMedia(item)
  }

  const poster = item.poster || undefined
  const videoPreviewSrc = poster
    ? undefined
    : item.src
      ? `${item.src}#t=0.1`
      : undefined

  return (
    <motion.figure
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      onClick={onOpen}
      className="group relative mb-3 block w-full cursor-pointer overflow-hidden rounded-2xl bg-muted/40 ring-1 ring-border/60 shadow-sm transition-shadow hover:shadow-lg sm:mb-4 sm:rounded-3xl"
    >
      {item.type === 'photo' ? (
        <FallbackImg
          src={item.src || '/placeholder.svg'}
          fallbackSrc={item.srcFallback}
          alt={`Registro enviado por ${item.guest}`}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="relative aspect-[3/4] bg-muted/60 sm:aspect-auto">
          {poster ? (
            <FallbackImg
              src={poster}
              fallbackSrc={item.posterFallback}
              alt={`Capa do vídeo de ${item.guest}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <video
              src={videoPreviewSrc}
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-background/85 text-primary shadow-lg backdrop-blur transition-transform group-hover:scale-110 sm:size-14">
              <Play className="size-5 translate-x-0.5 fill-primary sm:size-6" />
            </span>
          </span>
        </div>
      )}

      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:p-4">
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 text-sm font-medium text-white">
            <User className="size-3.5 shrink-0" />
            <span className="truncate">{item.guest}</span>
          </span>
          <span className="text-xs text-white/75">{item.date}</span>
        </span>
        <button
          type="button"
          onClick={handleDownload}
          aria-label={`Baixar registro de ${item.guest}`}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-foreground transition-colors hover:bg-white"
        >
          <Download className="size-4" />
        </button>
      </figcaption>
    </motion.figure>
  )
}
