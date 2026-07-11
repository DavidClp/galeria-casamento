import { GalleryProvider } from '@/components/gallery-provider'
import { FloralCorners } from '@/components/floral-corners'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Stats } from '@/components/stats'
import { UploadSection } from '@/components/upload-section'
import { Gallery } from '@/components/gallery'
import { HowItWorks } from '@/components/how-it-works'
import { Footer } from '@/components/footer'
import { FloatingUploadButton } from '@/components/floating-upload-button'

export default function Page() {
  return (
    <GalleryProvider>
      <FloralCorners />
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <Stats />
          <UploadSection />
          <Gallery />
          <HowItWorks />
        </main>
        <Footer />
      </div>
      <FloatingUploadButton />
    </GalleryProvider>
  )
}
