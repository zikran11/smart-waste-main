import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { CircularEconomySection } from '@/components/landing/circular-economy-section'
import { CTASection } from '@/components/landing/cta-section'
import { EducationSection } from "@/components/landing/education-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <CircularEconomySection />
      <FeaturesSection />
      <EducationSection />
      <CTASection />
    </>
  )
}
