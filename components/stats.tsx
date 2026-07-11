'use client'

import { motion } from 'motion/react'
import { Image as ImageIcon, Video, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useGallery } from '@/components/gallery-provider'

export function Stats() {
  const { photoCount, videoCount, guestCount, loading } = useGallery()

  const items = [
    { label: 'Fotos enviadas', value: photoCount, icon: ImageIcon },
    { label: 'Vídeos enviados', value: videoCount, icon: Video },
    { label: 'Convidados participantes', value: guestCount, icon: Users },
  ]

  return (
    <section className="px-4 py-6">
      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="flex flex-col items-center gap-2 rounded-3xl border-border/60 bg-card/70 py-7 text-center shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary/12 text-primary">
                <item.icon className="size-5" />
              </span>
              <span className="font-serif text-4xl text-foreground tabular-nums">
                {loading ? '—' : item.value}
              </span>
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
