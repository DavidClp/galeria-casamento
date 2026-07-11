'use client'

import * as React from 'react'
import { API_URL, type MediaItem } from '@/lib/gallery-data'

type GalleryContextValue = {
  media: MediaItem[]
  loading: boolean
  addMedia: (items: MediaItem[]) => void
  photoCount: number
  videoCount: number
  guestCount: number
}

const GalleryContext = React.createContext<GalleryContextValue | null>(null)

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [media, setMedia] = React.useState<MediaItem[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/media`)
        if (!res.ok) throw new Error('Falha ao carregar galeria')
        const data = (await res.json()) as { items?: MediaItem[] }
        if (!cancelled) setMedia(Array.isArray(data.items) ? data.items : [])
      } catch (err) {
        console.error(err)
        if (!cancelled) setMedia([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const addMedia = React.useCallback((items: MediaItem[]) => {
    setMedia((prev) => [...items, ...prev])
  }, [])

  const photoCount = media.filter((m) => m.type === 'photo').length
  const videoCount = media.filter((m) => m.type === 'video').length
  const guestCount = new Set(media.map((m) => m.guest)).size

  const value: GalleryContextValue = {
    media,
    loading,
    addMedia,
    photoCount,
    videoCount,
    guestCount,
  }

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
}

export function useGallery() {
  const ctx = React.useContext(GalleryContext)
  if (!ctx) throw new Error('useGallery must be used within a GalleryProvider')
  return ctx
}

export function scrollToUpload() {
  document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
