'use client'

import { motion } from 'motion/react'
import { Heart, ImagePlus, CalendarHeart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { scrollToUpload } from '@/components/gallery-provider'
import { COUPLE } from '@/lib/gallery-data'

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Hero() {
  return (
    <section id="top" className="relative px-4 pt-28 pb-12 md:pt-36 md:pb-16">
      <div className="mx-auto max-w-5xl text-center">
        <motion.p
          custom={0}
          initial="hidden"
          animate="show"
          variants={fade}
          className="mb-4 flex items-center justify-center gap-2 text-sm font-medium tracking-[0.25em] text-primary uppercase"
        >
          <CalendarHeart className="size-4" />
          {COUPLE.date}
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={fade}
          className="font-serif text-5xl leading-tight tracking-tight text-balance text-foreground md:text-7xl"
        >
          {COUPLE.names}
        </motion.h1>

        <motion.div
          custom={2}
          initial="hidden"
          animate="show"
          variants={fade}
          className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-4xl shadow-xl ring-1 ring-border/60"
        >
          <img
            src="/images/main.webp"
            alt={`${COUPLE.names} no dia do casamento`}
            className="aspect-[16/9] w-full object-cover"
          />
        </motion.div>

        <motion.h2
          custom={3}
          initial="hidden"
          animate="show"
          variants={fade}
          className="mx-auto mt-10 flex max-w-2xl items-center justify-center gap-2 font-serif text-2xl text-balance text-foreground md:text-4xl"
        >
          Compartilhe os momentos que você registrou
          <Heart className="size-6 shrink-0 fill-primary text-primary md:size-8" />
        </motion.h2>

        <motion.p
          custom={4}
          initial="hidden"
          animate="show"
          variants={fade}
          className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground"
        >
          Cada foto e vídeo torna nossa lembrança ainda mais especial. Envie aqui os
          registros do nosso grande dia.
        </motion.p>

        <motion.div
          custom={5}
          initial="hidden"
          animate="show"
          variants={fade}
          className="mt-8"
        >
          <Button
            onClick={scrollToUpload}
            className="h-12 gap-2 rounded-full px-8 text-base shadow-md transition-transform hover:scale-[1.03]"
          >
            <ImagePlus className="size-5" />
            Enviar Fotos
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
