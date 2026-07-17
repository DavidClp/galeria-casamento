export type MediaType = 'photo' | 'video'

export type MediaItem = {
  id: string
  type: MediaType
  src: string
  srcOriginal?: string
  srcFallback?: string
  originalFallback?: string
  poster?: string | null
  posterFallback?: string | null
  guest: string
  date: string
}

export const COUPLE = {
  names: 'Nathalia & David',
  date: '18 de Julho de 2026',
  hashtag: '#NathaliaeDavid',
}

export const API_URL =
  /*  process.env.API_URL?.replace(/\/$/, '') || */ /* 'http://localhost:3099'  */'https://galeria-casamento-api.bikoservicos.com.br'

export function displayUrl(item: MediaItem): string {
  return item.src || '/placeholder.svg'
}

export function downloadUrl(item: MediaItem): string {
  return item.srcOriginal || item.src
}

export function posterUrl(item: MediaItem): string | null {
  return item.poster || null
}
