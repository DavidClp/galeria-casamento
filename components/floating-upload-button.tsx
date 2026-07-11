'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ImagePlus } from 'lucide-react'
import { scrollToUpload } from '@/components/gallery-provider'

export function FloatingUploadButton() {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToUpload}
          aria-label="Enviar fotos"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30"
        >
          <ImagePlus className="size-5" />
          <span className="hidden sm:inline">Enviar Fotos</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
