'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'
import { RiskBanner } from '@/components/home/risk-banner'
import { HeroSection } from '@/components/home/hero-section'
import { DemoSection } from '@/components/home/demo-section'
import { HowItWorksSection } from '@/components/home/how-it-works-section'
import { UploadSection } from '@/components/home/upload-section'
import { StockCriteriaSection } from '@/components/home/stock-criteria-section'
import { FeaturesSection } from '@/components/home/features-section'
import { PricingSection } from '@/components/home/pricing-section'
import { CTASection } from '@/components/home/cta-section'
import { Footer } from '@/components/layout/footer'
import { PageTracker } from '@/components/analytics/page-tracker'

export default function Home() {
  // Handle hash navigation from other pages
  useEffect(() => {
    const hash = window.location.hash
    if (hash === '#upload-chart') {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById('upload-chart')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen opacity-100 animate-in fade-in duration-300">
      <PageTracker eventType="landing_page_visit" />
      <Navigation />
      <RiskBanner />
      <main className="pt-[130px]">
        <HeroSection />
        <DemoSection />
        <HowItWorksSection />
        <UploadSection />
        <StockCriteriaSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}