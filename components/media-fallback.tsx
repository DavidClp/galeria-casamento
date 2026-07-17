'use client'

import * as React from 'react'

type FallbackImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string | null
}

/** Tries primary src; on error swaps to fallback once. */
export function FallbackImg({
  src,
  fallbackSrc,
  onError,
  ...rest
}: FallbackImgProps) {
  const [current, setCurrent] = React.useState(src)
  const triedFallback = React.useRef(false)

  React.useEffect(() => {
    setCurrent(src)
    triedFallback.current = false
  }, [src])

  return (
    <img
      {...rest}
      src={current || '/placeholder.svg'}
      onError={(e) => {
        if (!triedFallback.current && fallbackSrc && fallbackSrc !== current) {
          triedFallback.current = true
          setCurrent(fallbackSrc)
          return
        }
        onError?.(e)
      }}
    />
  )
}

type FallbackVideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  fallbackSrc?: string | null
  posterFallback?: string | null
}

export function FallbackVideo({
  src,
  fallbackSrc,
  poster,
  posterFallback,
  onError,
  ...rest
}: FallbackVideoProps) {
  const [current, setCurrent] = React.useState(src)
  const [currentPoster, setCurrentPoster] = React.useState(
    poster || posterFallback || undefined,
  )
  const triedFallback = React.useRef(false)

  React.useEffect(() => {
    setCurrent(src)
    triedFallback.current = false
  }, [src])

  React.useEffect(() => {
    setCurrentPoster(poster || posterFallback || undefined)
  }, [poster, posterFallback])

  return (
    <video
      {...rest}
      src={current}
      poster={currentPoster}
      onError={(e) => {
        if (!triedFallback.current && fallbackSrc && fallbackSrc !== current) {
          triedFallback.current = true
          setCurrent(fallbackSrc)
          if (posterFallback) setCurrentPoster(posterFallback)
          return
        }
        onError?.(e)
      }}
    />
  )
}

export async function downloadMedia(item: {
  id: string
  guest: string
  src: string
  srcOriginal?: string
  originalFallback?: string
  srcFallback?: string
}) {
  const candidates = [
    item.srcOriginal,
    item.originalFallback,
    item.src,
    item.srcFallback,
  ].filter(Boolean) as string[]

  let lastError: unknown
  for (const url of candidates) {
    try {
      const res = await fetch(url)
      if (!res.ok) continue
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = `${item.guest.replace(/\s+/g, '-').toLowerCase()}-${item.id}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(objectUrl)
      return
    } catch (err) {
      lastError = err
    }
  }

  console.error(lastError)
  window.open(candidates[0] || item.src, '_blank')
}
