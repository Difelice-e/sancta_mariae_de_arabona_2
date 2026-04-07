import Hero from '@/components/home/Hero'
import StackingSections from '@/components/home/StackingSections'
import Atmosphere from '@/components/home/Atmosphere'
import Highlights from '@/components/home/Highlights'
import CtaSection from '@/components/home/CtaSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <StackingSections />
      <Atmosphere />
      <Highlights />
      <CtaSection />
    </>
  )
}
