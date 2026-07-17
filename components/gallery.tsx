'use client'

import * as React from 'react'
import { Download, User, CalendarDays } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useGallery } from '@/components/gallery-provider'
import { GalleryCard } from '@/components/gallery-card'
import { GalleryFilter, type FilterValue } from '@/components/gallery-filter'
import {
  FallbackImg,
  FallbackVideo,
  downloadMedia,
} from '@/components/media-fallback'
import type { MediaItem } from '@/lib/gallery-data'

const SKELETON_HEIGHTS = ['h-64', 'h-80', 'h-56', 'h-72', 'h-60', 'h-96']

export function Gallery() {
  const { media, loading } = useGallery()
  const [filter, setFilter] = React.useState<FilterValue>('all')
  const [active, setActive] = React.useState<MediaItem | null>(null)

  const filtered = media.filter((m) => filter === 'all' || m.type === filter)

  async function downloadActive() {
    if (!active) return
    await downloadMedia(active)
  }

  return (
    <section id="gallery" className="scroll-mt-10 px-4 py-6 md:py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 text-center">
          <h2 className="font-serif text-3xl text-balance text-foreground md:text-4xl">
            Galeria de momentos
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            Reviva cada instante registrado pelos nossos convidados.
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <GalleryFilter active={filter} onChange={setFilter} />
        </div>

        {loading ? (
          <div className="columns-2 gap-3 lg:columns-3 lg:gap-4">
            {SKELETON_HEIGHTS.map((h, i) => (
              <Skeleton key={i} className={`mb-3 w-full rounded-2xl sm:mb-4 sm:rounded-3xl ${h}`} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            Nenhum registro por aqui ainda. Seja o primeiro a compartilhar!
          </p>
        ) : (
          <div className="columns-2 gap-3 lg:columns-3 lg:gap-4">
            {filtered.map((item) => (
              <GalleryCard key={item.id} item={item} onOpen={() => setActive(item)} />
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-3xl overflow-hidden rounded-3xl p-0 sm:max-w-3xl">
          {active && (
            <>
              <DialogTitle className="sr-only">
                Registro de {active.guest}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Enviado em {active.date}
              </DialogDescription>
              <div className="bg-black">
                {active.type === 'photo' ? (
                  <FallbackImg
                    src={active.src || '/placeholder.svg'}
                    fallbackSrc={active.srcFallback}
                    alt={`Registro enviado por ${active.guest}`}
                    className="max-h-[70vh] w-full object-contain"
                  />
                ) : (
                  <FallbackVideo
                    src={active.src}
                    fallbackSrc={active.srcFallback}
                    poster={active.poster || undefined}
                    posterFallback={active.posterFallback}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[70vh] w-full object-contain"
                  />
                )}
              </div>
              <div className="flex items-center justify-between gap-3 bg-card px-5 py-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 font-medium text-foreground">
                    <User className="size-4 shrink-0 text-primary" />
                    <span className="truncate">{active.guest}</span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    {active.date}
                  </p>
                </div>
                <Button
                  onClick={downloadActive}
                  variant="secondary"
                  className="h-10 shrink-0 gap-2 rounded-full px-4"
                >
                  <Download className="size-4" />
                  Baixar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
