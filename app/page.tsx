import { Navigation } from '@/components/layout/navigation'
import { HeroSection } from '@/components/home/hero-section'
import { StockCriteriaSection } from '@/components/home/stock-criteria-section'
import { FeaturesSection } from '@/components/home/features-section'
import { HowItWorksSection } from '@/components/home/how-it-works-section'
import { VideoSection } from '@/components/home/video-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { PricingSection } from '@/components/home/pricing-section'
import { CTASection } from '@/components/home/cta-section'
import { Footer } from '@/components/layout/footer'
import { PageTracker } from '@/components/analytics/page-tracker'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageTracker eventType="landing_page_visit" />
      <Navigation />
      <HeroSection />
      <StockCriteriaSection />
      <FeaturesSection />
      <HowItWorksSection />
      <VideoSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  )
}