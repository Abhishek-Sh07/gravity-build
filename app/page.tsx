import Header from '@/components/Header'
import ImageSequenceHero from '@/components/ImageSequenceHero'
import HeroSection from '@/components/HeroSection'
import ServicesSection from '@/components/ServicesSection'
import FeaturedWorkSubstanceSection from '@/components/FeaturedWorkSubstanceSection'
import ProcessSection from '@/components/ProcessSection'
import AboutStudioSection from '@/components/AboutStudioSection'
import ProofSection from '@/components/ProofSection'
import ContactCTA from '@/components/ContactCTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <ImageSequenceHero />
      <HeroSection />
      <ServicesSection />
      <FeaturedWorkSubstanceSection />
      <ProcessSection />
      <AboutStudioSection />
      <ProofSection />
      <ContactCTA />
      <Footer />
    </main>
  )
}
