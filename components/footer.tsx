import { Heart } from 'lucide-react'
import { COUPLE } from '@/lib/gallery-data'

export function Footer() {
  return (
    <footer className="relative px-4 py-14 text-center">
      <div className="mx-auto max-w-xl">
        <span className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-primary/12 text-primary">
          <Heart className="size-5 fill-primary" />
        </span>
        <p className="font-serif text-2xl text-balance text-foreground md:text-3xl">
          Obrigado por fazer parte do nosso grande dia.
        </p>
        <p className="mt-4 text-sm tracking-[0.2em] text-primary uppercase">
          {COUPLE.hashtag}
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          {COUPLE.names} · {COUPLE.date}
        </p>
      </div>
    </footer>
  )
}
