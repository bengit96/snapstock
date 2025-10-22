'use client'

import { Navigation } from '@/components/layout/navigation'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturesSection } from '@/components/home/features-section'
import { HowItWorksSection } from '@/components/home/how-it-works-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { PricingSection } from '@/components/home/pricing-section'
import { CTASection } from '@/components/home/cta-section'
import { Footer } from '@/components/layout/footer'
import { usePageTracking } from '@/lib/hooks/usePageTracking'

export default function Home() {
  // Track landing page visit
  usePageTracking({
    eventType: 'landing_page_visit',
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  )
}