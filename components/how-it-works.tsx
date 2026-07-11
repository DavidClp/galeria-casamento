'use client'

import { motion } from 'motion/react'
import { Camera, UploadCloud, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'

const steps = [
  {
    icon: Camera,
    title: 'Tire fotos e vídeos',
    text: 'Capture os melhores momentos da celebração do seu jeito, com o seu olhar.',
  },
  {
    icon: UploadCloud,
    title: 'Faça upload',
    text: 'Envie seus registros em poucos segundos, direto do seu celular ou computador.',
  },
  {
    icon: Sparkles,
    title: 'Reviva os melhores momentos',
    text: 'Acompanhe a galeria colaborativa crescer com as lembranças de todos.',
  },
]

export function HowItWorks() {
  return (
    <section className="px-4 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl text-balance text-foreground md:text-4xl">
            Como funciona
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            Compartilhar suas lembranças é simples e leva apenas alguns instantes.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <Card className="h-full rounded-3xl border-border/60 bg-card/70 p-7 text-center shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
                <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <step.icon className="size-6" />
                </span>
                <h3 className="font-serif text-xl text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
