import Header from '@/components/Header'
import HeroVideoBackground from '@/components/HeroVideoBackground'
import ImageSequenceHero from '@/components/ImageSequenceHero'
import HeroSection from '@/components/HeroSection'
import ClientsSection from '@/components/ClientsSection'
import WorkV2Section from '@/components/WorkV2Section'
import TrustedBrandsSection from '@/components/TrustedBrandsSection'
import ApartSection from '@/components/ApartSection'
import BenefitsSection from '@/components/BenefitsSection'
import ContactCTA from '@/components/ContactCTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <HeroVideoBackground />
      <Header />
      <ImageSequenceHero />
      <HeroSection />
      <ClientsSection />
      <WorkV2Section />
      <TrustedBrandsSection />
      <ApartSection />
      <BenefitsSection />
      <ContactCTA />
      <Footer />
    </main>
  )
}
