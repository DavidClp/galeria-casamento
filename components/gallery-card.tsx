'use client'

import { motion } from 'motion/react'
import { Play, Download, User } from 'lucide-react'
import type { MediaItem } from '@/lib/gallery-data'

export function GalleryCard({
  item,
  onOpen,
}: {
  item: MediaItem
  onOpen: () => void
}) {
  async function handleDownload(e: React.MouseEvent) {
    e.stopPropagation()
    try {
      const res = await fetch(item.src)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${item.guest.replace(/\s+/g, '-').toLowerCase()}-${item.id}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      window.open(item.src, '_blank')
    }
  }

  return (
    <motion.figure
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      onClick={onOpen}
      className="group relative mb-4 block w-full cursor-pointer overflow-hidden rounded-3xl ring-1 ring-border/60 shadow-sm transition-shadow hover:shadow-lg"
    >
      {item.type === 'photo' ? (
        <img
          src={item.src || '/placeholder.svg'}
          alt={`Registro enviado por ${item.guest}`}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="relative">
          <video
            src={item.src}
            muted
            playsInline
            preload="metadata"
            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-background/85 text-primary shadow-lg backdrop-blur transition-transform group-hover:scale-110">
              <Play className="size-6 translate-x-0.5 fill-primary" />
            </span>
          </span>
        </div>
      )}

      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
