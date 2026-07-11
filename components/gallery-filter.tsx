'use client'

import { motion } from 'motion/react'
import { LayoutGrid, Image as ImageIcon, Video } from 'lucide-react'

export type FilterValue = 'all' | 'photo' | 'video'

const filters: { value: FilterValue; label: string; icon: typeof LayoutGrid }[] = [
  { value: 'all', label: 'Todos', icon: LayoutGrid },
  { value: 'photo', label: 'Fotos', icon: ImageIcon },
  { value: 'video', label: 'Vídeos', icon: Video },
]

export function GalleryFilter({
  active,
  onChange,
}: {
  active: FilterValue
  onChange: (value: FilterValue) => void
}) {
  return (
    <div className="flex items-center justify-center gap-1.5 rounded-full border border-border/60 bg-card/70 p-1.5 shadow-sm backdrop-blur-sm">
      {filters.map((f) => {
        const isActive = active === f.value
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <f.icon className="relative size-4" />
            <span className="relative">{f.label}</span>
          </button>
        )
      })}
    </div>
  )
}
