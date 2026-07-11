'use client'

import * as React from 'react'
import { Heart, ImagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { scrollToUpload } from '@/components/gallery-provider'
import { COUPLE } from '@/lib/gallery-data'

export function Header() {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-border/60 bg-background/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/12 text-primary">
            <Heart className="size-4" />
          </span>
          <span className="font-serif text-lg tracking-tight text-foreground">
            {COUPLE.names}
          </span>
        </a>
        <div className="flex items-center gap-1.5">
          <Button
            onClick={scrollToUpload}
            className="h-9 gap-2 rounded-full px-4 shadow-sm"
          >
            <ImagePlus className="size-4" />
            <span className="hidden sm:inline">Enviar Fotos</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
