import Hero from '@/components/home/Hero'
import ScrollySection from '@/components/home/ScrollySection'
import Atmosphere from '@/components/home/Atmosphere'
import Highlights from '@/components/home/Highlights'
import CtaSection from '@/components/home/CtaSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ScrollySection />
      <Atmosphere />
      <Highlights />
      <CtaSection />
    </>
  )
}
