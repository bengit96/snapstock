'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

interface CTASectionProps {
  title?: string
  description?: string
  buttonText?: string
  subtext?: string
}

export function CTASection({
  title = 'Ready to Transform Your Trading?',
  description = 'Join thousands of traders who are already making smarter decisions with SnapStock. Start your free trial today—no credit card required.',
  buttonText = 'Start Your Free Trial',
  subtext = 'Free for 7 days, then $19.99/month. Cancel anytime.'
}: CTASectionProps) {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          {title}
        </h2>
        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <Link href={ROUTES.login}>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 shadow-xl">
            {buttonText} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        {subtext && (
          <p className="text-purple-200 text-sm mt-4">
            {subtext}
          </p>
        )}
      </div>
    </section>
  )
}