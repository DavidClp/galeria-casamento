export type MediaType = 'photo' | 'video'

export type MediaItem = {
  id: string
  type: MediaType
  src: string
  guest: string
  date: string
}

export const COUPLE = {
  names: 'Nathalia & David',
  date: '18 de Julho de 2026',
  hashtag: '#NathaliaeDavid',
}

export const API_URL =
 /*  process.env.API_URL?.replace(/\/$/, '') || */ 'https://galeria-casamento-api.bikoservicos.com.br'
